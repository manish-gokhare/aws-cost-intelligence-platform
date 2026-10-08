import os

from datetime import date, timedelta

import boto3


class CostExplorerService:
    """
    Service for retrieving AWS Cost Explorer data.

    Supported modes:

    aws  -> Always use AWS Cost Explorer
    mock -> Always use deterministic mock data
    auto -> Use AWS data when available, otherwise use mock data
    """

    MOCK_SERVICE_COSTS = {
        "Amazon EC2": 15.20,
        "Amazon RDS": 12.40,
        "Amazon EKS": 10.80,
        "Amazon S3": 4.75,
        "Amazon CloudWatch": 3.60,
        "Elastic Load Balancing": 2.90,
        "AWS Lambda": 1.85,
        "Amazon DynamoDB": 1.20,
    }

    MOCK_CHANGE_PERCENTAGES = {
        "Amazon EC2": 12.4,
        "Amazon RDS": 6.8,
        "Amazon EKS": 18.2,
        "Amazon S3": -2.4,
        "Amazon CloudWatch": 9.7,
        "Elastic Load Balancing": 4.1,
        "AWS Lambda": -5.6,
        "Amazon DynamoDB": 1.9,
    }

    MOCK_DAILY_WEIGHTS = [
        0.92,
        0.95,
        0.97,
        0.94,
        0.98,
        1.01,
        0.96,
        0.99,
        1.03,
        0.97,
        1.00,
        1.02,
        1.04,
        0.98,
        0.96,
        1.01,
        1.03,
        1.05,
        1.00,
        1.02,
        1.04,
        1.01,
        1.06,
        1.03,
        1.07,
        1.05,
        1.08,
        1.04,
        1.06,
        1.09,
    ]

    def __init__(
        self,
        start_date=None,
        end_date=None,
    ):
        self.mode = os.getenv(
            "COST_DATA_MODE",
            "auto",
        ).lower()

        self.region = os.getenv(
            "AWS_REGION",
            "us-east-1",
        )

        self.start_date = start_date
        self.end_date = end_date

        if self.mode not in {"aws", "mock", "auto"}:
            raise ValueError(
                "COST_DATA_MODE must be one of: aws, mock, auto"
            )

        # Boto3 uses the standard AWS credential provider chain.
        #
        # Local:
        #   ~/.aws/credentials
        #
        # EKS:
        #   IAM Role / EKS Pod Identity
        #
        # No AWS access keys are stored in this application.
        self.client = boto3.client(
            "ce",
            region_name=self.region,
        )

    # ------------------------------------------------------------------
    # Public API methods
    # ------------------------------------------------------------------

    def get_dashboard_data(self):
        """
        Return all data required by the React dashboard.

        This is the main dashboard API data source.

        The Cost Explorer data remains the source of truth.
        PostgreSQL caching/history can be added later.
        """

        if self.mode == "mock":
            return self._build_dashboard_data(
                daily_costs=self._get_mock_daily_costs(),
                service_costs=self._get_mock_service_costs(),
                source="MOCK",
                data_mode="mock",
            )

        try:
            daily_costs = self._get_aws_daily_costs()
            service_costs = self._get_aws_service_costs()

            aws_total = (
                sum(item["cost"] for item in daily_costs)
                if daily_costs
                else 0.0
            )

            if self.mode == "aws":
                return self._build_dashboard_data(
                    daily_costs=daily_costs,
                    service_costs=service_costs,
                    source="COST_EXPLORER",
                    data_mode="aws",
                )

            # AUTO mode:
            # Use AWS data only when meaningful cost data exists.
            if aws_total > 0 or sum(
                item["cost"] for item in service_costs
            ) > 0:
                return self._build_dashboard_data(
                    daily_costs=daily_costs,
                    service_costs=service_costs,
                    source="COST_EXPLORER",
                    data_mode="aws",
                )

        except Exception:
            if self.mode == "aws":
                raise

        # AUTO fallback
        return self._build_dashboard_data(
            daily_costs=self._get_mock_daily_costs(),
            service_costs=self._get_mock_service_costs(),
            source="MOCK",
            data_mode="mock",
        )

    def get_cost_summary(self):
        dashboard = self.get_dashboard_data()
        return dashboard["summary"]

    def get_daily_costs(self):
        dashboard = self.get_dashboard_data()
        return dashboard["dailyCosts"]

    def get_service_costs(self):
        dashboard = self.get_dashboard_data()
        return dashboard["serviceCosts"]

    # ------------------------------------------------------------------
    # Dashboard builder
    # ------------------------------------------------------------------

    def _build_dashboard_data(
        self,
        daily_costs,
        service_costs,
        source,
        data_mode,
    ):
        total_cost = round(
            sum(item["cost"] for item in service_costs),
            2,
        )

        # Prefer the daily total when service data is empty.
        if total_cost == 0:
            total_cost = round(
                sum(item["cost"] for item in daily_costs),
                2,
            )

        daily_average = (
            round(
                total_cost / len(daily_costs),
                2,
            )
            if daily_costs
            else 0.0
        )

        top_service = (
            service_costs[0]
            if service_costs
            else None
        )

        top_cost_drivers = []

        for rank, service in enumerate(
            service_costs[:5],
            start=1,
        ):
            top_cost_drivers.append(
                {
                    "rank": rank,
                    "serviceName": service["serviceName"],
                    "cost": service["cost"],
                    "percentageOfTotal": service[
                        "percentageOfTotal"
                    ],
                    "changePercentage": service[
                        "changePercentage"
                    ],
                    "currency": service["currency"],
                }
            )

        currency = "USD"

        if daily_costs:
            currency = daily_costs[0].get(
                "currency",
                "USD",
            )
        elif service_costs:
            currency = service_costs[0].get(
                "currency",
                "USD",
            )

        return {
            "summary": {
                "totalCost": total_cost,
                "dailyAverage": daily_average,
                "topService": (
                    top_service["serviceName"]
                    if top_service
                    else "N/A"
                ),
                "topServiceCost": (
                    top_service["cost"]
                    if top_service
                    else 0.0
                ),
                "serviceCount": len(service_costs),
                "percentageChange": 0.0,
                "currency": currency,
            },
            "dailyCosts": daily_costs,
            "serviceCosts": service_costs,
            "topCostDrivers": top_cost_drivers,
            "metadata": {
                "startDate": self._get_start_date().isoformat(),
                "endDate": self._get_end_date().isoformat(),
                "currency": currency,
                "metric": "UnblendedCost",
                "source": source,
                "dataMode": data_mode,
            },
        }

    # ------------------------------------------------------------------
    # AWS Cost Explorer
    # ------------------------------------------------------------------

    def _get_aws_daily_costs(self):
        response = self.client.get_cost_and_usage(
            TimePeriod={
                "Start": self._get_start_date().isoformat(),
                "End": self._get_end_date().isoformat(),
            },
            Granularity="DAILY",
            Metrics=["UnblendedCost"],
        )

        daily_costs = []

        for result in response.get(
            "ResultsByTime",
            [],
        ):
            amount_data = result["Total"]["UnblendedCost"]

            daily_costs.append(
                {
                    "date": result["TimePeriod"]["Start"],
                    "cost": round(
                        float(amount_data["Amount"]),
                        4,
                    ),
                    "currency": amount_data.get(
                        "Unit",
                        "USD",
                    ),
                }
            )

        return daily_costs

    def _get_aws_service_costs(self):
        response = self.client.get_cost_and_usage(
            TimePeriod={
                "Start": self._get_start_date().isoformat(),
                "End": self._get_end_date().isoformat(),
            },
            Granularity="MONTHLY",
            Metrics=["UnblendedCost"],
            GroupBy=[
                {
                    "Type": "DIMENSION",
                    "Key": "SERVICE",
                }
            ],
        )

        # Cost Explorer can return multiple billing periods.
        # Aggregate the same service across those periods.
        service_totals = {}
        service_currency = {}

        for result in response.get(
            "ResultsByTime",
            [],
        ):
            for group in result.get(
                "Groups",
                [],
            ):
                service_name = group["Keys"][0]

                amount_data = group["Metrics"][
                    "UnblendedCost"
                ]

                cost = float(
                    amount_data["Amount"]
                )

                if cost <= 0:
                    continue

                service_totals[service_name] = (
                    service_totals.get(
                        service_name,
                        0.0,
                    )
                    + cost
                )

                service_currency[service_name] = (
                    amount_data.get(
                        "Unit",
                        "USD",
                    )
                )

        services = []

        for service_name, cost in service_totals.items():
            services.append(
                {
                    "serviceName": service_name,
                    "cost": round(cost, 2),
                    "currency": service_currency.get(
                        service_name,
                        "USD",
                    ),
                }
            )

        services.sort(
            key=lambda item: item["cost"],
            reverse=True,
        )

        total_cost = sum(
            item["cost"]
            for item in services
        )

        for service in services:
            service["percentageOfTotal"] = (
                round(
                    service["cost"]
                    / total_cost
                    * 100,
                    2,
                )
                if total_cost > 0
                else 0.0
            )

            # Period-over-period comparison
            # will be implemented after historical
            # PostgreSQL data is introduced.
            service["changePercentage"] = 0.0

        return services

    # ------------------------------------------------------------------
    # Mock data
    # ------------------------------------------------------------------

    def _get_mock_service_costs(self):
        base_total_cost = sum(
            self.MOCK_SERVICE_COSTS.values()
        )

        start_date = self._get_start_date()
        end_date = self._get_end_date()

        number_of_days = (
            end_date - start_date
        ).days

        if number_of_days <= 0:
            return []

        base_days = len(
            self.MOCK_DAILY_WEIGHTS
        )

        range_multiplier = (
            number_of_days / base_days
        )

        total_cost = (
            base_total_cost
            * range_multiplier
        )

        services = []

        for service_name, base_cost in (
            self.MOCK_SERVICE_COSTS.items()
        ):
            cost = (
                base_cost
                * range_multiplier
            )

            percentage = (
                cost / total_cost * 100
                if total_cost > 0
                else 0.0
            )

            services.append(
                {
                    "serviceName": service_name,
                    "cost": round(cost, 2),
                    "percentageOfTotal": round(
                        percentage,
                        2,
                    ),
                    "changePercentage": (
                        self.MOCK_CHANGE_PERCENTAGES[
                            service_name
                        ]
                    ),
                    "currency": "USD",
                }
            )

        services.sort(
            key=lambda item: item["cost"],
            reverse=True,
        )

        # Correct rounding difference so service totals
        # remain consistent with the selected date range.
        rounded_total = sum(
            item["cost"]
            for item in services
        )

        difference = round(
            total_cost - rounded_total,
            2,
        )

        if services:
            services[0]["cost"] = round(
                services[0]["cost"]
                + difference,
                2,
            )

        return services

    def _get_mock_daily_costs(self):
        total_cost = sum(
            self.MOCK_SERVICE_COSTS.values()
        )

        start_date = self._get_start_date()
        end_date = self._get_end_date()

        # _get_end_date() is exclusive because it
        # follows AWS Cost Explorer date semantics.
        number_of_days = (
            end_date - start_date
        ).days

        if number_of_days <= 0:
            return []

        # Repeat the deterministic weight pattern when
        # the selected range is longer than 30 days.
        daily_weights = [
            self.MOCK_DAILY_WEIGHTS[
                index % len(self.MOCK_DAILY_WEIGHTS)
            ]
            for index in range(number_of_days)
        ]

        weight_total = sum(
            daily_weights
        )

        base_days = len(
            self.MOCK_DAILY_WEIGHTS
        )

        # Scale the mock total according to the
        # selected number of days.
        range_total_cost = (
            total_cost
            * number_of_days
            / base_days
        )

        daily_costs = []

        for day_number, weight in enumerate(
            daily_weights
        ):
            current_date = (
                start_date
                + timedelta(days=day_number)
            )

            cost = (
                range_total_cost
                * weight
                / weight_total
            )

            daily_costs.append(
                {
                    "date": current_date.isoformat(),
                    "cost": round(cost, 2),
                    "currency": "USD",
                }
            )

        # Correct rounding difference so that
        # daily total exactly equals service total.
        rounded_total = sum(
            item["cost"]
            for item in daily_costs
        )

        difference = round(
            range_total_cost - rounded_total,
            2,
        )

        if daily_costs:
            daily_costs[-1]["cost"] = round(
                daily_costs[-1]["cost"]
                + difference,
                2,
            )

        return daily_costs

    # ------------------------------------------------------------------
    # Date helpers
    # ------------------------------------------------------------------

    def _get_end_date(self):
        # Cost Explorer End date is exclusive.
        if self.end_date is not None:
            return self.end_date + timedelta(days=1)

        return date.today()

    def _get_start_date(self):
        if self.start_date is not None:
            return self.start_date

        return date.today() - timedelta(days=30)
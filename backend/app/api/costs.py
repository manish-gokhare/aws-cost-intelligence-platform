from datetime import date

from fastapi import APIRouter, HTTPException, Query

from app.services.cost_explorer import CostExplorerService


router = APIRouter(
    prefix="/api/v1/costs",
    tags=["Costs"],
)


def validate_date_range(
    start_date: date,
    end_date: date,
):
    if start_date > end_date:
        raise HTTPException(
            status_code=400,
            detail="Start date cannot be after end date.",
        )


@router.get("/dashboard")
def get_cost_dashboard(
    start_date: date | None = Query(
        default=None,
        description="Start date in YYYY-MM-DD format.",
    ),
    end_date: date | None = Query(
        default=None,
        description="End date in YYYY-MM-DD format.",
    ),
):
    """
    Return all data required by the cost dashboard.
    """

    try:
        service = CostExplorerService(
            start_date=start_date,
            end_date=end_date,
        )

        return service.get_dashboard_data()

    except HTTPException:
        raise

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to retrieve AWS cost "
                f"dashboard: {str(exc)}"
            ),
        ) from exc


@router.get("/summary")
def get_cost_summary(
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
):
    try:
        service = CostExplorerService(
            start_date=start_date,
            end_date=end_date,
        )

        return service.get_cost_summary()

    except HTTPException:
        raise

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to retrieve AWS "
                f"cost summary: {str(exc)}"
            ),
        ) from exc


@router.get("/daily")
def get_daily_costs(
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
):
    try:
        service = CostExplorerService(
            start_date=start_date,
            end_date=end_date,
        )

        return {
            "data": service.get_daily_costs()
        }

    except HTTPException:
        raise

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to retrieve daily "
                f"AWS costs: {str(exc)}"
            ),
        ) from exc


@router.get("/services")
def get_service_costs(
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
):
    try:
        service = CostExplorerService(
            start_date=start_date,
            end_date=end_date,
        )

        return {
            "data": service.get_service_costs()
        }

    except HTTPException:
        raise

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to retrieve AWS "
                f"service costs: {str(exc)}"
            ),
        ) from exc
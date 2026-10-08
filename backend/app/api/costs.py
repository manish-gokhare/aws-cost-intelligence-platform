from fastapi import APIRouter, HTTPException

from app.services.cost_explorer import CostExplorerService


router = APIRouter(
    prefix="/api/v1/costs",
    tags=["Costs"],
)


@router.get("/dashboard")
def get_cost_dashboard():
    """
    Return all data required by the cost dashboard.
    """

    try:
        service = CostExplorerService()

        return service.get_dashboard_data()

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to retrieve AWS cost "
                f"dashboard: {str(exc)}"
            ),
        ) from exc


@router.get("/summary")
def get_cost_summary():
    try:
        service = CostExplorerService()

        return service.get_cost_summary()

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to retrieve AWS "
                f"cost summary: {str(exc)}"
            ),
        ) from exc


@router.get("/daily")
def get_daily_costs():
    try:
        service = CostExplorerService()

        return {
            "data": service.get_daily_costs()
        }

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to retrieve daily "
                f"AWS costs: {str(exc)}"
            ),
        ) from exc


@router.get("/services")
def get_service_costs():
    try:
        service = CostExplorerService()

        return {
            "data": service.get_service_costs()
        }

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to retrieve AWS "
                f"service costs: {str(exc)}"
            ),
        ) from exc

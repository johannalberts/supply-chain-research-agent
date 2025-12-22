# app/api.py
from typing import List
from ninja import Router, Schema
from .agents.supply_chain_graph import supply_chain_app

# Use Router instead of NinjaAPI for app-specific logic
router = Router()

# --- Schemas ---

class ResearchRequest(Schema):
    industry: str

class RiskMetricSchema(Schema):
    category: str
    impact_score: int
    description: str

class ResearchResponse(Schema):
    risk_report: str
    critical_alerts: List[str]
    fragility_score: int
    risk_metrics: List[RiskMetricSchema]

# --- Endpoints ---

@router.post("/run-research", response=ResearchResponse)
def trigger_research(request, data: ResearchRequest):
    """
    Triggers the LangGraph supply chain research agent.
    The URL for this will be: /api/supply-chain/run-research
    """
    # Initializing the LangGraph state with all required fields
    initial_state = {
        "industry": data.industry, 
        "raw_data": [], 
        "risk_report": "", 
        "critical_alerts": [],
        "fragility_score": 0,
        "risk_metrics": []
    }
    
    # Executing the graph
    # Gemini and Tavily calls happen inside these nodes
    final_output = supply_chain_app.invoke(initial_state)
    
    return final_output
# agents/supply_chain_graph.py
from typing import TypedDict, List
from pydantic import BaseModel, Field
from langgraph.graph import StateGraph, START, END
from langchain_google_genai import ChatGoogleGenerativeAI
from tavily import TavilyClient
import os

tavily = TavilyClient(api_key=os.environ.get("TAVILY_API_KEY"))
llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    temperature=0,
    google_api_key=os.environ.get("GOOGLE_API_KEY")
)


class AgentState(TypedDict):
    industry: str
    raw_data: List[str]
    risk_report: str
    critical_alerts: List[str]
    fragility_score: int
    risk_metrics: List[dict]


class RiskMetric(BaseModel):
    category: str = Field(description="e.g., Logistics, Labor, Geopolitical")
    impact_score: int = Field(description="Scale of 1-10")
    description: str = Field(description="Brief explanation of the risk")


class AnalystOutput(BaseModel):
    executive_summary: str
    fragility_score: int = Field(description="Overall 1-10 score for the industry")
    risk_metrics: List[RiskMetric]
    critical_alerts: List[str]


# 2. Define the Nodes
def researcher_node(state):
    """
    Step 1: Search for recent supply chain disruptions based on the industry.
    """
    industry = state.get("industry", "Global")
    query = f"recent supply chain disruptions, port strikes, and logistics risks in {industry} industry 2025"

    print(f"--- AGENT RESEARCHING: {query} ---")

    # We use 'advanced' search depth for high-quality C-suite data
    search_result = tavily.search(
        query=query, 
        topic="news", 
        search_depth="advanced",
        max_results=5
    )

    # Tavily returns a list of results with 'content' and 'url'
    raw_data = [
        f"Source: {r['url']}\nContent: {r['content']}" 
        for r in search_result['results']
    ]

    return {"raw_data": raw_data}

def risk_analyst_node(state):
    raw_text = "\n\n".join(state["raw_data"])
    industry = state["industry"]
    
    # The System Prompt defines the persona
    system_prompt = f"""
    You are a Senior Supply Chain Risk Analyst for a C-suite executive team.
    Analyze the provided research regarding the {industry} industry.

    Your goal:
    1. Identify specific disruptions (strikes, shortages, delays).
    2. Quantify the 'Fragility Score' (1-10).
    3. Categorize risks into Logistics, Labor, or Geopolitical.
    4. Provide a punchy Executive Summary.
    """

    # We use .with_structured_output to force the LLM to use our Pydantic model
    structured_llm = llm.with_structured_output(AnalystOutput)

    analysis = structured_llm.invoke([
        ("system", system_prompt),
        ("human", f"Data: {raw_text}")
    ])

    # Return the structured data to update the State
    return {
        "risk_report": analysis.executive_summary,
        "critical_alerts": analysis.critical_alerts,
        "fragility_score": analysis.fragility_score,
        "risk_metrics": [m.dict() for m in analysis.risk_metrics] # Format for JSON/Django
    }

def synthesizer_node(state):
    """
    Final polish: De-duplicate alerts and ensure formatting is consistent.
    """
    alerts = list(set(state.get("critical_alerts", []))) # Basic de-duplication

    # You could add logic here to flag 'Urgent' if fragility_score > 8
    is_urgent = state.get("fragility_score", 0) >= 8

    if is_urgent:
        alerts.insert(0, "CRITICAL: Immediate action recommended due to high fragility.")

    return {"critical_alerts": alerts}

# 3. Build the Graph
workflow = StateGraph(AgentState)
workflow.add_node("researcher", researcher_node)
workflow.add_node("analyst", risk_analyst_node)
workflow.add_node("synthesizer", synthesizer_node)

workflow.add_edge(START, "researcher")
workflow.add_edge("researcher", "analyst")
workflow.add_edge("analyst", "synthesizer")
workflow.add_edge("synthesizer", END)

supply_chain_app = workflow.compile()
# backend/api.py
from ninja import NinjaAPI
from app.api import router as supply_chain_router

api = NinjaAPI(
    title="Supply Chain Intelligence API",
    version="1.0.0",
    description="C-Suite Dashboard Backend"
)

# This prefixes all routes in app/api.py with 'supply-chain'
api.add_router("/supply-chain", supply_chain_router)
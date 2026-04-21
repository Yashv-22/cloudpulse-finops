from pydantic import BaseModel, ConfigDict
from typing import Dict, Any, Optional
from datetime import datetime
from decimal import Decimal

class UnifiedResource(BaseModel):
    resource_id: str
    account_id: str
    region: str
    resource_type: str
    name: str
    
    cost_7d: Decimal
    cpu_avg_7d: float
    memory_avg_7d: float
    network_bytes_7d: int
    
    last_active: datetime
    tags: Dict[str, str]
    metadata: Dict[str, Any]
    
    waste_score: Optional[float] = None
    collected_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

from sqlalchemy import Column, Integer, String, Float, JSON, DateTime
from sqlalchemy.sql import func
from app.db.engine import Base

class ResourceORM(Base):
    __tablename__ = "resources"

    id = Column(Integer, primary_key=True, index=True)
    resource_id = Column(String, index=True)
    account_id = Column(String, index=True)
    region = Column(String, index=True)
    type = Column(String, index=True)  # EC2, EBS, RDS, S3
    
    # Unified Resource Model (URM) fields
    cost_7d = Column(Float, default=0.0)
    cpu_avg = Column(Float, nullable=True)
    memory_avg = Column(Float, nullable=True)
    last_active = Column(DateTime, nullable=True)
    tags = Column(JSON, default={})
    
    # Enrichment
    status = Column(String, default="Active") # Active, Idle, Unattached
    waste_score = Column(Float, default=0.0)
    waste_tier = Column(String, nullable=True) # CRITICAL, HIGH, MEDIUM, LOW
    carbon_g_co2_7d = Column(Float, default=0.0)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

from sqlalchemy import Column, Integer, String, Float, JSON, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.engine import Base

class UserORM(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    role = Column(String, default="viewer")
    company = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    resources = relationship("ResourceORM", back_populates="owner")
    recommendations = relationship("RecommendationORM", back_populates="user")


class ResourceORM(Base):
    __tablename__ = "resources"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    resource_id = Column(String, index=True, nullable=False)
    account_id = Column(String, index=True, nullable=False)
    region = Column(String, index=True, nullable=False)
    type = Column(String, index=True, nullable=False)  # EC2, EBS, RDS, S3
    name = Column(String, nullable=True)
    
    # Unified Resource Model (URM) fields
    cost_7d = Column(Float, default=0.0)
    cpu_avg_7d = Column(Float, nullable=True)
    memory_avg_7d = Column(Float, nullable=True)
    network_bytes_7d = Column(Integer, default=0)
    last_active = Column(DateTime, nullable=True)
    tags = Column(JSON, default={})
    resource_metadata = Column(JSON, default={}) # Raw provider-specific data
    
    # Enrichment
    status = Column(String, default="Active") # Active, Idle, Unattached
    waste_score = Column(Float, default=0.0)
    waste_tier = Column(String, nullable=True) # CRITICAL, HIGH, MEDIUM, LOW
    carbon_g_co2_7d = Column(Float, default=0.0)
    carbon_intensity_score = Column(Float, default=0.0)
    
    collected_at = Column(DateTime(timezone=True), default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    owner = relationship("UserORM", back_populates="resources")
    recommendations = relationship("RecommendationORM", back_populates="resource")


class RecommendationORM(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    resource_pk = Column(Integer, ForeignKey("resources.id"), nullable=True) # FK to ResourceORM
    
    issue = Column(String, nullable=False)
    recommendation_text = Column(String, nullable=False)
    terraform_code = Column(String, nullable=True)
    estimated_savings = Column(Float, default=0.0)
    priority = Column(String, default="Medium") # High, Medium, Low
    confidence = Column(Integer, default=0) # 0-100
    reasoning = Column(String, nullable=True)
    status = Column(String, default="Pending") # Pending, Approved, Applied, Rejected

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("UserORM", back_populates="recommendations")
    resource = relationship("ResourceORM", back_populates="recommendations")


class ScanSessionORM(Base):
    __tablename__ = "scan_sessions"

    id = Column(Integer, primary_key=True, index=True)
    status = Column(String, default="Running") # Running, Completed, Failed
    resources_scanned = Column(Integer, default=0)
    issues_found = Column(Integer, default=0)
    total_savings_identified = Column(Float, default=0.0)
    
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)

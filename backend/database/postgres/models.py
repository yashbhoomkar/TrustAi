from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    ForeignKey,
    DateTime,
    BigInteger,
    JSON,
    Boolean
)

from sqlalchemy.orm import relationship

from datetime import datetime

from database.postgres.connection import Base


###########################################################
# User
###########################################################

class User(Base):

    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    email = Column(
        String,
        unique=True,
        nullable=False
    )

    hashed_password = Column(
        String,
        nullable=False
    )

    api_keys = relationship(
        "ApiKey",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    datasets = relationship(
        "Dataset",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    evaluations = relationship(
        "Evaluation",
        back_populates="user",
        cascade="all, delete-orphan"
    )


###########################################################
# API Key
###########################################################

class ApiKey(Base):

    __tablename__ = "api_keys"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    provider = Column(
        String,
        nullable=False
    )

    display_name = Column(
        String,
        nullable=False
    )

    api_key = Column(
        Text,
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    user = relationship(
        "User",
        back_populates="api_keys"
    )


###########################################################
# Dataset
###########################################################

class Dataset(Base):

    __tablename__ = "datasets"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    display_name = Column(
        String,
        nullable=False
    )

    original_filename = Column(
        String,
        nullable=False
    )

    stored_filename = Column(
        String,
        nullable=False,
        unique=True
    )

    storage_path = Column(
        Text,
        nullable=False
    )

    file_size = Column(
        BigInteger,
        nullable=False
    )

    rows = Column(
        Integer,
        nullable=True
    )

    columns = Column(
        Integer,
        nullable=True
    )

    column_names = Column(
        JSON,
        nullable=True
    )

    column_mapping = Column(
        JSON,
        nullable=True
    )

    status = Column(
        String,
        default="uploaded"
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    user = relationship(
        "User",
        back_populates="datasets"
    )

    evaluations = relationship(
        "Evaluation",
        back_populates="dataset",
        cascade="all, delete-orphan"
    )

###########################################################
# Metric
###########################################################

class Metric(Base):

    __tablename__ = "metrics"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    is_default = Column(
        Boolean,
        default=False
    )

    title = Column(
        String,
        nullable=False
    )

    description = Column(
        Text,
        nullable=True
    )

    system_prompt = Column(
        Text,
        nullable=False
    )

    general_instructions = Column(
        Text,
        nullable=True
    )

    output_type = Column(
        String,
        nullable=False
    )
    # discrete / continuous

    min_value = Column(
        Integer,
        nullable=True
    )

    max_value = Column(
        Integer,
        nullable=True
    )

    discrete_values = Column(
        JSON,
        nullable=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    user = relationship(
        "User"
    )

###########################################################
# Evaluation
###########################################################

class Evaluation(Base):

    __tablename__ = "evaluations"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    dataset_id = Column(
        Integer,
        ForeignKey("datasets.id"),
        nullable=False
    )

    evaluation_name = Column(
        String,
        nullable=False
    )

    status = Column(
        String,
        default="queued"
    )

    metrics = Column(
        JSON,
        nullable=True
    )

    total_rows = Column(
        Integer,
        nullable=True
    )

    completed_rows = Column(
        Integer,
        default=0
    )

    results_path = Column(
        Text,
        nullable=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    user = relationship(
        "User",
        back_populates="evaluations"
    )

    dataset = relationship(
        "Dataset",
        back_populates="evaluations"
    )
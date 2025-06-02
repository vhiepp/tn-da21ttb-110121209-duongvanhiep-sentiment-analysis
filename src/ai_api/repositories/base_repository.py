from sqlalchemy.orm import Session
from typing import Type

class BaseRepository:
    def __init__(self, db: Session, model: Type):
        self.db = db
        self.model = model

    def get_all(self):
        return self.db.query(self.model).all()

    def get_by_id(self, id: int):
        return self.db.query(self.model).filter(self.model.id == id).first()

    def create(self, entity):
        self.db.add(entity)
        self.db.commit()
        self.db.refresh(entity)
        return entity

    def update(self, id: int, updates: dict):
        obj = self.get_by_id(id)
        if obj:
            for key, value in updates.items():
                setattr(obj, key, value)
            self.db.commit()
            self.db.refresh(obj)
        return obj

    def delete(self, id: int):
        obj = self.get_by_id(id)
        if obj:
            self.db.delete(obj)
            self.db.commit()
        return obj
from repositories.base_repository import BaseRepository
from entities.ai_model_entity import AIModel

class AIModelRepository(BaseRepository):
    def __init__(self, db):
        super().__init__(db, AIModel)
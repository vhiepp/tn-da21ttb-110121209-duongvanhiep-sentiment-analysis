from repositories.base_repository import BaseRepository
from entities.predict_content_entity import PredictContent

class PredictContentRepository(BaseRepository):
    def __init__(self, db):
        super().__init__(db, PredictContent)
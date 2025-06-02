from repositories.base_repository import BaseRepository
from entities.predict_history_entity import PredictHistory

class PredictHistoryRepository(BaseRepository):
    def __init__(self, db):
        super().__init__(db, PredictHistory)
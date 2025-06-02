from repositories.base_repository import BaseRepository
from entities.user_entity import User

class UserRepository(BaseRepository):
    def __init__(self, db):
        super().__init__(db, User)
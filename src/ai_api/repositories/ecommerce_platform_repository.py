from repositories.base_repository import BaseRepository
from entities.ecommerce_platform_entity import EcommercePlatform

class EcommercePlatformRepository(BaseRepository):
    def __init__(self, db):
        super().__init__(db, EcommercePlatform)
from seeders.user_seeder import run_user_seeder
from database import Base, engine

# Tạo lại bảng (nếu chưa có)
Base.metadata.create_all(bind=engine)

# Chạy các seeder
run_user_seeder()

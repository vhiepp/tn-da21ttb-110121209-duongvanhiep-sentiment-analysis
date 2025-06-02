from entities.user_entity import User, UserRole
from database import db
from utils.auth import hash_password

def run_user_seeder():    # Kiểm tra nếu đã có dữ liệu rồi thì không seed lại
    if db.query(User).count() > 0:
        print("Users already seeded.")
        return

    users = [
        User(first_name="Văn Hiệp", last_name="Dương", email="hiep@gmail.com", username="hiepdv", password=hash_password("123"), role=UserRole.ADMIN),
    ]

    db.add_all(users)
    db.commit()
    db.close()
    print("Seeded users successfully.")

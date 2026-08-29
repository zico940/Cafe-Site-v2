from app.database import SessionLocal, engine, Base
from app.models.menu import Menu

SEED_MENUS = [
    {"name": "에스프레소", "name_en": "Espresso", "price": 3500, "category": "espresso", "description": "진하고 강렬한 에스프레소"},
    {"name": "아메리카노", "name_en": "Americano", "price": 4000, "category": "espresso", "description": "에스프레소에 물을 더한 클래식"},
    {"name": "롱블랙", "name_en": "Long Black", "price": 4500, "category": "espresso", "description": "물 위에 에스프레소를 내린 진한 커피"},
    {"name": "카페라떼", "name_en": "Cafe Latte", "price": 4800, "category": "milk_based", "description": "에스프레소와 스팀밀크의 조화"},
    {"name": "카푸치노", "name_en": "Cappuccino", "price": 5000, "category": "milk_based", "description": "풍부한 우유 거품이 특징"},
    {"name": "플랫화이트", "name_en": "Flat White", "price": 5500, "category": "milk_based", "description": "진한 에스프레소와 벨벳같은 우유"},
    {"name": "바닐라라떼", "name_en": "Vanilla Latte", "price": 5500, "category": "sweet", "description": "달콤한 바닐라 시럽이 들어간 라떼"},
    {"name": "카라멜마키아토", "name_en": "Caramel Macchiato", "price": 6000, "category": "sweet", "description": "카라멜 드리즐이 올라간 달콤한 음료"},
    {"name": "카페모카", "name_en": "Cafe Mocha", "price": 5800, "category": "sweet", "description": "초콜릿과 커피의 완벽한 조합"},
    {"name": "녹차라떼", "name_en": "Matcha Latte", "price": 5500, "category": "non_coffee", "description": "국산 말차로 만든 진한 그린라떼"},
    {"name": "초코라떼", "name_en": "Chocolate Latte", "price": 5500, "category": "non_coffee", "description": "벨기에 초콜릿으로 만든 진한 음료"},
    {"name": "허브티", "name_en": "Herb Tea", "price": 4500, "category": "non_coffee", "description": "캐모마일, 페퍼민트 등 다양한 허브티"},
]


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        count = db.query(Menu).count()
        if count == 0:
            for m in SEED_MENUS:
                db.add(Menu(**m))
            db.commit()
            print(f"Seeded {len(SEED_MENUS)} menus.")
        else:
            print(f"Already have {count} menus, skipping seed.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()

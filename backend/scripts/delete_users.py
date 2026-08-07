import asyncio
import firebase_admin
from firebase_admin import credentials, auth
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import delete
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.models.user import User
from app.core.config import settings
from app.core.firebase import init_firebase

async def main():
    # Database URL
    DATABASE_URL = settings.DATABASE_URL
    engine = create_async_engine(DATABASE_URL)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    emails_to_delete = ["prathameshdeshmukh090@gmail.com", "topg45330@gmail.com"]

    async with async_session() as session:
        for email in emails_to_delete:
            try:
                print(f"Deleting {email} from Postgres...")
                await session.execute(delete(User).where(User.email == email))
                await session.commit()
                print(f"Deleted {email} from Postgres.")
            except Exception as e:
                print(f"Failed to delete {email} from Postgres: {e}")

    # Delete from Firebase
    try:
        init_firebase()
        for email in emails_to_delete:
            try:
                user = auth.get_user_by_email(email)
                auth.delete_user(user.uid)
                print(f"Deleted {email} from Firebase.")
            except Exception as e:
                print(f"Failed to delete {email} from Firebase (might not exist): {e}")
    except Exception as e:
        print("Failed to init Firebase")

if __name__ == "__main__":
    asyncio.run(main())

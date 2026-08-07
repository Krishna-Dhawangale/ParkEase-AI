import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text

async def check():
    engine = create_async_engine('postgresql+asyncpg://postgres:ParkEaseAI@127.0.0.1:5432/parkease_ai')
    async with engine.begin() as conn:
        await conn.execute(text("UPDATE users SET role = 'CLIENT_ADMIN' WHERE email = 'topg45330@gmail.com';"))
        result = await conn.execute(text('SELECT email, role FROM users;'))
        rows = result.fetchall()
        print("Users in PostgreSQL:")
        for r in rows:
            print(f"- {r[0]} | Role: {r[1]}")
        for r in rows:
            print(f"- {r[0]} | Role: {r[1]}")

if __name__ == '__main__':
    asyncio.run(check())

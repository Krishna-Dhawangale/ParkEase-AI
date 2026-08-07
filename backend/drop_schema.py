import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text

engine = create_async_engine('postgresql+asyncpg://postgres:ParkEaseAI@127.0.0.1:5432/parkease_ai', isolation_level='AUTOCOMMIT')

async def main():
    async with engine.connect() as conn:
        await conn.execute(text('DROP SCHEMA public CASCADE'))
        await conn.execute(text('CREATE SCHEMA public'))
        await conn.execute(text('GRANT ALL ON SCHEMA public TO postgres'))
        await conn.execute(text('GRANT ALL ON SCHEMA public TO public'))
    print('Done')

if __name__ == "__main__":
    asyncio.run(main())

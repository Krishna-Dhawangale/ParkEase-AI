import asyncio
import asyncpg
import urllib.parse
import sys
from pathlib import Path

# Force UTF-8 output encoding for Windows terminal
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
PASSWORD = 'ParkEaseAI'
ENCODED_PASSWORD = urllib.parse.quote(PASSWORD)
HOST = '127.0.0.1'
PORT = 5432
USER = 'postgres'
DB_NAME = 'parkease_ai'

async def main():
    print(f"Connecting to PostgreSQL server at {HOST}:{PORT} as '{USER}'...")
    
    # 1. Connect to default 'postgres' database to create 'parkease_db' if needed
    try:
        conn = await asyncpg.connect(user=USER, password=PASSWORD, host=HOST, port=PORT, database='postgres')
        print("[SUCCESS] Successfully connected to PostgreSQL server!")
    except Exception as e:
        print(f"[ERROR] Connection failed: {e}")
        return

    # Check if parkease_db exists
    db_exists = await conn.fetchval("SELECT 1 FROM pg_database WHERE datname = $1", DB_NAME)
    if not db_exists:
        print(f"Database '{DB_NAME}' does not exist. Creating '{DB_NAME}'...")
        await conn.execute(f'CREATE DATABASE "{DB_NAME}"')
        print(f"[SUCCESS] Database '{DB_NAME}' created successfully!")
    else:
        print(f"[INFO] Database '{DB_NAME}' already exists.")

    await conn.close()

    # 2. Connect directly to 'parkease_db'
    print(f"Connecting to '{DB_NAME}'...")
    db_conn = await asyncpg.connect(user=USER, password=PASSWORD, host=HOST, port=PORT, database=DB_NAME)

    schema_dir = Path(__file__).resolve().parent / 'schema'
    sql_files = [
        '01_extensions.sql',
        '02_enums.sql',
        '03_tables.sql',
        '04_constraints.sql',
        '05_indexes.sql',
        '06_triggers.sql',
        '07_seed.sql',
        '08_comments.sql'
    ]

    print("\nExecuting Modular Schema Files...")
    for sql_filename in sql_files:
        sql_path = schema_dir / sql_filename
        if not sql_path.exists():
            print(f"[WARNING] File {sql_filename} not found!")
            continue
        
        print(f"  -> Running {sql_filename}...")
        sql_content = sql_path.read_text(encoding='utf-8')
        
        try:
            await db_conn.execute(sql_content)
            print(f"    [OK] {sql_filename} executed successfully!")
        except Exception as e:
            print(f"    [ERROR] Error executing {sql_filename}: {e}")

    # 3. Verify created tables
    tables = await db_conn.fetch("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
        ORDER BY table_name;
    """)

    print(f"\nSetup Verification in '{DB_NAME}':")
    print(f"Total Base Tables Created: {len(tables)}")
    for row in tables:
        print(f"  - {row['table_name']}")

    await db_conn.close()
    print("\n[COMPLETE] Database setup finished! Refresh pgAdmin to see 'parkease_db'.")

if __name__ == '__main__':
    asyncio.run(main())

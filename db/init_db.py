import os
import sys
import glob
from pathlib import Path

# Try loading env vars from root .env
env_file = Path(__file__).resolve().parent.parent / '.env'
if env_file.exists():
    with open(env_file, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                k, v = line.split('=', 1)
                os.environ[k.trim() if hasattr(k, 'trim') else k.strip()] = v.strip()

db_url = os.environ.get('DATABASE_URL', '')
print(f"🔗 Target Database URL: {db_url or 'Not configured in .env'}")

schema_dir = Path(__file__).resolve().parent / 'schema'
sql_files = sorted(glob.glob(str(schema_dir / '*.sql')))

print(f"\n📂 Found {len(sql_files)} modular schema files in {schema_dir}:")
for sf in sql_files:
    print(f"  - {Path(sf).name}")

print("\n✨ Database setup scripts are ready.")
print("👉 You can execute these files in pgAdmin Query Tool or run via psql:")
print(f"   psql -d parkease_db -f {Path(__file__).resolve().parent / 'init_all.sql'}")

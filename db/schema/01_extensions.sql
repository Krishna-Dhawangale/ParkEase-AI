-- 01_extensions.sql
-- Enables required PostgreSQL extensions for UUID generation and GiST range indexing

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

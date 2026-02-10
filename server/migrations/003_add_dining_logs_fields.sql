-- dining_logs に用途・人数・1人単価フィールドを追加
ALTER TABLE dining_logs ADD COLUMN IF NOT EXISTS purpose TEXT DEFAULT '';
ALTER TABLE dining_logs ADD COLUMN IF NOT EXISTS people INTEGER DEFAULT 2;
ALTER TABLE dining_logs ADD COLUMN IF NOT EXISTS price_per_person TEXT DEFAULT '';

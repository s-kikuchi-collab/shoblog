-- SHOBLOG LINE予約管理 テーブル作成SQL
-- Supabase SQL Editor で実行してください

CREATE TABLE reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  line_user_id TEXT NOT NULL,
  line_display_name TEXT DEFAULT '不明',
  restaurant_name TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT DEFAULT '未定',
  party_size INTEGER,
  raw_message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  note TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 検索パフォーマンス用インデックス
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_reservations_date ON reservations(date);
CREATE INDEX idx_reservations_created_at ON reservations(created_at DESC);

-- Row Level Security
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon select" ON reservations FOR SELECT USING (true);
CREATE POLICY "Allow anon insert" ON reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update" ON reservations FOR UPDATE USING (true);

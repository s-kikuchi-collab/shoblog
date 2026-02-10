CREATE TABLE dining_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  date DATE NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  memo TEXT DEFAULT '',
  who TEXT DEFAULT 'shobu',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: 個人利用のため全許可
ALTER TABLE dining_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON dining_logs FOR ALL USING (true) WITH CHECK (true);

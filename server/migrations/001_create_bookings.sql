CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shop TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT DEFAULT '19:00',
  people INTEGER DEFAULT 2,
  purpose TEXT DEFAULT '',
  who TEXT DEFAULT 'shobu',
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'completed')),
  satisfaction INTEGER CHECK (satisfaction BETWEEN 1 AND 5),
  comment TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- RLS: 個人利用のため全許可
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON bookings FOR ALL USING (true) WITH CHECK (true);

# LINE Messaging API セットアップ手順

## 1. LINE Developersでチャネル作成

1. [LINE Developers](https://developers.line.biz/) にログイン
2. プロバイダーを選択（または新規作成）
3. 「Messaging API」チャネルを作成
4. チャネル名: `SHOBLOG予約` など任意

## 2. 必要な情報の取得

チャネル設定画面から以下を取得:

| 項目 | 場所 |
|------|------|
| Channel ID | 「チャネル基本設定」タブ |
| Channel Secret | 「チャネル基本設定」タブ |
| Channel Access Token | 「Messaging API設定」タブ → 発行 |

## 3. Webhook設定

「Messaging API設定」タブで:

1. **Webhook URL** を設定: `https://your-domain.com/webhook`
   - ローカル開発時は ngrok 等でトンネリング
   - `ngrok http 3000` → 表示されたURLに `/webhook` を付けて設定
2. **Webhookの利用** を「オン」
3. **応答メッセージ** を「オフ」（自動応答を無効化）

## 4. 環境変数の設定

`server/.env` に取得した情報を設定:

```
LINE_CHANNEL_ID=your_channel_id
LINE_CHANNEL_SECRET=your_channel_secret
LINE_CHANNEL_ACCESS_TOKEN=your_channel_access_token
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_key
PORT=3000
```

## 5. Supabaseテーブル作成

Supabaseダッシュボード → SQL Editor で以下を実行:

```sql
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

-- インデックス
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_reservations_date ON reservations(date);

-- RLSを有効化
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- anon keyでの読み取り・書き込みを許可
CREATE POLICY "Allow anon select" ON reservations FOR SELECT USING (true);
CREATE POLICY "Allow anon insert" ON reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update" ON reservations FOR UPDATE USING (true);
```

## 6. サーバー起動

```bash
cd server
npm install
npm start
```

## 7. 動作確認

1. ngrokでトンネリング: `ngrok http 3000`
2. LINE DevelopersでWebhook URLを更新
3. LINEでメッセージ送信: `予約 焼肉ホルモン金樹 2/15 19:00 4名`
4. 自動返信が届くことを確認
5. SHOBLOG管理画面の「予約」タブで表示されることを確認

## 対応メッセージフォーマット

```
予約 [店名] [日付] [時間] [人数]

例:
予約 焼肉ホルモン金樹 2/15 19:00 4名
焼肉ホルモン金樹 明日 19時 4人
2月15日 19時30分 焼肉ホルモン金樹 4名
焼肉ホルモン金樹 明後日 19:00 4名
```

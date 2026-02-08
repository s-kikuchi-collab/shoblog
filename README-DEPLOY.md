# SHOBLOGサーバー デプロイ手順

## Renderにサーバーをデプロイ

1. https://render.com にアクセスしてGitHubアカウントでサインアップ/ログイン
2. ダッシュボードで「New +」→「Web Service」をクリック
3. GitHubリポジトリ `s-kikuchi-collab/shoblog` を選択して「Connect」
4. 以下を設定:
   - **Name:** `shoblog-line-server`
   - **Root Directory:** `server`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
   - **Plan:** `Free`
5. 「Environment」タブで環境変数を追加:
   - `LINE_CHANNEL_SECRET` = （LINE Developer Consoleから取得）
   - `LINE_CHANNEL_ACCESS_TOKEN` = （LINE Developer Consoleから取得）
   - `SUPABASE_URL` = （Supabaseダッシュボードから取得）
   - `SUPABASE_KEY` = （Supabaseダッシュボードから取得）
   - `FRONTEND_URL` = フロントエンドの本番URL（例: `https://shoblog.vercel.app`）
6. 「Create Web Service」をクリック
7. デプロイ完了後、URLが発行される（例: `https://shoblog-line-server.onrender.com`）

## デプロイ後の設定

### フロントエンド
1. `.env.production` の `VITE_API_BASE` をRenderの実際のURLに更新
2. Vercelを使っている場合、Vercelダッシュボードの Environment Variables にも `VITE_API_BASE` を設定
3. `npm run build` → git push で自動デプロイ

### LINE Developer Console
1. https://developers.line.biz にログイン
2. チャネルの「Messaging API」→「Webhook設定」
3. Webhook URLを以下に設定:
   ```
   https://shoblog-line-server.onrender.com/webhook
   ```
4. 「検証」ボタンで疎通確認
5. 「Webhookの利用」をオンに

### 動作確認
1. LINEで予約メッセージを送信（例: `予約 焼肉ホルモン金樹 明日 19:00 4名`）
2. SHOBLOGの「予定」タブで表示されることを確認
3. 自動返信が届くことを確認

## 必要な環境変数一覧

| 変数名 | 説明 | 設定場所 |
|--------|------|----------|
| `LINE_CHANNEL_SECRET` | LINE Messaging API チャネルシークレット | Render |
| `LINE_CHANNEL_ACCESS_TOKEN` | LINE Messaging API アクセストークン | Render |
| `SUPABASE_URL` | Supabase プロジェクトURL | Render |
| `SUPABASE_KEY` | Supabase anon/service key | Render |
| `FRONTEND_URL` | フロントエンド本番URL（CORS用） | Render |
| `VITE_API_BASE` | サーバーの本番URL | Vercel / .env.production |

## 注意事項

- Renderの無料プランは15分アクセスがないとスリープする。keep-aliveで対策済みだが、初回起動に最大30秒かかる場合がある
- これが問題なら有料プラン（$7/月）を検討
- LINE tokenが過去にコードにハードコードされていた場合、LINE Developer Consoleでトークンを再発行することを推奨
- ローカル開発時は `server/.env` にLINE/Supabase環境変数を設定して `cd server && npm run dev` で起動

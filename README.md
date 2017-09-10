egosearch-bulter
===

これはなに
---
指定されたサービスから流入するデータを指定されたワードで選別し、指定されたサービスにそのデータを出力するNode.jsで作られたアプリケーションです。

設定
---
```bash
cp .env.example .env
editor .env
```

### グローバル設定
システム側が利用する設定項目です。

- `EGS_SUB_SERVICES`
  購読するサービスをカンマ区切りで指定します。  
  [購読サービスについて](#購読サービスについて) も参照してください。
- `EGS_SUB_TRACKS`
  購読したサービスから流入するデータを選別するキーワードを指定します。  
  現在は購読サービスがTwitterしかないためその仕様に基づいています。
- `EGS_PUB_SERVICES`
  購読しているサービスから流入してきたデータを出版する先のサービスをカンマ区切りで指定します。  
  [出版サービスについて](#出版サービスについて) も参照してください。

購読サービスについて
---
### twitter
Twitterのpublic streamsから情報を取得します。

#### 設定
アプリケーションを作成し、トークンを発行した上で以下のフィールドを環境変数、もしくは.envにセットしてください。

名称|説明
--|--
`EGS_SUB_TWITTER_CONSUMER_KEY`|アプリケーションのConsumer Key
`EGS_SUB_TWITTER_CONSUMER_SECRET`|アプリケーションのConsumer Secret
`EGS_SUB_TWITTER_TOKEN`|あなたのAccess Token
`EGS_SUB_TWITTER_TOKEN_SECRET`|あなたのAccess Token Secret

出版サービスについて
---
### console
コンソールに入力データの詳細を出力します。

#### 出力
[_購読サービス名_] new message by _購読サービスに於けるデータを作成したユーザID_ (_データを参照できるURL_)

### slack
Incomming Hookを利用してSlackに入力データを出力します。

#### 設定
Incomming Hook URIを発行した上で以下のフィールドを環境変数、もしくは.envにセットしてください。

名称|説明
--|--
`EGS_PUB_SLACK_INCOMMING_HOOK_URI`|Incomming Hook URI
`EGS_PUB_SLACK_COLOR`|[content and links to messages \| Slack](https://api.slack.com/docs/message-attachments#color)

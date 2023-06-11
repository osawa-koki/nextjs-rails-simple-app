# nextjs-rails-simple-app

## 実行方法

```shell
docker build -t nextjs-rails-simple-app .
docker run -it -p 8000:8000 nextjs-rails-simple-app
```

## 開発環境の構築

| モジュール | バージョン |
| --- | --- |
| Ruby | 3.2.2 |
| Ruby on Rails | 7.0.4.3 |
| Node.js | 20 |
| yarn | 1.22.19 |

### クライアントサイド

```shell
cd client
yarn install
yarn dev
```

### サーバサイド

```shell
cd server
gem install bundler
bundle install
gem install rails
rails db:migrate
rails server --port 8000
```

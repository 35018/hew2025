CREATE DATABASE hew2025_db;

\c hew2025_db;

-- テーブル作成

-- 重複しないように同名テーブルがある場合DROP
DROP TABLE IF EXISTS users;
-- 定義
CREATE TABLE users(
    user_id integer NOT NULL PRYMARY KEY,
    user_name varchar(50) NOT NULL,
    email varchar(200) NOT NULL,
    pass varchar(30) NOT NULL,
    birth date   
)

-- 初期登録ユーザーデータ
INSERST INTO users (user_id,user_name,email,pass,birth)
VALUES(
    1,
    "admin",
    "example@example.co.jp",
    "pass",
    "2025-12-12"
);
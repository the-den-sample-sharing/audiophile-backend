-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`

DROP TABLE IF EXISTS packs cascade; 
DROP TABLE IF EXISTS samples cascade;
DROP TABLE IF EXISTS profiles cascade;
DROP TABLE IF EXISTS users cascade;
DROP TABLE IF EXISTS profile_avatars cascade;

CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email VARCHAR NOT NULL,
  password_hash VARCHAR NOT NULL
);

CREATE TABLE profiles (
  user_id BIGINT NOT NULL PRIMARY KEY,
  username VARCHAR NOT NULL,
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  bio VARCHAR,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE profile_avatars (
  profile_id BIGINT NOT NULL,
  avatar_url VARCHAR,
  FOREIGN KEY (profile_id) REFERENCES users(id)

);

CREATE TABLE packs (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR
);

CREATE TABLE samples (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  url VARCHAR,
  user_id BIGINT,
  pack_id BIGINT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (pack_id) REFERENCES packs(id)
);








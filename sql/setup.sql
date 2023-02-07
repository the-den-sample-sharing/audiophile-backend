-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS profiles;


CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email VARCHAR NOT NULL,
  password_hash VARCHAR NOT NULL
  
  
);

CREATE TABLE profiles (
  user_id BIGINT,
  username VARCHAR,
  first_name VARCHAR,
  last_name VARCHAR,
  FOREIGN KEY(user_id) REFERENCES users(id)
);



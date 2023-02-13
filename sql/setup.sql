-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS profiles;
DROP TABLE IF EXISTS profiles_sample_packs; -- join table
DROP TABLE IF EXISTS sample_packs;

CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email VARCHAR NOT NULL,
  password_hash VARCHAR NOT NULL
);

CREATE TABLE profiles (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id BIGINT NOT NULL,
  username VARCHAR,
  first_name VARCHAR,
  last_name VARCHAR,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE sample_packs (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR NOT NULL
);

CREATE TABLE profiles_sample_packs (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  profile_id BIGINT,
  sample_pack_id BIGINT,
  FOREIGN KEY (profile_id) REFERENCES profiles(id),
  FOREIGN KEY (sample_pack_id) REFERENCES sample_packs(id)
);

INSERT INTO
  users (email, password_hash)
VALUES
  ('rio@example.com', 'notarealpasswordhash'),
  ('kyle@example.com', 'notarealpasswordhash'),
  ('grey@example.com', 'notarealpasswordhash');

INSERT INTO
  profiles (user_id, username, first_name, last_name)
VALUES
  (1, 'rio_username', 'Rio', 'Edwards' ),
  (2, 'kyle_username', 'Kyle', 'McCall' ),
  (3, 'grey_username', 'Grey', 'Whithers' );

INSERT INTO sample_packs (name)
VALUES
  ('riosamplepack1'),
  ('riosamplepack2'),
  ('kylesamplepack1'),
  ('greysamplepack');

INSERT INTO profiles_sample_packs (profile_id, sample_pack_id)
VALUES
    (1, 1),
    (1, 2),
    (2, 3),
    (3, 4);



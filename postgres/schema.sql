DROP DATABASE IF EXISTS sdc_reviews;

CREATE DATABASE sdc_reviews;

CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL NOT NULL PRIMARY KEY,
  product_id INT,
  rating INT,
  date TIMESTAMP,
  summary VARCHAR,
  body VARCHAR,
  recommend BOOLEAN,
  reported BOOLEAN,
  reviewer_name VARCHAR NOT NULL,
  reviewer_email VARCHAR NOT NULL,
  response VARCHAR,
  helpfulness INT
);

SELECT setval('reviews_id_seq', (SELECT MAX(id) FROM reviews));
ALTER SEQUENCE reviews_id_seq RESTART WITH (SELECT COUNT FROM reviews) + 1;

CREATE TABLE IF NOT EXISTS reviews_photos (
  id SERIAL NOT NULL PRIMARY KEY,
  review_id INT REFERENCES reviews (id),
  url VARCHAR
);

CREATE TABLE IF NOT EXISTS characteristics (
  id SERIAL NOT NULL PRIMARY KEY,
  product_id INT,
  name VARCHAR
);

CREATE TABLE IF NOT EXISTS characteristic_reviews (
  id SERIAL NOT NULL PRIMARY KEY,
  characteristic_id INT REFERENCES characteristics (id),
  review_id	INT REFERENCES reviews (id),
  value INT
);

TRUNCATE TABLE reviews, reviews_photos, characteristics, characteristic_reviews;

COPY reviews FROM '/Users/matt/Desktop/work/data/reviews.csv' DELIMITERS ',' CSV header;
COPY reviews_photos FROM '/Users/matt/Desktop/work/data/reviews_photos.csv' DELIMITERS ',' CSV header;
COPY characteristics FROM '/Users/matt/Desktop/work/data/characteristics.csv' DELIMITERS ',' CSV header;
COPY characteristic_reviews FROM '/Users/matt/Desktop/work/data/characteristic_reviews.csv' DELIMITERS ',' CSV header;


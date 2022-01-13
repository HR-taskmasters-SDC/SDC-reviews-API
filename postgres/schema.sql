DROP DATABASE IF EXISTS sdc_reviews;

CREATE DATABASE sdc_reviews;

CREATE TABLE products (
  id SERIAL NOT NULL PRIMARY KEY,
  name VARCHAR,
  slogan VARCHAR,
  description	VARCHAR,
  category VARCHAR,
  default_price INT
);

COPY products FROM '/Users/matt/Desktop/work/data/product.csv' DELIMITERS ',' CSV header;

CREATE TABLE reviews (
  id SERIAL NOT NULL PRIMARY KEY,
  product_id INT REFERENCES products (id),
  rating INT,
  date VARCHAR,
  summary VARCHAR,
  body VARCHAR,
  recommend BOOLEAN,
  reported BOOLEAN,
  reviewer_name VARCHAR NOT NULL,
  reviewer_email VARCHAR NOT NULL,
  response VARCHAR,
  helpfulness INT
);

COPY reviews FROM '/Users/matt/Desktop/work/data/reviews.csv' DELIMITERS ',' CSV header;

CREATE TABLE reviews_photos (
  id SERIAL NOT NULL PRIMARY KEY,
  review_id INT REFERENCES reviews (id),
  url VARCHAR
);

COPY reviews_photos FROM '/Users/matt/Desktop/work/data/reviews_photos.csv' DELIMITERS ',' CSV header;

CREATE TABLE characteristics (
  id SERIAL NOT NULL PRIMARY KEY,
  product_id INT REFERENCES products (id),
  name VARCHAR
);

COPY characteristics FROM '/Users/matt/Desktop/work/data/characteristics.csv' DELIMITERS ',' CSV header;

CREATE TABLE characteristic_reviews (
  id SERIAL NOT NULL PRIMARY KEY,
  characteristic_id INT REFERENCES characteristics (id),
  review_id	INT REFERENCES reviews (id),
  value INT
);

COPY characteristic_reviews FROM '/Users/matt/Desktop/work/data/characteristic_reviews.csv' DELIMITERS ',' CSV header;


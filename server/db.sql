CREATE TABLE reviews (
   id BIGSERIAL NOT NULL PRIMARY KEY ,
   restaurant_id BIGINT NOT NULL REFERENCES restaurants(id),
   name VARCHAR(50) NOT NULL,
   review TEXT NOT NULL, 
   rating INT NOT NULL check(rating >= 1 AND rating <= 5)
);
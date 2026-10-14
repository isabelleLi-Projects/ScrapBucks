DROP DATABASE IF EXISTS scrapbucks_db;
CREATE DATABASE scrapbucks_db;
USE scrapbucks_db;

CREATE TABLE User (
  user_id   INT AUTO_INCREMENT PRIMARY KEY,
  display_name      VARCHAR(100)  NOT NULL,
  email             VARCHAR(100)  NOT NULL,
  password_hash     VARCHAR(255)  NOT NULL,
  profile_photo     VARCHAR(100)  NOT NULL,
  role              VARCHAR(100)  NOT NULL, -- collector or customer
  rating            REAL          NOT NULL,
  FOREIGN KEY (driver_of) REFERENCES Post(post_id)  
);

CREATE TABLE TimeAvailable (
    day_of_week

);

CREATE TABLE Post (
    post_id   INT AUTO_INCREMENT PRIMARY KEY,
    num_bags         INT           NOT NULL, 
    price            REAL          NOT NULL,
    pickup_location  VARCHAR(100)  NOT NULL,
    photo            VARCHAR(100)  NOT NULL,
    has_driver       BOOLEAN       NOT NULL,
    is_picked_up     BOOLEAN       NOT NULL,
    


);

CREATE TABLE DriverLocations (
    

);

CREATE TABLE RecyclingLocations (

);

CREATE TABLE Reviews (

);

CREATE TABLE Messages (

);


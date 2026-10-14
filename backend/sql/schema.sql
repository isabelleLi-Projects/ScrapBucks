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
    recycling_location_id   INT AUTO_INCREMENT PRIMARY KEY,
    zip_code                CHAR(5),
    CONSTRAINT check_5_digits
        CHECK (zip_code REGEXP '^[0-9]{5}$')
    latitude                FLOAT    NOT NULL,
    longitude               FLOAT    NOT NULL,
    city                    VARCHAR(100)  NOT NULL,
    adddress                VARCHAR(100)  NOT NULL
);

CREATE TABLE Reviews (
    review_id   INT AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(50)        NOT NULL,
    notes       VARCHAR(300)       NOT NULL, -- description
    num_stars   REAL               NOT NULL
    FOREIGN KEY (user_id) REFERENCES User(user_id) 
);

CREATE TABLE Messages (
    message_id       INT           NOT NULL,
    has_driver       BOOLEAN       NOT NULL,
    is_read          BOOLEAN       NOT NULL,
    time_sent        TIMESTAMP     NOT NULL,
    PRIMARY KEY (message_id, post_id),
    CONSTRAINT fk_messages_weak_entity_set
      FOREIGN KEY (post_id) REFERENCES Post(post_id) 
      ON DELETE CASCADE
);

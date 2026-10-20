DROP DATABASE IF EXISTS scrapbucks_db;
CREATE DATABASE scrapbucks_db;
USE scrapbucks_db;

CREATE TABLE Users (
  user_id   INT AUTO_INCREMENT PRIMARY KEY,
  display_name      VARCHAR(100)  NOT NULL,
  email             VARCHAR(100)  NOT NULL UNIQUE,
  password_hash     VARCHAR(255)  NOT NULL,
  profile_photo     VARCHAR(100)  NOT NULL,
  user_role         VARCHAR(20)   NOT NULL, -- collector or customer
  rating            DECIMAL(3,2)  NOT NULL,

  CHECK (user_role IN ('collector', 'customer')),
  CHECK (rating BETWEEN 0.00 AND 5.00)
);

CREATE TABLE Posts (
    post_id   INT AUTO_INCREMENT PRIMARY KEY,
    num_bags         INT            NOT NULL, 
    price            DECIMAL (10,2) NOT NULL,
    pickup_location  VARCHAR(100)   NOT NULL,
    photo            VARCHAR(100)   NOT NULL,
    has_driver       BOOLEAN        NOT NULL DEFAULT FALSE,
    is_picked_up     BOOLEAN        NOT NULL DEFAULT FALSE,
    posted_by        INT            NOT NULL,
    FOREIGN KEY (posted_by) REFERENCES Users(user_id),
    driver_id        INT,
    FOREIGN KEY (driver_id) REFERENCES Users(user_id)

);

-- Weak entity depends on Post
CREATE TABLE TimeAvailable (
    time_id         INT      NOT NULL,  -- weak attribute
    post_id         INT      NOT NULL,  -- pk from post (strong entity)
    day_of_week     INT      NOT NULL, 
    start_time      TIME     NOT NULL,    
    end_time        TIME     NOT NULL,
    PRIMARY KEY (post_id, time_id),
    FOREIGN KEY (post_id) REFERENCES Posts(post_id) ON DELETE CASCADE
);

CREATE TABLE DriverLocations (
    driver_location_id   INT AUTO_INCREMENT PRIMARY KEY, 
    latitude             DECIMAL(10,8)    NOT NULL,
    longitude            DECIMAL(11,8)    NOT NULL,
    updated_at           TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    driver_id            INT              NOT NULL,
    FOREIGN KEY (driver_id) REFERENCES Users(user_id) 

);

CREATE TABLE RecyclingLocations (
    recycling_location_id   INT AUTO_INCREMENT PRIMARY KEY, --database's internal ID
    calrecycle_id           VARCHAR(100)       NOT NULL UNIQUE, -- location's ID from CalRecycle
    facility_name           VARCHAR(200)       NOT NULL, -- name of the CRV recycling place
    zip_code                CHAR(5)            NOT NULL,
    CONSTRAINT check_5_digits
        CHECK (zip_code REGEXP '^[0-9]{5}$'),
    latitude                DECIMAL(10,8)    NOT NULL,
    longitude               DECIMAL(11,8)    NOT NULL,
    city                    VARCHAR(100)     NOT NULL,
    recycle_address         VARCHAR(100)     NOT NULL,
    phone                   VARCHAR(30),
    is_active               BOOLEAN          NOT NULL DEFAULT TRUE, -- False when a location not part of CalRecycle data 
    source_updated_at       DATETIME         NULL, -- check if calRecycle provides this data
    last_synced_at          DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP, -- when the system last checked CalRecycle
    created_at              DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    updated_at              DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- changes the time to the time when the row is updated
    -- upsert = combines "update" and "insert" for the insert

);

CREATE TABLE Reviews (
    review_id   INT AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(50)        NOT NULL,
    notes       VARCHAR(300)       NOT NULL, -- description
    num_stars   INT                NOT NULL,
    created_by  INT                NOT NULL,
    FOREIGN KEY (created_by) REFERENCES Users(user_id),
    for_user    INT                NOT NULL,
    FOREIGN KEY (for_user) REFERENCES Users(user_id),
    CHECK (created_by <> for_user) -- prevents users from reviewing themselves
);

-- Weak Entity Set depends on Post
CREATE TABLE Messages (
    message_id       INT           NOT NULL,
    has_driver       BOOLEAN       NOT NULL,
    is_read          BOOLEAN       NOT NULL,
    time_sent        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    post_id          INT           NOT NULL,
    message_text     VARCHAR(1000) NOT NULL,
    PRIMARY KEY (message_id, post_id),
    FOREIGN KEY (post_id) REFERENCES Posts(post_id) ON DELETE CASCADE
);

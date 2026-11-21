USE scrapbucks_db;

ALTER TABLE RecyclingLocations
    DROP CHECK check_5_digits,
    MODIFY zip_code VARCHAR(10) NOT NULL,
    ADD CONSTRAINT check_us_zip
        -- allows for "92243-2771" format zipcodes
        -- 5 digits, hyphen, 4 digits(optional)
        CHECK (zip_code REGEXP '^[0-9]{5}(-[0-9]{4})?$');

    


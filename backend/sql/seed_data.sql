USE scrapbucks_db;

-- Users
INSERT INTO Users
(display_name, email, password_hash, profile_photo, rating)
VALUES
('Jessica Tan', 'jessica@example.com', '$2b$10$UR9wfLsnwybgITnlLAzD.O5ORLUpv2N6wXQDnDuaPec8VtwOdIwha', 'jessica.jpg', 5.00),
('Alex Chen', 'alex@example.com', '$2b$10$xQjV9uusbyH0vtmHfN91Ae0cNGfO46.mw8v//R2SSswRNbNxzgpWW', 'alex.jpg', 4.50),
('Jordan Kim', 'jordan@example.com', '$2b$10$z0hGPCPLKM/sVlc3bSkIb.5vrYTeBn.xbN0ZEtmkC/MLC56gl5Wu.', 'jordan.jpg', 4.75);

-- Posts
INSERT INTO Posts
(price, description, address_line, city, state, zip_code,
 latitude, longitude, pickup_notes, delivery_instruction,
 has_driver, is_picked_up, posted_by, driver_id)
VALUES
(
  15.00,
  'Three bags of recyclable bottles and cans',
  '123 Main Street',
  'San Jose',
  'CA',
  '95112',
  37.33820000,
  -121.88630000,
  'Please pick up near the front door',
  'knock please',
  TRUE,
  FALSE,
  1,
  2
),
(
  25.00,
  'Five bags of aluminum cans',
  '456 Oak Avenue',
  'San Jose',
  'CA',
  '95126',
  37.32160000,
  -121.89100000,
  'Call when you arrive',
  'pickup outside',
  FALSE,
  FALSE,
  1,
  NULL
),
(
  10.00,
  'Two bags of cardboard and plastic bottles',
  '789 Market Street',
  'Santa Clara',
  'CA',
  '95050',
  37.35410000,
  -121.95520000,
  'Pickup is available after 5 PM',
  'pickup outside',
  TRUE,
  TRUE,
  3,
  2
);

-- Available pickup times
-- day_of_week: 1 = Monday, 2 = Tuesday, etc.
INSERT INTO TimeAvailable
(time_id, post_id, day_of_week, start_time, end_time)
VALUES
(1, 1, 1, '09:00:00', '12:00:00'),
(2, 1, 3, '14:00:00', '17:00:00'),
(1, 2, 2, '10:00:00', '13:00:00'),
(1, 3, 6, '09:00:00', '11:00:00');

-- Post photos
INSERT INTO PostPhotos
(post_id, photo_order, photo_url)
VALUES
(1, 1, 'https://images.example.com/recycling-bags-1.jpg'),
(1, 2, 'https://images.example.com/recycling-bags-2.jpg'),
(2, 1, 'https://images.example.com/aluminum-cans.jpg'),
(3, 1, 'https://images.example.com/cardboard.jpg');

-- Driver locations
INSERT INTO DriverLocations
(latitude, longitude, driver_id)
VALUES
(37.33500000, -121.88400000, 2),
(37.35000000, -121.95000000, 2);

-- -- Recycling locations
-- INSERT INTO RecyclingLocations
-- (calrecycle_id, facility_name, zip_code, latitude, longitude,
--  city, recycle_address, phone)
-- VALUES
-- (
--   'CRV-001',
--   'San Jose Recycling Center',
--   '95112',
--   37.34200000,
--   -121.89500000,
--   'San Jose',
--   '100 Recycling Way',
--   '408-555-0100'
-- ),
-- (
--   'CRV-002',
--   'Santa Clara Recycling Center',
--   '95050',
--   37.35400000,
--   -121.95500000,
--   'Santa Clara',
--   '200 Green Street',
--   '408-555-0110'
-- );

-- Reviews
INSERT INTO Reviews
(title, notes, num_stars, created_by, for_user)
VALUES
(
  'Great collector',
  'Alex was on time and very helpful.',
  5,
  1,
  2
),
(
  'Easy pickup',
  'The pickup process went smoothly.',
  4,
  3,
  2
);

-- Messages
INSERT INTO Messages
(message_id, has_driver, is_read, post_id, message_text)
VALUES
(1, TRUE, TRUE, 1, 'A driver has accepted your pickup.'),
(1, FALSE, FALSE, 2, 'Your post is still waiting for a driver.'),
(1, TRUE, TRUE, 3, 'Your recycling has been picked up.');
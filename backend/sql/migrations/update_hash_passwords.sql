USE scrapbucks_db;

UPDATE Users
SET password_hash = '$2b$10$UR9wfLsnwybgITnlLAzD.O5ORLUpv2N6wXQDnDuaPec8VtwOdIwha'
WHERE email = 'jessica@example.com';

UPDATE Users
SET password_hash = '$2b$10$xQjV9uusbyH0vtmHfN91Ae0cNGfO46.mw8v//R2SSswRNbNxzgpWW'
WHERE email = 'alex@example.com';

UPDATE Users
SET password_hash = '$2b$10$z0hGPCPLKM/sVlc3bSkIb.5vrYTeBn.xbN0ZEtmkC/MLC56gl5Wu.'
WHERE email = 'jordan@example.com';
BEGIN;
SET client_encoding = 'UTF8';

-- cars
TRUNCATE TABLE cars RESTART IDENTITY CASCADE;

INSERT INTO cars (id, brand, model, year, country, description, image, power, torque, acceleration, "topSpeed", "compatibilityRating")
SELECT * FROM (
  VALUES
    (1,'Nissan','Skyline R34',1999,'Japan',NULL,'🚗',NULL,NULL,NULL,NULL,0),
    (2,'Nissan','Silvia S14',1996,'Japan',NULL,'🚗',NULL,NULL,NULL,NULL,0),
    (3,'Nissan','Silvia S15',1999,'Japan',NULL,'🚗',NULL,NULL,NULL,NULL,0),
    (4,'Toyota','Supra A80',1998,'Japan',NULL,'🚗',NULL,NULL,NULL,NULL,0),
    (5,'Toyota','Supra MK4',1997,'Japan',NULL,'🚗',NULL,NULL,NULL,NULL,0),
    (6,'Mazda','RX-7 FD3S',1999,'Japan',NULL,'🚗',NULL,NULL,NULL,NULL,0),
    (7,'Mitsubishi','Lancer Evo',2006,'Japan',NULL,'🚗',NULL,NULL,NULL,NULL,0),
    (8,'Subaru','WRX STI',2004,'Japan',NULL,'🚗',NULL,NULL,NULL,NULL,0),

    (9,'BMW','M3 E46',2003,'Germany',NULL,'🚗',NULL,NULL,NULL,NULL,0),
    (10,'BMW','M4',2020,'Germany',NULL,'🚗',NULL,NULL,NULL,NULL,0),
    (11,'Ford','Mustang GT',2018,'USA',NULL,'🚗',NULL,NULL,NULL,NULL,0),
    (12,'Chevrolet','Camaro SS',2019,'USA',NULL,'🚗',NULL,NULL,NULL,NULL,0),

    (13,'Skoda','Octavia A5',2011,'Czech',NULL,'🚗',NULL,NULL,NULL,NULL,0),
    (14,'Skoda','Octavia A7',2018,'Czech',NULL,'🚗',NULL,NULL,NULL,NULL,0),
    (15,'Skoda','Rapid',2016,'Czech',NULL,'🚗',NULL,NULL,NULL,NULL,0),

    (16,'Volvo','S60',2017,'Sweden',NULL,'🚗',NULL,NULL,NULL,NULL,0),
    (17,'Volvo','XC60',2019,'Sweden',NULL,'🚗',NULL,NULL,NULL,NULL,0),

    (18,'Hyundai','Solaris',2019,'Russia',NULL,'🚗',NULL,NULL,NULL,NULL,0),
    (19,'Kia','Rio',2019,'Russia',NULL,'🚗',NULL,NULL,NULL,NULL,0),

    (20,'Alfa Romeo','Giulia',2019,'Europe',NULL,'🚗',NULL,NULL,NULL,NULL,0),
    (21,'Fiat','500',2018,'Europe',NULL,'🚗',NULL,NULL,NULL,NULL,0),
    (22,'Jaguar','F-Type',2017,'Europe',NULL,'🚗',NULL,NULL,NULL,NULL,0),
    (23,'Mini','Cooper S',2016,'Europe',NULL,'🚗',NULL,NULL,NULL,NULL,0),
    (24,'Peugeot','308',2018,'Europe',NULL,'🚗',NULL,NULL,NULL,NULL,0),
    (25,'Renault','Megane',2019,'Europe',NULL,'🚗',NULL,NULL,NULL,NULL,0),
    (26,'Seat','Ibiza',2017,'Europe',NULL,'🚗',NULL,NULL,NULL,NULL,0),
    (27,'Seat','Leon',2018,'Europe',NULL,'🚗',NULL,NULL,NULL,NULL,0)
) AS v(id,brand,model,year,country,description,image,power,torque,acceleration,"topSpeed","compatibilityRating")
WHERE NOT EXISTS (
  SELECT 1 FROM cars c WHERE c.brand = v.brand AND c.model = v.model
);

COMMIT;



# This file on the entirity has all the constraints that are imposed in the crud database(the main db)
# Except for tables and db used on microservices and mongo db tables

constraints = []

"""
The structure would be Tablename, followed by its contraints
"""

### Users - > rol

C = """

    DO $$ 
    BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_users_roles' and conrelid = 'users'::regclass
    ) THEN
    ALTER TABLE users
    ADD CONSTRAINT fk_users_roles FOREIGN KEY (role_id) REFERENCES roles(role_id);
    END IF;
    END 
    $$
"""
constraints.append(C)


### user vehicles

C = """

    DO $$ 
    BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_user_vehicles_users' and conrelid = 'user_vehicles'::regclass
    ) THEN
    ALTER TABLE user_vehicles
    ADD CONSTRAINT fk_user_vehicles_users FOREIGN KEY (user_id) REFERENCES users(user_id);
    END IF;
    END 
    $$
"""
constraints.append(C)


### vehicle service

C = """

    DO $$ 
    BEGIN
    IF NOT EXISTS ( 
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_vehicle_services_services' and conrelid = 'vehicle_services'::regclass 
    ) THEN 
    ALTER TABLE vehicle_services
    ADD CONSTRAINT fk_vehicle_services_services FOREIGN KEY (service_id) REFERENCES services(service_id);
    END IF;
    END
    $$
"""

constraints.append(C)

C = """
    DO $$ 
    BEGIN
    IF NOT EXISTS ( 
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_vehicle_services_vehicles' and conrelid = 'vehicle_services'::regclass 
    ) THEN 
    ALTER TABLE vehicle_services
    ADD CONSTRAINT fk_vehicle_services_vehicles FOREIGN KEY (service_id) REFERENCES vehicles(vehicle_id);
    END IF;
    END
    $$
"""

constraints.append(C)


### bookings and booked services
C = """
    DO $$ 
    BEGIN
    IF NOT EXISTS ( 
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_bookings_users' and conrelid = 'bookings'::regclass 
    ) THEN 
    ALTER TABLE bookings
    ADD CONSTRAINT fk_bookings_users FOREIGN KEY (user_id) REFERENCES users(user_id);
    END IF;

    IF NOT EXISTS ( 
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_bookings_user_vehicles' and conrelid = 'bookings'::regclass 
    ) THEN 
    ALTER TABLE bookings
    ADD CONSTRAINT fk_bookings_user_vehicles FOREIGN KEY (user_vehicle_id) REFERENCES user_vehicles(user_vehicle_id);
    END IF;

    END
    $$
"""
constraints.append(C)


### Booked service


C = """
    DO $$ 
    BEGIN

    IF NOT EXISTS ( 
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_booked_services_bookings' and conrelid = 'booked_services'::regclass 
    ) THEN 
    ALTER TABLE booked_services
    ADD CONSTRAINT fk_booked_services_bookings FOREIGN KEY (booking_id) REFERENCES bookings(booking_id);
    END IF;

    IF NOT EXISTS ( 
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_booked_services_vehicle_services' and conrelid = 'booked_services'::regclass 
    ) THEN 
    ALTER TABLE booked_services
    ADD CONSTRAINT fk_booked_services_vehicle_services FOREIGN KEY (vehicle_service_id) REFERENCES vehicle_services(vehicle_service_id);
    END IF;

    END
    $$
"""

constraints.append(C)

### booked repairs

C = """
    DO $$ 
    BEGIN
    IF NOT EXISTS ( 
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_booked_repairs_bookings' and conrelid = 'booked_repairs'::regclass 
    ) THEN 
    ALTER TABLE booked_repairs
    ADD CONSTRAINT fk_booked_repairs_bookings FOREIGN KEY (booking_id) REFERENCES bookings(booking_id);
    END IF;
    END
    $$
"""

constraints.append(C)


###  Payment 

C = """
    DO $$ 
    BEGIN

    IF NOT EXISTS ( 
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_payments_bookings' and conrelid = 'payments'::regclass 
    ) THEN 
    ALTER TABLE payments
    ADD CONSTRAINT fk_payments_bookings FOREIGN KEY (booking_id) REFERENCES bookings(booking_id);
    END IF;

    IF NOT EXISTS ( 
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_payments_users' and conrelid = 'payments'::regclass 
    ) THEN 
    ALTER TABLE payments
    ADD CONSTRAINT fk_payments_users FOREIGN KEY (user_id) REFERENCES users(user_id);
    END IF;

    END
    $$

"""

constraints.append(C)


### Package service

C = """
    DO $$ 
    BEGIN

    IF NOT EXISTS ( 
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_package_services_packages' and conrelid = 'package_services'::regclass 
    ) THEN 
    ALTER TABLE package_services
    ADD CONSTRAINT fk_package_services_packages FOREIGN KEY (package_id) REFERENCES packages(package_id);
    END IF;

    IF NOT EXISTS ( 
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_package_services_vehicle_services' and conrelid = 'package_services'::regclass 
    ) THEN 
    ALTER TABLE package_services
    ADD CONSTRAINT fk_package_services_vehicle_services FOREIGN KEY (vehicle_service_id) REFERENCES vehicle_services(vehicle_service_id);
    END IF;

    END
    $$

"""



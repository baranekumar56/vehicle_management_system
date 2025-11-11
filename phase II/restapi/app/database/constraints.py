

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
        WHERE conname = 'fk_users_role' and conrelid = 'users'::regclass
    ) THEN
    ALTER TABLE users
    ADD CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES role(role_id) ON DELETE SET NULL;
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
        WHERE conname = 'fk_user_vehicle_users' and conrelid = 'user_vehicle'::regclass
    ) THEN
    ALTER TABLE user_vehicle
    ADD CONSTRAINT fk_user_vehicle_users FOREIGN KEY (user_id) REFERENCES users(user_id)  ON DELETE SET NULL;
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
        WHERE conname = 'fk_vehicle_service_service' and conrelid = 'vehicle_service'::regclass 
    ) THEN 
    ALTER TABLE vehicle_service
    ADD CONSTRAINT fk_vehicle_service_service FOREIGN KEY (service_id) REFERENCES service(service_id)  ON DELETE SET NULL;
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
        WHERE conname = 'fk_vehicle_service_vehicle' and conrelid = 'vehicle_service'::regclass 
    ) THEN 
    ALTER TABLE vehicle_service
    ADD CONSTRAINT fk_vehicle_service_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicle(vehicle_id)  ON DELETE SET NULL;
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
        WHERE conname = 'fk_booking_users' and conrelid = 'booking'::regclass 
    ) THEN 
    ALTER TABLE booking
    ADD CONSTRAINT fk_booking_users FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL ;
    END IF;

    IF NOT EXISTS ( 
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_booking_user_vehicle' and conrelid = 'booking'::regclass 
    ) THEN 
    ALTER TABLE booking
    ADD CONSTRAINT fk_booking_user_vehicle FOREIGN KEY (user_vehicle_id) REFERENCES user_vehicle(user_vehicle_id) ON DELETE SET NULL ;
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
        WHERE conname = 'fk_booked_service_booking' and conrelid = 'booked_service'::regclass 
    ) THEN 
    ALTER TABLE booked_service
    ADD CONSTRAINT fk_booked_service_booking FOREIGN KEY (booking_id) REFERENCES booking(booking_id)  ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS ( 
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_booked_service_vehicle_service' and conrelid = 'booked_service'::regclass 
    ) THEN 
    ALTER TABLE booked_service
    ADD CONSTRAINT fk_booked_service_vehicle_service FOREIGN KEY (vehicle_service_id) REFERENCES vehicle_service(vehicle_service_id)  ON DELETE SET NULL ;
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
        WHERE conname = 'fk_booked_repair_booking' and conrelid = 'booked_repair'::regclass 
    ) THEN 
    ALTER TABLE booked_repair
    ADD CONSTRAINT fk_booked_repair_booking FOREIGN KEY (booking_id) REFERENCES booking(booking_id)  ON DELETE SET NULL;
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
        WHERE conname = 'fk_payment_booking' and conrelid = 'payment'::regclass 
    ) THEN 
    ALTER TABLE payment
    ADD CONSTRAINT fk_payment_booking FOREIGN KEY (booking_id) REFERENCES booking(booking_id)  ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS ( 
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_payment_users' and conrelid = 'payment'::regclass 
    ) THEN 
    ALTER TABLE payment
    ADD CONSTRAINT fk_payment_users FOREIGN KEY (user_id) REFERENCES users(user_id)  ON DELETE SET NULL;
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
        WHERE conname = 'fk_package_service_package' and conrelid = 'package_service'::regclass 
    ) THEN 
    ALTER TABLE package_service
    ADD CONSTRAINT fk_package_service_package FOREIGN KEY (package_id) REFERENCES package(package_id)  ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS ( 
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_package_service_vehicle_service' and conrelid = 'package_service'::regclass 
    ) THEN 
    ALTER TABLE package_service
    ADD CONSTRAINT fk_package_service_vehicle_service FOREIGN KEY (vehicle_service_id) REFERENCES vehicle_service(vehicle_service_id)  ON DELETE SET NULL;
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
        WHERE conname = 'fk_package_vehicle' and conrelid = 'package'::regclass 
    ) THEN 
    ALTER TABLE package
    ADD CONSTRAINT fk_package_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicle(vehicle_id)  ON DELETE SET NULL;
    END IF;
    END
    $$

"""

### Bill


C = """
    DO $$ 
    BEGIN

    IF NOT EXISTS ( 
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_bill_booking' and conrelid = 'bill'::regclass 
    ) THEN 
    ALTER TABLE bill
    ADD CONSTRAINT fk_bill_booking FOREIGN KEY (booking_id) REFERENCES booking(booking_id)  ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS ( 
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_bill_users' and conrelid = 'bill'::regclass 
    ) THEN 
    ALTER TABLE bill
    ADD CONSTRAINT fk_bill_users FOREIGN KEY (forwarded_mechanic_id) REFERENCES users(user_id)  ON DELETE SET NULL;
    END IF;

    END
    $$
"""

service_reminder_constrainsts = """

    DO $$
    BEGIN

    IF NOT EXISTS ( 
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_service_reminder_users' and conrelid = 'service_reminder'::regclass 
    ) THEN 
    ALTER TABLE service_reminder
    ADD CONSTRAINT fk_service_reminder_users FOREIGN KEY (user_id) REFERENCES users(user_id)  ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS ( 
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_service_reminder_user_vehicle' and conrelid = 'service_reminder'::regclass 
    ) THEN 
    ALTER TABLE service_reminder
    ADD CONSTRAINT fk_service_reminder_user_vehicle FOREIGN KEY (user_vehicle_id) REFERENCES user_vehicle(user_vehicle_id)  ON DELETE SET NULL;
    END IF;

    END
    $$;


"""
constraints.append(service_reminder_constrainsts)
mechanic = """
    DO $$ 
    BEGIN
    IF NOT EXISTS ( 
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_mechanic_users' and conrelid = 'mechanic'::regclass 
    ) THEN 
    ALTER TABLE mechanic
    ADD CONSTRAINT fk_mechanic_users FOREIGN KEY (mechanic_id) REFERENCES users(user_id)  ON DELETE SET NULL;
    END IF;
    END
    $$    

"""
constraints.append(mechanic)
constraints.append(C)


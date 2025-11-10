



# This file has all the custom types that we will be using in our project

enums = []
composites = []


# Composite types


address_type = """
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'address_type'
    ) THEN
        CREATE TYPE address_type AS (
            street varchar(50),
            area varchar(50),
            district varchar(30),
            state varchar(30),
            country varchar(30),
            pincode varchar(6)
        );
    END IF;
END
$$;


"""

composites.append(address_type)

# enums

booking_status = """
    DO $$
    BEGIN 
        IF NOT EXISTS(
            SELECT 1 FROM pg_type where typname = 'booking_status'
        ) THEN
            CREATE TYPE booking_status as ENUM (
            'booked','billing','billing_confirmation', 'pending', 'halted','ongoing','completed','canceled','rejected'
            );
        END IF;
    END
    $$;
"""

vehicle_type = """
    DO $$
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM pg_type where typname = 'vehicle_type'
        ) THEN 
            CREATE TYPE vehicle_type as ENUM (
            'two_wheeler', 'four_wheeler'
            );
        END IF;
    END
    $$;
"""

fuel_type = """
    DO $$
    BEGIN 
        IF NOT EXISTS (
            SELECT 1 FROM pg_type where typname = 'fuel_type'
        ) THEN 
            CREATE TYPE fuel_type as ENUM (
            'petrol', 'diesel', 'cng', 'hybrid','electric'
            );
        END IF;
    END
    $$;
"""

payment_type = """

    DO $$
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM pg_type where typname = 'payment_type'
        ) THEN
            CREATE TYPE payment_type as ENUM (
                'payment', 'refund'
            );
        END IF;
    END
    $$;

"""

service_type = """

    DO $$
    BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM pg_type where typname = 'service_type'
    ) THEN CREATE TYPE service_type as ENUM (
        'service', 'repair'
    );
    END IF;
    END
    $$

"""

payment_status = """

    DO $$
    BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM pg_type where typname = 'payment_type'
    ) THEN CREATE TYPE payment_type as ENUM (
        'payed', 'pending'
    );
    END IF;
    END
    $$


"""


enums.extend([vehicle_type, fuel_type, booking_status, payment_status, payment_type, service_type])

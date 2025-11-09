

package_batch_state_change = """
    CREATE OR REPLACE PROCEDURE package_batch_state_change (ids int[], new_state boolean)
    LANGUAGE plpgsql
    AS $$
    BEGIN
        UPDATE package
        SET active = new_state
        WHERE package_id = ANY(ids);
    END;
    $$;
"""

service_batch_state_change = """

    CREATE OR REPLACE PROCEDURE service_batch_state_change (ids int[], new_state boolean)
    LANGUAGE plpgsql
    AS $$
    BEGIN
        UPDATE service
        SET active = new_state
        WHERE service_id = ANY(ids);
    END;
    $$;
"""

vehicle_batch_state_change = """

    CREATE OR REPLACE PROCEDURE vehicle_batch_state_change (ids int[], new_state boolean)
    LANGUAGE plpgsql
    AS $$
    BEGIN
        UPDATE vehicle
        SET active = new_state
        WHERE vehicle_id = ANY(ids);
    END;
    $$;

"""

vehicle_service_batch_state_change = """

    CREATE OR REPLACE PROCEDURE vehicle_service_batch_state_change (ids int[], new_state boolean)
    LANGUAGE plpgsql
    AS $$
    BEGIN
        UPDATE vehicle_service
        SET active = new_state
        WHERE vehicle_service_id = ANY(ids);
    END;
    $$;

"""

vehicle_service_log_in_booked_service = """

    CREATE OR REPLACE FUNCTION vehicle_service_log_in_booked_service (ids int[], booking_id_ int) RETURNS TABLE (total_price numeric, total_time int)
    LANGUAGE plpgsql
    AS $$
    DECLARE
        rec RECORD;
    BEGIN

        total_price := 0;
        total_time := 0;

        FOR rec IN  
            SELECt 
                vehicle_service_id, price, time_to_complete 
            FROM 
                vehicle_service
            WHERE
                vehicle_service_id = ANY(ids)
        LOOP
            INSERT INTO
            booked_service (booking_id, vehicle_service_id, price, time_to_complete, status, cancelled_by_admin, created_at)
            VALUES(booking_id_, rec.vehicle_service_id, rec.price, rec.time_to_complete, false, false, now());

            total_time := total_time + rec.time_to_complete;
            total_price := total_price + rec.price;

        END LOOP;
        RETURN QUERY SELECT total_price, total_time;


    END;
    $$;
"""

db_availability_cache_updater = """

    CREATE OR REPLACE FUNCTION array_diff(anyarray, anyarray)
    RETURNS anyarray AS $$

        SELECT COALESCE(array_agg(elem), '{}')
        FROM unnest($1) elem 
        WHERE elem <> ALL ($2)
    
    $$ LANGUAGE sql IMMUTABLE;


    CREATE OR REPLACE FUNCTION cache_updater(booking_date DATE, required_hours int[])
    RETURNS integer LANGUAGE plpgsql AS $$
    DECLARE 
        rec RECORD;
        updated_rows integer;
    BEGIN

        FOR rec in SELECT * from availability_cache where booking_date = day AND active = true LOOP

            IF rec.available_hours @> required_hours THEN
                
                UPDATE 
                    availability_cache 
                SET 
                    available_hours = array_diff(rec.available_hours, required_hours), version = version + 1
                WHERE 
                    id = rec.id AND version = rec.version;
                
                GET DIAGNOSTICS updated_rows = ROW_COUNT;

                IF updated_rows != 0 THEN RETURN rec.shed_id;
                END IF;
            END IF;
        END LOOP;

        RETURN 0;
    END;
    $$;
"""


### the below thing is for service data change , like the price and time to complete
### i need to update the packages meta data table, at the same time
### if the package service gets removed from a package then too i have to update that


service_updation_triggers = """

CREATE OR REPLACE FUNCTION service_price_time_update_on_package() 
RETURNS TRIGGER AS $$
BEGIN  
    -- When vehicle_service table gets updated, update package table metadata accordingly

    UPDATE package
    SET
        total_price = total_price - OLD.price + NEW.price, 
        total_time = total_time - OLD.time_to_complete + NEW.time_to_complete
    WHERE
        package_id IN (
            SELECT ps.package_id 
            FROM package_service ps 
            WHERE ps.vehicle_service_id = NEW.vehicle_service_id
        );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER vehicle_service_price_time_change
AFTER UPDATE OF price, time_to_complete ON vehicle_service
FOR EACH ROW 
EXECUTE FUNCTION service_price_time_update_on_package();


-- When a service is added to a package, update the package metadata (time, price, count)

CREATE OR REPLACE FUNCTION package_meta_data_add_updater_for_time_price()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE package
    SET 
        total_time = total_time + vs.time_to_complete, 
        total_price = total_price + vs.price, 
        total_services = total_services + 1
    FROM vehicle_service AS vs
    WHERE 
        NEW.vehicle_service_id = vs.vehicle_service_id 
        AND NEW.package_id = package.package_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER package_time_price_add_trigger
AFTER INSERT ON package_service
FOR EACH ROW
EXECUTE FUNCTION package_meta_data_add_updater_for_time_price();


-- When a service is removed from a package, update the package metadata accordingly

CREATE OR REPLACE FUNCTION package_meta_data_remove_updater_for_time_price()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE package
    SET 
        total_time = total_time - vs.time_to_complete, 
        total_price = total_price - vs.price, 
        total_services = total_services - 1
    FROM vehicle_service AS vs
    WHERE 
        OLD.vehicle_service_id = vs.vehicle_service_id 
        AND OLD.package_id = package.package_id;
        
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER package_time_price_remove_trigger
AFTER DELETE ON package_service
FOR EACH ROW
EXECUTE FUNCTION package_meta_data_remove_updater_for_time_price();

"""



procedures = [package_batch_state_change, service_batch_state_change, vehicle_batch_state_change, vehicle_service_batch_state_change, vehicle_service_log_in_booked_service, db_availability_cache_updater, service_updation_triggers ]
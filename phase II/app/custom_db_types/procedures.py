

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


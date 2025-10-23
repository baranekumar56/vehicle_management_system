

def insert_to_db(table_name, insert_data):

    # stmt = insert(user_table).values(name="Alice", email="alice@example.com")
    
    insert(table_name).values(**insert_data.    ())


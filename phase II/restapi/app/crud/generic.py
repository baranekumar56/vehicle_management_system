
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update , cast, String
from sqlalchemy import and_, or_, insert, delete, update
from functools import wraps
from datetime import datetime, timedelta
from pydantic import BaseModel

def ErrorHandler(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):

        try :
            res = await func(*args, **kwargs)
            return res
        except Exception as e:
            raise e
    return wrapper


@ErrorHandler
async def check_if_id_exists(id: int, table_class, db:AsyncSession):
    """
    This function returns the object or none, be carefull dont expect true or false
    """
    id_name = f"{table_class.__tablename__}_id"

    id_column = getattr(table_class, id_name)

    res = await  db.execute(select(table_class).where(id_column == id))
    res = res.scalar_one_or_none()
    return res


@ErrorHandler
async def check_if_entry_exists(table_class, db:AsyncSession, **kwargs):

    """
This function return true or false, based on the based keyword args set in the where clause,
if it finds an entry in the table, then returns that obj else returns none
"""

    # expands the kwargs and get the attr one by one from table obj

    query = select(table_class)

    for key, val in kwargs.items():
        # get the attr from table class
        attr = getattr(table_class, key)
        query = query.where(attr == val)


    # after setting up all where conditions, we then execute it
    res = await db.execute(query)
    entry = res.scalar_one_or_none()

    if entry is None:
        return None
    return entry

 

@ErrorHandler
async def add_entry(model_class, schema_object, db:AsyncSession, **kwargs):
    # the order would be like, model class, schmea object, db
    """
        Gets the model class then dumps the schema obj to model class, then if kwargs are available then it will be ran through a loop and will in added
        this function returns the object inserted into the db
        Keep in mind , while using this we need to manuallly commit to db
        thhis function wont commit on its own
     """

    # from the schema object extract its attributes then 
    # create an object of model_class then one by one , migrate the data from schema to model

    to_be_added = model_class(**schema_object.model_dump())

    # keyword arguments passed to the function

    for key, val in kwargs.items():
        setattr(to_be_added, key, val)


    db.add(to_be_added)
    await db.flush()
    await db.refresh(to_be_added)
    return to_be_added


@ErrorHandler
async def insert_multiple_entries(model_class, schema_objects, db:AsyncSession, **kwargs):


    """
    This function adds multiple schema objects provided in the `schema_objects` variable 
    using values(), and not by using db.add, so this function wont return any updated records 
    """

    to_be_added = []

    for object in schema_objects:
        to_be_added.append(object.model_dump())
    

    query = insert(model_class).values(to_be_added)

    inserted_rows = await db.execute(query)

    return inserted_rows.rowcount

@ErrorHandler
async def update_entry_by_id(table_class, id:int, db:AsyncSession, **kwargs) -> int:

    """
    This function updates with the help of its primary key, 
    we can pass fields need to be updated as keyword arguments .
    As normal sql updates, it returns the number of rows which got updated
    Manual commit is required 
    """

    id_name = f"{table_class.__tablename__}_id"

    id_column = getattr(table_class, id_name)   

    values_to_update = {}

    for key, val in kwargs.items():
        attribute = getattr(table_class, key)
        # print(attribute)
        values_to_update[attribute] = val


    query = update(table_class).where(id_column == id).values(values_to_update)
    
    res = await db.execute(query)

    return res.rowcount
    
@ErrorHandler
async def update_entry(table_class, update_conditions:dict, db:AsyncSession, **kwargs):

    """
    Unline update entry by id, this function can get updating conditions as a dict
    then specifies them in the where condition, returns the no of rows affected
    """

    conditions = []

    for key, val in update_conditions.items():
        attr = getattr(table_class, key)
        conditions.append(attr == val)

    values_to_update = {}

    for key, val in kwargs.items():
        attribute = getattr(table_class, key)
        # print(attribute)
        values_to_update[attribute] = val

    
    
    query = update(table_class).where(and_(*conditions)).values(values_to_update)

    res = await db.execute(query)

    return res.rowcount


@ErrorHandler
async def commit_changes(db:AsyncSession) :
    await db.commit()



@ErrorHandler
async def get_entries(table_class, 
                      db: AsyncSession, 
                      search_string: str = "",
                      join_tables : list[BaseModel] | None = None,
                      join_columns : list[str] | None = None,
                      omit_columns : list[str] = [],
                      limit: int = 100, 
                      offset: int = 0,
                      **filters):
    # filters tell the conditions

    """
    This function filters the table class Table, user need to pass the limit and offset attribute , if not default limit = 100, offset = 0.
    wehn you use this function , pass all you filters that you want to this as a dict of string to value.
    Example:
        For equality check, 
            columnname : value => age : 20
        For logical check, (current supported greater than , greater than or equal to, less than, less than or equal to, equality should be like above
                            column name and condition should be separated by -)
                
            columnname-gt : value => age-gt:20

            Logical operator maps:
            gt => greater than
            ge => greater than or equal to
            lt => less than
            le => less than or equal to

    NOTE for datetime objects key should be like this , dt-columnname-op : val

    When an unsupported value is given for a filter value , user need to manually catch those exceptions and signify them signify them
    """


    # filters now have columnname-op : value pairs, or columnname: value pairs
    # take one by one , then map with the associated filter column then may the operator either ==, <, > , <= , >=


    # the values should be their original values according to 

    query = select(table_class)

    # here we carry out joins for the given column


    

    search_columns = []

    ### building condition base for search string
    # for this we cast all the rows to text

    # now for search string related search 
    if search_string != "":

        for column in table_class.__table__.columns:

            if column.name in omit_columns:
                continue

            attr = getattr(table_class, column.name)

            search_columns.append(cast(attr, String).ilike("%{}%".format(search_string)))

    # now add all the filter params 

    filter_columns = []

    for key, val in filters.items():
        tokens = key.split
        
        
        try:
            if tokens[0] == "dt":
                # datetime filters, tokens e.g., ['dt', 'created_at', 'le']
                if len(tokens) < 2:
                    # Invalid key format
                    continue
                attr = getattr(table_class, tokens[1])
                current_day = datetime.fromisoformat(val)
                next_day = current_day + timedelta(days=1)

                if len(tokens) == 2:
                    # dt-columnname (range for that day)
                    filter_columns.append(attr >= current_day)
                    filter_columns.append(attr < next_day)
                else:
                    op = tokens[2]
                    if op == 'ge':
                        filter_columns.append(attr >= current_day)
                    elif op == 'gt':
                        filter_columns.append(attr > current_day)
                    elif op == 'le':
                        filter_columns.append(attr <= current_day)
                    elif op == 'lt':
                        filter_columns.append(attr < current_day)
                    else:
                        # unsupported operator
                        continue

            else:
                # Non-datetime filters
                if len(tokens) == 1:
                    # equality check
                    attr = getattr(table_class, tokens[0])
                    filter_columns.append(attr == val)
                else:
                    attr = getattr(table_class, tokens[0])
                    op = tokens[1]
                    if op == 'ge':
                        filter_columns.append(attr >= val)
                    elif op == 'gt':
                        filter_columns.append(attr > val)
                    elif op == 'le':
                        filter_columns.append(attr <= val)
                    elif op == 'lt':
                        filter_columns.append(attr < val)
                    else:
                        # unsupported operator
                        continue

        except Exception as e:
            # Optionally: log or raise a custom error for unsupported filters/values here
            raise ValueError(f"Invalid filter {key} with value {val}: {str(e)}")
        
    where_clauses = []
    if search_columns:
        where_clauses.append(or_(*search_columns))
    if filter_columns:
        where_clauses.append(and_(*filter_columns))

    if where_clauses:
        query = query.where(and_(*where_clauses))

    query = query.limit(limit).offset(offset)

    result = await db.execute(query)
    return result.scalars().all()

            
                

@ErrorHandler
async def delete_multiple_entries_using_id(model_class, ids: list[int], db:AsyncSession, **kwargs):

    primary_attr = f"{model_class.__tablename__}_id"
    primary_attr = getattr(model_class, primary_attr)

    query = delete(model_class).where(primary_attr.in_(ids))

    deleted_rows = await db.execute(query)

    return deleted_rows.rowcount






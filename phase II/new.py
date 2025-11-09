

# class a():
#     __tablename__ = "hai"
#     barane = 10
#     def __init__(self, **kwargs):
        
#         for key, val in kwargs.items():
#             setattr(self, key, val)
#         print(self)

#     def print(self):
#         for key, val in self.__dict__.items():
#             print(key, val)


# def func(**kwargs):

#     # print(kwargs)

#     # for key, val in kwargs.items():
#         # print(type(key), val)
#     return kwargs


# func(a=10, b=20)
# t = a(**func(a=10, b=20))
# t.print()
# print(getattr(a, 'barane'))


# from datetime import datetime, timedelta

# # Create a datetime object
# current_datetime = datetime.now()
# print(f"Original datetime: {current_datetime}")

# # Add days
# future_datetime_days = current_datetime + timedelta(days=5)
# print(f"After adding 5 days: {future_datetime_days}")

# # Add hours
# future_datetime_hours = current_datetime + timedelta(hours=3)
# print(f"After adding 3 hours: {future_datetime_hours}")

# # Add minutes and seconds
# future_datetime_minutes_seconds = current_datetime + timedelta(minutes=30, seconds=15)
# print(f"After adding 30 minutes and 15 seconds: {future_datetime_minutes_seconds}")

# # Combine multiple time units
# future_datetime_combined = current_datetime + timedelta(weeks=1, days=2, hours=4, minutes=10)
# print(f"After adding 1 week, 2 days, 4 hours, and 10 minutes: {future_datetime_combined}")



# class a:
#     authorized = False
#     def __init__(self, current_role=None):
#         print("called base")


# class b(a):
#     required_role = "b"
#     def __init__(self, current_role, *args, **kwargs):
#         super().__init__(current_role, *args, **kwargs)
#         if current_role == self.required_role:
#             self.authorized = True

# class c(a):
#     required_role = "c"
#     def __init__(self, current_role, *args, **kwargs):
#         print("from c : {}, requied_role: {}".format(current_role, self.required_role))
#         super().__init__(current_role, *args, **kwargs)
#         if current_role == self.required_role:
#             self.authorized = True


# class d(b, c):

#     def __init__(self, current_role):
#         super().__init__(current_role=current_role)

#         if self.authorized:
#             print("user permitted")
#         else :
#             print("not permitted")


# D = d('c')


from pprint import pprint

class Authenticator:

    required_roles = []

    def __init__(self, role):
        self.required_roles.append(role)

    
class RequiredCustomerPrevilage(Authenticator):
    __role = "customer"
    def __init__(self):
        super().__init__(self.__role)

    def __call__(self, request):
        

        # resolve the request object here 
        # check if the passed role is in required roles

        role = request.header.payload.role # for name sake

        if role in self.required_roles :
            return "AUTHORIZED"
        else :
            raise Exception("Illegal entry")
        


pairs = [
    (9, 14),
    (12, 17),
    (10, 18),
    (15, 9),
    (13, 16),
    (11, 18),
    (14, 12),
    (9, 17),
    (16, 10),
    (18, 13),
    (10, 15),
    (17, 11),
    (12, 9),
    (15, 18),
    (13, 10),
    (9, 16),
    (18, 12),
    (14, 17),
    (11, 13),
    (16, 18),
    (17, 9),
    (10, 11),
    (13, 14),
    (15, 12),
    (9, 18)
]

sorted_pairs = []
for index, pair in enumerate(pairs):

    sorted_pairs.append(sorted(pair))
        
sorted_pairs.sort()
pprint(sorted_pairs)


from collections import deque

available_mechaincs = []
for i in range (0, 6):
    


class a():
    __tablename__ = "hai"
    barane = 10
    def __init__(self, **kwargs):
        
        for key, val in kwargs.items():
            setattr(self, key, val)
        print(self)

    def print(self):
        for key, val in self.__dict__.items():
            print(key, val)


def func(**kwargs):

    # print(kwargs)

    # for key, val in kwargs.items():
        # print(type(key), val)
    return kwargs


func(a=10, b=20)
t = a(**func(a=10, b=20))
t.print()
print(getattr(a, 'barane'))
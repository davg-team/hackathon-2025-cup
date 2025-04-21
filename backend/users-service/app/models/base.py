import uuid6


class Base:
    @classmethod
    def generate_uuid(cls) -> str:
        return str(uuid6.uuid7())

    def __init__(self, **kwargs):
        for key, value in kwargs.items():
            setattr(self, key, value)

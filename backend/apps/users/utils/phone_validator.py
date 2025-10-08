from django.core.validators import RegexValidator

PHONE_VALIDATOR = RegexValidator(r"^(\+998)(\d{9})$", "Номер телефона неверно! Попробуйте так +998112223344")

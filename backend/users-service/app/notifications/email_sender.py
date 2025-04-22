import smtplib
from email.mime.image import MIMEImage
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from jinja2 import Environment, FileSystemLoader

try:
    from .conf import SMTP_PASSWORD, SMTP_PORT, SMTP_SERVER, SMTP_USERNAME
except:
    pass

# Настройка Jinja2
env = Environment(loader=FileSystemLoader("app/notifications/templates"))


def send_email(
    to_email, subject, template_name, context, logo_path="app/notifications/Collage.png"
):
    # Загрузка шаблона
    context["subject"] = subject
    template = env.get_template(template_name)
    html_content = template.render(context)

    # Создание сообщения
    msg = MIMEMultipart("related")
    msg["From"] = 'АИС "ФСП" <fsp@fsp-platform.ru>'
    msg["To"] = to_email
    msg["Subject"] = subject

    # HTML часть
    msg.attach(MIMEText(html_content, "html"))

    # Добавление логотипа
    with open(logo_path, "rb") as logo_file:
        logo = MIMEImage(logo_file.read())
        logo.add_header("Content-ID", "<logo>")
        msg.attach(logo)

    # Отправка письма
    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        server.sendmail(SMTP_USERNAME, to_email, msg.as_string())
        print(f"Письмо отправлено на {to_email}")


# # Пример использования
# context = {
#     "user_name": "Пользователь",
#     "message": "Тестовое уведомление",
#     "new_role": "Администратор",
#     "admin_link": "https://fsp-platform.ru/admin/roles",
# }

# send_email(
#     to_email="kolyadin.2007@yandex.ru",
#     subject='Добро пожаловать в АИС "ФСП"',
#     template_name="registration_email.html",
#     context=context,
# )

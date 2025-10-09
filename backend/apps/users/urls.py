from django.urls import path

# from users.views.check_in import CheckInView
# from users.views.sign_in import SignInView
from users.views.info_user import InfoUserView


urlpatterns = [
    path('info_user', InfoUserView.as_view(), name='info_user.py'),
]

from django.urls import path

# from users.views.check_in import CheckInView
# from users.views.sign_in import SignInView
from users.views.info_user import InfoUserView
from users.views.sign_up import SignUpView

urlpatterns = [
    path('info_user', InfoUserView.as_view(), name='info_user.py'),
    path('sign-up', SignUpView.as_view(), name='signup'),
]

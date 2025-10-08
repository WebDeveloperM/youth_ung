from django.urls import path

from users.views.check_in import CheckInView
from users.views.sign_in import SignInView

urlpatterns = [
    path('sign-in', SignInView.as_view(), name='signin'),
    path('check-in', CheckInView.as_view(), name='checkin'),
]

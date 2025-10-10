from django.urls import reverse
from core.tests.base_test import BaseTestCase


class CheckInTest(BaseTestCase):
    fixtures = ('users_and_tokens.yaml', 'chats.yaml')

    def test_signin_success(self):
        response = self.client.post(reverse('users:checkin'), {'phone': '+998943220998', 'code': '123456'})
        self.assertEqual(200, response.status_code, response.data)
        self.assertIn('token', response.data, response.data)
        self.assertIn('user', response.data, response.data)
        self.assertEqual('Amigo', response.data['user']['phone'], response.data)

    def test_signin_fail(self):
        response = self.client.post(reverse('users:checkin'), {})
        self.assertEqual(400, response.status_code, response.data)

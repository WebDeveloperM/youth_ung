from django.urls import reverse
from core.tests.base_test import BaseTestCase


class SignInTest(BaseTestCase):
    fixtures = ('users_and_tokens.yaml',)

    def test_signin_success(self):
        response = self.client.post(reverse('users:signin'), {'phone': '+998943220998'})
        self.assertEqual(200, response.status_code, response.data)
        self.assertIn('phone', response.data, response.data)
        self.assertIn('message', response.data, response.data)
        self.assertEqual('Bakha_aka', response.data['phone'], response.data)

    def test_signin_fail(self):
        response = self.client.post(reverse('users:signin'), {})
        self.assertEqual(400, response.status_code, response.data)

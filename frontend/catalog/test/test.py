import datetime as dt
from http import HTTPStatus

from django.test import Client, override_settings, TestCase
from django.utils import timezone

from catalog.models import AcmeWebhookMessage


class AcmeWebhookTests(TestCase):
    def setUp(self):
        self.client = Client(enforce_csrf_checks=True)

    def test_success(self):
        start = timezone.now()
        old_message = AcmeWebhookMessage.objects.create(
            received_at=start - dt.timedelta(days=100),
        )

        response = self.client.post(
            "/catalog/api/webhooks/acme/mPnBRC1qxapOAxQpWmjy4NofbgxCmXSj/",
            content_type="application/json",
            data={"this": "is a message"},
        )

        assert response.status_code == HTTPStatus.OK
        assert response.content.decode() == "Message received okay."
        assert not AcmeWebhookMessage.objects.filter(
            id=old_message.id).exists()
        awm = AcmeWebhookMessage.objects.get()
        assert awm.received_at >= start
        assert awm.payload == {"this": "is a message"}

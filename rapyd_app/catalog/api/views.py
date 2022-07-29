from requests import request
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from catalog.models import Item, Order, OrderItem, Address, Payment, Coupon, AcmeWebhookMessage, BankAccount
from .serializers import *
from catalog.api.rapydService import RapydService
from uuid import uuid4
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, CreateAPIView
import json
from django.contrib.auth.models import User
import datetime as dt
from locale import currency
from django.shortcuts import get_object_or_404, redirect
from django.utils import timezone
from django.core.exceptions import ObjectDoesNotExist
from django.core.mail import EmailMultiAlternatives, send_mail
from django.template.loader import render_to_string
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import HttpResponse, HttpResponseForbidden
from django.db.transaction import atomic, non_atomic_requests
from django.conf import settings
from django.db.models import Q
from rest_framework.decorators import api_view


class PaymentView(CreateAPIView):
    rapyd_service = RapydService()
    permission_classes = (IsAuthenticated,)

    def post(self, *args, **kwargs):
        order = Order.objects.get(
            user=self.request.user, ordered=False)

        payment = Payment.objects.create(user=self.request.user, status='CRE', amount=self.request.data.get(
            'amount'), amount_currency=self.request.data.get('currency'))
        payment.save()
        country = self.request.data.get('country')
        currency = self.request.data.get('currency')
        bank_account = BankAccount.objects.filter(Q(country=country) & Q(
            balance_currency=currency)).first()
        data = None
        if bank_account is None:
            bank_account, data = self.rapyd_service.issue_iban(
                country, currency)
            bank_account.save()

        result = bank_account.__dict__
        del result['balance'], result['_state']
        result = json.dumps(result)

        order.payment = payment
        order.save()
        return Response({"data": result})


class CheckoutView(APIView):

    def get(self,  *args, **kwargs):
        order = Order.objects.get(user=self.request.user, ordered=False)
        serializer = OrderSerializer(order, many=True)

        return Response({"order-items": serializer.data})

    def post(self, *args, **kwargs):
        print(self.request.data)
        order = add_to_cart(self.request, self.request.data["slug"],
                            self.request.data["quantity"])
        address = Address.objects.create(user=self.request.user, street_address=self.request.data.get(
            'street_address'), apartment_address=self.request.data.get('apartment_address'), country=self.request.data.get('country'), zip=self.request.data.get('zip'))

        address.save()
        order.address = address
        order.save()
        print(order.get_total())

        if self.request.data.get('code', None):
            code = self.request.data.get('code')
            coupon = Coupon.objects.filter(code=code).first()
            if coupon:
                order.coupon = coupon
                order.save()
                return Response({"success": True, "data": order.get_total()})
            else:
                return Response({"success": False, "data": order.get_total()})
        else:
            return Response({"success": False, "data": str(order.get_total())[1:]})


@csrf_exempt
@require_POST
@non_atomic_requests
def acme_webhook(request):
    print("Incoming webhook from Acme:", request.body)
    AcmeWebhookMessage.objects.filter(
        received_at__lte=timezone.now() - dt.timedelta(days=7)
    ).delete()

    payload = json.loads(request.body)
    AcmeWebhookMessage.objects.create(
        received_at=timezone.now(),
        payload=payload,
    )

    # ba_fname, ba_lastname = str.split(
    #     payload['data']['remitter_information']['name'], " ")
    #  user = User.objects.filter(
    # first_name=ba_fname, last_name=ba_lastname).first()
    email = "munachiernesteze@gmail.com"
    # user = User.objects.filter(
    #     email=email).first()
    # order_qs = Order.objects.get(user=user, ordered=False)
    # if order_qs.exists():
    #     order = order_qs[0]
    #     if order.payment is not None:
    #         order.payment.status = 'CLO'
    #         order.payment.save()
    #     recipient_mail = User.objects.filter(
    #         first_name=ba_fname, last_name=ba_lastname)[0].email

    send_mail(
        subject='Space Payment Received',
        message='We have received your latest payment.\n You have paid {} and have {}$ outstanding to complete the payment on you space flight. The following details were sent: {}'.format(
            98000, 125000, str(request.body)),
        from_email='ojosunday1410@gmail.com',
        recipient_list=["munachiernesteze@gmail.com"],
        # html_message=html_body,
        fail_silently=True,
    )

    # Get acct number nate
    # Get accm number name and match it to user.get_name, and match it to user.get_name,
    # then send email saying, thanks we have received {}, {} left
    # payment.status = closed
    # If amt left =0, order closed
    # Possible hyperlink in e-mail to route to refund view

    return HttpResponse("Message received okay.", content_type="text/plain")


def add_to_cart(request, slug, quantity):
    item = get_object_or_404(Item, slug=slug)
    order_item, created = OrderItem.objects.get_or_create(
        item=item,
        user=request.user,
        ordered=False,
        quantity=quantity,
    )
    order_qs = Order.objects.filter(user=request.user, ordered=False)
    if order_qs.exists():
        order = order_qs[0]
        if order.items.filter(item__slug=item.slug).exists():
            order_item.quantity = quantity
            order_item.save()
            return order
        else:
            order.items.add(order_item)
            return order

    else:
        ordered_date = timezone.now()
        order = Order.objects.create(
            user=request.user, ordered=False, ordered_date=ordered_date)
        order.items.add(order_item)
        return order


@login_required
@api_view(['POST'])
def cancel_order(request, slug):
    item = get_object_or_404(Item, slug=slug)
    order_qs = Order.objects.filter(user=request.user, ordered=False)
    if order_qs.exists():
        order = order_qs.first()
        order.items.all().delete()
        return Response({"success": f"All items were removed from your cart"})
    else:
        return Response({"success": f"Cart is empty"})


# @login_required
# def remove_single_from_cart(request, slug):
#     item = get_object_or_404(Item, slug=slug)
#     order_item, created = OrderItem.objects.get_or_create(
#         item=item, user=request.user, ordered=False)
#     order_qs = Order.objects.filter(user=request.user, ordered=False)
#     if order_qs.exists():
#         order = order_qs[0]
#         if order.items.filter(item__slug=item.slug).exists():
#             if order_item.quantity > 1:
#                 order_item.quantity -= 1
#                 order_item.save()
#             else:
#                 order.items.remove(order_item)
#                 order.save()
#             return Response({"success": f"{item}'s quantity was updated"})

#         else:
#             return Response({"success": f"{item.title} was not in your cart"})

#     else:
#         return Response({"success": False, "error": "You do not have an active order"})


@atomic
def process_webhook_payload(payload):
    # TODO: business logic
    pass


def payment_complete(request):
    body = json.loads(request.body)
    order = Order.objects.get(
        user=request.user, ordered=False, id=body['orderID'])
    payment = Payment(
        user=request.user,
        stripe_charge_id=body['payID'],
        amount=order.get_total()
    )
    payment.save()

    # assign the payment to order
    order.payment = payment
    order.ordered = True
    order.save()
    return Response({"success": 'Payment was successful'})


def verify_client(request):
    request.user.is_verified = True
    return Response({"success": True})


class CouponView(CreateAPIView):
    def post(self, *args, **kwargs):
        code = self.request.data.get('code')
        coupon = Coupon.objects.filter(code=code).first()
        return Response({"success": True, "amount": coupon.amount})


def createPayout(request, id):
    order = Order.objects.filter(id=id, ordered=True)
    if order.exists():
        rapyd = RapydService()
        beneficiary = {"beneficiary": {
            "first_name": order.user.first_name,
            "last_name": order.user.last_name,
            "address": order.address.street_address,
            "email":  order.user.email,
            "country":  order.address.country,
            "city": order.address.city,
            "postcode": order.address.zip,
            "account_number": BankAccount.objects.get(user=order.user).account_iban_number,
            "bank_name": BankAccount.objects.get(user=order.user).bank_name,
            "aba": "123456789",
            "ach_code": "123456789",
            "identification_type": "DL",
            "identification_value": "123456789",
            "bic_swift": BankAccount.objects.get(user=order.user).account_bic_swift,
            "payment_type": "priority",
            "state": order.address.state,
        }}
        currency = BankAccount.objects.get(user=order.user).bank_currency
        country = BankAccount.objects.get(user=order.user).country

        sender_bank = BankAccount.objects.filter(
            countr=country, currency=currency).first()

        sender = {"sender": {
            "first_name": "Munachi",
            "last_name": "Ernest-Eze",
            "address": "123 Main St",
            "city": "New York",
            "state": "NY",
            "date_of_birth": "22/02/1980",
            "postcode": "12345",
            "phonenumber": "621212938122",
            "remitter_account_type": "Company",
            "source_of_income": "salary",
            "identification_type": "DL",
            "identification_value": "123456789",
            "purpose_code": "ABCDEFGHI",
            "description": "client",
            "account_number": sender_bank.account_iban_number,
            "beneficiary_relationship": "customer",
            "occupation": "programmer",
        }},

        rapyd.issue_refund(sender, beneficiary, country=country,
                           currency=currency, amount=order.get_total())
        return Response({"success": True})
    return Response({"success": False})


@api_view(['POST'])
def simulateTransaction(request):
    rapyd = RapydService()
    data = rapyd.simulate_funds(**request.data)
    return Response({"success": True, "data": data})

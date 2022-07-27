import datetime as dt
from django.shortcuts import get_object_or_404, redirect
from django.utils import timezone
from django.core.exceptions import ObjectDoesNotExist
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import HttpResponse, HttpResponseForbidden
from django.db.transaction import atomic, non_atomic_requests
from django.conf import settings
from django.db.models import Q
import json
from rest_framework.generics import ListAPIView, CreateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from uuid import uuid4
from catalog.api.rapydService import RapydService
from .serializers import *
from catalog.models import Item, Order, OrderItem, Address, Payment, Coupon, AcmeWebhookMessage, BankAccount


class ProductDetail(ListAPIView):
    model = Item
    template_name = 'product.html'


class OrderSummaryView(LoginRequiredMixin, ListAPIView):
    def get(self, *args, **kwargs):
        try:
            order = Order.objects.get(user=self.request.user, ordered=False)
            order = OrderSerializer(order).data
            return Response({'order': order})
        except ObjectDoesNotExist:
            return Response({'message': 'You dont have an active order'})


class PaymentView(CreateAPIView):
    rapyd_service = RapydService()

    def post(self, *args, **kwargs):
        order = Order.objects.get(
            user=self.request.user, ordered=False)
        payment = Payment.objects.create(user=self.request.user, status='CRE', amount=self.request.data.get(
            'amount'), amount_currency=self.request.data.get('currency'))

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
        order.ordered = True
        order.payment = payment
        order.save()
        return Response({"data": result})


class CheckoutView(APIView):

    def get(self,  *args, **kwargs):
        order = Order.objects.get(user=self.request.user, ordered=False)
        serializer = OrderSerializer(order, many=True)

        return Response({"order-items": serializer.data})

    def post(self, *args, **kwargs):
        order = Order.objects.get(
            user=self.request.user, ordered=False)
        address = Address.objects.create(user=self.request.user, street_address=self.request.data.get(
            'street_address'), apartment_address=self.request.data.get('apartment_address'), country=self.request.data.get('country'), zip=self.request.data.get('zip'))

        address.save()

        order.address = address
        order.save()

        return Response({"success": True})


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
    process_webhook_payload(payload)
    return HttpResponse("Message received okay.", content_type="text/plain")


@login_required
def add_to_cart(request, slug):
    item = get_object_or_404(Item, slug=slug)
    order_item, created = OrderItem.objects.get_or_create(
        item=item,
        user=request.user,
        ordered=False,
    )
    order_qs = Order.objects.filter(user=request.user, ordered=False)
    if order_qs.exists():
        order = order_qs[0]
        if order.items.filter(item__slug=item.slug).exists():
            order_item.quantity += 1
            order_item.save()
            return Response({"success": f"{item}'s quantity was updated to {order_item.quantity}."})
        else:
            order.items.add(order_item)
            return Response({"success": f"{item} was added to your cart."})

    else:
        ordered_date = timezone.now()
        order = Order.objects.create(
            user=request.user, ordered=False, ordered_date=ordered_date)
        order.items.add(order_item)
        return Response({"success": f"{item} was added to your cart."})


@login_required
def remove_from_cart(request, slug):
    item = get_object_or_404(Item, slug=slug)
    order_item, created = OrderItem.objects.get_or_create(
        item=item, user=request.user, ordered=False)
    order_qs = Order.objects.filter(user=request.user, ordered=False)
    if order_qs.exists():
        order = order_qs[0]
        if order.items.filter(item__slug=item.slug).exists():
            order.items.remove(order_item)
            order.save()
            return Response({"success": f"{item.title} was removed from your cart"})
        else:
            return Response({"success": f"{item.title} was not in your cart"})
    else:
        return Response({"success": f"{item.title} was not in your cart"})


@login_required
def remove_single_from_cart(request, slug):
    item = get_object_or_404(Item, slug=slug)
    order_item, created = OrderItem.objects.get_or_create(
        item=item, user=request.user, ordered=False)
    order_qs = Order.objects.filter(user=request.user, ordered=False)
    if order_qs.exists():
        order = order_qs[0]
        if order.items.filter(item__slug=item.slug).exists():
            if order_item.quantity > 1:
                order_item.quantity -= 1
                order_item.save()
            else:
                order.items.remove(order_item)
                order.save()
            return Response({"success": f"{item}'s quantity was updated"})

        else:
            return Response({"success": f"{item.title} was not in your cart"})

    else:
        return Response({"success": False, "error": "You do not have an active order"})


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


class CouponView(CreateAPIView):
    def post(self, *args, **kwargs):
        code = self.request.data.get('code')
        coupon = Coupon.objects.filter(code=code).first()

        try:
            order = Order.objects.get(user=self.request.user, ordered=False)
            if coupon:
                order.coupon = coupon
                order.save()
                return Response({"success": True, "amount": order.get_total()})
            else:
                return Response({"success": False, "error": "Invalid coupon code"})
        except ObjectDoesNotExist:
            return Response({"success": False, "error": "You do not have an active order"})

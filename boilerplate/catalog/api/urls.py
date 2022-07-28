from django.urls import path
from .views import (
    CheckoutView,
    OrderSummaryView,
    PaymentView,
    ProductDetail,
    acme_webhook, CouponView,
    add_to_cart,
    remove_from_cart,
    remove_single_from_cart,
)


urlpatterns = [
    path('checkout/', CheckoutView.as_view(), name='checkout'),
    path('webhooks/acme/mPnBRC1qxapOAxQpWmjy4NofbgxCmXSj/',
         acme_webhook, name='acme_webhook'),
    path('add-coupon/', CouponView.as_view(), name="add_coupon"),
    path('add-to-cart/<slug>/', add_to_cart, name='add_to_cart'),
    path('remove-from-cart/<slug>/', remove_from_cart, name='remove_from_cart'),
    path('remove-single-from-cart/<slug>/',
         remove_single_from_cart, name='remove_single_from_cart'),
    path('payment/', PaymentView.as_view(), name='payment'),
    path('order-summary/', OrderSummaryView.as_view(), name='order_summary'),
    path('product/', ProductDetail.as_view(), name='product'),

]

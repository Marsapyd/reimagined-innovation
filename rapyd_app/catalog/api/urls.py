from django.urls import path
from .views import (
    CheckoutView,
    PaymentView,
    CouponView,
    # ProductDetail,
    acme_webhook,
    # add_to_cart,
    cancel_order,
    simulateTransaction
    # remove_single_from_cart,
)


urlpatterns = [
    path('checkout/', CheckoutView.as_view(), name='checkout'),
    path('webhooks/acme/mPnBRC1qxapOAxQpWmjy4NofbgxCmXSj/',
         acme_webhook, name='acme_webhook'),
    path('add-coupon/', CouponView.as_view(), name="add_coupon"),
    # path('add-to-cart/<slug>/', add_to_cart, name='add_to_cart'),
    path('remove-from-cart/<slug>/', cancel_order, name='cancel_order'),
    # path('remove-single-from-cart/<slug>/',
    #  remove_single_from_cart, name = 'remove_single_from_cart'),
    path('payment/', PaymentView.as_view(), name='payment'),
    path('simulate/', simulateTransaction, name='simulate'),
    # path('order-summary/', OrderSummaryView.as_view(), name='order_summary'),
    # path('product/', ProductDetail.as_view(), name='product'),

]

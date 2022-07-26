from unicodedata import name
from django.db import models
from django.shortcuts import reverse
from django_countries.fields import CountryField
from django.contrib.auth.models import User
from djmoney.models.fields import MoneyField
from localflavor.generic.models import IBANField, BICField
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
User._meta.get_field('email')._unique = True
User._meta.get_field('email').blank = False
User._meta.get_field('email').null = False

CATEGORY_CHOICES = (
    ('CUS', 'Consumer'),
    ('SUP', 'Supplier'),
)

CREATED = 'CRE'
ACTIVE = 'ACT'
CLOSED = 'CLO'
REFUNDED = 'REF'


STATUS = (
    (CREATED, 'Created'),
    (ACTIVE, 'Active'),
    (CLOSED, 'Closed')
)


PAYMENT_STATUS = (
    (CREATED, 'Created'),
    (ACTIVE, 'Active'),
    (CLOSED, 'Closed'),
    (REFUNDED, 'Refunded')
)


class Item(models.Model):
    title = models.CharField(max_length=200)
    price = MoneyField(default=0, default_currency='USD', max_digits=10)
    discount_price = MoneyField(
        default=0, default_currency='USD', blank=True, max_digits=10)
    slug = models.SlugField()
    category = models.CharField(choices=CATEGORY_CHOICES, max_length=3)
    description = models.TextField(blank=True)
    image = models.ImageField(
        null=True, default='default.jpg', upload_to='productImages', blank=True)
    company_supplier = models.CharField(blank=True, max_length=200)

    def __str__(self):
        return self.title

    def get_add_to_cart_url(self):
        return reverse('add_to_cart', kwargs={'slug': self.slug})

    def get_remove_from_cart_url(self):
        return reverse('remove_from_cart', kwargs={'slug': self.slug})

    def get_remove_single_from_cart_url(self):
        return reverse('remove_single_from_cart', kwargs={'slug': self.slug})


class OrderItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    ordered = models.BooleanField(default=False)
    quantity = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} of {self.item.title}"

    def get_total_item_price(self):
        return self.quantity * self.item.price

    def get_amount_saved(self):
        return self.get_total_item_price() - self.get_final_price()

    def get_total_item_discount_price(self):
        return self.quantity * self.item.discount_price

    def get_final_price(self):
        if self.item.discount_price:
            return self.get_total_item_discount_price()
        return self.get_total_item_price()


class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    items = models.ManyToManyField(OrderItem)
    address = models.ForeignKey(
        "Address", on_delete=models.SET_NULL, blank=True, null=True, related_name="orders")
    status = models.CharField(choices=STATUS, max_length=3)
    payment = models.ForeignKey(
        "Payment", on_delete=models.SET_NULL, blank=True, null=True, related_name="orders")
    coupon = models.ForeignKey(
        "Coupon", on_delete=models.SET_NULL, blank=True, null=True, related_name="orders")
    ordered = models.BooleanField(default=False)
    start_date = models.DateTimeField(auto_now_add=True)
    ordered_date = models.DateTimeField()

    def __str__(self):
        return self.user.email

    def get_total(self):
        total = 0
        for order_item in self.items.all():
            total += order_item.get_final_price()
        if self.coupon:
            total -= self.coupon.amount*total
        return total


class Address(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    street_address = models.CharField(max_length=200)
    apartment_address = models.CharField(max_length=200)
    country = CountryField(multiple=False)
    zip = models.CharField(max_length=200)
    save_info = models.BooleanField(default=False, blank=True)
    default = models.BooleanField(default=False, blank=True)
    use_default = models.BooleanField(default=False, blank=True)

    class Meta:
        verbose_name_plural = 'Addresses'

    def __str__(self):
        return self.user.email


class Payment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    charge_id = models.CharField(blank=True, max_length=100)
    amount = MoneyField(default=0, default_currency='USD', max_digits=10)
    status = models.CharField(choices=PAYMENT_STATUS, max_length=3)
    bank = models.ForeignKey("BankAccount", related_name="payments",
                             on_delete=models.SET_NULL, blank=True, null=True)


def __str__(self):
    return self.user.email


class Coupon(models.Model):
    code = models.CharField(max_length=50)
    amount = models.FloatField()

    def __str__(self):
        return self.code


class AcmeWebhookMessage(models.Model):
    received_at = models.DateTimeField(help_text="When we received the event.")
    payload = models.JSONField(default=None, null=True)

    class Meta:
        indexes = [
            models.Index(fields=["received_at"]),
        ]


class BankAccount(models.Model):
    balance = MoneyField(max_digits=10, decimal_places=2,
                         default_currency='USD',null=True, blank=True)
    account_iban_number = IBANField(null=True, blank=True)
    account_swift_bic = BICField(null=True, blank=True)
    metadata = models.JSONField(default=dict, null=True)
    account_name = models.CharField(max_length=200, default='Rapyd')
    country = CountryField(multiple=False)
    rapyd_iban_id = models.CharField(max_length=200, blank=True, default=True)

    class Meta:
        constraints = [
            models.CheckConstraint(
                name="not_both_null",
                check=(
                    models.Q(account_swift_bic__isnull=False)
                    | models.Q(account_iban_number__isnull=False)
                ),
            )
        ]

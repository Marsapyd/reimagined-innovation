from rest_framework import serializers
from catalog.models import BankAccount, Item, Payment, Order


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'


class BankAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankAccount
        exclude = ['balance']


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'

import base64
import hashlib
import hmac
from importlib.metadata import metadata
import json
from operator import imod
import random
import string
import time
from typing import Any, Dict

from fastapi import HTTPException, status
import requests
from uuid import uuid4
from requests import Response
from django.conf import settings
import pycountry
from catalog.models import BankAccount


class RapydService:
    def __init__(self):
        self.__access_key = settings.RAPYD_ACCESS_KEY
        self.__secret_key = settings.RAPYD_SECRET_KEY
        self.__base_rapid_api_key = settings.RAPYD_API_URL
        self.__COMPANY_NAME = settings.COMPANY_NAME
        self.__EWALLET_ID = settings.EWALLET_ID

    def issue_iban(self, country, currency):
        country = pycountry.countries.get(name=country)
        country_code = country.alpha_2
        body = {
            "currency": currency,
            "country": country_code,
            "ewallet": self.__EWALLET_ID,
            "merchant_reference_id": self.__COMPANY_NAME,
            "metadata": {
                "merchant_defined": True
            }
        }
        api_response = requests.post(
            **self.__prepare_request('post', '/v1/issuing/bankaccounts', body=body))
        if api_response.status_code != 200:
            RapydService._handle_response(api_response)
        data = api_response.json()["data"]
        result = BankAccount(account_name=data["bank_account"]['beneficiary_name'],
                             rapyd_iban_id=data['id'], account_iban_number=data['bank_account']['iban'], account_swift_bic=data['bank_account']['bic'], country=country, balance=0, balance_currency=currency, metadata=data)

        return (result, data)
        # create payment object with status created in view, update with isutran once ibanhistory is moved to moved and then leave as it is

    def retrieve_iban_histrory(self, rapyd_iban_id, transaction_id=None):
        if not transaction_id:
            api_response = requests.post(
                **self.__prepare_request('get', f'/v1/issuing/bankaccounts/{rapyd_iban_id}'))
            if api_response.status_code != 200:
                RapydService._handle_response(api_response)
            data = api_response.json()["data"]
            return data["transactions"][-1]
        else:
            api_response = requests.post(
                **self.__prepare_request('get', f'/v1/issuing/bankaccounts/{rapyd_iban_id}/transactions/{transaction_id}'))
            if api_response.status_code != 200:
                RapydService._handle_response(api_response)
            data = api_response.json()["data"]
            return data

    def issue_refund(self, sender, beneficiary, country, currency, amount):

        country = pycountry.countries.get(name=country)
        country_code = country.alpha_2
        sender_body = sender | {
            "sender_country": "US",
            "sender_currency": "USD",
            "sender_entity_type": "company"
        }
        payload_body = {
            "payout_method_type": f"{country_code.lower()}_general_bank",
            "payout_amount": str(amount),
            "payout_currency": currency,
            "ewallet": self.__EWALLET_ID,
            "merchant_reference_id": self.__COMPANY_NAME,
            "metadata": {
                "merchant_defined": True
            }
        }
        beneficiary_body = beneficiary | {
            "beneficiary_country": "de",
            "beneficiary_entity_type": "individual"
        }
        body = {} | beneficiary_body | payload_body | sender_body
        api_response = requests.post(
            **self.__prepare_request('post', '/v1/payouts/', body=body))

        if api_response.status_code != 200:
            RapydService._handle_response(api_response)
        data = api_response.json()
        return data

    def auth_webhook_request(self, incomeSign, url, salt, timestamp, body) -> bool:
        signature = self.__generate_signature_for_webhook(
            url, salt, timestamp, body)
        return signature == incomeSign

    def __generate_salt(self):
        return ''.join(random.sample(string.ascii_letters + string.digits, 12))

    def __get_unix_time(self):
        return int(time.time())

    def __prepare_request(self, http_method: str, path: str, body=None):
        full_url = f'{self.__base_rapid_api_key}{path}'

        body_dict: Dict[str, Any] = dict()
        if body:
            body_dict = body

        str_body = json.dumps(body_dict, separators=(
            ',', ':'), ensure_ascii=False) if body else ''

        salt, timestamp, signature = self.__generate_signature(
            http_method=http_method, path=path, body=str_body)

        headers = self.__prepare_headers(salt, timestamp, signature)
        result = {"url": full_url, "headers": headers, "json": body_dict} if body is not None else {
            "url": full_url, "headers": headers}
        return result

    def __generate_signature(self, http_method, path, body):
        salt = self.__generate_salt()
        timestamp = str(self.__get_unix_time())
        to_sign = (http_method, path, salt, str(timestamp),
                   self.__access_key, self.__secret_key, body)

        h = hmac.new(self.__secret_key.encode('utf-8'),
                     ''.join(to_sign).encode('utf-8'), hashlib.sha256)
        signature = base64.urlsafe_b64encode(str.encode(h.hexdigest()))
        return salt, timestamp, signature

    def __generate_signature_for_webhook(self, url, salt, timestamp, body):
        str_body = json.dumps(body, separators=(
            ',', ':'), ensure_ascii=False) if body else ''
        to_sign = (url, salt, timestamp, self.__access_key,
                   self.__secret_key, str_body)

        h = hmac.new(self.__secret_key.encode('utf-8'),
                     ''.join(to_sign).encode('utf-8'), hashlib.sha256)
        signature = base64.urlsafe_b64encode(str.encode(h.hexdigest()))
        return signature.decode()

    def __prepare_headers(self, salt: str, timestamp: str, signature):
        return {"salt": salt,
                "access_key": self.__access_key,
                "timestamp": timestamp,
                "signature": signature
                }

    @staticmethod
    def _handle_response(res: Response):
        error = None
        try:
            error = res.json()
        except:
            error = res.text
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error
        )

    @staticmethod
    def _fix_body_float_values(dict: Dict[str, Any]):
        #   By default "Requests" lib when sends float values in the body
        #   serializes them to int if they have an integer value.
        #   However the json.dump() method uses trailing zeros.
        #   So we need to manually round all floats to integer values if possible, otherwise our signature will not match the body
        for key in dict.keys():
            value = dict[key]
            if isinstance(value, float) and value.is_integer():
                dict[key] = int(value)
        return dict

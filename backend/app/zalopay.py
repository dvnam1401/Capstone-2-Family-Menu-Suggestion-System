import hmac
import hashlib
import time
import urllib.request
import urllib.parse
import json
import random
import logging
from datetime import datetime
from typing import Dict, Any, Optional
from dotenv import load_dotenv
import os

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

load_dotenv()

# Load config from .env
ZALOPAY_APP_ID = int(os.getenv("ZALOPAY_APP_ID"))
ZALOPAY_KEY1 = os.getenv("ZALOPAY_KEY1")
ZALOPAY_KEY2 = os.getenv("ZALOPAY_KEY2")
ZALOPAY_CREATE_ORDER_URL = os.getenv("ZALOPAY_CREATE_ORDER_URL")
ZALOPAY_QUERY_URL = os.getenv("ZALOPAY_QUERY_URL")
ZALOPAY_CALLBACK_URL = os.getenv("ZALOPAY_CALLBACK_URL")

# Verify environment variables
def verify_env() -> bool:
    required_vars = [
        'ZALOPAY_APP_ID',
        'ZALOPAY_KEY1',
        'ZALOPAY_KEY2',
        'ZALOPAY_CREATE_ORDER_URL',
        'ZALOPAY_QUERY_URL',
        'ZALOPAY_CALLBACK_URL'
    ]
    
    missing_vars = []
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        logger.error(f"Missing environment variables: {', '.join(missing_vars)}")
        return False
    
    logger.info("Environment variables verified successfully")
    return True

class ZaloPayError(Exception):
    """Custom exception for ZaloPay related errors"""
    pass

def create_zalopay_order(order_id: int, user_id: int, amount: float, items: list, payment_method: str = "zalopayapp") -> Dict[str, Any]:
    logger.info(f"Creating ZaloPay order for order_id: {order_id}, user_id: {user_id}, amount: {amount}, payment_method: {payment_method}")
    start_time = time.time()
    
    try:
        # Validate input
        if amount <= 0:
            raise ZaloPayError("Amount must be greater than 0")
        if not items:
            raise ZaloPayError("Items list cannot be empty")
        
        # Validate payment method
        valid_payment_methods = ["zalopayapp", "ATM", "CC", "QR"]
        if payment_method not in valid_payment_methods:
            logger.warning(f"Invalid payment method: {payment_method}. Using default: zalopayapp")
            payment_method = "zalopayapp"
            
        # Generate app_trans_id in format yyMMdd_xxxxxx
        trans_id = random.randrange(1000000)
        app_trans_id = "{:%y%m%d}_{}".format(datetime.now(), trans_id)

        # Prepare order data
        order = {
            "app_id": ZALOPAY_APP_ID,
            "app_trans_id": app_trans_id,
            "app_user": f"user_{user_id}",
            "app_time": int(round(time.time() * 1000)),  # Miliseconds
            "embed_data": json.dumps({"order_id": order_id}),
            "item": json.dumps(items),
            "amount": int(amount * 100),  # Convert to VNĐ (ZaloPay requirement)
            "description": f"Payment for the order #{order_id}",
            "bank_code": payment_method
        }

        # Create MAC signature
        data = f"{order['app_id']}|{order['app_trans_id']}|{order['app_user']}|{order['amount']}|{order['app_time']}|{order['embed_data']}|{order['item']}"
        order["mac"] = hmac.new(
            ZALOPAY_KEY1.encode('utf-8'),
            data.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()

        # Send request to ZaloPay
        response = urllib.request.urlopen(
            url=ZALOPAY_CREATE_ORDER_URL,
            data=urllib.parse.urlencode(order).encode('utf-8')
        )
        result = json.loads(response.read())
        
        # Log response time
        response_time = time.time() - start_time
        logger.info(f"ZaloPay order created successfully. Response time: {response_time:.2f}s")
        
        if result.get("return_code") != 1:
            logger.error(f"ZaloPay order creation failed: {result.get('return_message')}")
            raise ZaloPayError(result.get("return_message"))
            
        return result
        
    except urllib.error.URLError as e:
        logger.error(f"Network error while creating ZaloPay order: {str(e)}")
        raise ZaloPayError(f"Network error: {str(e)}")
    except json.JSONDecodeError as e:
        logger.error(f"Invalid JSON response from ZaloPay: {str(e)}")
        raise ZaloPayError(f"Invalid response format: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error while creating ZaloPay order: {str(e)}")
        raise ZaloPayError(str(e))

def verify_callback(data: Dict[str, Any]) -> bool:
    logger.info("Verifying ZaloPay callback data")
    try:
        received_mac = data.get("mac")
        data_str = data.get("data")
        
        if not received_mac or not data_str:
            logger.error("Missing mac or data in callback")
            return False
        
        # Compute MAC for verification
        computed_mac = hmac.new(
            ZALOPAY_KEY2.encode('utf-8'),
            data_str.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
        
        is_valid = received_mac == computed_mac
        if not is_valid:
            logger.warning("Invalid MAC signature in callback")
        else:
            logger.info("Callback verification successful")
            
        return is_valid
        
    except Exception as e:
        logger.error(f"Error verifying callback: {str(e)}")
        return False

def query_order_status(app_trans_id: str) -> Dict[str, Any]:
    logger.info(f"Querying order status for app_trans_id: {app_trans_id}")
    start_time = time.time()
    
    try:
        params = {
            "app_id": ZALOPAY_APP_ID,
            "app_trans_id": app_trans_id
        }
        data = f"{params['app_id']}|{params['app_trans_id']}|{ZALOPAY_KEY1}"
        params["mac"] = hmac.new(
            ZALOPAY_KEY1.encode('utf-8'),
            data.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()

        response = urllib.request.urlopen(
            url=ZALOPAY_QUERY_URL,
            data=urllib.parse.urlencode(params).encode('utf-8')
        )
        result = json.loads(response.read())
        
        # Log response time
        response_time = time.time() - start_time
        logger.info(f"Order status query completed. Response time: {response_time:.2f}s")
        
        if result.get("return_code") != 1:
            logger.error(f"Order status query failed: {result.get('return_message')}")
            raise ZaloPayError(result.get("return_message"))
            
        return result
        
    except urllib.error.URLError as e:
        logger.error(f"Network error while querying order status: {str(e)}")
        raise ZaloPayError(f"Network error: {str(e)}")
    except json.JSONDecodeError as e:
        logger.error(f"Invalid JSON response from ZaloPay: {str(e)}")
        raise ZaloPayError(f"Invalid response format: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error while querying order status: {str(e)}")
        raise ZaloPayError(str(e))

# Verify environment variables on module load
if not verify_env():
    logger.error("ZaloPay integration is not properly configured") 
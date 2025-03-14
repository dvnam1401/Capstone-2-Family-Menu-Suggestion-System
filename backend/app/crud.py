from sqlalchemy.orm import Session
from . import models, schemas
from typing import Optional, List
from decimal import Decimal
from datetime import datetime
from .security import hash_password

def get_user_by_username(db: Session, username: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.username == username).first()

def get_user_by_email(db: Session, email: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user) -> models.User:
    # Kiểm tra xem user có phải là dictionary không
    if isinstance(user, dict):
        # Mã hóa mật khẩu
        hashed_password = hash_password(user.get("password"))
        db_user = models.User(
            username=user.get("username"),
            email=user.get("email"),
            password=hashed_password,
            full_name=user.get("full_name"),
            location=user.get("location", None),
            role=user.get("role", "user")
        )
    else:
        # Nếu là đối tượng Pydantic
        # Mã hóa mật khẩu
        hashed_password = hash_password(user.password)
        db_user = models.User(
            username=user.username,
            email=user.email,
            password=hashed_password,
            full_name=user.full_name,
            location=getattr(user, "location", None),
            role=getattr(user, "role", "user")
        )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user(db: Session, user_id: int) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.user_id == user_id).first()

def update_user(db: Session, user_id: int, user) -> Optional[models.User]:
    db_user = get_user(db, user_id)
    if not db_user:
        return None
    
    # Nếu là dictionary
    if isinstance(user, dict):
        # Nếu có cập nhật mật khẩu
        if "password" in user:
            user["password"] = hash_password(user["password"])
        
        for field, value in user.items():
            setattr(db_user, field, value)
    else:
        # Nếu là đối tượng Pydantic
        update_data = user.dict(exclude_unset=True)
        
        # Nếu có cập nhật mật khẩu
        if "password" in update_data:
            update_data["password"] = hash_password(update_data["password"])
        
        for field, value in update_data.items():
            setattr(db_user, field, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int) -> bool:
    db_user = get_user(db, user_id)
    if not db_user:
        return False
    
    db.delete(db_user)
    db.commit()
    return True

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

# Order CRUD operations
def create_order(db: Session, order: schemas.OrderCreate) -> models.Orders:
    total_amount = Decimal('0')
    
    # Create the order
    db_order = models.Orders(
        user_id=order.user_id,
        total_amount=total_amount,
        status="pending",
        payment_method=order.payment_method
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    
    # Create order items
    for item in order.cart_items:
        # Lấy thông tin sản phẩm từ database
        product = db.query(models.Product).filter(models.Product.product_id == item.product_id).first()
        if not product:
            raise ValueError(f"Product with ID {item.product_id} not found")
        
        # Lấy giá thực tế của sản phẩm
        product_price = product.price
        
        db_order_item = models.OrderItems(
            order_id=db_order.order_id,
            product_id=item.product_id,
            quantity=item.quantity,
            price=product_price  # Sử dụng giá thực tế
        )
        db.add(db_order_item)
        total_amount += product_price * item.quantity
    
    # Update order total
    db_order.total_amount = total_amount
    db.commit()
    db.refresh(db_order)
    return db_order

def update_order_status(db: Session, order_id: int, status: str) -> Optional[models.Orders]:
    db_order = db.query(models.Orders).filter(models.Orders.order_id == order_id).first()
    if not db_order:
        return None
    
    db_order.status = status
    db.commit()
    db.refresh(db_order)
    return db_order

def get_order(db: Session, order_id: int) -> Optional[models.Orders]:
    return db.query(models.Orders).filter(models.Orders.order_id == order_id).first()

# Payment CRUD operations
def create_payment(db: Session, payment: schemas.PaymentCreate) -> models.Payments:
    db_payment = models.Payments(
        order_id=payment.order_id,
        amount=payment.amount,
        method=payment.method,
        status="pending"
    )
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment

def update_payment_status(db: Session, payment_id: int, status: str, zp_trans_id: Optional[str] = None) -> Optional[models.Payments]:
    db_payment = db.query(models.Payments).filter(models.Payments.payment_id == payment_id).first()
    if not db_payment:
        return None
    
    db_payment.status = status
    if zp_trans_id:
        db_payment.zp_trans_id = zp_trans_id
    
    db.commit()
    db.refresh(db_payment)
    return db_payment

def get_payment(db: Session, payment_id: int) -> Optional[models.Payments]:
    return db.query(models.Payments).filter(models.Payments.payment_id == payment_id).first()

def get_payment_by_order(db: Session, order_id: int) -> Optional[models.Payments]:
    return db.query(models.Payments).filter(models.Payments.order_id == order_id).first()

# Product CRUD operations
def get_products(db: Session, skip: int = 0, limit: int = 100, category_id: Optional[int] = None) -> List[models.Product]:
    query = db.query(models.Product)
    if category_id:
        query = query.filter(models.Product.category_id == category_id)
    return query.offset(skip).limit(limit).all()

def get_product(db: Session, product_id: int) -> Optional[models.Product]:
    return db.query(models.Product).filter(models.Product.product_id == product_id).first()

def create_product(db: Session, product: schemas.ProductCreate) -> models.Product:
    db_product = models.Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def update_product(db: Session, product_id: int, product_data: dict) -> Optional[models.Product]:
    db_product = get_product(db, product_id)
    if not db_product:
        return None
    
    for field, value in product_data.items():
        setattr(db_product, field, value)
    
    db.commit()
    db.refresh(db_product)
    return db_product

# Cart Items CRUD operations
def create_cart_item(db: Session, user_id: int, cart_item: schemas.CartItem) -> models.CartItems:
    db_cart_item = models.CartItems(
        user_id=user_id,
        product_id=cart_item.product_id,
        quantity=cart_item.quantity
    )
    db.add(db_cart_item)
    db.commit()
    db.refresh(db_cart_item)
    return db_cart_item

def get_cart_item(db: Session, cart_item_id: int) -> Optional[models.CartItems]:
    return db.query(models.CartItems).filter(models.CartItems.cart_item_id == cart_item_id).first()

def get_cart_items_by_user(db: Session, user_id: int) -> List[models.CartItems]:
    return db.query(models.CartItems).filter(models.CartItems.user_id == user_id).all()

def update_cart_item(db: Session, cart_item_id: int, quantity: int) -> Optional[models.CartItems]:
    db_cart_item = get_cart_item(db, cart_item_id)
    if not db_cart_item:
        return None
    
    db_cart_item.quantity = quantity
    db.commit()
    db.refresh(db_cart_item)
    return db_cart_item

def delete_cart_item(db: Session, cart_item_id: int) -> bool:
    db_cart_item = get_cart_item(db, cart_item_id)
    if not db_cart_item:
        return False
    
    db.delete(db_cart_item)
    db.commit()
    return True

# Menu CRUD operations
def create_menu(db: Session, menu_data: dict, menu_items: List[dict] = None) -> models.Menus:
    new_menu = models.Menus(**menu_data)
    db.add(new_menu)
    db.commit()
    db.refresh(new_menu)
    
    if menu_items:
        for item in menu_items:
            menu_item = models.MenuItems(menu_id=new_menu.menu_id, **item)
            db.add(menu_item)
        db.commit()
    
    return new_menu

def get_menu(db: Session, menu_id: int) -> Optional[models.Menus]:
    return db.query(models.Menus).filter(models.Menus.menu_id == menu_id).first()

def get_menus(db: Session, skip: int = 0, limit: int = 100) -> List[models.Menus]:
    return db.query(models.Menus).offset(skip).limit(limit).all()

def update_menu(db: Session, menu_id: int, menu_data: dict) -> Optional[models.Menus]:
    db_menu = get_menu(db, menu_id)
    if not db_menu:
        return None
    
    for field, value in menu_data.items():
        setattr(db_menu, field, value)
    
    db.commit()
    db.refresh(db_menu)
    return db_menu

def delete_menu(db: Session, menu_id: int) -> bool:
    db_menu = get_menu(db, menu_id)
    if not db_menu:
        return False
    
    db.delete(db_menu)
    db.commit()
    return True

# Review CRUD operations
def create_review(db: Session, review_data: dict) -> models.Reviews:
    new_review = models.Reviews(**review_data)
    db.add(new_review)
    db.commit()
    db.refresh(new_review)
    return new_review

def get_review(db: Session, review_id: int) -> Optional[models.Reviews]:
    return db.query(models.Reviews).filter(models.Reviews.review_id == review_id).first()

def get_reviews_by_product(db: Session, product_id: int) -> List[models.Reviews]:
    return db.query(models.Reviews).filter(models.Reviews.product_id == product_id).all()

def update_review(db: Session, review_id: int, review_data: dict) -> Optional[models.Reviews]:
    db_review = get_review(db, review_id)
    if not db_review:
        return None
    
    for field, value in review_data.items():
        setattr(db_review, field, value)
    
    db.commit()
    db.refresh(db_review)
    return db_review

def delete_review(db: Session, review_id: int) -> bool:
    db_review = get_review(db, review_id)
    if not db_review:
        return False
    
    db.delete(db_review)
    db.commit()
    return True

# Promotion CRUD operations
def create_promotion(db: Session, promotion_data: dict) -> models.Promotions:
    new_promotion = models.Promotions(**promotion_data)
    db.add(new_promotion)
    db.commit()
    db.refresh(new_promotion)
    return new_promotion

def get_promotion(db: Session, promotion_id: int) -> Optional[models.Promotions]:
    return db.query(models.Promotions).filter(models.Promotions.promotion_id == promotion_id).first()

def get_active_promotions(db: Session) -> List[models.Promotions]:
    current_time = datetime.now()
    return db.query(models.Promotions).filter(
        models.Promotions.start_date <= current_time,
        models.Promotions.end_date >= current_time
    ).all()

def update_promotion(db: Session, promotion_id: int, promotion_data: dict) -> Optional[models.Promotions]:
    db_promotion = get_promotion(db, promotion_id)
    if not db_promotion:
        return None
    
    for field, value in promotion_data.items():
        setattr(db_promotion, field, value)
    
    db.commit()
    db.refresh(db_promotion)
    return db_promotion

def delete_promotion(db: Session, promotion_id: int) -> bool:
    db_promotion = get_promotion(db, promotion_id)
    if not db_promotion:
        return False
    
    db.delete(db_promotion)
    db.commit()
    return True

# Inventory CRUD operations
def create_inventory(db: Session, inventory_data: dict) -> models.Inventory:
    new_inventory = models.Inventory(**inventory_data)
    db.add(new_inventory)
    db.commit()
    db.refresh(new_inventory)
    return new_inventory

def get_inventory(db: Session, inventory_id: int) -> Optional[models.Inventory]:
    return db.query(models.Inventory).filter(models.Inventory.inventory_id == inventory_id).first()

def get_inventory_by_product(db: Session, product_id: int) -> Optional[models.Inventory]:
    return db.query(models.Inventory).filter(models.Inventory.product_id == product_id).first()

def update_inventory(db: Session, inventory_id: int, quantity: int) -> Optional[models.Inventory]:
    db_inventory = get_inventory(db, inventory_id)
    if not db_inventory:
        return None
    
    db_inventory.quantity = quantity
    db.commit()
    db.refresh(db_inventory)
    return db_inventory

def delete_inventory(db: Session, inventory_id: int) -> bool:
    db_inventory = get_inventory(db, inventory_id)
    if not db_inventory:
        return False
    
    db.delete(db_inventory)
    db.commit()
    return True

# Inventory Transaction CRUD operations
def create_inventory_transaction(db: Session, transaction_data: dict) -> models.InventoryTransactions:
    new_transaction = models.InventoryTransactions(**transaction_data)
    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)
    return new_transaction

def get_inventory_transactions(db: Session, start_date: str = None, end_date: str = None) -> List[models.InventoryTransactions]:
    query = db.query(models.InventoryTransactions)
    if start_date:
        query = query.filter(models.InventoryTransactions.created_at >= start_date)
    if end_date:
        query = query.filter(models.InventoryTransactions.created_at <= end_date)
    return query.all()

# Favorite Menu CRUD operations
def create_favorite_menu(db: Session, user_id: int, menu_id: int) -> models.FavoriteMenus:
    favorite = models.FavoriteMenus(user_id=user_id, menu_id=menu_id)
    db.add(favorite)
    db.commit()
    db.refresh(favorite)
    return favorite

def get_favorite_menu(db: Session, favorite_menu_id: int) -> Optional[models.FavoriteMenus]:
    return db.query(models.FavoriteMenus).filter(models.FavoriteMenus.favorite_menu_id == favorite_menu_id).first()

def get_favorite_menus_by_user(db: Session, user_id: int) -> List[models.FavoriteMenus]:
    return db.query(models.FavoriteMenus).filter(models.FavoriteMenus.user_id == user_id).all()

def delete_favorite_menu(db: Session, favorite_menu_id: int) -> bool:
    favorite = get_favorite_menu(db, favorite_menu_id)
    if not favorite:
        return False
    
    db.delete(favorite)
    db.commit()
    return True 
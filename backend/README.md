# Family Menu Suggestion System

Hệ thống gợi ý thực đơn cho gia đình, kết hợp với chức năng thương mại điện tử cho phép người dùng mua sắm nguyên liệu.

## Tính năng chính

1. **Quản lý người dùng**
   - Đăng ký, đăng nhập với JWT authentication
   - Phân quyền: user, admin, inventory_manager
   - Quản lý thông tin cá nhân và preferences

2. **Quản lý sản phẩm**
   - CRUD sản phẩm và danh mục
   - Quản lý kho hàng
   - Theo dõi lịch sử giao dịch

3. **Gợi ý thực đơn**
   - Gợi ý dựa trên preferences của người dùng
   - Lưu và quản lý thực đơn yêu thích
   - Đánh giá và nhận xét

4. **Giỏ hàng và đặt hàng**
   - Thêm/xóa sản phẩm vào giỏ hàng
   - Quản lý đơn hàng
   - Thanh toán qua ZaloPay

5. **Tích hợp ZaloPay**
   - Tạo đơn hàng
   - Xử lý callback
   - Kiểm tra trạng thái giao dịch
   - Nhiều phương thức thanh toán:
     - Thanh toán qua ứng dụng ZaloPay
     - Thanh toán bằng thẻ ATM
     - Thanh toán bằng thẻ tín dụng (Visa, Mastercard, JCB)
     - Thanh toán bằng QR code

## Yêu cầu hệ thống

- Python 3.9+
- MySQL 8.0+
- Redis 6.2+
- Docker và Docker Compose (tùy chọn)

## Cài đặt

### Phương pháp 1: Sử dụng Docker

1. Clone repository:
```bash
git clone <repository_url>
cd family-menu-system
```

2. Tạo file .env từ mẫu:
```bash
cp .env.example .env
```

3. Cập nhật các biến môi trường trong file .env

4. Khởi động các services:
```bash
docker-compose up -d
```

### Phương pháp 2: Cài đặt thủ công

1. Cài đặt Python dependencies:
```bash
pip install -r requirements.txt
```

2. Cài đặt và cấu hình MySQL:
```sql
CREATE DATABASE family_menu_db;
CREATE USER 'family_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON family_menu_db.* TO 'family_user'@'localhost';
FLUSH PRIVILEGES;
```

3. Cài đặt và khởi động Redis:
```bash
redis-server
```

4. Cập nhật file .env với thông tin cấu hình

5. Chạy ứng dụng:
```bash
uvicorn app.main:app --reload
```

## Cấu trúc dự án

```
family_menu_system/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── database.py
│   ├── auth.py
│   ├── crud.py
│   ├── cache.py
│   ├── zalopay.py
│   └── routes/
│       ├── __init__.py
│       ├── auth.py
│       ├── user.py
│       ├── inventory.py
│       ├── admin.py
│       ├── payment.py
│       └── e_commerce.py
├── tests/
│   ├── __init__.py
│   ├── test_main.py
│   └── test_zalopay.py
├── .env
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## API Documentation

API documentation có sẵn tại `/docs` sau khi khởi động ứng dụng.

### Các endpoint chính:

1. Authentication
   - POST /api/auth/register
   - POST /api/auth/login

2. User
   - GET /api/products
   - POST /api/users/{user_id}/cart
   - GET /api/users/{user_id}/menu-suggestions

3. Admin
   - GET /api/admin/users
   - POST /api/admin/products
   - GET /api/admin/analytics/sales

4. Payment
   - POST /api/payments/zalopay/create - Tạo đơn hàng thanh toán ZaloPay
   - POST /api/payments/zalopay/callback - Callback URL cho ZaloPay
   - GET /api/payments/zalopay/status/{app_trans_id} - Kiểm tra trạng thái thanh toán
   - GET /api/payments/zalopay/payment-methods - Lấy danh sách phương thức thanh toán

## Testing

Chạy unit tests:
```bash
pytest
```

## Security

1. Authentication sử dụng JWT
2. Password được hash trước khi lưu
3. Role-based access control
4. Input validation
5. Rate limiting
6. SSL/TLS trong production

## Monitoring

1. Logging
   - Application logs
   - Access logs
   - Error logs

2. Metrics
   - Response time
   - Error rate
   - Transaction success rate

## Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## License

MIT License

## Support

Nếu bạn gặp vấn đề hoặc có câu hỏi, vui lòng tạo issue trong repository.
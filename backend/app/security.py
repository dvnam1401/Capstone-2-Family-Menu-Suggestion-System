from passlib.context import CryptContext

# Tạo context cho việc mã hóa mật khẩu
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """
    Mã hóa mật khẩu sử dụng bcrypt
    """
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Xác thực mật khẩu bằng cách so sánh mật khẩu đầu vào với mật khẩu đã hash
    """
    return pwd_context.verify(plain_password, hashed_password) 
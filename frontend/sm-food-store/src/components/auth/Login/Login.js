// src/components/auth/Login/Login.js
import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook } from 'react-icons/fa';
import { AuthContext } from '../../../context/AuthContext';
import Button from '../../common/Button/Button';

const LoginContainer = styled.div`
  max-width: 500px;
  margin: 50px auto;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  background: white;
`;

const LoginTitle = styled.h1`
  text-align: center;
  color: #0A4D7C;
  font-size: 28px;
  margin-bottom: 30px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
`;

const Input = styled(Field)`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  &:focus {
    outline: none;
    border-color: #0A4D7C;
  }
`;

const PasswordContainer = styled.div`
  position: relative;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  &:hover {
    color: #333;
  }
`;

const ErrorText = styled.div`
  color: #d32f2f;
  font-size: 14px;
  margin-top: 5px;
`;

const ForgotPassword = styled(Link)`
  display: block;
  text-align: right;
  margin-top: 10px;
  color: #0A4D7C;
  text-decoration: none;
  font-size: 14px;
  &:hover {
    text-decoration: underline;
  }
`;

const OrDivider = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0;
  &:before, &:after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #ddd;
  }
  span {
    margin: 0 10px;
    color: #666;
    font-size: 14px;
  }
`;

const SocialButtons = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
`;

const SocialButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  
  svg {
    margin-right: 10px;
    font-size: 18px;
  }
  
  &:hover {
    background: #f9f9f9;
  }
`;

const GoogleButton = styled(SocialButton)`
  svg {
    color: #DB4437;
  }
`;

const FacebookButton = styled(SocialButton)`
  svg {
    color: #4267B2;
  }
`;

const SignupPrompt = styled.div`
  text-align: center;
  margin-top: 30px;
  color: #666;
  font-size: 14px;
  
  a {
    color: #0A4D7C;
    text-decoration: none;
    font-weight: 500;
    margin-left: 5px;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const TermsText = styled.div`
  text-align: center;
  margin-top: 20px;
  font-size: 12px;
  color: #666;
  
  a {
    color: #0A4D7C;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, loginWithGoogle, loginWithFacebook } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const redirectPath = location.state?.from || '/';
  
  const initialValues = {
    email: '',
    password: ''
  };
  
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Địa chỉ email không hợp lệ')
      .required('Email là trường bắt buộc'),
    password: Yup.string()
      .required('Mật khẩu là trường bắt buộc')
  });
  
  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      await login(values.email, values.password);
      navigate(redirectPath, { replace: true });
    } catch (error) {
      setFieldError('password', 'Email hoặc mật khẩu không chính xác');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate(redirectPath, { replace: true });
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };
  
  const handleFacebookLogin = async () => {
    try {
      await loginWithFacebook();
      navigate(redirectPath, { replace: true });
    } catch (error) {
      console.error('Facebook login failed:', error);
    }
  };
  
  return (
    <LoginContainer>
      <LoginTitle>Đăng Nhập</LoginTitle>
      
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <FormGroup>
              <Label htmlFor="email">Email / số điện thoại</Label>
              <Input 
                type="text" 
                id="email" 
                name="email" 
                placeholder="Ex: yourname@gmail.com" 
              />
              <ErrorMessage name="email" component={ErrorText} />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="password">Mật khẩu</Label>
              <PasswordContainer>
                <Input 
                  type={showPassword ? "text" : "password"} 
                  id="password" 
                  name="password" 
                  placeholder="••••••••" 
                />
                <PasswordToggle 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </PasswordToggle>
              </PasswordContainer>
              <ErrorMessage name="password" component={ErrorText} />
              <ForgotPassword to="/forgot-password">Quên mật khẩu?</ForgotPassword>
            </FormGroup>
            
            <Button 
              type="submit" 
              variant="secondary" 
              fullWidth 
              size="large" 
              disabled={isSubmitting}
            >
              Tiếp tục
            </Button>
          </Form>
        )}
      </Formik>
      
      <OrDivider>
        <span>Hoặc đăng nhập / đăng ký với</span>
      </OrDivider>
      
      <SocialButtons>
        <GoogleButton onClick={handleGoogleLogin}>
          <FaGoogle /> Tiếp tục với Google
        </GoogleButton>
      </SocialButtons>
      <SocialButtons>
        <FacebookButton onClick={handleFacebookLogin}>
          <FaFacebook /> Tiếp tục với Facebook
        </FacebookButton>
      </SocialButtons>
      
      <TermsText>
        Bằng cách đăng ký, bạn đồng ý với <Link to="/terms">Điều khoản & Điều kiện của chúng tôi</Link> và xác nhận rằng bạn đã đọc <Link to="/privacy">Chính sách Bảo mật của chúng tôi</Link>.
      </TermsText>
    </LoginContainer>
  );
};

export default Login;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import AuthLayout from '../../layouts/AuthLayout';
import Button from '../../components/common/Button/Button';
import authService from '../../services/authService';

const ForgotContainer = styled.div`
  max-width: 500px;
  width: 100%;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  background: white;
`;

const ForgotTitle = styled.h1`
  text-align: center;
  color: #0A4D7C;
  font-size: 28px;
  margin-bottom: 15px;
`;

const Subtitle = styled.p`
  text-align: center;
  color: #666;
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

const ErrorText = styled.div`
  color: #d32f2f;
  font-size: 14px;
  margin-top: 5px;
`;

const BackToLogin = styled(Link)`
  display: flex;
  align-items: center;
  margin-top: 20px;
  color: #0A4D7C;
  text-decoration: none;
  font-size: 14px;
  
  svg {
    margin-right: 8px;
  }
  
  &:hover {
    text-decoration: underline;
  }
`;

const SuccessMessage = styled.div`
  background-color: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  text-align: center;
`;

const ForgotPassword = () => {
  const [emailSent, setEmailSent] = useState(false);
  
  const initialValues = {
    email: ''
  };
  
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Địa chỉ email không hợp lệ')
      .required('Email là trường bắt buộc')
  });
  
  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      await authService.resetPassword(values.email);
      setEmailSent(true);
    } catch (error) {
      setFieldError('email', 'Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại sau.');
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <AuthLayout>
      <ForgotContainer>
        <ForgotTitle>Quên mật khẩu</ForgotTitle>
        <Subtitle>Nhập email của bạn để đặt lại mật khẩu</Subtitle>
        
        {emailSent && (
          <SuccessMessage>
            Chúng tôi đã gửi email hướng dẫn đặt lại mật khẩu đến email của bạn. Vui lòng kiểm tra hộp thư đến của bạn.
          </SuccessMessage>
        )}
        
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <FormGroup>
                <Label htmlFor="email">Email</Label>
                <Input 
                  type="email" 
                  id="email" 
                  name="email" 
                  placeholder="Nhập email đã đăng ký của bạn" 
                />
                <ErrorMessage name="email" component={ErrorText} />
              </FormGroup>
              
              <Button 
                type="submit" 
                variant="secondary" 
                fullWidth 
                size="large" 
                disabled={isSubmitting || emailSent}
              >
                {emailSent ? 'Đã gửi email' : 'Gửi yêu cầu đặt lại mật khẩu'}
              </Button>
            </Form>
          )}
        </Formik>
        
        <BackToLogin to="/login">
          <FaArrowLeft /> Quay lại đăng nhập
        </BackToLogin>
      </ForgotContainer>
    </AuthLayout>
  );
};

export default ForgotPassword;
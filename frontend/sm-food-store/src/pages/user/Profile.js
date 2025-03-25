import React, { useState, useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLock } from 'react-icons/fa';
import MainLayout from '../../layouts/MainLayout';
import Button from '../../components/common/Button/Button';
import { AuthContext } from '../../context/AuthContext';

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 30px;
`;

const ProfileTitle = styled.h1`
  font-size: 28px;
  margin-bottom: 30px;
`;

const CardContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 30px;
`;

const CardHeader = styled.div`
  background: #f5f5f5;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  
  h2 {
    margin: 0;
    font-size: 18px;
    display: flex;
    align-items: center;
    
    svg {
      margin-right: 10px;
      color: #4CAF50;
    }
  }
`;

const CardBody = styled.div`
  padding: 20px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.cols || 1}, 1fr);
  gap: 15px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 0;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
`;

const Input = styled(Field)`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #4CAF50;
  }
`;

const ErrorText = styled.div`
  color: #d32f2f;
  font-size: 14px;
  margin-top: 5px;
`;

const SaveButton = styled(Button)`
  margin-top: 10px;
`;

const SuccessMessage = styled.div`
  background-color: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
`;

const Profile = () => {
  const { currentUser, updateProfile, changePassword } = useContext(AuthContext);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  
  // Profile form validation
  const profileInitialValues = {
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
    city: currentUser?.city || '',
    postalCode: currentUser?.postalCode || ''
  };
  
  const profileValidationSchema = Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().required('Phone number is required')
  });
  
  // Password form validation
  const passwordInitialValues = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  
  const passwordValidationSchema = Yup.object({
    currentPassword: Yup.string().required('Current password is required'),
    newPassword: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('New password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .required('Confirm password is required')
  });
  
  // Handle profile update
  const handleProfileUpdate = async (values, { setSubmitting }) => {
    try {
      await updateProfile(values);
      setProfileSuccess(true);
      setTimeout(() => {
        setProfileSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Profile update failed:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  // Handle password change
  const handlePasswordChange = async (values, { setSubmitting, resetForm }) => {
    try {
      await changePassword(values.currentPassword, values.newPassword);
      resetForm();
      setPasswordSuccess(true);
      setTimeout(() => {
        setPasswordSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Password change failed:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <MainLayout>
      <ProfileContainer>
        <ProfileTitle>My Profile</ProfileTitle>
        
        {/* Personal Information */}
        <CardContainer>
          <CardHeader>
            <h2><FaUser /> Personal Information</h2>
          </CardHeader>
          <CardBody>
            {profileSuccess && (
              <SuccessMessage>
                Your profile has been updated successfully.
              </SuccessMessage>
            )}
            
            <Formik
              initialValues={profileInitialValues}
              validationSchema={profileValidationSchema}
              onSubmit={handleProfileUpdate}
              enableReinitialize
            >
              {({ isSubmitting }) => (
                <Form>
                  <FormRow cols={2}>
                    <FormGroup>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input type="text" id="firstName" name="firstName" />
                      <ErrorMessage name="firstName" component={ErrorText} />
                    </FormGroup>
                    
                    <FormGroup>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input type="text" id="lastName" name="lastName" />
                      <ErrorMessage name="lastName" component={ErrorText} />
                    </FormGroup>
                  </FormRow>
                  
                  <FormRow cols={2}>
                    <FormGroup>
                      <Label htmlFor="email">Email</Label>
                      <Input type="email" id="email" name="email" />
                      <ErrorMessage name="email" component={ErrorText} />
                    </FormGroup>
                    
                    <FormGroup>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input type="tel" id="phone" name="phone" />
                      <ErrorMessage name="phone" component={ErrorText} />
                    </FormGroup>
                  </FormRow>
                  
                  <SaveButton
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                  >
                    Save Changes
                  </SaveButton>
                </Form>
              )}
            </Formik>
          </CardBody>
        </CardContainer>
        
        {/* Address Information */}
        <CardContainer>
          <CardHeader>
            <h2><FaMapMarkerAlt /> Address Information</h2>
          </CardHeader>
          <CardBody>
            <Formik
              initialValues={profileInitialValues}
              onSubmit={handleProfileUpdate}
              enableReinitialize
            >
              {({ isSubmitting }) => (
                <Form>
                  <FormGroup>
                    <Label htmlFor="address">Address</Label>
                    <Input type="text" id="address" name="address" />
                    <ErrorMessage name="address" component={ErrorText} />
                  </FormGroup>
                  
                  <FormRow cols={2}>
                    <FormGroup>
                      <Label htmlFor="city">City</Label>
                      <Input type="text" id="city" name="city" />
                      <ErrorMessage name="city" component={ErrorText} />
                    </FormGroup>
                    
                    <FormGroup>
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input type="text" id="postalCode" name="postalCode" />
                      <ErrorMessage name="postalCode" component={ErrorText} />
                    </FormGroup>
                  </FormRow>
                  
                  <SaveButton
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                  >
                    Save Changes
                  </SaveButton>
                </Form>
              )}
            </Formik>
          </CardBody>
        </CardContainer>
        
        {/* Change Password */}
        <CardContainer>
          <CardHeader>
            <h2><FaLock /> Change Password</h2>
          </CardHeader>
          <CardBody>
            {passwordSuccess && (
              <SuccessMessage>
                Your password has been changed successfully.
              </SuccessMessage>
            )}
            
            <Formik
              initialValues={passwordInitialValues}
              validationSchema={passwordValidationSchema}
              onSubmit={handlePasswordChange}
            >
              {({ isSubmitting }) => (
                <Form>
                  <FormGroup>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input type="password" id="currentPassword" name="currentPassword" />
                    <ErrorMessage name="currentPassword" component={ErrorText} />
                  </FormGroup>
                  
                  <FormRow cols={2}>
                    <FormGroup>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input type="password" id="newPassword" name="newPassword" />
                      <ErrorMessage name="newPassword" component={ErrorText} />
                    </FormGroup>
                    
                    <FormGroup>
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input type="password" id="confirmPassword" name="confirmPassword" />
                      <ErrorMessage name="confirmPassword" component={ErrorText} />
                    </FormGroup>
                  </FormRow>
                  
                  <SaveButton
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                  >
                    Change Password
                  </SaveButton>
                </Form>
              )}
            </Formik>
          </CardBody>
        </CardContainer>
      </ProfileContainer>
    </MainLayout>
  );
};

export default Profile;
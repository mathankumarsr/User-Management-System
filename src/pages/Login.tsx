import React from 'react';
import { Form, Input, Button, Checkbox, Card, Typography, Alert, Spin } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { loginAsync, clearError } from '../store/slices/authSlice';
import { validateEmail } from '../utlis/validation';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [form] = Form.useForm();

  const handleSubmit = async (values: LoginFormValues) => {
    dispatch(clearError());
    try {
      await dispatch(loginAsync(values)).unwrap();
      navigate('/userList')
    } catch (error: any) {
      console.error(error?.message)
    }
  };

  return (
    <div className="login-container">
      <Card className="login-form">
        <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
          Welcome Back
        </Title>
        
        {error && (
          <Alert
            message={error}
            type="error"
            style={{ marginBottom: 16 }}
            closable
            onClose={() => dispatch(clearError())}
          />
        )}

        <Form
          form={form}
          name="login"
          onFinish={handleSubmit}
          layout="vertical"
          initialValues={{ rememberMe: false }}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { validator: (_, value) => validateEmail(value) ? Promise.resolve() : Promise.reject('Please enter a valid email!') }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Enter your email"
              size="large"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters!' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter your password"
              size="large"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item name="rememberMe" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              block
            >
              {loading ? <Spin size="small" /> : 'Log in'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;

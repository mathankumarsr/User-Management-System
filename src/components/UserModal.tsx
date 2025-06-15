import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, message, Space } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { createUserAsync, updateUserAsync } from '../store/slices/userSlice';
import { User } from '../store/slices/userSlice';
import { validateEmail, validateUrl } from '../utlis/validation';

interface UserModalProps {
  visible: boolean;
  user: User | null;
  onClose: () => void;
}

const UserModal: React.FC<UserModalProps> = ({ visible, user, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.users);
  const [form] = Form.useForm();

  const isEditing = !!user;

  useEffect(() => {
    if (visible) {
      if (user) {
        form.setFieldsValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          avatar: user.avatar,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, user, form]);

  const handleSubmit = async (values: any) => {
    try {
      if (isEditing && user) {
        await dispatch(updateUserAsync({ id: user.id, userData: values })).unwrap();
        message.success('User updated successfully');
      } else {
        await dispatch(createUserAsync(values)).unwrap();
        message.success('User created successfully');
      }
      onClose();
    } catch (error) {
      message.error(isEditing ? 'Failed to update user' : 'Failed to create user');
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={isEditing ? 'Edit User' : 'Create New User'}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose={false}
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="firstName"
          label="First Name"
          rules={[
            { required: true, message: 'Please enter first name' },
            { min: 2, message: 'First name must be at least 2 characters' },
            { max: 50, message: 'First name cannot exceed 50 characters' }
          ]}
        >
          <Input placeholder="Please enter first name" />
        </Form.Item>

        <Form.Item
          name="lastName"
          label="Last Name"
          rules={[
            { required: true, message: 'Please enter last name' },
            { min: 2, message: 'Last name must be at least 2 characters' },
            { max: 50, message: 'Last name cannot exceed 50 characters' }
          ]}
        >
          <Input placeholder="Please enter last name" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter email' },
            { validator: (_, value) => validateEmail(value) ? Promise.resolve() : Promise.reject('Please enter a valid email') }
          ]}
        >
          <Input placeholder="Please enter email" />
        </Form.Item>

        <Form.Item
          name="avatar"
          label="Profile Image Link"
          rules={[
            { required: true, message: 'Please enter profile image link' },
            { validator: (_, value) => validateUrl(value) ? Promise.resolve() : Promise.reject('Please enter a valid URL') }
          ]}
        >
          <Input placeholder="Please enter profile image link" />
        </Form.Item>

        <Form.Item style={{ marginTop: 24, textAlign: 'right' }}>
          <Space>
            <Button onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserModal;
import React from 'react';
import { Table, Avatar, Button, Space, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { deleteUserAsync } from '../store/slices/userSlice';
import { User } from '../store/slices/userSlice';

interface UserTableProps {
  users: User[];
  loading: boolean;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number) => void;
  };
  onEdit: (user: User) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, loading, pagination, onEdit }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteUserAsync(id)).unwrap();
      message.success('User deleted successfully');
    } catch (error) {
      message.error('Failed to delete user');
    }
  };

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 80,
      render: (avatar: string, record: User) => (
        <Avatar src={avatar} size={40}>
          {`${record.firstName[0]}${record.lastName[0]}`}
        </Avatar>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email: string) => <a href={`mailto:${email}`}>{email}</a>,
    },
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Action',
      key: 'action',
      width: 120,
      render: (_: any, record: User) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              danger
              size="small"
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="table-container">
      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        rowKey="id"
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: pagination.onChange,
          showSizeChanger: false,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} users`,
        }}
        scroll={{ x: 800 }}
      />
    </div>
  );
};

export default UserTable;
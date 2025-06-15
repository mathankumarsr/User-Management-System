import React from 'react';
import { Row, Col, Card, Avatar, Button, Space, Popconfirm, Pagination, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { deleteUserAsync, User } from '../store/slices/userSlice';

interface UserCardsProps {
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

const UserCards: React.FC<UserCardsProps> = ({ users, loading, pagination, onEdit }) => {
    const dispatch = useDispatch<AppDispatch>();

    const handleDelete = async (id: string) => {
        try {
            await dispatch(deleteUserAsync(id)).unwrap();
            message.success('User deleted successfully');
        } catch {
            message.error('Failed to delete user');
        }
    };

    return (
        <div>
            <Row gutter={[16, 16]}>
                {users.map((user) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={user.id}>
                        <div className="user-card-wrapper">
                            <Card className="user-card" loading={loading}>
                                <div className="user-card-content">
                                    <Avatar src={user.avatar} size={64} className="user-avatar">
                                        {`${user.firstName[0]}${user.lastName[0]}`}
                                    </Avatar>
                                    <div className="user-name">
                                        {`${user.firstName} ${user.lastName}`}
                                    </div>
                                    <div className="user-email">{user.email}</div>
                                </div>

                                <div className="card-actions-hover">
                                    <Space>
                                        <Button
                                            type="default"
                                            shape="circle"
                                            style={{
                                                width: 48,
                                                height: 48
                                            }}
                                            icon={<EditOutlined style={{ fontSize: '24px' }} />}
                                            onClick={() => onEdit(user)}
                                        />
                                        <Popconfirm
                                            title="Are you sure you want to delete this user?"
                                            onConfirm={() => handleDelete(user.id)}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <Button
                                                type="primary"
                                                danger
                                                style={{
                                                width: 48,
                                                height: 48
                                            }}
                                                shape="circle"
                                                icon={<DeleteOutlined style={{ fontSize: '24px' }} />}
                                            />
                                        </Popconfirm>
                                    </Space>
                                </div>
                            </Card>
                        </div>
                    </Col>
                ))}
            </Row>

            <div style={{ textAlign: 'center', marginTop: 24 }}>
                <Pagination
                    current={pagination.current}
                    pageSize={pagination.pageSize}
                    total={pagination.total}
                    onChange={pagination.onChange}
                    showQuickJumper
                    showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} users`}
                />
            </div>
        </div>
    );
};

export default UserCards;

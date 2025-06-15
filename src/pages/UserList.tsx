import React, { useEffect, useMemo, useState } from 'react';
import { Layout, Typography, Button, Space, Input, Radio, Spin, Alert } from 'antd';
import { SearchOutlined, PlusOutlined, LogoutOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchUsersAsync, setSearchQuery, setCurrentPage } from '../store/slices/userSlice';
import { logoutAsync } from '../store/slices/authSlice';
import UserTable from '../components/UserTable';
import UserCards from '../components/UserCards';
import UserModal from '../components/UserModal';

const { Header, Content } = Layout;
const { Title } = Typography;

type ViewMode = 'table' | 'card';

const UserList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { users, loading, error, currentPage, pageSize, total, searchQuery } = useSelector((state: RootState) => state.users);
  
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchUsersAsync({ page: currentPage, pageSize }));
  }, [dispatch, currentPage, pageSize]);

  const handleSearch = (value: string) => {
    dispatch(setSearchQuery(value));
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const handleLogout = () => {
    dispatch(logoutAsync());
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setModalVisible(true);
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setEditingUser(null);
  };

  const filteredUsers = useMemo(() => {
  if (!searchQuery.trim()) return users;
  return users.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
}, [users, searchQuery]);

  return (
    <Layout>
      <Header className="app-header">
        <div className="logo">User Management System</div>
        <div className="user-info">
          <span>Welcome, {user?.name}</span>
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{ color: 'white', background: 'red' }}
          >
            Logout
          </Button>
        </div>
      </Header>

      <Content className="main-content">
        <div className="page-header">
          <Title level={2}>Users</Title>
          <Space>
            <Input
              placeholder="Search users..."
              prefix={<SearchOutlined />}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 300 }}
              allowClear
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateUser}>
              Create User
            </Button>
          </Space>
        </div>

        <div className="view-toggle">
          <Radio.Group
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            style={{ marginBottom: 16 }}
          >
            <Radio.Button value="table">Table</Radio.Button>
            <Radio.Button value="card">Card</Radio.Button>
          </Radio.Group>
        </div>

        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            style={{ marginBottom: 16 }}
            closable
          />
        )}

        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
          </div>
        ) : (
          <>
            {viewMode === 'table' ? (
              <UserTable
                users={filteredUsers}
                loading={loading}
                pagination={{
                  current: currentPage,
                  pageSize,
                  total,
                  onChange: handlePageChange,
                }}
                onEdit={handleEditUser}
              />
            ) : (
              <UserCards
                users={filteredUsers}
                loading={loading}
                pagination={{
                  current: currentPage,
                  pageSize,
                  total,
                  onChange: handlePageChange,
                }}
                onEdit={handleEditUser}
              />
            )}
          </>
        )}

        <UserModal
          visible={modalVisible}
          user={editingUser}
          onClose={handleModalClose}
        />
      </Content>
    </Layout>
  );
};

export default UserList;

import axios from "axios";

const API_BASE_URL = 'https://reqres.in/api';

const getHeader = () => {
  const token = localStorage.getItem('authToken');
  return {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
          'x-api-key': 'reqres-free-v1',
        }
      : {
          'x-api-key': 'reqres-free-v1',
        },
  };
};

export const authAPI = {
    login: async (credentials: { email: string; password: string; rememberMe: boolean }) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/login`, {
                email: credentials.email,
                password: credentials.password,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'reqres-free-v1'
                },
            });

            return {
                token: response.data.token || 'mock-jwt-token',
                user: {
                    id: '1',
                    email: credentials.email,
                    name: 'Elon Musk',
                },
            };
        } catch (error: any) {
            if (error.response?.status === 400) {
                throw new Error('Invalid email or password');
            }
            throw new Error('Login failed. Please try again.');
        }
    },

    logout: async () => {
        return Promise.resolve();
    },
};
export const userAPI = {
    getUsers: async (
        params: { page: number; pageSize: number; search?: string },
    ) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/users`, {
                params: {
                    page: params.page,
                    per_page: params.pageSize,
                },
                ...getHeader()
            });

            const transformedData = response.data.data.map((user: any) => ({
                id: user.id.toString(),
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                avatar: user.avatar,
            }));

            return {
                data: transformedData,
                total: response.data.total,
                page: response.data.page,
                totalPages: response.data.total_pages,
            };
        } catch (error: any) {
            throw new Error('Failed to fetch users');
        }
    },

    createUser: async (
        userData: { firstName: string; lastName: string; email: string; avatar: string },
    ) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/users`,
                {
                    first_name: userData.firstName,
                    last_name: userData.lastName,
                    email: userData.email,
                    avatar: userData.avatar,
                },
                {...getHeader()}
            );

            return {
                id: response.data.id || Date.now().toString(),
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                avatar: userData.avatar,
            };
        } catch (error: any) {
            throw new Error('Failed to create user');
        }
    },

    updateUser: async (
        id: string,
        userData: Partial<{ firstName: string; lastName: string; email: string; avatar: string }>,
    ) => {
        try {
            await axios.put(
                `${API_BASE_URL}/users/${id}`,
                {
                    first_name: userData.firstName,
                    last_name: userData.lastName,
                    email: userData.email,
                    avatar: userData.avatar,
                },
                {...getHeader()}
            );

            return {
                id,
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                email: userData.email || '',
                avatar: userData.avatar || '',
            };
        } catch (error: any) {
            throw new Error('Failed to update user');
        }
    },

    deleteUser: async (id: string) => {
        try {
            await axios.delete(`${API_BASE_URL}/users/${id}`, {...getHeader()});
            return id;
        } catch (error: any) {
            throw new Error('Failed to delete user');
        }
    },
};

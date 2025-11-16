import api from '../services/apiInterceptor';
import { toast } from 'react-toastify';

/**
 * Logs in a user, stores the token and user info in localStorage.
 * @param {string} username
 * @param {string} password
 * @returns {Promise<object>}
 */
export const loginUser = async (username, password) => {
  try {
    const response = await api.post('Auth/login', {
      userName: username,
      password: password,
    });

    if (response.data && response.data.token) {
      const { token, UserRole, UserFullName, ...userData } = response.data;

      // 1️⃣ Save token
      localStorage.setItem('token', token);

      // 2️⃣ Save full user object
      localStorage.setItem('user', JSON.stringify({ ...userData, UserRole, UserFullName }));

      // 3️⃣ Save individual items for easy access
      localStorage.setItem('userRole', UserRole);
      if (UserFullName) localStorage.setItem('userFullName', UserFullName);

      // 4️⃣ Notify other parts of the app (like Header.jsx)
      window.dispatchEvent(new Event('storage'));

      toast.success('Login Successful!');
      return response.data;
    }

  } catch (error) {
    const errorMsg = error.response?.data?.message || 'Invalid credentials or server error.';
    toast.error('Login Failed! ' + errorMsg);
    throw error;
  }
};

/**
 * Logs out user and clears localStorage
 */
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userFullName');
  window.dispatchEvent(new Event('storage'));
  toast.info('Logged out successfully.');
};

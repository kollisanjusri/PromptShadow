const DEMO_CREDENTIALS = {
  'test1': { password: 'test@123', role: 'Employee', name: 'Test User 1', department: 'Engineering' },
  'test2': { password: 'test@123', role: 'Employee', name: 'Test User 2', department: 'Marketing' },
  'test3': { password: 'test@123', role: 'Employee', name: 'Test User 3', department: 'Operations' },
  'admin': { password: 'admin@123', role: 'Admin', name: 'Admin Account', department: 'Security' },
};

export const login = async (username, password, selectedRole) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = DEMO_CREDENTIALS[username];
      if (!user) {
        return reject(new Error('Invalid username or password.'));
      }
      if (user.password !== password) {
        return reject(new Error('Invalid username or password.'));
      }
      if (user.role !== selectedRole) {
        return reject(new Error(`Role mismatch. This account cannot sign in as ${selectedRole}.`));
      }

      const userData = { id: username, username, role: user.role, name: user.name, department: user.department };
      sessionStorage.setItem('promptshadow_session', JSON.stringify(userData));
      resolve(userData);
    }, 500);
  });
};

export const logout = () => {
  sessionStorage.removeItem('promptshadow_session');
};

export const getCurrentUser = () => {
  const data = sessionStorage.getItem('promptshadow_session');
  return data ? JSON.parse(data) : null;
};

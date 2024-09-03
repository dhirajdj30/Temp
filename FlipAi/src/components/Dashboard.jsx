import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const { user, setUser } = useContext(AuthContext);

  const handleLogout = async () => {
    await axios.post('http://localhost:5000/api/users/logout', {}, { withCredentials: true });
    setUser(null);
  };

  return (
    <div className="max-w-md mx-auto my-10 p-4 shadow-lg rounded-lg">
      <h2 className="text-2xl mb-6 text-center">Dashboard</h2>
      {user ? (
        <>
          <p className="text-center mb-4">Welcome, {user.phone}</p>
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-2 rounded"
          >
            Logout
          </button>
        </>
      ) : (
        <p className="text-center">You are not logged in.</p>
      )}
    </div>
  );
};

export default Dashboard;

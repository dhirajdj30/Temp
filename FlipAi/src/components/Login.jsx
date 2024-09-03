import React, { useState, useContext } from 'react';
import mongoose from 'mongoose'; // For MongoDB operations
import bcrypt from 'bcryptjs'; // For password comparison
import jwt from 'jsonwebtoken'; // NEW: Import JWT for token generation
import AuthContext from '../context/AuthContext';

const userSchema = new mongoose.Schema({
  phone: String,
  password: String,
}, { collection: 'UserData' });

const User = mongoose.model('User', userSchema);

const Login = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(AuthContext);

  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => console.log('MongoDB connected')).catch(err => console.error('MongoDB connection error:', err));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await User.findOne({ phone });
      if (!user) {
        return alert('Invalid credentials');
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return alert('Invalid credentials');
      }

      // NEW: Generate JWT token upon successful login
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // NEW: Save the token in localStorage
      localStorage.setItem('token', token);

      setUser(phone);
      alert('Login successful!');
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto my-10 p-4 shadow-lg rounded-lg">
      <h2 className="text-2xl mb-6 text-center">Login</h2>
      <input
        type="text"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Login</button>
    </form>
  );
};

export default Login;

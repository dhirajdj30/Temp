import React, { useState } from 'react';
import mongoose from 'mongoose'; // For MongoDB operations
import bcrypt from 'bcryptjs'; // For password hashing
import jwt from 'jsonwebtoken'; // NEW: Import JWT for token generation

const userSchema = new mongoose.Schema({
  phone: String,
  password: String,
}, { collection: 'UserData' });

const User = mongoose.model('User', userSchema);

const Register = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => console.log('MongoDB connected')).catch(err => console.error('MongoDB connection error:', err));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ phone, password: hashedPassword });
      await newUser.save();

      // NEW: Generate JWT token upon successful registration
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // NEW: Save the token in localStorage
      localStorage.setItem('token', token);

      alert('Registration successful!');
    } catch (error) {
      console.error('Registration failed', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto my-10 p-4 shadow-lg rounded-lg">
      <h2 className="text-2xl mb-6 text-center">Register</h2>
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
      <button type="submit" className="w-full bg-green-500 text-white py-2 rounded">Register</button>
    </form>
  );
};

export default Register;

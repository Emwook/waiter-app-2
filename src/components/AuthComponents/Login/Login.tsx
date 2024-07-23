// src/components/Login.tsx

import React, { useState } from "react";
import { login } from "../../../config/auth";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { signIn } from "../../../store/reducers/userReducer";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      console.log('logged with email: ', email);
      const userData = {
        email: email,
        id: '123',
      }
      dispatch(signIn(userData) as any)
      navigate('/');
    } catch (error) {
      console.error("Error logging in", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;

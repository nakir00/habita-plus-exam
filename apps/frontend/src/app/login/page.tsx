'use client'
import { useState } from 'react';
import { trpc } from '../../utils/trpc';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {

  
  return (
    <div style={{ padding: 20 }}>
      <h1>Login</h1>
      <LoginForm />
    </div>
  );
}

'use client'
// components/LoginForm.tsx
import { useState } from 'react';
import { trpc, authUtils } from '../../utils/trpc';
import { useRouter } from 'next/router';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const router = useRouter();
  
  // Mutation de login
  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      // Sauvegarder le token dans localStorage
      authUtils.setToken(data.token);
      
      // Rediriger vers la page protégée
      // router.push('/dashboard');
    },
    onError: (error) => {
      console.error('Login error:', error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      <button 
        type="submit" 
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? 'Connexion...' : 'Se connecter'}
      </button>
      
      {loginMutation.error && (
        <p style={{ color: 'red' }}>
          Erreur: {loginMutation.error.message}
        </p>
      )}
      {loginMutation.isSuccess &&loginMutation.data?.user.name}
    </form>
  );
}
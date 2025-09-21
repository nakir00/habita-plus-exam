'use client'
import { useState } from 'react';
import { trpc } from '../../utils/trpc';
import { Button } from '@/components/ui/button';

export default function RegisterPage() {
  const register = trpc.auth.register.useMutation();
  const [form, setForm] = useState({ email: '', password: '', name: '', age: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register.mutate({
      email: form.email,
      password: form.password,
      name: form.name,
      age: form.age ? Number(form.age) : undefined,
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Age"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
        />
        <Button type="submit" disabled={register.isPending}>Register</Button>
      </form>

      {register.isError && <p style={{ color: 'red' }}>{register.error.message}</p>}
      {register.isSuccess && <p>User created: {register.data.user.email}</p>}
    </div>
  );
}

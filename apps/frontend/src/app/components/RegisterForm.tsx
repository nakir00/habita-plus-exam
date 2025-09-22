'use client';

import { useState } from 'react';
import { trpc } from '../../utils/trpc';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterForm() {
  const router = useRouter();
  const register = trpc.auth.register.useMutation({
    onSuccess: () => {
      router.push('/login'); 
    },
  });

  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    age: '',
  });

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
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4 w-100" style={{ maxWidth: '500px' }}>
        <h2 className="mb-4 text-center text-primary">Créer un compte</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Nom</label>
            <input
              id="name"
              type="text"
              className="form-control"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="age" className="form-label">Âge</label>
            <input
              id="age"
              type="number"
              className="form-control"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Adresse email</label>
            <input
              id="email"
              type="email"
              className="form-control"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label">Mot de passe</label>
            <input
              id="password"
              type="password"
              className="form-control"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={register.isPending}
          >
            {register.isPending ? 'Création...' : 'S’inscrire'}
          </button>
        </form>

        
        {register.isError && (
          <div className="alert alert-danger mt-3">{register.error.message}</div>
        )}
        {register.isSuccess && (
          <div className="alert alert-success mt-3">
            Utilisateur créé ! Redirection...
          </div>
        )}

      
        <p className="mt-4 text-center">
          Déjà inscrit ?{' '}
          <Link href="/login" className="text-primary fw-bold">
            Connectez-vous ici
          </Link>
        </p>
      </div>
    </div>
  );
}


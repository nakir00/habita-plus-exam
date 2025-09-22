'use client';

import { useState } from "react";
import { trpc, authUtils } from "../../utils/trpc";
import { useRouter } from "next/navigation";
import Link from "next/link";
import '../styles/login.css'
export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      authUtils.setToken(data.token);
      router.push("/dashboard");
    },
    onError: (error) => {
      console.error("Login error:", error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4 w-100" style={{ maxWidth: '500px' }}>
        <h2 className="mb-4 text-center text-primary">Connexion</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Adresse email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Entrez votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label">Mot de passe</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Entrez votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        
        {loginMutation.error && (
          <div className="alert alert-danger mt-3">{loginMutation.error.message}</div>
        )}
        {loginMutation.isSuccess && (
          <div className="alert alert-success mt-3">
            Bienvenue, {loginMutation.data?.user.name} !
          </div>
        )}

       
        <p className="mt-4 text-center">
          Pas encore de compte ?{" "}
          <Link href="/register" className="text-primary fw-bold">
            Inscrivez-vous ici
          </Link>
        </p>
      </div>
    </div>
  );
}

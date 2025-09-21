"use client";

import Image from "next/image";

import { trpc } from "../utils/trpc";
import type { User } from '@habita-plus-exam/prisma-types';

function Profile({ user }: { user: User }) {
  return <div>{user.name} - {user.email}</div>;
}


export default function Home() {
  const helloQuery = trpc.hello.useQuery({name:"naby"});
  const userListQuery = trpc.protected.users.useQuery()
  return (
    <main className="p-6">
      <h1 className="text-xl font-bold">Frontend avec tRPC 🚀</h1>

      <div className="mt-4">
        {helloQuery.isLoading ? (
          <p>Chargement...</p>
        ) : (
          <p>{helloQuery.data?.message}</p>
        )}
      </div>

      <div className="mt-6">
        <h2 className="font-semibold">Utilisateurs :</h2>
        {userListQuery.isLoading && <p>Chargement...</p>}
        {userListQuery.data?.users.map((u) => (
          <p key={u.id}>{u.name} — {u.email}</p>
        ))}
        {userListQuery.status === 'error'?"vous n'etes pas connecté":''}
      </div>
    </main>
  );
}

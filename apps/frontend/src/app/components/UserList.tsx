// components/UserList.tsx - Utilisation des requêtes protégées
import { trpc } from '../../utils/trpc';

export default function UserList() {
  // Le Bearer Token sera automatiquement inclus dans les headers
  const userListQuery = trpc.protected.users.useQuery();

  if (userListQuery.isLoading) return <div>Chargement...</div>;
  
  if (userListQuery.error) {
    // Gestion spécifique des erreurs d'authentification
    if (userListQuery.error.data?.code === 'UNAUTHORIZED') {
      return (
        <div>
          <p>Vous devez être connecté pour voir cette page.</p>
          <a href="/login">Se connecter</a>
        </div>
      );
    }
    
    return <div>Erreur: {userListQuery.error.message}</div>;
  }

  return (
    <div>
      <h2>Liste des utilisateurs</h2>
      {userListQuery.data?.users.map(user => (
        <div key={user.id}>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
}
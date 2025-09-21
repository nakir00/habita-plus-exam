import { authUtils } from '../../utils/trpc';
import { useRouter } from 'next/router';

export default function LogoutButton() {
  const router = useRouter();
  
  const handleLogout = () => {
    // Supprimer le token
    authUtils.clearToken();
    
    // Rediriger vers la page de login
    router.push('/login');
  };

  // N'afficher le bouton que si l'utilisateur est connecté
  if (!authUtils.isAuthenticated()) {
    return null;
  }

  return (
    <button onClick={handleLogout}>
      Se déconnecter
    </button>
  );
}
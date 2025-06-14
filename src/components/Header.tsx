import { Bell, User, LogOut, LogIn, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "sonner";

const Header = () => {
  const { user, profile, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error(`Erreur de déconnexion: ${error.message}`);
    } else {
      toast.success("Déconnexion réussie.");
      navigate('/auth');
    }
  };

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    const first = firstName?.[0]?.toUpperCase() || '';
    const last = lastName?.[0]?.toUpperCase() || '';
    return `${first}${last}` || '??';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm shadow-sm">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold">
              <span className="text-easyweb-gray">Easy</span>
              <span className="text-easyweb-red">Web</span>
              <span className="text-xs text-easyweb-gray">™</span>
            </div>
          </Link>
          {user && (
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
              <Link
                to="/"
                className="text-easyweb-red border-b-2 border-easyweb-red pb-2"
              >
                Tableau de bord
              </Link>
              <a
                href="#" // Remplacer par de vrais liens si nécessaire
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Automatisations
              </a>
              <a
                href="#" // Remplacer par de vrais liens si nécessaire
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Reporting
              </a>
            </nav>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {user && (
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-easyweb-red rounded-full"></span>
            </Button>
          )}
          
          {authLoading ? (
            <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
          ) : user && profile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 p-1 rounded-full">
                  <Avatar className="h-8 w-8">
                    {profile.avatar_url && <AvatarImage src={profile.avatar_url} alt={`${profile.first_name} ${profile.last_name}`} />}
                    <AvatarFallback>{getInitials(profile.first_name, profile.last_name)}</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline-block text-sm font-medium">
                    {profile.first_name || 'Utilisateur'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white z-[100]">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profil (Bientôt)
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Paramètres
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild className="bg-easyweb-red hover:bg-easyweb-red/90 text-white">
              <Link to="/auth">
                <LogIn className="mr-2 h-4 w-4" /> Se connecter
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

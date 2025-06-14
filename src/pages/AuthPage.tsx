
import React, { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const AuthPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const { signIn, signUp, error: authError, loading } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    const { error } = await signIn({ email, password });
    if (error) {
      toast.error(`Erreur de connexion: ${error.message}`);
    } else {
      toast.success("Connexion réussie !");
      navigate('/');
    }
  };

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    const { error } = await signUp({ 
      email, 
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        }
      }
    });
    if (error) {
      // Amélioration de la gestion d'erreur pour les limites de taux
      if (error.message.includes('email_send_rate_limit') || error.message.includes('security purposes')) {
        toast.error("Trop de tentatives d'inscription. Veuillez attendre 58 secondes avant de réessayer.");
      } else if (error.message.includes('User already registered')) {
        toast.error("Un compte existe déjà avec cet email. Essayez de vous connecter à la place.");
      } else {
        toast.error(`Erreur d'inscription: ${error.message}`);
      }
    } else {
      toast.success("Inscription réussie ! Veuillez vérifier vos e-mails pour confirmer votre compte.");
      // Optionnel: rediriger ou afficher un message spécifique après inscription
      // Pour l'instant, on reste sur la page pour que l'utilisateur voie le toast.
      // navigate('/'); // Ou vers une page "vérifiez vos emails"
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Tabs defaultValue="signin" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Se connecter</TabsTrigger>
          <TabsTrigger value="signup">S'inscrire</TabsTrigger>
        </TabsList>
        <TabsContent value="signin">
          <Card>
            <CardHeader>
              <CardTitle>Connexion</CardTitle>
              <CardDescription>Accédez à votre tableau de bord EasyWeb.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSignIn}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-signin">Email</Label>
                  <Input 
                    id="email-signin" 
                    type="email" 
                    placeholder="sophie@example.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-signin">Mot de passe</Label>
                  <Input 
                    id="password-signin" 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-stretch">
                <Button type="submit" disabled={loading} className="w-full bg-easyweb-red hover:bg-easyweb-red/90 text-white">
                  {loading ? 'Chargement...' : 'Se connecter'}
                </Button>
                {authError && <p className="mt-2 text-sm text-red-600">{authError.message}</p>}
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Inscription</CardTitle>
              <CardDescription>Créez votre compte EasyWeb.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSignUp}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName-signup">Prénom</Label>
                  <Input 
                    id="firstName-signup" 
                    type="text" 
                    placeholder="Sophie" 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName-signup">Nom</Label>
                  <Input 
                    id="lastName-signup" 
                    type="text" 
                    placeholder="Dubois" 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-signup">Email</Label>
                  <Input 
                    id="email-signup" 
                    type="email" 
                    placeholder="sophie@example.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-signup">Mot de passe</Label>
                  <Input 
                    id="password-signup" 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-stretch">
                <Button type="submit" disabled={loading} className="w-full bg-easyweb-red hover:bg-easyweb-red/90 text-white">
                  {loading ? 'Chargement...' : "S'inscrire"}
                </Button>
                {authError && <p className="mt-2 text-sm text-red-600">{authError.message}</p>}
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
       <p className="mt-4 text-center text-sm text-gray-600">
        <Link to="/" className="font-medium text-easyweb-red hover:text-easyweb-red/80">
          Retour à l'accueil
        </Link>
      </p>
    </div>
  );
};

export default AuthPage;

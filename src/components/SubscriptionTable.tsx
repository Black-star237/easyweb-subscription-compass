import { useState } from 'react';
import { Search, Filter, Download, Plus, ExternalLink, MessageCircle, Settings, Edit, Trash2, Link as LinkIcon, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { FilterOptions, Subscription } from '@/types/subscription';
import AddSubscriptionDialog from './AddSubscriptionDialog';
import EditSubscriptionDialog from './EditSubscriptionDialog';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formatDaysRemaining } from '@/utils/dateUtils';

const SubscriptionTable = () => {
  const { subscriptions, loading, error, refetch } = useSubscriptions();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editSubscription, setEditSubscription] = useState<Subscription | null>(null);
  const [deleteSubscription, setDeleteSubscription] = useState<Subscription | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    paymentStatus: 'all',
    sortBy: 'daysRemaining',
    sortOrder: 'asc',
    showOnlyDueSoon: false
  });

  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="status-badge status-paid">Payé</Badge>;
      case 'pending':
        return <Badge className="status-badge status-pending">En attente</Badge>;
      case 'overdue':
        return <Badge className="status-badge status-overdue">En retard</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getDaysRemainingStyle = (days: number) => {
    if (days > 7) return 'days-remaining-good';
    if (days >= 3) return 'days-remaining-warning';
    return 'days-remaining-critical';
  };

  const filteredSubscriptions = subscriptions.filter(subscription => {
    const matchesSearch = subscription.companyName.toLowerCase().includes(filters.search.toLowerCase()) ||
                         subscription.clientName.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStatus = filters.paymentStatus === 'all' || subscription.paymentStatus === filters.paymentStatus;
    const matchesDueSoon = !filters.showOnlyDueSoon || subscription.daysRemaining <= 7;
    return matchesSearch && matchesStatus && matchesDueSoon;
  });

  const openWhatsApp = (number: string, companyName: string) => {
    const message = encodeURIComponent(`Bonjour, concernant l'abonnement de ${companyName}...`);
    window.open(`https://wa.me/${number.replace(/\s+/g, '')}?text=${message}`, '_blank');
  };

  const handleLogoUpload = async (subscriptionId: string, file: File) => {
    try {
      setUploadingLogo(subscriptionId);
      
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${subscriptionId}_${Date.now()}.${fileExt}`;
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('subscription-logos')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('subscription-logos')
        .getPublicUrl(fileName);

      // Update subscription record with logo URL
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({ logo: publicUrl })
        .eq('id', subscriptionId);

      if (updateError) {
        throw updateError;
      }

      toast({ 
        title: "Logo mis à jour", 
        description: "Le logo a été téléchargé avec succès.", 
        variant: "default" 
      });
      
      refetch();
    } catch (error) {
      console.error('Erreur lors du téléchargement du logo:', error);
      toast({ 
        title: "Erreur", 
        description: "Impossible de télécharger le logo.", 
        variant: "destructive" 
      });
    } finally {
      setUploadingLogo(null);
    }
  };

  const handleSubscriptionAdded = () => {
    refetch();
  };

  const handleSubscriptionUpdated = () => {
    setEditSubscription(null);
    refetch();
    toast({ title: "Modifié", description: "L'abonnement a été mis à jour avec succès.", variant: "default" });
  };

  const handleDelete = async () => {
    if (!deleteSubscription) return;
    setDeleting(true);
    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', deleteSubscription.id);
    setDeleting(false);
    setDeleteSubscription(null);
    if (!error) {
      toast({ title: "Supprimé", description: "L'abonnement a été supprimé.", variant: "default" });
      refetch();
    } else {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    }
  };

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            Erreur lors du chargement des données: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-xl font-semibold">
              Gestionnaire d'abonnements
            </CardTitle>
            <Button 
              className="bg-easyweb-red hover:bg-easyweb-red/90"
              onClick={() => setShowAddDialog(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un abonnement
            </Button>
          </div>
          <p className="text-muted-foreground">
            Gérez et suivez tous vos abonnements clients en un seul endroit
          </p>
        </CardHeader>

        <CardContent>
          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Rechercher par nom, entreprise ou numéro..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select value={filters.paymentStatus} onValueChange={(value: any) => setFilters(prev => ({ ...prev, paymentStatus: value }))}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="paid">Payé</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="overdue">En retard</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="dueSoon"
                  checked={filters.showOnlyDueSoon}
                  onCheckedChange={(checked) => setFilters(prev => ({ ...prev, showOnlyDueSoon: !!checked }))}
                />
                <label htmlFor="dueSoon" className="text-sm font-medium">
                  Bientôt dus
                </label>
              </div>

              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-easyweb-red"></div>
            </div>
          )}

          {/* Table */}
          {!loading && (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[60px]">Logo</TableHead>
                    <TableHead>Entreprise</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Liens</TableHead>
                    <TableHead>Échéance</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscriptions.map((subscription) => (
                    <TableRow key={subscription.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <div className="relative group">
                          <Avatar className="h-10 w-10">
                            {subscription.logo ? (
                              <AvatarImage src={subscription.logo} alt={subscription.companyName} />
                            ) : null}
                            <AvatarFallback className="bg-gradient-to-br from-easyweb-red to-easyweb-orange text-white font-semibold">
                              {subscription.companyName.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
                            <label className="cursor-pointer">
                              <Upload className="w-4 h-4 text-white" />
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                disabled={uploadingLogo === subscription.id}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleLogoUpload(subscription.id, file);
                                  }
                                }}
                              />
                            </label>
                          </div>
                          {uploadingLogo === subscription.id && (
                            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="font-medium">{subscription.companyName}</div>
                        <div className="text-sm text-muted-foreground">{subscription.clientName}</div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="font-medium">{subscription.clientName}</div>
                      </TableCell>
                      
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openWhatsApp(subscription.whatsappNumber, subscription.companyName)}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          WhatsApp
                        </Button>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <a
                            href={subscription.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Site
                          </a>
                          <a
                            href={subscription.adminUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-purple-600 hover:text-purple-700"
                          >
                            <Settings className="w-3 h-3 mr-1" />
                            Admin
                          </a>
                          {subscription.notionUrl && (
                            <a
                              href={subscription.notionUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-sm text-gray-700 hover:text-gray-900"
                            >
                              <LinkIcon className="w-3 h-3 mr-1" />
                              Notion
                            </a>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className={`text-sm ${getDaysRemainingStyle(subscription.daysRemaining)}`}>
                          {formatDaysRemaining(subscription.daysRemaining)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(subscription.nextPaymentDate).toLocaleDateString('fr-FR')}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        {getStatusBadge(subscription.paymentStatus)}
                      </TableCell>
                      
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditSubscription(subscription)}
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-easyweb-red hover:text-easyweb-red/80"
                            onClick={() => setDeleteSubscription(subscription)}
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {!loading && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-muted-foreground">
                Affichage de 1 à {filteredSubscriptions.length} sur {filteredSubscriptions.length} résultats
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-easyweb-red text-white hover:bg-easyweb-red/90"
                >
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  Suivant
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AddSubscriptionDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSubscriptionAdded={handleSubscriptionAdded}
      />

      <EditSubscriptionDialog
        subscription={editSubscription}
        open={!!editSubscription}
        onOpenChange={open => { if (!open) setEditSubscription(null); }}
        onSubscriptionUpdated={handleSubscriptionUpdated}
      />

      <ConfirmDeleteDialog
        open={!!deleteSubscription}
        onCancel={() => setDeleteSubscription(null)}
        onConfirm={handleDelete}
        loading={deleting}
        subscription={deleteSubscription}
      />
    </>
  );
};

export default SubscriptionTable;

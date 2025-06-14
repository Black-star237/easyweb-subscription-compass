
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { FilterOptions, Subscription } from '@/types/subscription';
import AddSubscriptionDialog from './AddSubscriptionDialog';
import EditSubscriptionDialog from './EditSubscriptionDialog';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import SubscriptionFilters from './SubscriptionFilters';
import SubscriptionTableHeader from './SubscriptionTableHeader';
import SubscriptionTableRow from './SubscriptionTableRow';
import SubscriptionTablePagination from './SubscriptionTablePagination';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

  const filteredSubscriptions = subscriptions.filter(subscription => {
    const matchesSearch = subscription.companyName.toLowerCase().includes(filters.search.toLowerCase()) ||
                         subscription.clientName.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStatus = filters.paymentStatus === 'all' || subscription.paymentStatus === filters.paymentStatus;
    const matchesDueSoon = !filters.showOnlyDueSoon || subscription.daysRemaining <= 7;
    return matchesSearch && matchesStatus && matchesDueSoon;
  });

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
    console.log('Mise à jour déclenchée pour recalculer les champs automatiques');
    setEditSubscription(null);
    refetch();
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
        <SubscriptionTableHeader onAddSubscription={() => setShowAddDialog(true)} />

        <CardContent>
          <SubscriptionFilters filters={filters} onFiltersChange={setFilters} />

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
                    <SubscriptionTableRow
                      key={subscription.id}
                      subscription={subscription}
                      uploadingLogo={uploadingLogo}
                      onLogoUpload={handleLogoUpload}
                      onEdit={setEditSubscription}
                      onDelete={setDeleteSubscription}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {!loading && (
            <SubscriptionTablePagination
              totalResults={filteredSubscriptions.length}
              currentResults={filteredSubscriptions.length}
            />
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

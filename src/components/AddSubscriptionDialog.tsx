
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AddSubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubscriptionAdded: () => void;
}

const AddSubscriptionDialog: React.FC<AddSubscriptionDialogProps> = ({
  open,
  onOpenChange,
  onSubscriptionAdded
}) => {
  const [formData, setFormData] = useState({
    companyName: '',
    clientName: '',
    whatsappNumber: '',
    websiteUrl: '',
    adminUrl: '',
    notionUrl: '',
    daysRemaining: '',
    paymentStatus: 'pending' as 'paid' | 'pending' | 'overdue',
    nextPaymentDate: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      companyName: '',
      clientName: '',
      whatsappNumber: '',
      websiteUrl: '',
      adminUrl: '',
      notionUrl: '',
      daysRemaining: '',
      paymentStatus: 'pending',
      nextPaymentDate: '',
      notes: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('subscriptions')
        .insert({
          company_name: formData.companyName,
          client_name: formData.clientName,
          whatsapp_number: formData.whatsappNumber,
          website_url: formData.websiteUrl,
          admin_url: formData.adminUrl,
          notion_url: formData.notionUrl || null,
          days_remaining: parseInt(formData.daysRemaining) || 0,
          payment_status: formData.paymentStatus,
          next_payment_date: formData.nextPaymentDate,
          notes: formData.notes || null
        });

      if (error) {
        throw error;
      }

      toast.success('Abonnement ajouté avec succès !');
      resetForm();
      onOpenChange(false);
      onSubscriptionAdded();
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      toast.error('Erreur lors de l\'ajout de l\'abonnement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un nouvel abonnement</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour créer un nouvel abonnement client.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Nom de l'entreprise *</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                placeholder="Ex: Mon Entreprise SARL"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientName">Nom du client *</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => handleInputChange('clientName', e.target.value)}
                placeholder="Ex: Jean Dupont"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="whatsappNumber">Numéro WhatsApp *</Label>
              <Input
                id="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                placeholder="Ex: +33 6 12 34 56 78"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="daysRemaining">Jours restants *</Label>
              <Input
                id="daysRemaining"
                type="number"
                value={formData.daysRemaining}
                onChange={(e) => handleInputChange('daysRemaining', e.target.value)}
                placeholder="Ex: 30"
                min="0"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="websiteUrl">URL du site web *</Label>
            <Input
              id="websiteUrl"
              type="url"
              value={formData.websiteUrl}
              onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
              placeholder="https://www.exemple.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="adminUrl">URL d'administration *</Label>
            <Input
              id="adminUrl"
              type="url"
              value={formData.adminUrl}
              onChange={(e) => handleInputChange('adminUrl', e.target.value)}
              placeholder="https://admin.exemple.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notionUrl">URL Notion (optionnel)</Label>
            <Input
              id="notionUrl"
              type="url"
              value={formData.notionUrl}
              onChange={(e) => handleInputChange('notionUrl', e.target.value)}
              placeholder="https://notion.so/..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="paymentStatus">Statut de paiement</Label>
              <Select
                value={formData.paymentStatus}
                onValueChange={(value: 'paid' | 'pending' | 'overdue') => 
                  handleInputChange('paymentStatus', value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Payé</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="overdue">En retard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nextPaymentDate">Prochaine échéance *</Label>
              <Input
                id="nextPaymentDate"
                type="date"
                value={formData.nextPaymentDate}
                onChange={(e) => handleInputChange('nextPaymentDate', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optionnel)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Informations supplémentaires..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              className="bg-easyweb-red hover:bg-easyweb-red/90"
              disabled={loading}
            >
              {loading ? 'Ajout en cours...' : 'Ajouter l\'abonnement'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSubscriptionDialog;

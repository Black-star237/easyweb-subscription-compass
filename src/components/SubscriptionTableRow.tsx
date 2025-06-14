
import React from 'react';
import { ExternalLink, MessageCircle, Settings, Edit, Trash2, Link as LinkIcon, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Subscription } from '@/types/subscription';
import { formatDaysRemaining } from '@/utils/dateUtils';

interface SubscriptionTableRowProps {
  subscription: Subscription;
  uploadingLogo: string | null;
  onLogoUpload: (subscriptionId: string, file: File) => void;
  onEdit: (subscription: Subscription) => void;
  onDelete: (subscription: Subscription) => void;
}

const SubscriptionTableRow: React.FC<SubscriptionTableRowProps> = ({
  subscription,
  uploadingLogo,
  onLogoUpload,
  onEdit,
  onDelete
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="status-badge status-paid">Actif</Badge>;
      case 'pending':
        return <Badge className="status-badge status-pending">Dû aujourd'hui</Badge>;
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

  const openWhatsApp = (number: string, companyName: string) => {
    const message = encodeURIComponent(`Bonjour, concernant l'abonnement de ${companyName}...`);
    window.open(`https://wa.me/${number.replace(/\s+/g, '')}?text=${message}`, '_blank');
  };

  return (
    <TableRow className="hover:bg-muted/30 transition-colors">
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
                    onLogoUpload(subscription.id, file);
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
            onClick={() => onEdit(subscription)}
            title="Modifier"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-easyweb-red hover:text-easyweb-red/80"
            onClick={() => onDelete(subscription)}
            title="Supprimer"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default SubscriptionTableRow;

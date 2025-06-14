
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Subscription } from "@/types/subscription";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EditSubscriptionDialogProps {
  subscription: Subscription | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubscriptionUpdated: () => void;
}

const EditSubscriptionDialog: React.FC<EditSubscriptionDialogProps> = ({ subscription, open, onOpenChange, onSubscriptionUpdated }) => {
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<Partial<Subscription>>({
    defaultValues: subscription || {},
  });

  React.useEffect(() => {
    reset(subscription || {});
  }, [subscription, reset]);

  const onSubmit = async (values: Partial<Subscription>) => {
    if (!subscription) return;
    const { error } = await supabase
      .from("subscriptions")
      .update({
        company_name: values.companyName,
        client_name: values.clientName,
        whatsapp_number: values.whatsappNumber,
        website_url: values.websiteUrl,
        admin_url: values.adminUrl,
        notion_url: values.notionUrl,
        days_remaining: values.daysRemaining,
        payment_status: values.paymentStatus,
        next_payment_date: values.nextPaymentDate,
        notes: values.notes,
      })
      .eq("id", subscription.id);
    if (!error) {
      onSubscriptionUpdated();
      onOpenChange(false);
    } else {
      toast({ title: "Erreur de modification", description: error.message, variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier l’abonnement</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <Input {...register("companyName")} placeholder="Entreprise" required autoFocus />
          <Input {...register("clientName")} placeholder="Client" required />
          <Input {...register("whatsappNumber")} placeholder="Numéro WhatsApp" required />
          <Input {...register("websiteUrl")} placeholder="URL du site" required />
          <Input {...register("adminUrl")} placeholder="URL admin" required />
          <Input {...register("notionUrl")} placeholder="Lien Notion" />
          <Input {...register("daysRemaining", { valueAsNumber: true })} type="number" placeholder="Jours restants" required />
          <Input {...register("nextPaymentDate")} type="date" placeholder="Prochaine échéance" required />
          <Input {...register("paymentStatus")} placeholder="Statut (paid|pending|overdue)" required />
          <Input {...register("notes")} placeholder="Notes" />
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              Enregistrer
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Annuler
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSubscriptionDialog;

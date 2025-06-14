
import { Subscription } from '@/types/subscription';

export const mockSubscriptions: Subscription[] = [
  {
    id: '1',
    companyName: 'Bistrot Terroir',
    clientName: 'Martin Lefèvre',
    whatsappNumber: '+33612345678',
    websiteUrl: 'https://bistrot-terroir.com',
    adminUrl: 'https://admin.bistrot-terroir.com',
    notionUrl: 'https://notion.so/bistrot-terroir',
    daysRemaining: 2,
    paymentStatus: 'overdue',
    nextPaymentDate: '2024-06-12',
    notes: 'Client en retard, relance effectuée',
    createdAt: '2024-01-15',
    updatedAt: '2024-06-10'
  },
  {
    id: '2',
    companyName: 'Eco Concept',
    clientName: 'Camille Durand',
    whatsappNumber: '+33698765432',
    websiteUrl: 'https://eco-concept.fr',
    adminUrl: 'https://admin.eco-concept.fr',
    notionUrl: 'https://notion.so/eco-concept',
    daysRemaining: 15,
    paymentStatus: 'paid',
    nextPaymentDate: '2024-06-29',
    notes: 'Client fidèle, paiement toujours à temps',
    createdAt: '2024-02-01',
    updatedAt: '2024-06-14'
  },
  {
    id: '3',
    companyName: 'Mode Boutique',
    clientName: 'Aurélie Moreau',
    whatsappNumber: '+33645678901',
    websiteUrl: 'https://mode-boutique.com',
    adminUrl: 'https://admin.mode-boutique.com',
    notionUrl: 'https://notion.so/mode-boutique',
    daysRemaining: 5,
    paymentStatus: 'pending',
    nextPaymentDate: '2024-06-19',
    notes: 'Demande de modification du site en cours',
    createdAt: '2024-03-10',
    updatedAt: '2024-06-13'
  },
  {
    id: '4',
    companyName: 'Tech Innovations',
    clientName: 'Thomas Blanc',
    whatsappNumber: '+33623456789',
    websiteUrl: 'https://tech-innovations.fr',
    adminUrl: 'https://admin.tech-innovations.fr',
    notionUrl: 'https://notion.so/tech-innovations',
    daysRemaining: 1,
    paymentStatus: 'pending',
    nextPaymentDate: '2024-06-15',
    notes: 'Nouveau client, premier paiement',
    createdAt: '2024-05-15',
    updatedAt: '2024-06-14'
  },
  {
    id: '5',
    companyName: 'Cabinet Vidal',
    clientName: 'Julien Vidal',
    whatsappNumber: '+33678901234',
    websiteUrl: 'https://cabinet-vidal.fr',
    adminUrl: 'https://admin.cabinet-vidal.fr',
    notionUrl: 'https://notion.so/cabinet-vidal',
    daysRemaining: 20,
    paymentStatus: 'paid',
    nextPaymentDate: '2024-07-04',
    notes: 'Client premium, service complet',
    createdAt: '2024-01-20',
    updatedAt: '2024-06-14'
  }
];

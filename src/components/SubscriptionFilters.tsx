
import React from 'react';
import { Search, Filter, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FilterOptions } from '@/types/subscription';

interface SubscriptionFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

const SubscriptionFilters: React.FC<SubscriptionFiltersProps> = ({
  filters,
  onFiltersChange
}) => {
  const updateFilters = (updates: Partial<FilterOptions>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 mb-6">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Rechercher par nom, entreprise ou numéro..."
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Select 
          value={filters.paymentStatus} 
          onValueChange={(value: any) => updateFilters({ paymentStatus: value })}
        >
          <SelectTrigger className="w-[180px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent className="bg-white z-50">
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="paid">Actif</SelectItem>
            <SelectItem value="pending">Dû aujourd'hui</SelectItem>
            <SelectItem value="overdue">En retard</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="dueSoon"
            checked={filters.showOnlyDueSoon}
            onCheckedChange={(checked) => updateFilters({ showOnlyDueSoon: !!checked })}
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
  );
};

export default SubscriptionFilters;

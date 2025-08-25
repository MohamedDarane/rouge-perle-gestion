
import React from 'react';
import { Printer, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { detectPrinterType, setPrinterType, PrinterType } from '../services/printerService';

const PrinterSettings: React.FC = () => {
  const [currentPrinterType, setCurrentPrinterType] = React.useState<PrinterType>(detectPrinterType());

  const handlePrinterTypeChange = (value: PrinterType) => {
    setPrinterType(value);
    setCurrentPrinterType(value);
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow-md">
      <div className="flex items-center mb-4">
        <Settings className="h-5 w-5 text-cafeRed mr-2" />
        <h3 className="text-lg font-semibold text-cafeBlack">Paramètres d'impression</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type d'imprimante
          </label>
          <Select
            value={currentPrinterType}
            onValueChange={(value: PrinterType) => handlePrinterTypeChange(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">
                <div className="flex items-center">
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimante normale (A4)
                </div>
              </SelectItem>
              <SelectItem value="rongta">
                <div className="flex items-center">
                  <Printer className="h-4 w-4 mr-2" />
                  RONGTA (Thermique 58mm)
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="text-sm text-gray-600">
          <p className="mb-2">
            <strong>Imprimante normale:</strong> Format A4 avec mise en page complète et couleurs.
          </p>
          <p>
            <strong>RONGTA:</strong> Format thermique optimisé pour imprimantes de reçus 58mm.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrinterSettings;

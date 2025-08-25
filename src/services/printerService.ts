
import { Order, TableOrder } from '../types';
import { formatNormalPrint } from './printers/normalPrinter';
import { formatRONGTAPrint } from './printers/rongtaPrinter';

export type PrinterType = 'normal' | 'rongta';

// Detect printer type - this could be enhanced to auto-detect based on browser/device
export const detectPrinterType = (): PrinterType => {
  // For now, we'll use localStorage to store user preference
  // In a real app, this could detect the actual printer type
  const stored = localStorage.getItem('printerType') as PrinterType;
  return stored || 'normal';
};

export const setPrinterType = (type: PrinterType): void => {
  localStorage.setItem('printerType', type);
};

export const printOrder = (order: Order): void => {
  const printerType = detectPrinterType();
  
  switch (printerType) {
    case 'rongta':
      formatRONGTAPrint(order);
      break;
    case 'normal':
    default:
      formatNormalPrint(order);
      break;
  }
};

export const printTableOrder = (order: TableOrder): void => {
  const printerType = detectPrinterType();
  
  switch (printerType) {
    case 'rongta':
      formatRONGTAPrint(order, true);
      break;
    case 'normal':
    default:
      formatNormalPrint(order, true);
      break;
  }
};

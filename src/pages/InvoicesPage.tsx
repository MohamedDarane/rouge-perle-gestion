
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { getRecentOrders } from '../services/cafeService';
import { Order } from '../types';
import { Search, Download, FileText } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

const InvoicesPage: React.FC = () => {
  const [invoices, setInvoices] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch completed orders as invoices
    const completedOrders = getRecentOrders(50).filter(order => order.completed);
    setInvoices(completedOrders);
  }, []);

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.agentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout requireAdmin={true}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-cafeBlack">Factures</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Rechercher des factures..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-cafeRed focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="cafe-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° de facture</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">FACT-{invoice.id.slice(0, 6)}</TableCell>
                    <TableCell>{invoice.agentName}</TableCell>
                    <TableCell>{invoice.total.toFixed(2)} €</TableCell>
                    <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <button className="p-1 hover:text-cafeRed transition-colors" title="Voir">
                          <FileText size={18} />
                        </button>
                        <button className="p-1 hover:text-cafeRed transition-colors" title="Télécharger">
                          <Download size={18} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Aucune facture trouvée
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InvoicesPage;

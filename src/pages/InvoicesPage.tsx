
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Order } from '../types';
import { getOrders } from '../services/cafeService';
import { Search, Filter, Plus, Download } from 'lucide-react';
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
    // Get completed orders as invoices
    const orders = getOrders();
    const completedOrders = orders.filter(order => order.completed);
    setInvoices(completedOrders);
  }, []);

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.agentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-cafeBlack">Factures</h1>
          <div className="flex flex-col sm:flex-row gap-3">
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
            <button className="bg-cafeRed text-white px-4 py-2 rounded-md flex items-center justify-center hover:bg-red-700 transition-colors">
              <Plus size={18} className="mr-2" />
              Nouvelle facture
            </button>
          </div>
        </div>

        <div className="cafe-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Numéro</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Articles</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id} className="cursor-pointer hover:bg-gray-50">
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.agentName}</TableCell>
                    <TableCell>{invoice.items.length} articles</TableCell>
                    <TableCell>{invoice.total.toFixed(2)} MAD</TableCell>
                    <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <button className="text-cafeRed hover:text-red-700 transition-colors">
                        <Download size={16} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
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

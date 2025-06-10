
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Order } from '../types';
import { Search, Filter, Plus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

// Mock data for orders since getRecentOrders doesn't exist
const mockOrders: Order[] = [
  {
    id: "ord_001",
    items: [
      { drinkId: "1", drinkName: "Espresso", quantity: 2, unitPrice: 2.50 }
    ],
    total: 5.00,
    date: new Date(),
    agentId: "agent1",
    agentName: "Aziz",
    completed: false
  },
  {
    id: "ord_002", 
    items: [
      { drinkId: "2", drinkName: "Cappuccino", quantity: 1, unitPrice: 3.50 }
    ],
    total: 3.50,
    date: new Date(Date.now() - 86400000),
    agentId: "agent2",
    agentName: "Noureddine",
    completed: true
  }
];

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCompleted, setFilterCompleted] = useState<boolean | null>(null);

  useEffect(() => {
    // Use mock data instead of getRecentOrders
    setOrders(mockOrders);
  }, []);

  const filteredOrders = orders.filter(
    (order) => {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.agentName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = 
        filterCompleted === null || 
        order.completed === filterCompleted;
      
      return matchesSearch && matchesFilter;
    }
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-cafeBlack">Commandes</h1>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Rechercher des commandes..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-cafeRed focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <select
                className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-cafeRed focus:border-transparent"
                value={filterCompleted === null ? "" : filterCompleted ? "completed" : "pending"}
                onChange={(e) => {
                  if (e.target.value === "") setFilterCompleted(null);
                  else setFilterCompleted(e.target.value === "completed");
                }}
              >
                <option value="">Tous les statuts</option>
                <option value="completed">Complété</option>
                <option value="pending">En cours</option>
              </select>
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
            
            <button className="bg-cafeRed text-white px-4 py-2 rounded-md flex items-center justify-center hover:bg-red-700 transition-colors">
              <Plus size={18} className="mr-2" />
              Nouvelle commande
            </button>
          </div>
        </div>

        <div className="cafe-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Articles</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <TableRow key={order.id} className="cursor-pointer hover:bg-gray-50">
                    <TableCell className="font-medium">{order.id.slice(0, 8)}</TableCell>
                    <TableCell>{order.agentName}</TableCell>
                    <TableCell>{order.items.length} articles</TableCell>
                    <TableCell>{order.total.toFixed(2)} €</TableCell>
                    <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.completed ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.completed ? 'Complété' : 'En cours'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Aucune commande trouvée
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

export default OrdersPage;

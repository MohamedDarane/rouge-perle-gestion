
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Drink, Order, OrderItem } from '../types';
import { getDrinks, getOrders, createOrder } from '../services/cafeService';
import { Search, Filter, Plus, Trash2, ShoppingCart } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCompleted, setFilterCompleted] = useState<boolean | null>(null);
  const [showNewOrderForm, setShowNewOrderForm] = useState(false);
  const [cart, setCart] = useState<OrderItem[]>([]);

  useEffect(() => {
    setOrders(getOrders());
    setDrinks(getDrinks());
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

  const addToCart = (drink: Drink) => {
    const existingItem = cart.find(item => item.drinkId === drink.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.drinkId === drink.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        drinkId: drink.id,
        drinkName: drink.name,
        quantity: 1,
        unitPrice: drink.price
      }]);
    }
  };

  const removeFromCart = (drinkId: string) => {
    setCart(cart.filter(item => item.drinkId !== drinkId));
  };

  const updateQuantity = (drinkId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(drinkId);
      return;
    }
    
    setCart(cart.map(item => 
      item.drinkId === drinkId 
        ? { ...item, quantity }
        : item
    ));
  };

  const getTotalCart = () => {
    return cart.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
  };

  const handleCreateOrder = () => {
    if (cart.length === 0) return;
    
    const newOrder = createOrder(cart);
    if (newOrder) {
      setOrders([newOrder, ...orders]);
      setCart([]);
      setShowNewOrderForm(false);
    }
  };

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
            
            <button 
              onClick={() => setShowNewOrderForm(!showNewOrderForm)}
              className="bg-cafeRed text-white px-4 py-2 rounded-md flex items-center justify-center hover:bg-red-700 transition-colors"
            >
              <Plus size={18} className="mr-2" />
              Nouvelle commande
            </button>
          </div>
        </div>

        {showNewOrderForm && (
          <div className="cafe-card p-6">
            <h2 className="text-xl font-bold text-cafeBlack mb-4">Nouvelle Commande</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Produits disponibles */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Produits disponibles</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {drinks.map((drink) => (
                    <div key={drink.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
                      <div>
                        <div className="font-medium">{drink.name}</div>
                        <div className="text-sm text-gray-600">{drink.price.toFixed(2)} MAD</div>
                      </div>
                      <button
                        onClick={() => addToCart(drink)}
                        className="bg-cafeRed text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                      >
                        Ajouter
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Panier */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <ShoppingCart size={20} className="mr-2" />
                  Panier ({cart.length})
                </h3>
                
                {cart.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    Aucun produit dans le panier
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.drinkId} className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex-1">
                          <div className="font-medium">{item.drinkName}</div>
                          <div className="text-sm text-gray-600">
                            {item.unitPrice.toFixed(2)} MAD × {item.quantity} = {(item.unitPrice * item.quantity).toFixed(2)} MAD
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.drinkId, item.quantity - 1)}
                            className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm hover:bg-gray-300"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.drinkId, item.quantity + 1)}
                            className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm hover:bg-gray-300"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromCart(item.drinkId)}
                            className="text-red-600 hover:text-red-800 ml-2"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between items-center font-bold text-lg">
                        <span>Total:</span>
                        <span>{getTotalCart().toFixed(2)} MAD</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex space-x-3 mt-4">
                  <button
                    onClick={handleCreateOrder}
                    disabled={cart.length === 0}
                    className="flex-1 bg-cafeRed text-white py-2 px-4 rounded hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Créer la commande
                  </button>
                  <button
                    onClick={() => {
                      setCart([]);
                      setShowNewOrderForm(false);
                    }}
                    className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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
                    <TableCell>{order.total.toFixed(2)} MAD</TableCell>
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

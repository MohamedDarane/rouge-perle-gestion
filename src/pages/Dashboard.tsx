
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { getActiveDrinks, getRecentOrders, getRevenueStats } from '../services/cafeService';
import { getCurrentUser, getStoredLoginActivities, getStoredActivities } from '../services/authService';
import { Activity, LoginActivity, Order, Revenue } from '../types';
import { Calendar, Coffee, DollarSign, Users } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

const Dashboard: React.FC = () => {
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [revenueStats, setRevenueStats] = useState<Revenue[]>([]);
  const [loginActivities, setLoginActivities] = useState<LoginActivity[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const user = getCurrentUser();

  useEffect(() => {
    // Fetch data when component mounts
    setRecentOrders(getRecentOrders(5));
    setRevenueStats(getRevenueStats(7));
    setLoginActivities(getStoredLoginActivities().slice(0, 5));
    setActivities(getStoredActivities().slice(0, 5));
  }, []);

  // Calculate daily stats
  const todayOrders = recentOrders.filter(order => 
    new Date(order.date).toDateString() === new Date().toDateString()
  ).length;
  
  const todayRevenue = revenueStats.find(rev => 
    rev.date === new Date().toISOString().split('T')[0]
  )?.amount || 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-cafeBlack">Tableau de bord</h1>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="cafe-card p-6 flex items-center">
            <div className="h-12 w-12 bg-cafeRed/20 rounded-full flex items-center justify-center mr-4">
              <Coffee size={24} className="text-cafeRed" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Commandes aujourd'hui</p>
              <h3 className="text-2xl font-bold text-cafeBlack">{todayOrders}</h3>
            </div>
          </div>
          
          <div className="cafe-card p-6 flex items-center">
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <DollarSign size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Revenus aujourd'hui</p>
              <h3 className="text-2xl font-bold text-cafeBlack">{todayRevenue.toFixed(2)} €</h3>
            </div>
          </div>
          
          <div className="cafe-card p-6 flex items-center">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <Users size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Agents actifs</p>
              <h3 className="text-2xl font-bold text-cafeBlack">{loginActivities.length}</h3>
            </div>
          </div>
          
          <div className="cafe-card p-6 flex items-center">
            <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center mr-4">
              <Calendar size={24} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Activités récentes</p>
              <h3 className="text-2xl font-bold text-cafeBlack">{activities.length}</h3>
            </div>
          </div>
        </div>
        
        {/* Recent Orders */}
        <div className="cafe-card">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-cafeBlack">Commandes récentes</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id.slice(0, 8)}</TableCell>
                    <TableCell>{order.agentName}</TableCell>
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
                  <TableCell colSpan={5} className="text-center py-4">
                    Aucune commande récente
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Recent Activities */}
        <div className="cafe-card">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-cafeBlack">Activités récentes</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Heure</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.length > 0 ? (
                activities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>{activity.userName}</TableCell>
                    <TableCell>{activity.action}</TableCell>
                    <TableCell>{new Date(activity.timestamp).toLocaleTimeString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    Aucune activité récente
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

export default Dashboard;

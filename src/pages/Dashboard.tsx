
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { getRevenues } from '../services/cafeService';
import { getStoredActivities, getStoredLoginActivities } from '../services/authService';
import { Activity, LoginActivity, Revenue } from '../types';
import StatCard from '../components/StatCard';
import MoneyCalculatorCard from '../components/MoneyCalculatorCard';
import TopProductsCard from '../components/TopProductsCard';
import { Users, Euro, Clock, Coffee } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loginActivities, setLoginActivities] = useState<LoginActivity[]>([]);
  const [revenues, setRevenues] = useState<Revenue[]>([]);

  useEffect(() => {
    setActivities(getStoredActivities());
    setLoginActivities(getStoredLoginActivities());
    setRevenues(getRevenues());
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const todayLogins = loginActivities.filter(login => login.date === today);
  const totalRevenue = revenues.reduce((sum, rev) => sum + rev.amount, 0);

  // Mock data for top products
  const mockTopProducts = [
    { name: "Espresso", quantity: 45, revenue: 112.50 },
    { name: "Cappuccino", quantity: 32, revenue: 112.00 },
    { name: "Latte", quantity: 28, revenue: 98.00 }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-cafeBlack">Tableau de bord</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Connexions aujourd'hui"
            value={todayLogins.length.toString()}
            icon={<Users />}
          />
          <StatCard
            title="Revenus totaux"
            value={`${totalRevenue.toFixed(2)} €`}
            icon={<Euro />}
          />
          <StatCard
            title="Commandes en cours"
            value="23"
            icon={<Clock />}
          />
          <StatCard
            title="Produits actifs"
            value="15"
            icon={<Coffee />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MoneyCalculatorCard totalAmount={totalRevenue} />
          <TopProductsCard topProducts={mockTopProducts} />
        </div>

        <div className="cafe-card">
          <h2 className="text-lg font-semibold mb-4 text-cafeBlack">Activités récentes</h2>
          <div className="space-y-2">
            {activities.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <span className="text-sm text-gray-600">{activity.action}</span>
                <div className="text-xs text-gray-400">
                  <span className="font-medium">{activity.userName}</span> - {activity.timestamp.toLocaleString()}
                </div>
              </div>
            ))}
            {activities.length === 0 && (
              <p className="text-gray-500 text-sm">Aucune activité récente</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

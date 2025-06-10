
import React from 'react';
import DashboardLayout from '../components/DashboardLayout';

const Dashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-cafeBlack">Tableau de bord</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="cafe-card p-6 text-center">
            <h3 className="text-lg font-semibold text-cafeBlack mb-2">Bienvenue</h3>
            <p className="text-gray-600">Gérez votre café efficacement</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

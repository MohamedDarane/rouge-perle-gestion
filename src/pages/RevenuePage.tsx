
import React from 'react';
import DashboardLayout from '../components/DashboardLayout';

const RevenuePage: React.FC = () => {
  return (
    <DashboardLayout requireAdmin={true}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-cafeBlack">Revenus</h1>
        </div>
        <div className="cafe-card p-6">
          <p className="text-gray-600">Analyse des revenus</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RevenuePage;

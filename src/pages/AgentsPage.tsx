
import React from 'react';
import DashboardLayout from '../components/DashboardLayout';

const AgentsPage: React.FC = () => {
  return (
    <DashboardLayout requireAdmin={true}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-cafeBlack">Agents</h1>
        </div>
        <div className="cafe-card p-6">
          <p className="text-gray-600">Gestion des agents</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AgentsPage;

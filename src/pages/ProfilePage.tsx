
import React from 'react';
import DashboardLayout from '../components/DashboardLayout';

const ProfilePage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-cafeBlack">Profil</h1>
        </div>
        <div className="cafe-card p-6">
          <p className="text-gray-600">Gestion du profil utilisateur</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;

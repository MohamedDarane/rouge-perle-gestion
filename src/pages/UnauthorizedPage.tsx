
import React from 'react';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-cafeRed">403</h1>
        <p className="text-xl text-gray-600 mb-4">Accès non autorisé</p>
        <p className="text-sm text-gray-500 mb-6">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="bg-cafeRed hover:bg-red-700 text-white px-6 py-3 rounded-md transition-colors"
        >
          Retour au tableau de bord
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;

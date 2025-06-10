
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleGoHome = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-cafeRed">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page introuvable</p>
        <p className="text-sm text-gray-500 mb-6">
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <button 
          onClick={handleGoHome}
          className="bg-cafeRed hover:bg-red-700 text-white px-6 py-3 rounded-md transition-colors"
        >
          Retour à la page de connexion
        </button>
      </div>
    </div>
  );
};

export default NotFound;

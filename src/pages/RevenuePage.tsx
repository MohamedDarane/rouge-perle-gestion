
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Revenue } from '../types';
import { 
  getRevenues, 
  clearAllActivities, 
  clearAllSystemData, 
  printRevenueReport 
} from '../services/cafeService';
import { registerActivity } from '../services/authService';
import { Calendar, Printer, Trash2, AlertTriangle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

const RevenuePage: React.FC = () => {
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [filteredData, setFilteredData] = useState<Revenue[]>([]);
  const [periodType, setPeriodType] = useState<'day' | 'month' | 'year' | 'custom'>('month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteType, setDeleteType] = useState<'activities' | 'all'>('activities');

  useEffect(() => {
    const revenueData = getRevenues();
    setRevenues(revenueData);
    filterByPeriod(revenueData, periodType, startDate, endDate);
  }, []);

  useEffect(() => {
    filterByPeriod(revenues, periodType, startDate, endDate);
  }, [revenues, periodType, startDate, endDate]);

  const filterByPeriod = (data: Revenue[], type: string, start: string, end: string) => {
    const today = new Date();
    let filtered = [...data];

    switch (type) {
      case 'day':
        const targetDate = start || today.toISOString().split('T')[0];
        filtered = data.filter(revenue => revenue.date === targetDate);
        break;
      case 'month':
        const targetMonth = start ? new Date(start) : today;
        const monthStr = targetMonth.toISOString().slice(0, 7);
        filtered = data.filter(revenue => revenue.date.startsWith(monthStr));
        break;
      case 'year':
        const targetYear = start ? new Date(start).getFullYear() : today.getFullYear();
        filtered = data.filter(revenue => revenue.date.startsWith(targetYear.toString()));
        break;
      case 'custom':
        if (start && end) {
          filtered = data.filter(revenue => 
            revenue.date >= start && revenue.date <= end
          );
        }
        break;
    }

    setFilteredData(filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const totalRevenue = filteredData.reduce((sum, revenue) => sum + revenue.amount, 0);

  const handlePrint = () => {
    printRevenueReport(filteredData, periodType, startDate, endDate, totalRevenue);
    registerActivity(`A imprimé un rapport de revenus pour la période: ${periodType}`);
  };

  const handleClearData = async () => {
    try {
      if (deleteType === 'activities') {
        clearAllActivities();
        alert('Toutes les activités ont été supprimées avec succès');
      } else {
        clearAllSystemData();
        setRevenues(getRevenues());
        alert('Toutes les données du système ont été supprimées avec succès');
      }
      setShowDeleteConfirm(false);
    } catch (error) {
      alert('Erreur: Seuls les administrateurs peuvent effectuer cette action');
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const getPeriodLabel = () => {
    switch (periodType) {
      case 'day':
        return startDate ? `Jour: ${formatDate(startDate)}` : `Aujourd'hui: ${formatDate(new Date().toISOString().split('T')[0])}`;
      case 'month':
        const monthDate = startDate ? new Date(startDate) : new Date();
        return `Mois: ${monthDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`;
      case 'year':
        const year = startDate ? new Date(startDate).getFullYear() : new Date().getFullYear();
        return `Année: ${year}`;
      case 'custom':
        return startDate && endDate ? `${formatDate(startDate)} - ${formatDate(endDate)}` : 'Période personnalisée';
      default:
        return 'Toutes les données';
    }
  };

  return (
    <DashboardLayout requireAdmin={true}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-cafeBlack">Revenus</h1>
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              disabled={filteredData.length === 0}
              className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Printer size={18} className="mr-2" />
              Imprimer
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-red-700 transition-colors"
            >
              <Trash2 size={18} className="mr-2" />
              Supprimer données
            </button>
          </div>
        </div>

        {/* Filtres de période */}
        <div className="cafe-card p-6">
          <h3 className="text-lg font-semibold mb-4 text-cafeBlack">Filtrer par période</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type de période</label>
              <select
                value={periodType}
                onChange={(e) => setPeriodType(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cafeRed"
              >
                <option value="day">Jour</option>
                <option value="month">Mois</option>
                <option value="year">Année</option>
                <option value="custom">Personnalisée</option>
              </select>
            </div>

            {periodType !== 'custom' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {periodType === 'day' ? 'Date' : periodType === 'month' ? 'Mois' : 'Année'}
                </label>
                <input
                  type={periodType === 'day' ? 'date' : periodType === 'month' ? 'month' : 'number'}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cafeRed"
                  min={periodType === 'year' ? '2020' : undefined}
                  max={periodType === 'year' ? new Date().getFullYear().toString() : undefined}
                />
              </div>
            )}

            {periodType === 'custom' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date de début</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cafeRed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date de fin</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cafeRed"
                    min={startDate}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Résumé */}
        <div className="cafe-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-cafeBlack">Résumé - {getPeriodLabel()}</h3>
            <div className="text-2xl font-bold text-cafeRed">
              {totalRevenue.toFixed(2)} MAD
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="font-semibold text-gray-600">Nombre de jours</div>
              <div className="text-lg font-bold text-cafeBlack">{filteredData.length}</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="font-semibold text-gray-600">Moyenne journalière</div>
              <div className="text-lg font-bold text-cafeBlack">
                {filteredData.length ? (totalRevenue / filteredData.length).toFixed(2) : 0} MAD
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="font-semibold text-gray-600">Revenus maximum</div>
              <div className="text-lg font-bold text-cafeBlack">
                {filteredData.length ? Math.max(...filteredData.map(r => r.amount)).toFixed(2) : 0} MAD
              </div>
            </div>
          </div>
        </div>

        {/* Tableau des données */}
        <div className="cafe-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Revenu (MAD)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((revenue) => (
                  <TableRow key={revenue.date}>
                    <TableCell>{formatDate(revenue.date)}</TableCell>
                    <TableCell className="font-semibold text-cafeRed">
                      {revenue.amount.toFixed(2)} MAD
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-8">
                    Aucune donnée disponible pour cette période
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Modal de confirmation de suppression */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center mb-4">
                <AlertTriangle className="text-red-500 mr-3" size={24} />
                <h3 className="text-lg font-semibold">Confirmation de suppression</h3>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Que voulez-vous supprimer ?</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="activities"
                      checked={deleteType === 'activities'}
                      onChange={(e) => setDeleteType(e.target.value as any)}
                      className="mr-2"
                    />
                    Supprimer uniquement les activités
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="all"
                      checked={deleteType === 'all'}
                      onChange={(e) => setDeleteType(e.target.value as any)}
                      className="mr-2"
                    />
                    Supprimer toutes les données (commandes, pointages, activités)
                  </label>
                </div>
              </div>
              
              <p className="text-gray-600 mb-6">
                {deleteType === 'activities' 
                  ? 'Toutes les activités du système seront supprimées définitivement.'
                  : 'Toutes les données du système seront supprimées définitivement. Cette action est irréversible.'
                }
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleClearData}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RevenuePage;

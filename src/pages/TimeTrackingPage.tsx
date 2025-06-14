
import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Calendar, User } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { getCurrentUser } from '../services/authService';
import { clockIn, clockOut, getTimeLogs } from '../services/cafeService';
import { TimeLog } from '../types';

const TimeTrackingPage: React.FC = () => {
  const [currentTimeLog, setCurrentTimeLog] = useState<TimeLog | null>(null);
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const user = getCurrentUser();

  useEffect(() => {
    loadTimeLogs();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadTimeLogs = () => {
    const logs = getTimeLogs();
    setTimeLogs(logs);
    
    if (user) {
      const today = new Date().toISOString().split('T')[0];
      const todayLog = logs.find(
        log => log.userId === user.id && log.date === today && !log.clockOut
      );
      setCurrentTimeLog(todayLog || null);
    }
  };

  const handleClockIn = async () => {
    setLoading(true);
    try {
      const log = clockIn();
      if (log) {
        setCurrentTimeLog(log);
        loadTimeLogs();
      }
    } catch (error) {
      console.error('Erreur lors du pointage d\'arrivée:', error);
    }
    setLoading(false);
  };

  const handleClockOut = async () => {
    setLoading(true);
    try {
      const log = clockOut();
      if (log) {
        setCurrentTimeLog(null);
        loadTimeLogs();
      }
    } catch (error) {
      console.error('Erreur lors du pointage de départ:', error);
    }
    setLoading(false);
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const calculateWorkingTime = (clockIn: Date, clockOut?: Date) => {
    const start = new Date(clockIn);
    const end = clockOut ? new Date(clockOut) : new Date();
    const diff = end.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const userLogs = user ? timeLogs.filter(log => log.userId === user.id) : [];
  const isAdmin = user?.role === 'admin';
  const displayLogs = isAdmin ? timeLogs : userLogs;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-cafeBlack">Suivi du temps</h1>
          <div className="text-lg font-mono text-cafeBlack">
            {formatTime(currentTime)}
          </div>
        </div>

        {/* Status actuel */}
        <div className="cafe-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Clock className="mr-2" />
              État actuel
            </h2>
            {currentTimeLog && (
              <span className="text-green-600 font-medium">
                Présent depuis {formatTime(currentTimeLog.clockIn)}
              </span>
            )}
          </div>

          <div className="flex gap-4">
            {!currentTimeLog ? (
              <button
                onClick={handleClockIn}
                disabled={loading}
                className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <CheckCircle className="mr-2" size={20} />
                {loading ? 'Pointage...' : 'Pointer l\'arrivée'}
              </button>
            ) : (
              <button
                onClick={handleClockOut}
                disabled={loading}
                className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                <XCircle className="mr-2" size={20} />
                {loading ? 'Pointage...' : 'Pointer le départ'}
              </button>
            )}
          </div>

          {currentTimeLog && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <p className="text-green-800">
                <strong>Temps de travail actuel :</strong> {calculateWorkingTime(currentTimeLog.clockIn)}
              </p>
            </div>
          )}
        </div>

        {/* Historique */}
        <div className="cafe-card p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Calendar className="mr-2" />
            Historique des pointages
          </h2>

          {displayLogs.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Aucun pointage enregistré
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4">Date</th>
                    {isAdmin && <th className="text-left py-3 px-4">Agent</th>}
                    <th className="text-left py-3 px-4">Arrivée</th>
                    <th className="text-left py-3 px-4">Départ</th>
                    <th className="text-left py-3 px-4">Temps travaillé</th>
                    <th className="text-left py-3 px-4">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {displayLogs
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((log) => (
                    <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">{formatDate(log.date)}</td>
                      {isAdmin && (
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <User size={16} className="mr-2 text-cafeRed" />
                            {log.userName}
                          </div>
                        </td>
                      )}
                      <td className="py-3 px-4">{formatTime(log.clockIn)}</td>
                      <td className="py-3 px-4">
                        {log.clockOut ? formatTime(log.clockOut) : '-'}
                      </td>
                      <td className="py-3 px-4">
                        {log.clockOut ? calculateWorkingTime(log.clockIn, log.clockOut) : calculateWorkingTime(log.clockIn)}
                      </td>
                      <td className="py-3 px-4">
                        {log.clockOut ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                            Terminé
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            En cours
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Statistiques (visible pour tous) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="cafe-card p-4">
            <h3 className="font-semibold text-cafeBlack mb-2">Cette semaine</h3>
            <p className="text-2xl font-bold text-cafeRed">
              {userLogs
                .filter(log => {
                  const logDate = new Date(log.date);
                  const now = new Date();
                  const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
                  return logDate >= weekStart && log.clockOut;
                })
                .reduce((total, log) => {
                  if (log.clockOut) {
                    const diff = new Date(log.clockOut).getTime() - new Date(log.clockIn).getTime();
                    return total + Math.floor(diff / (1000 * 60 * 60));
                  }
                  return total;
                }, 0)}h
            </p>
          </div>

          <div className="cafe-card p-4">
            <h3 className="font-semibold text-cafeBlack mb-2">Ce mois</h3>
            <p className="text-2xl font-bold text-cafeRed">
              {userLogs
                .filter(log => {
                  const logDate = new Date(log.date);
                  const now = new Date();
                  return logDate.getMonth() === now.getMonth() && 
                         logDate.getFullYear() === now.getFullYear() && 
                         log.clockOut;
                })
                .reduce((total, log) => {
                  if (log.clockOut) {
                    const diff = new Date(log.clockOut).getTime() - new Date(log.clockIn).getTime();
                    return total + Math.floor(diff / (1000 * 60 * 60));
                  }
                  return total;
                }, 0)}h
            </p>
          </div>

          <div className="cafe-card p-4">
            <h3 className="font-semibold text-cafeBlack mb-2">Jours travaillés</h3>
            <p className="text-2xl font-bold text-cafeRed">
              {userLogs.filter(log => log.clockOut).length}
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TimeTrackingPage;

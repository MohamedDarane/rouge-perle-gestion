
import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit2, Trash2, Mail, Shield, User, Save, X } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { User as UserType } from '../types';

interface Agent {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'agent';
  createdAt: Date;
  lastLogin?: Date;
}

const AgentsPage: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'agent' as 'admin' | 'agent',
    password: ''
  });

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = () => {
    // Récupérer les agents depuis le localStorage
    const storedAgents = localStorage.getItem('agents');
    if (storedAgents) {
      setAgents(JSON.parse(storedAgents));
    } else {
      // Agents par défaut
      const defaultAgents: Agent[] = [
        {
          id: 'admin1',
          email: 'Mostapha@perle-rouge.com',
          name: 'Mostapha',
          role: 'admin',
          createdAt: new Date('2024-01-01'),
          lastLogin: new Date()
        },
        {
          id: 'agent1',
          email: 'Aziz@perle-rouge.com',
          name: 'Aziz',
          role: 'agent',
          createdAt: new Date('2024-01-02'),
          lastLogin: new Date()
        },
        {
          id: 'agent2',
          email: 'Noureddine@perle-rouge.com',
          name: 'Noureddine',
          role: 'agent',
          createdAt: new Date('2024-01-03'),
          lastLogin: new Date()
        }
      ];
      setAgents(defaultAgents);
      localStorage.setItem('agents', JSON.stringify(defaultAgents));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingAgent) {
      // Modifier un agent existant
      const updatedAgents = agents.map(agent => 
        agent.id === editingAgent.id 
          ? { ...agent, name: formData.name, email: formData.email, role: formData.role }
          : agent
      );
      setAgents(updatedAgents);
      localStorage.setItem('agents', JSON.stringify(updatedAgents));
      setEditingAgent(null);
    } else {
      // Ajouter un nouveau agent
      const newAgent: Agent = {
        id: `agent_${Date.now()}`,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        createdAt: new Date()
      };
      const updatedAgents = [...agents, newAgent];
      setAgents(updatedAgents);
      localStorage.setItem('agents', JSON.stringify(updatedAgents));
      setShowAddForm(false);
    }

    // Réinitialiser le formulaire
    setFormData({ name: '', email: '', role: 'agent', password: '' });
  };

  const handleDelete = (agentId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet agent ?')) {
      const updatedAgents = agents.filter(agent => agent.id !== agentId);
      setAgents(updatedAgents);
      localStorage.setItem('agents', JSON.stringify(updatedAgents));
    }
  };

  const handleEdit = (agent: Agent) => {
    setEditingAgent(agent);
    setFormData({
      name: agent.name,
      email: agent.email,
      role: agent.role,
      password: ''
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setShowAddForm(false);
    setEditingAgent(null);
    setFormData({ name: '', email: '', role: 'agent', password: '' });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <DashboardLayout requireAdmin={true}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-cafeBlack">Gestion des Agents</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-4 py-2 bg-cafeRed text-white rounded-lg hover:bg-red-700"
          >
            <Plus className="mr-2" size={20} />
            Ajouter un agent
          </button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="cafe-card p-4">
            <h3 className="font-semibold text-cafeBlack mb-2">Total Agents</h3>
            <p className="text-2xl font-bold text-cafeRed">{agents.length}</p>
          </div>
          <div className="cafe-card p-4">
            <h3 className="font-semibold text-cafeBlack mb-2">Administrateurs</h3>
            <p className="text-2xl font-bold text-cafeRed">
              {agents.filter(agent => agent.role === 'admin').length}
            </p>
          </div>
          <div className="cafe-card p-4">
            <h3 className="font-semibold text-cafeBlack mb-2">Agents</h3>
            <p className="text-2xl font-bold text-cafeRed">
              {agents.filter(agent => agent.role === 'agent').length}
            </p>
          </div>
        </div>

        {/* Formulaire d'ajout/modification */}
        {showAddForm && (
          <div className="cafe-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {editingAgent ? 'Modifier l\'agent' : 'Ajouter un nouvel agent'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-cafeBlack mb-2">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cafeRed"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-cafeBlack mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cafeRed"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-cafeBlack mb-2">
                    Rôle
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'agent' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cafeRed"
                  >
                    <option value="agent">Agent</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </div>

                {!editingAgent && (
                  <div>
                    <label className="block text-sm font-medium text-cafeBlack mb-2">
                      Mot de passe
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cafeRed"
                      required={!editingAgent}
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex items-center px-4 py-2 bg-cafeRed text-white rounded-lg hover:bg-red-700"
                >
                  <Save className="mr-2" size={20} />
                  {editingAgent ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Liste des agents */}
        <div className="cafe-card p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Users className="mr-2" />
            Liste des agents
          </h2>

          {agents.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Aucun agent enregistré
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4">Agent</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Rôle</th>
                    <th className="text-left py-3 px-4">Créé le</th>
                    <th className="text-left py-3 px-4">Dernière connexion</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {agents.map((agent) => (
                    <tr key={agent.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-cafeRed rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                            {agent.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium">{agent.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <Mail size={16} className="mr-2 text-gray-400" />
                          {agent.email}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          agent.role === 'admin' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {agent.role === 'admin' ? (
                            <><Shield size={12} className="inline mr-1" />Admin</>
                          ) : (
                            <><User size={12} className="inline mr-1" />Agent</>
                          )}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {formatDate(agent.createdAt)}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {agent.lastLogin ? formatDate(agent.lastLogin) : 'Jamais'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(agent)}
                            className="p-1 text-blue-600 hover:text-blue-800"
                            title="Modifier"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(agent.id)}
                            className="p-1 text-red-600 hover:text-red-800"
                            title="Supprimer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AgentsPage;

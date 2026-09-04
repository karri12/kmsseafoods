import React, { useState, useEffect } from 'react';
import { Party, PartyType } from '../types';
import { Repository } from '../db/repository';
import { User, Truck, Plus, Trash2, Edit, Phone, MapPin, FileText, Search } from 'lucide-react';

export const FarmerSupplier: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PartyType>('FARMER');
  const [parties, setParties] = useState<Party[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParty, setEditingParty] = useState<Party | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });

  useEffect(() => {
    loadParties();
  }, [activeTab]);

  async function loadParties() {
    const list = await Repository.getPartiesByType(activeTab);
    setParties(list);
  }

  function handleOpenAdd() {
    setEditingParty(null);
    setFormData({ name: '', phone: '', address: '', notes: '' });
    setIsModalOpen(true);
  }

  function handleOpenEdit(party: Party) {
    setEditingParty(party);
    setFormData({
      name: party.name,
      phone: party.phone,
      address: party.address,
      notes: party.notes
    });
    setIsModalOpen(true);
  }

  async function handleSaveParty(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter a name.');
      return;
    }

    await Repository.saveParty({
      ...(editingParty?.id ? { id: editingParty.id } : {}),
      type: activeTab,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      notes: formData.notes.trim(),
      createdAt: editingParty?.createdAt || new Date().toISOString()
    });

    setIsModalOpen(false);
    loadParties();
  }

  async function handleDeleteParty(id?: number, name?: string) {
    if (!id) return;
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

    await Repository.deleteParty(id);
    loadParties();
  }

  const filteredParties = parties.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Farmers & Suppliers Directory</h2>
          <p className="text-sm text-slate-500">
            Manage reusable customer contact profiles for 1-click bill entry
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Add {activeTab === 'FARMER' ? 'Farmer' : 'Supplier'}
        </button>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setActiveTab('FARMER')}
              className={`flex items-center gap-2 px-5 py-2 text-sm font-bold rounded-md transition-all ${
                activeTab === 'FARMER'
                  ? 'bg-white text-blue-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4" />
              Farmers Directory
            </button>
            <button
              onClick={() => setActiveTab('SUPPLIER')}
              className={`flex items-center gap-2 px-5 py-2 text-sm font-bold rounded-md transition-all ${
                activeTab === 'SUPPLIER'
                  ? 'bg-white text-blue-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Truck className="w-4 h-4" />
              Suppliers Directory
            </button>
          </div>

          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeTab.toLowerCase()}s by name, phone, address...`}
              className="w-full pl-9 pr-4 py-2 text-sm font-medium bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredParties.length === 0 ? (
          <div className="col-span-2 bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-500">
            No {activeTab.toLowerCase()} records found. Click "+ Add" to create one.
          </div>
        ) : (
          filteredParties.map((party) => (
            <div
              key={party.id}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex justify-between items-start"
            >
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  {activeTab === 'FARMER' ? (
                    <User className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Truck className="w-4 h-4 text-emerald-600" />
                  )}
                  {party.name}
                </h3>

                {party.phone && (
                  <p className="text-xs text-slate-600 flex items-center gap-1.5 font-medium">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {party.phone}
                  </p>
                )}

                {party.address && (
                  <p className="text-xs text-slate-600 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {party.address}
                  </p>
                )}

                {party.notes && (
                  <p className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded border border-slate-100">
                    "{party.notes}"
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(party)}
                  className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteParty(party.id, party.name)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-800">
              {editingParty ? 'Edit Profile' : `Add New ${activeTab === 'FARMER' ? 'Farmer' : 'Supplier'}`}
            </h3>

            <form onSubmit={handleSaveParty} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rambabu"
                  required
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Mobile / Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. 9848012345"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Address / Location
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. Sitharamapuram, Tallarevu"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Notes / Details
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Pond size, preferred prawn variety, bank info"
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

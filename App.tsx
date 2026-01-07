
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Table, Trash2, Edit2, Car, Fuel, Calendar, Hash, DollarSign, Gauge, LogOut, ChevronRight, X, TrendingUp } from 'lucide-react';
import { FuelEntry, FuelEntryFormData } from './types.ts';
import FuelForm from './components/FuelForm.tsx';
import FuelTable from './components/FuelTable.tsx';

const STORAGE_KEY = 'ecodrive_refuels';

const App: React.FC = () => {
  const [entries, setEntries] = useState<FuelEntry[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<FuelEntry | null>(null);

  // Load initial data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load entries", e);
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const handleAddEntry = (formData: FuelEntryFormData, shouldClose: boolean = true) => {
    const newEntry: FuelEntry = {
      ...formData,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    setEntries(prev => [newEntry, ...prev]);
    if (shouldClose) {
      setIsFormOpen(false);
    }
  };

  const handleUpdateEntry = (formData: FuelEntryFormData) => {
    if (!editingEntry) return;
    setEntries(prev => prev.map(e => e.id === editingEntry.id ? { ...formData, id: editingEntry.id, timestamp: editingEntry.timestamp } : e));
    setEditingEntry(null);
    setIsFormOpen(false);
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const handleEditClick = (entry: FuelEntry) => {
    setEditingEntry(entry);
    setIsFormOpen(true);
  };

  const lastEntry = entries[0];
  const lastConsumption = lastEntry && lastEntry.litros > 0 
    ? (lastEntry.odometroParcial / lastEntry.litros) 
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500 p-2 rounded-lg text-white shadow-lg shadow-emerald-200">
              <Car size={24} />
            </div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">Car<span className="text-emerald-500 underline decoration-emerald-200 decoration-4 underline-offset-4">Data</span></h1>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow min-w-[280px]">
            <div className="flex items-center gap-4">
              <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-500">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Último Consumo</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-3xl font-black text-slate-800">
                    {lastConsumption > 0 ? lastConsumption.toFixed(2) : '--'}
                  </p>
                  <p className="text-sm font-bold text-slate-400">km/L</p>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={() => { setEditingEntry(null); setIsFormOpen(true); }}
            className="flex items-center gap-3 bg-slate-900 hover:bg-slate-800 text-white px-8 py-7 rounded-[2rem] font-black shadow-2xl shadow-slate-300 transition-all active:scale-95 group h-full self-stretch sm:self-auto"
          >
            <div className="bg-emerald-500 p-2 rounded-xl group-hover:rotate-90 transition-transform">
              <Plus size={24} strokeWidth={3} />
            </div>
            <span className="text-lg uppercase tracking-tight">Novo Registro</span>
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between bg-white">
            <h2 className="text-lg font-black text-emerald-500 tracking-widest uppercase">
              HISTÓRICO
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <FuelTable 
              entries={entries} 
              onDelete={handleDeleteEntry} 
              onEdit={handleEditClick} 
            />
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-slate-400 text-xs font-medium uppercase tracking-widest">
        <p>© 2024 CarData Tracker • Gestão Simplificada</p>
      </footer>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-white">
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                  {editingEntry ? 'Editar Registro' : 'Novo Abastecimento'}
                </h3>
                <p className="text-slate-400 text-sm font-medium">Preencha os detalhes abaixo</p>
              </div>
              <button 
                onClick={() => { setIsFormOpen(false); setEditingEntry(null); }}
                className="p-3 hover:bg-slate-50 rounded-2xl text-slate-300 hover:text-slate-600 transition-all border border-transparent hover:border-slate-100"
              >
                <X size={24} strokeWidth={2.5} />
              </button>
            </div>
            
            <FuelForm 
              initialData={editingEntry || undefined}
              onSubmit={editingEntry ? handleUpdateEntry : handleAddEntry}
              onCancel={() => { setIsFormOpen(false); setEditingEntry(null); }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

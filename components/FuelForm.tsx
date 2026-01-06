import React, { useState } from 'react';
import { FuelEntry, FuelEntryFormData } from '../types';
import { Calendar, Car, Fuel, Hash, DollarSign, Gauge, ArrowRight, Check, Plus } from 'lucide-react';

interface FuelFormProps {
  initialData?: FuelEntry;
  onSubmit: (data: FuelEntryFormData, shouldClose?: boolean) => void;
  onCancel: () => void;
}

// Fixed: Made children optional to avoid TypeScript 'Property children is missing' error when using nested JSX elements.
const InputWrapper = ({ label, icon: Icon, children }: { label: string, icon: any, children?: React.ReactNode }) => (
  <div className="space-y-1 w-full flex flex-col">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
      {label}
    </label>
    <div className="relative w-full flex items-center group">
      <div className="absolute left-4 z-10 text-slate-300 group-focus-within:text-emerald-500 transition-colors pointer-events-none">
        <Icon size={18} strokeWidth={2} />
      </div>
      {children}
    </div>
  </div>
);

const FuelForm: React.FC<FuelFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const getEmptyState = (): FuelEntryFormData => ({
    data: new Date().toISOString().split('T')[0],
    carro: '',
    combustivel: 'Gasolina',
    litros: 0,
    valor: 0,
    odometroParcial: 0,
    odometroTotal: 0,
  });

  const [formData, setFormData] = useState<FuelEntryFormData>(
    initialData ? {
      data: initialData.data,
      carro: initialData.carro,
      combustivel: initialData.combustivel,
      litros: initialData.litros,
      valor: initialData.valor,
      odometroParcial: initialData.odometroParcial,
      odometroTotal: initialData.odometroTotal,
    } : getEmptyState()
  );

  const handleSubmit = (e: React.FormEvent, shouldClose: boolean = true) => {
    e.preventDefault();
    onSubmit(formData, shouldClose);
    
    if (!shouldClose) {
      setFormData(prev => ({
        ...getEmptyState(),
        carro: prev.carro,
        data: prev.data
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? 0 : parseFloat(value)) : value,
    }));
  };

  const inputClasses = "w-full pl-12 pr-4 min-h-[50px] bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all text-slate-700 font-medium placeholder:text-slate-300 flex items-center";

  return (
    <form className="p-0 flex flex-col" onSubmit={(e) => handleSubmit(e, true)}>
      <div className="p-8 space-y-5 overflow-y-auto max-h-[60vh] scrollbar-hide">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <InputWrapper label="Data" icon={Calendar}>
            <input 
              type="date" 
              name="data" 
              value={formData.data} 
              onChange={handleChange}
              className={inputClasses}
              required
            />
          </InputWrapper>

          <InputWrapper label="Veículo" icon={Car}>
            <select 
              name="carro" 
              value={formData.carro} 
              onChange={handleChange}
              className={inputClasses}
              required
            >
              <option value="" disabled>Selecione um veículo</option>
              <option value="Fastback">Fastback</option>
              <option value="Palio">Palio</option>
              <option value="Bros">Bros</option>
            </select>
          </InputWrapper>

          <InputWrapper label="Combustível" icon={Fuel}>
            <select 
              name="combustivel" 
              value={formData.combustivel} 
              onChange={handleChange}
              className={inputClasses}
              required
            >
              <option value="Gasolina">Gasolina</option>
              <option value="Etanol">Etanol</option>
              <option value="Diesel">Diesel</option>
              <option value="GNV">GNV</option>
            </select>
          </InputWrapper>

          <InputWrapper label="Litros" icon={Hash}>
            <input 
              type="number" 
              name="litros" 
              step="0.01" 
              placeholder="0.00" 
              value={formData.litros || ''} 
              onChange={handleChange}
              className={inputClasses}
              required
            />
          </InputWrapper>

          <InputWrapper label="Valor Total (R$)" icon={DollarSign}>
            <input 
              type="number" 
              name="valor" 
              step="0.01" 
              placeholder="0.00" 
              value={formData.valor || ''} 
              onChange={handleChange}
              className={inputClasses}
              required
            />
          </InputWrapper>

          <InputWrapper label="KM Parcial" icon={Gauge}>
            <input 
              type="number" 
              name="odometroParcial" 
              placeholder="0" 
              value={formData.odometroParcial || ''} 
              onChange={handleChange}
              className={inputClasses}
              required
            />
          </InputWrapper>

          <div className="sm:col-span-2">
            <InputWrapper label="KM Total" icon={Gauge}>
              <input 
                type="number" 
                name="odometroTotal" 
                placeholder="0" 
                value={formData.odometroTotal || ''} 
                onChange={handleChange}
                className={inputClasses}
                required
              />
            </InputWrapper>
          </div>
        </div>
      </div>

      <div className="p-8 pt-4 flex flex-col sm:flex-row items-center gap-4 border-t border-slate-50 bg-slate-50/30">
        <button 
          type="button" 
          onClick={onCancel}
          className="w-full sm:w-auto px-6 py-3 text-slate-400 font-semibold hover:text-slate-600 transition-colors order-3 sm:order-1"
        >
          Cancelar
        </button>
        
        <div className="flex-1 flex gap-3 w-full order-2">
          {!initialData && (
            <button 
              type="button" 
              onClick={(e) => handleSubmit(e, false)}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-bold rounded-2xl transition-all active:scale-[0.98]"
              title="Salvar e continuar adicionando"
            >
              <Plus size={20} strokeWidth={3} />
              <span className="hidden sm:inline">Salvar e Novo</span>
              <span className="sm:hidden">Novo</span>
            </button>
          )}

          <button 
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-xl shadow-slate-200 transition-all active:scale-[0.98]"
          >
            <span>{initialData ? 'Atualizar Registro' : 'Adicionar registro'}</span>
            <ArrowRight size={20} strokeWidth={3} />
          </button>
        </div>
      </div>
    </form>
  );
};

export default FuelForm;
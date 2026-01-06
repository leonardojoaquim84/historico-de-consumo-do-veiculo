
import React, { useState } from 'react';
import { FuelEntry, FuelEntryFormData } from '../types';
import { Calendar, Car, Fuel, Hash, DollarSign, Gauge, ArrowRight, Check, Plus } from 'lucide-react';

interface FuelFormProps {
  initialData?: FuelEntry;
  onSubmit: (data: FuelEntryFormData, shouldClose?: boolean) => void;
  onCancel: () => void;
}

const InputWrapper = ({ label, icon: Icon, children, className = "" }: { label: string, icon: any, children?: React.ReactNode, className?: string }) => (
  <div className={`space-y-1 w-full flex flex-col ${className}`}>
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

  // Estado para controlar se o modal deve fechar após o envio
  const [shouldCloseOnSubmit, setShouldCloseOnSubmit] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit(formData, shouldCloseOnSubmit);
    
    if (!shouldCloseOnSubmit) {
      // Se for "Salvar e Novo", limpa os campos mas mantém o carro e data para agilizar
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

  const inputClasses = "w-full pl-12 pr-4 min-h-[46px] bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all text-slate-700 font-medium placeholder:text-slate-300 flex items-center";

  return (
    <form className="p-0 flex flex-col" onSubmit={handleSubmit}>
      <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh] scrollbar-hide">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InputWrapper label="Data de Abastecimento" icon={Calendar} className="sm:col-span-3">
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
              <option value="" disabled>Selecione</option>
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
              min="0.01"
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
              min="0.01"
            />
          </InputWrapper>

          <InputWrapper label="KM Parcial" icon={Gauge}>
            <input 
              type="number" 
              name="odometroParcial" 
              step="0.1"
              placeholder="0.0" 
              value={formData.odometroParcial || ''} 
              onChange={handleChange}
              className={inputClasses}
              required
              min="0.1"
            />
          </InputWrapper>

          <InputWrapper label="KM Total" icon={Gauge}>
            <input 
              type="number" 
              name="odometroTotal" 
              step="0.1"
              placeholder="0.0" 
              value={formData.odometroTotal || ''} 
              onChange={handleChange}
              className={inputClasses}
              required
              min="0"
            />
          </InputWrapper>
        </div>
      </div>

      <div className="p-6 pt-4 flex flex-col sm:flex-row items-center gap-4 border-t border-slate-50 bg-slate-50/30">
        <button 
          type="button" 
          onClick={onCancel}
          className="w-full sm:w-auto px-6 py-2.5 bg-red-50 text-red-500 font-bold hover:bg-red-100 rounded-2xl transition-all active:scale-[0.98] order-3 sm:order-1"
        >
          Cancelar
        </button>
        
        <div className="flex-1 flex gap-3 w-full order-2">
          {!initialData && (
            <button 
              type="submit" 
              onClick={() => setShouldCloseOnSubmit(false)}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-bold rounded-2xl transition-all active:scale-[0.98]"
              title="Salvar e continuar adicionando"
            >
              <Plus size={18} strokeWidth={3} />
              <span className="hidden sm:inline">Salvar e Novo</span>
              <span className="sm:hidden">Novo</span>
            </button>
          )}

          <button 
            type="submit"
            onClick={() => setShouldCloseOnSubmit(true)}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-xl shadow-slate-200 transition-all active:scale-[0.98]"
          >
            <span>{initialData ? 'Salvar Registro' : 'Adicionar registro'}</span>
            <ArrowRight size={18} strokeWidth={3} />
          </button>
        </div>
      </div>
    </form>
  );
};

export default FuelForm;


import React from 'react';
import { FuelEntry } from '../types';
import { Trash2, Edit2, Calendar, Fuel as FuelIcon, Car as CarIcon, FileText, Share2, Gauge } from 'lucide-react';
import { jsPDF } from 'jspdf';

const TARGET_PHONE = '5521997391448';

interface FuelTableProps {
  entries: FuelEntry[];
  onDelete: (id: string) => void;
  onEdit: (entry: FuelEntry) => void;
}

const FuelTable: React.FC<FuelTableProps> = ({ entries, onDelete, onEdit }) => {
  
  const calculateConsumption = (entry: FuelEntry) => {
    if (!entry.litros || entry.litros === 0) return 0;
    return entry.odometroParcial / entry.litros;
  };

  const createPDFBlob = (entry: FuelEntry): Blob => {
    const doc = new jsPDF();
    const dateStr = new Date(entry.data).toLocaleDateString('pt-BR');
    const consumo = calculateConsumption(entry);
    
    // Design do PDF
    doc.setFontSize(22);
    doc.setTextColor(16, 185, 129); // Emerald-500
    doc.text('CAR DATA', 105, 25, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184); // Slate-400
    doc.text('RELATÓRIO DE ABASTECIMENTO', 105, 32, { align: 'center' });
    
    doc.setDrawColor(241, 245, 249); // Slate-100
    doc.line(20, 40, 190, 40);
    
    const startY = 60;
    const lineHeight = 12;
    const labelX = 30;
    const valueX = 90;

    const data = [
      ['Data:', dateStr],
      ['Veículo:', entry.carro],
      ['Combustível:', entry.combustivel],
      ['Litros:', `${entry.litros.toFixed(2)} L`],
      ['Valor Total:', `R$ ${entry.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
      ['KM Percorrida:', `${entry.odometroParcial} km`],
      ['KM Total:', `${entry.odometroTotal} km`],
      ['Consumo Médio:', `${consumo.toFixed(2)} km/L`],
    ];

    data.forEach((row, i) => {
      if (i % 2 === 0) {
        doc.setFillColor(248, 250, 252);
        doc.rect(25, startY + (i * lineHeight) - 7, 160, lineHeight, 'F');
      }
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(100, 116, 139); // Slate-500
      doc.text(row[0], labelX, startY + (i * lineHeight));
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.setTextColor(30, 41, 59); // Slate-800
      doc.text(row[1], valueX, startY + (i * lineHeight));
    });

    doc.line(20, 175, 190, 175);
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text(`Gerado via CarData em ${new Date().toLocaleString('pt-BR')}`, 105, 185, { align: 'center' });

    return doc.output('blob');
  };

  const handleShare = async (entry: FuelEntry) => {
    const blob = createPDFBlob(entry);
    const dateStr = new Date(entry.data).toLocaleDateString('pt-BR');
    const consumo = calculateConsumption(entry);
    const fileName = `abastecimento-${entry.carro}-${entry.data}.pdf`;
    const file = new File([blob], fileName, { type: 'application/pdf' });

    const message = `*CarData - Novo Abastecimento*\n🚗 Veículo: ${entry.carro}\n📅 Data: ${dateStr}\n⛽ Consumo: ${consumo.toFixed(2)} km/L\n💰 Valor: R$ ${entry.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n\nRelatório completo em PDF anexo.`;

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: 'CarData - Abastecimento',
          text: message,
        });
        return;
      } catch (error) {
        console.warn('Erro na Share API:', error);
      }
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${TARGET_PHONE}?text=${encodedMessage}`, '_blank');
  };

  if (entries.length === 0) {
    return (
      <div className="p-16 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-50 text-slate-200 rounded-full mb-6">
          <Calendar size={40} strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-bold text-slate-700">Tabela vazia</h3>
        <p className="text-slate-400 mt-2 max-w-xs mx-auto">Adicione registros para ver o histórico e consumo.</p>
      </div>
    );
  }

  const thClasses = "px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] bg-white whitespace-nowrap";
  const tdClasses = "px-6 py-5 whitespace-nowrap text-sm text-slate-600";

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b border-slate-50">
          <th className={thClasses}>Data</th>
          <th className={thClasses}>Veículo</th>
          <th className={thClasses}>Combustível</th>
          <th className={thClasses}>Litros</th>
          <th className={thClasses}>Consumo</th>
          <th className={thClasses}>Valor</th>
          <th className="px-6 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] bg-white">Ação</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">
        {entries.map((entry) => {
          const consumo = calculateConsumption(entry);
          return (
            <tr key={entry.id} className="hover:bg-slate-50/40 transition-all group">
              <td className={tdClasses}>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-700">
                    {new Date(entry.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                  </span>
                  <span className="text-[10px] text-slate-300 font-bold uppercase">
                    {new Date(entry.data).toLocaleDateString('pt-BR', { year: 'numeric' })}
                  </span>
                </div>
              </td>
              <td className={tdClasses}>
                <div className="flex items-center gap-2">
                  <CarIcon size={14} className="text-slate-300" />
                  <span className="font-bold text-slate-800">{entry.carro}</span>
                </div>
              </td>
              <td className={tdClasses}>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider
                  ${entry.combustivel === 'Gasolina' ? 'bg-amber-50 text-amber-600' : 
                    entry.combustivel === 'Etanol' ? 'bg-emerald-50 text-emerald-600' : 
                    'bg-slate-100 text-slate-600'}`}>
                  {entry.combustivel}
                </span>
              </td>
              <td className={tdClasses}>
                <span className="font-mono text-slate-500">{entry.litros.toFixed(2)}L</span>
              </td>
              <td className={tdClasses}>
                <div className="flex items-center gap-1.5">
                  <span className={`font-black text-lg ${consumo > 12 ? 'text-emerald-500' : consumo > 8 ? 'text-amber-500' : 'text-slate-800'}`}>
                    {consumo.toFixed(2)}
                  </span>
                  <span className="text-[10px] font-bold text-slate-300 uppercase">km/L</span>
                </div>
              </td>
              <td className={tdClasses}>
                <span className="font-bold text-slate-900">R$ {entry.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </td>
              <td className="px-6 py-5 text-right whitespace-nowrap">
                <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleShare(entry)}
                    className="flex items-center gap-2 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all active:scale-95 shadow-lg shadow-emerald-100"
                    title="Compartilhar PDF"
                  >
                    <Share2 size={14} strokeWidth={3} />
                    <span>Enviar</span>
                  </button>
                  
                  <div className="flex items-center border-l border-slate-100 ml-1 pl-1">
                    <button 
                      onClick={() => onEdit(entry)}
                      className="p-2 text-slate-300 hover:text-blue-500 transition-colors"
                      title="Editar"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => onDelete(entry.id)}
                      className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default FuelTable;

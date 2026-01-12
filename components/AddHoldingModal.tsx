import React, { useState } from 'react';
import { Transaction } from '../types';
import { X, Calendar } from 'lucide-react';

interface AddHoldingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
}

export const AddHoldingModal: React.FC<AddHoldingModalProps> = ({ isOpen, onClose, onAdd }) => {
  const today = new Date().toISOString().split('T')[0];
  
  const [formData, setFormData] = useState({
    symbol: '',
    name: '',
    quantity: '',
    unitPrice: '',
    sector: '科技',
    purchaseDate: today
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      symbol: formData.symbol,
      name: formData.name,
      quantity: Number(formData.quantity),
      unitPrice: Number(formData.unitPrice),
      cashDividend: 0, // Default to 0, relying on AI Sync for data
      sector: formData.sector,
      purchaseDate: formData.purchaseDate,
      exDividendDate: '' // Default to empty
    });
    // Reset and close
    setFormData({ 
      symbol: '', 
      name: '', 
      quantity: '', 
      unitPrice: '', 
      sector: '科技',
      purchaseDate: today
    });
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-center p-5 border-b border-slate-700 sticky top-0 bg-slate-800 z-10">
          <h2 className="text-xl font-bold text-white">新增買入明細</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">股票代號</label>
              <input
                required
                name="symbol"
                value={formData.symbol}
                onChange={handleChange}
                placeholder="例如: 2330"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">股票名稱</label>
              <input
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="例如: 台積電"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">買入股數</label>
              <input
                required
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="0"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">買入價格 (單價)</label>
              <input
                required
                type="number"
                step="0.01"
                name="unitPrice"
                value={formData.unitPrice}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="border-t border-slate-700 pt-4 mt-2">
            <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <Calendar size={16} className="text-blue-400"/>
              日期設定
            </h3>
            
            <div className="mb-4">
              <label className="block text-xs font-medium text-slate-400 mb-1">買入日期</label>
              <input
                required
                type="date"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                * 股利將根據買入日期與歷史除息日自動計算。請在新增後點擊主畫面的「更新配息」按鈕。
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">產業類別</label>
            <select
              name="sector"
              value={formData.sector}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
            >
              <option value="科技">科技 (Technology)</option>
              <option value="金融">金融 (Finance)</option>
              <option value="傳產">傳產 (Traditional)</option>
              <option value="ETF">ETF</option>
              <option value="其他">其他 (Other)</option>
            </select>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3 rounded-lg shadow-lg shadow-blue-500/20 transition-all active:scale-95"
            >
              確認新增明細
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
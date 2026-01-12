import React, { useState, useEffect } from 'react';
import { DividendEvent } from '../types';
import { X, Plus, Trash2, Calendar, Tag, DollarSign } from 'lucide-react';

interface ManageDividendsModalProps {
  isOpen: boolean;
  onClose: () => void;
  symbol: string;
  name: string;
  currentEvents: DividendEvent[];
  onSave: (symbol: string, events: DividendEvent[]) => void;
}

export const ManageDividendsModal: React.FC<ManageDividendsModalProps> = ({ 
  isOpen, onClose, symbol, name, currentEvents, onSave 
}) => {
  const [events, setEvents] = useState<DividendEvent[]>([]);
  const [newEvent, setNewEvent] = useState({
    label: '',
    amount: '',
    date: ''
  });

  useEffect(() => {
    if (isOpen) {
      setEvents([...currentEvents].sort((a, b) => b.date.localeCompare(a.date)));
    }
  }, [isOpen, currentEvents]);

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.amount || !newEvent.date) return;

    const eventToAdd: DividendEvent = {
      label: newEvent.label || undefined,
      amount: Number(newEvent.amount),
      date: newEvent.date
    };

    const updatedEvents = [eventToAdd, ...events].sort((a, b) => b.date.localeCompare(a.date));
    setEvents(updatedEvents);
    setNewEvent({ label: '', amount: '', date: '' });
  };

  const handleDelete = (index: number) => {
    const updatedEvents = events.filter((_, i) => i !== index);
    setEvents(updatedEvents);
  };

  const handleSave = () => {
    onSave(symbol, events);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-slate-700 bg-slate-800 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              配息管理 
              <span className="text-sm font-normal text-slate-400 bg-slate-700/50 px-2 py-0.5 rounded-full border border-slate-600">
                {symbol} {name}
              </span>
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {/* Add New Event Form */}
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 mb-6">
            <h3 className="text-sm font-semibold text-blue-400 mb-3 flex items-center gap-2">
              <Plus size={16} /> 新增配息紀錄
            </h3>
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1">
                  <Tag size={12} /> 標籤 (期別)
                </label>
                <input
                  type="text"
                  placeholder="2025Q3"
                  value={newEvent.label}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, label: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none placeholder-slate-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1">
                  <DollarSign size={12} /> 配息金額
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.40"
                  required
                  value={newEvent.amount}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none placeholder-slate-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1">
                  <Calendar size={12} /> 除息日期
                </label>
                <input
                  type="date"
                  required
                  value={newEvent.date}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded-lg transition-colors text-sm shadow-lg shadow-blue-900/20"
                >
                  加入列表
                </button>
              </div>
            </form>
          </div>

          {/* Events List */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-3">已登錄配息 ({events.length})</h3>
            {events.length === 0 ? (
              <div className="text-center py-8 text-slate-500 border border-dashed border-slate-700 rounded-lg">
                尚無配息資料，請在上方新增。
              </div>
            ) : (
              <div className="space-y-2">
                {events.map((event, index) => (
                  <div key={`${event.date}-${index}`} className="flex items-center justify-between bg-slate-800 p-3 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-24 text-slate-400 text-sm font-mono flex items-center gap-1">
                        <Calendar size={14} className="text-slate-500" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-2">
                        {event.label && (
                          <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded text-xs font-mono">
                            {event.label}
                          </span>
                        )}
                        <span className="text-emerald-400 font-bold font-mono">
                          ${event.amount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(index)}
                      className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      title="刪除"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-700 bg-slate-800 shrink-0 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg shadow-lg shadow-emerald-900/20 transition-colors"
          >
            儲存變更
          </button>
        </div>
      </div>
    </div>
  );
};
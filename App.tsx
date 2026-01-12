import React, { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { Plus, Trash2, PieChart as PieChartIcon, TrendingUp, DollarSign, BrainCircuit, Wallet, Search, ChevronDown, ChevronRight, Layers, CheckCircle2, Clock, Sparkles, CalendarDays, Edit3 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Transaction, AggregatedStock, AnalysisStatus, DividendEvent } from './types';
import { analyzePortfolio } from './services/geminiService';
import { SummaryCard } from './components/SummaryCard';
import { AddHoldingModal } from './components/AddHoldingModal';
import { ManageDividendsModal } from './components/ManageDividendsModal';

// Initial data provided by user
const INITIAL_TRANSACTIONS: Transaction[] = [
  // 0050
  { id: '1', symbol: '0050', name: '元大台灣50', quantity: 1000, unitPrice: 63.05, cashDividend: 0, sector: 'ETF', purchaseDate: '2025-12-08', exDividendDate: '' },
  { id: '2', symbol: '0050', name: '元大台灣50', quantity: 100, unitPrice: 69.85, cashDividend: 0, sector: 'ETF', purchaseDate: '2026-01-05', exDividendDate: '' },
  // 00713
  { id: '3', symbol: '00713', name: '元大高息低波', quantity: 10000, unitPrice: 58.45, cashDividend: 0, sector: 'ETF', purchaseDate: '2024-09-02', exDividendDate: '' },
  { id: '4', symbol: '00713', name: '元大高息低波', quantity: 1000, unitPrice: 57, cashDividend: 0, sector: 'ETF', purchaseDate: '2024-09-04', exDividendDate: '' },
  { id: '5', symbol: '00713', name: '元大高息低波', quantity: 2000, unitPrice: 57.15, cashDividend: 0, sector: 'ETF', purchaseDate: '2024-09-09', exDividendDate: '' },
  { id: '6', symbol: '00713', name: '元大高息低波', quantity: 2000, unitPrice: 57.15, cashDividend: 0, sector: 'ETF', purchaseDate: '2024-09-20', exDividendDate: '' },
  { id: '7', symbol: '00713', name: '元大高息低波', quantity: 1000, unitPrice: 56.1, cashDividend: 0, sector: 'ETF', purchaseDate: '2024-11-11', exDividendDate: '' },
  { id: '8', symbol: '00713', name: '元大高息低波', quantity: 1000, unitPrice: 56.5, cashDividend: 0, sector: 'ETF', purchaseDate: '2024-11-11', exDividendDate: '' },
  { id: '9', symbol: '00713', name: '元大高息低波', quantity: 1000, unitPrice: 54.35, cashDividend: 0, sector: 'ETF', purchaseDate: '2024-12-17', exDividendDate: '' },
  { id: '10', symbol: '00713', name: '元大高息低波', quantity: 1000, unitPrice: 52.45, cashDividend: 0, sector: 'ETF', purchaseDate: '2025-01-13', exDividendDate: '' },
  { id: '11', symbol: '00713', name: '元大高息低波', quantity: 1000, unitPrice: 52.7, cashDividend: 0, sector: 'ETF', purchaseDate: '2025-03-31', exDividendDate: '' },
  { id: '12', symbol: '00713', name: '元大高息低波', quantity: 1000, unitPrice: 50.7, cashDividend: 0, sector: 'ETF', purchaseDate: '2025-10-13', exDividendDate: '' },
  // 00878
  { id: '13', symbol: '00878', name: '國泰永續高股息', quantity: 10000, unitPrice: 23.93, cashDividend: 0, sector: 'ETF', purchaseDate: '2024-07-03', exDividendDate: '' },
  { id: '14', symbol: '00878', name: '國泰永續高股息', quantity: 5000, unitPrice: 23.49, cashDividend: 0, sector: 'ETF', purchaseDate: '2024-07-03', exDividendDate: '' },
  { id: '15', symbol: '00878', name: '國泰永續高股息', quantity: 5000, unitPrice: 22.66, cashDividend: 0, sector: 'ETF', purchaseDate: '2024-08-09', exDividendDate: '' },
  { id: '16', symbol: '00878', name: '國泰永續高股息', quantity: 2000, unitPrice: 22.22, cashDividend: 0, sector: 'ETF', purchaseDate: '2024-09-04', exDividendDate: '' },
  { id: '17', symbol: '00878', name: '國泰永續高股息', quantity: 3000, unitPrice: 22.52, cashDividend: 0, sector: 'ETF', purchaseDate: '2024-09-20', exDividendDate: '' },
  { id: '18', symbol: '00878', name: '國泰永續高股息', quantity: 1000, unitPrice: 21.07, cashDividend: 0, sector: 'ETF', purchaseDate: '2025-03-04', exDividendDate: '' },
  { id: '19', symbol: '00878', name: '國泰永續高股息', quantity: 1000, unitPrice: 21.72, cashDividend: 0, sector: 'ETF', purchaseDate: '2025-03-11', exDividendDate: '' },
  { id: '20', symbol: '00878', name: '國泰永續高股息', quantity: 1000, unitPrice: 21.71, cashDividend: 0, sector: 'ETF', purchaseDate: '2025-03-11', exDividendDate: '' },
  { id: '21', symbol: '00878', name: '國泰永續高股息', quantity: 1000, unitPrice: 21.3, cashDividend: 0, sector: 'ETF', purchaseDate: '2025-03-31', exDividendDate: '' },
  { id: '22', symbol: '00878', name: '國泰永續高股息', quantity: 1000, unitPrice: 19.71, cashDividend: 0, sector: 'ETF', purchaseDate: '2025-04-21', exDividendDate: '' },
  { id: '23', symbol: '00878', name: '國泰永續高股息', quantity: 1000, unitPrice: 21.16, cashDividend: 0, sector: 'ETF', purchaseDate: '2025-10-13', exDividendDate: '' },
  { id: '24', symbol: '00878', name: '國泰永續高股息', quantity: 1000, unitPrice: 20.52, cashDividend: 0, sector: 'ETF', purchaseDate: '2025-11-24', exDividendDate: '' },
  // 00919
  { id: '25', symbol: '00919', name: '群益台灣精選高息', quantity: 5000, unitPrice: 26.1, cashDividend: 0, sector: 'ETF', purchaseDate: '2024-07-04', exDividendDate: '' },
  { id: '26', symbol: '00919', name: '群益台灣精選高息', quantity: 1000, unitPrice: 24.73, cashDividend: 0, sector: 'ETF', purchaseDate: '2024-07-23', exDividendDate: '' },
  { id: '27', symbol: '00919', name: '群益台灣精選高息', quantity: 1000, unitPrice: 23.82, cashDividend: 0, sector: 'ETF', purchaseDate: '2024-08-09', exDividendDate: '' },
  { id: '28', symbol: '00919', name: '群益台灣精選高息', quantity: 3000, unitPrice: 24.95, cashDividend: 0, sector: 'ETF', purchaseDate: '2024-09-02', exDividendDate: '' },
  { id: '29', symbol: '00919', name: '群益台灣精選高息', quantity: 2000, unitPrice: 24.02, cashDividend: 0, sector: 'ETF', purchaseDate: '2024-09-04', exDividendDate: '' },
  { id: '30', symbol: '00919', name: '群益台灣精選高息', quantity: 3000, unitPrice: 24.43, cashDividend: 0, sector: 'ETF', purchaseDate: '2024-09-04', exDividendDate: '' },
  { id: '31', symbol: '00919', name: '群益台灣精選高息', quantity: 1000, unitPrice: 22.78, cashDividend: 0, sector: 'ETF', purchaseDate: '2025-01-13', exDividendDate: '' },
  { id: '32', symbol: '00919', name: '群益台灣精選高息', quantity: 2000, unitPrice: 22.47, cashDividend: 0, sector: 'ETF', purchaseDate: '2025-03-20', exDividendDate: '' },
  { id: '33', symbol: '00919', name: '群益台灣精選高息', quantity: 1000, unitPrice: 22.47, cashDividend: 0, sector: 'ETF', purchaseDate: '2025-03-31', exDividendDate: '' },
  { id: '34', symbol: '00919', name: '群益台灣精選高息', quantity: 1000, unitPrice: 21.04, cashDividend: 0, sector: 'ETF', purchaseDate: '2025-10-13', exDividendDate: '' },
];

const INITIAL_DIVIDENDS: Record<string, DividendEvent[]> = {
  "00878": [
    { label: "2025Q3", amount: 0.40, date: "2025-11-18" },
    { label: "2025Q2", amount: 0.40, date: "2025-08-18" },
    { label: "2025Q1", amount: 0.47, date: "2025-05-19" },
    { label: "2024Q4", amount: 0.50, date: "2025-02-20" },
    { label: "2024Q3", amount: 0.55, date: "2024-11-18" },
    { label: "2024Q2", amount: 0.55, date: "2024-08-16" },
    { label: "2024Q1", amount: 0.51, date: "2024-05-17" },
    { label: "2023Q4", amount: 0.40, date: "2024-02-27" },
    { label: "2023Q3", amount: 0.35, date: "2023-11-16" },
  ],
  "00713": [
    { label: "2025Q3", amount: 0.78, date: "2025-12-19" },
    { label: "2025Q2", amount: 0.78, date: "2025-09-19" },
    { label: "2025Q1", amount: 1.10, date: "2025-06-20" },
    { label: "2024Q4", amount: 1.40, date: "2025-03-21" },
    { label: "2024Q3", amount: 1.40, date: "2024-12-17" },
    { label: "2024Q2", amount: 1.50, date: "2024-09-18" },
    { label: "2024Q1", amount: 1.50, date: "2024-06-19" },
    { label: "2023Q4", amount: 0.88, date: "2024-03-18" },
    { label: "2023Q3", amount: 0.84, date: "2023-12-18" },
  ],
  "00919": [
    { label: "2025Q3", amount: 0.54, date: "2025-12-16" },
    { label: "2025Q2", amount: 0.54, date: "2025-09-16" },
    { label: "2025Q1", amount: 0.72, date: "2025-06-17" },
    { label: "2024Q4", amount: 0.72, date: "2025-03-18" },
    { label: "2024Q3", amount: 0.72, date: "2024-12-20" },
    { label: "2024Q2", amount: 0.72, date: "2024-09-23" },
    { label: "2024Q1", amount: 0.70, date: "2024-06-24" },
    { label: "2023Q4", amount: 0.66, date: "2024-03-18" },
    { label: "2023Q3", amount: 0.55, date: "2023-12-18" },
  ],
};

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1'];

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactions');
    // Use initial data if local storage is empty or undefined
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  // Store Dividend history: { "2330": [{date:..., amount:..., label:...}] }
  const [dividendHistoryMap, setDividendHistoryMap] = useState<Record<string, DividendEvent[]>>(() => {
    const saved = localStorage.getItem('dividendHistoryMap');
    // Use initial data if local storage is empty or undefined
    return saved ? JSON.parse(saved) : INITIAL_DIVIDENDS;
  });
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [manageDividendsState, setManageDividendsState] = useState<{isOpen: boolean, symbol: string, name: string}>({
    isOpen: false, symbol: '', name: ''
  });

  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('dividendHistoryMap', JSON.stringify(dividendHistoryMap));
  }, [dividendHistoryMap]);

  // Aggregate Transactions with Precise Logic
  const aggregatedHoldings: AggregatedStock[] = useMemo(() => {
    const map = new Map<string, AggregatedStock>();
    // For calculation purposes, consider 'today' as a future date or current date?
    // User data contains future dates (e.g., 2025-12-08). 
    // To see 'realized' dividends correctly relative to this simulated portfolio, 
    // we should perhaps let 'today' be flexible, but standard logic uses actual today.
    // However, for the user to see the "Projected/Realized" based on these dates, we use real today.
    // Realized = Ex-Date <= Today AND Ex-Date > Purchase Date.
    const today = new Date().toISOString().split('T')[0];
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const oneYearAgoStr = oneYearAgo.toISOString().split('T')[0];

    transactions.forEach(t => {
      if (!map.has(t.symbol)) {
        map.set(t.symbol, {
          symbol: t.symbol,
          name: t.name,
          totalQuantity: 0,
          totalCost: 0,
          averageCost: 0,
          cashDividend: 0,
          totalAnnualDividend: 0,
          totalRealizedDividend: 0,
          dividendEvents: dividendHistoryMap[t.symbol] || [],
          isAiVerified: (dividendHistoryMap[t.symbol] || []).length > 0, // Now basically means "has detailed records"
          sector: t.sector,
          transactions: []
        });
      }
      
      const agg = map.get(t.symbol)!;
      agg.totalQuantity += t.quantity;
      agg.totalCost += (t.quantity * t.unitPrice);
      
      const events = dividendHistoryMap[t.symbol];
      
      // 1. Projected Annual (Trailing 12 Months OR Manual Estimate)
      let annualRate = t.cashDividend; 
      if (events && events.length > 0) {
        // Calculate TTM (Trailing 12 Months) Yield for projection
        // If data is futuristic (2025), TTM might need to look at the "latest available year".
        // Let's take the sum of the last 4 known dividends as the annual rate proxy.
        const sortedEvents = [...events].sort((a,b) => b.date.localeCompare(a.date));
        if (sortedEvents.length >= 4) {
           // Sum top 4 most recent (including future) to estimate annual power
           annualRate = sortedEvents.slice(0, 4).reduce((sum, e) => sum + e.amount, 0);
        } else {
           // Fallback to all if less than 4
           annualRate = sortedEvents.reduce((sum, e) => sum + e.amount, 0);
           // If it's quarterly but we only have 3, maybe average * 4? Let's keep it simple sum for now.
        }
      }
      agg.totalAnnualDividend += (t.quantity * annualRate);
      agg.cashDividend = annualRate; 

      // 2. Precise Realized Calculation (Event Based)
      // Logic: You get the dividend if you bought BEFORE the ex-date.
      // Purchase Date < Ex-Dividend Date.
      // And usually, we only count "Realized" if the Ex-Date has already passed (<= Today).
      // But if the user wants to see "Future Realized" (Projected Income for specific batches), 
      // they might want to see it even if Ex-Date > Today. 
      // Standard accounting: Realized means cash in hand (or receivable). 
      // Let's stick to standard: ExDate <= Today. 
      // If user provided future dates in "dividendEvents", those are "Projected" until date passes.
      let realizedForThisBatch = 0;

      if (events && events.length > 0) {
        // Find all dividend events that occurred AFTER purchase
        events.forEach(event => {
          // You must own the stock BEFORE ex-date. 
          // Check: Purchase < ExDate.
          // Also check: ExDate <= Today (to be "Realized").
          // If you want to see "All Potential from this batch", remove "event.date <= today".
          // Based on the prompt "2025Q3... 0.40", user likely wants to see the projection.
          // However, the column header says "已實現(Realized)". 
          // I will stick to "Realized = Date Passed". 
          // If the user wants to see future cash flow, they look at "Annual Projected".
          if (event.date > t.purchaseDate && event.date <= today) {
            realizedForThisBatch += (event.amount * t.quantity);
          }
        });
      } else {
        // Fallback
        if (t.exDividendDate && t.purchaseDate < t.exDividendDate && today >= t.exDividendDate) {
          realizedForThisBatch = t.quantity * t.cashDividend;
        }
      }

      agg.totalRealizedDividend += realizedForThisBatch;
      agg.transactions.push(t);
    });

    return Array.from(map.values()).map(agg => ({
      ...agg,
      averageCost: agg.totalQuantity > 0 ? agg.totalCost / agg.totalQuantity : 0,
      transactions: agg.transactions.sort((a,b) => b.purchaseDate.localeCompare(a.purchaseDate))
    }));
  }, [transactions, dividendHistoryMap]);

  // Derived Statistics
  const stats = useMemo(() => {
    const totalCost = aggregatedHoldings.reduce((acc, curr) => acc + curr.totalCost, 0);
    const totalAnnualDividend = aggregatedHoldings.reduce((acc, curr) => acc + curr.totalAnnualDividend, 0);
    const totalRealizedDividend = aggregatedHoldings.reduce((acc, curr) => acc + curr.totalRealizedDividend, 0);
    const yieldOnCost = totalCost > 0 ? (totalAnnualDividend / totalCost) * 100 : 0;

    return { totalCost, totalAnnualDividend, totalRealizedDividend, yieldOnCost };
  }, [aggregatedHoldings]);

  // Chart Data
  const allocationData = useMemo(() => {
    return aggregatedHoldings.map(h => ({
      name: h.name,
      value: h.totalCost
    })).sort((a, b) => b.value - a.value);
  }, [aggregatedHoldings]);

  const dividendData = useMemo(() => {
    return aggregatedHoldings.map(h => ({
      name: h.name,
      dividend: Math.round(h.totalAnnualDividend),
      realized: Math.round(h.totalRealizedDividend)
    })).sort((a, b) => b.dividend - a.dividend);
  }, [aggregatedHoldings]);

  // Handlers
  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    const transactionWithId = { ...newTransaction, id: Date.now().toString() };
    setTransactions([...transactions, transactionWithId]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const toggleRow = (symbol: string) => {
    const newSet = new Set(expandedRows);
    if (newSet.has(symbol)) {
      newSet.delete(symbol);
    } else {
      newSet.add(symbol);
    }
    setExpandedRows(newSet);
  };

  const handleOpenManageDividends = (e: React.MouseEvent, symbol: string, name: string) => {
    e.stopPropagation();
    setManageDividendsState({ isOpen: true, symbol, name });
  };

  const handleSaveDividends = (symbol: string, events: DividendEvent[]) => {
    setDividendHistoryMap(prev => ({
      ...prev,
      [symbol]: events
    }));
  };

  const handleAIAnalyze = async () => {
    setAnalysisStatus(AnalysisStatus.LOADING);
    try {
      const result = await analyzePortfolio(aggregatedHoldings);
      setAiAnalysis(result);
      setAnalysisStatus(AnalysisStatus.SUCCESS);
    } catch (error) {
      setAiAnalysis("分析失敗，請檢查 API Key 或網路連線。");
      setAnalysisStatus(AnalysisStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-lg">
              <PieChartIcon className="text-white h-6 w-6" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              DividendFlow AI
            </h1>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-900/20"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">新增明細</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <SummaryCard 
            title="總投資成本" 
            value={`NT$ ${stats.totalCost.toLocaleString()}`} 
            subValue="Based on batch costs"
            icon={<Wallet size={24} />}
            colorClass="bg-slate-900"
          />
          <SummaryCard 
            title="年度預估股利" 
            value={`NT$ ${stats.totalAnnualDividend.toLocaleString()}`} 
            subValue="Based on Records"
            icon={<DollarSign size={24} />}
            colorClass="bg-slate-900"
          />
          <SummaryCard 
            title="已實現(入袋)股利" 
            value={`NT$ ${Math.round(stats.totalRealizedDividend).toLocaleString()}`} 
            subValue="Verified by Dates"
            icon={<CheckCircle2 size={24} />}
            colorClass="bg-slate-900/80 border-emerald-500/30"
          />
           <SummaryCard 
            title="綜合殖利率" 
            value={`${stats.yieldOnCost.toFixed(2)}%`} 
            subValue="Yield on Total Cost"
            icon={<TrendingUp size={24} />}
            colorClass="bg-slate-900"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Allocation Pie Chart */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <span className="w-1 h-5 bg-blue-500 rounded-full"></span>
              資產配置 (成本占比)
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }}
                    itemStyle={{ color: '#f8fafc' }}
                    formatter={(value: number) => `NT$ ${value.toLocaleString()}`}
                  />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ paddingTop: '20px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Dividend Bar Chart */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <span className="w-1 h-5 bg-emerald-500 rounded-full"></span>
              股利分析 (預估 vs 已領)
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dividendData} layout="vertical" margin={{ left: 20 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" stroke="#94a3b8" width={60} tick={{fontSize: 12}} />
                  <RechartsTooltip 
                    cursor={{fill: '#334155', opacity: 0.4}}
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }}
                    itemStyle={{ color: '#10b981' }}
                  />
                  <Legend />
                  <Bar dataKey="dividend" name="年度預估" fill="#334155" radius={[0, 4, 4, 0]} barSize={20} />
                  <Bar dataKey="realized" name="實際已領" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Holdings List & AI Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Holdings Table */}
          <div className="xl:col-span-2 bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-sm flex flex-col">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">庫存明細 (依個股匯總)</h3>
              <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">共 {aggregatedHoldings.length} 檔標的</span>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-medium w-12"></th>
                    <th className="px-2 py-4 font-medium">代號/名稱</th>
                    <th className="px-6 py-4 font-medium text-right">總股數</th>
                    <th className="px-6 py-4 font-medium text-right">平均成本</th>
                    <th className="px-6 py-4 font-medium text-right">已實現股利</th>
                    <th className="px-6 py-4 font-medium text-right">設定</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {aggregatedHoldings.map((agg) => {
                    const isExpanded = expandedRows.has(agg.symbol);
                    const hasDividendData = agg.dividendEvents.length > 0;
                    
                    return (
                      <React.Fragment key={agg.symbol}>
                        <tr 
                          onClick={() => toggleRow(agg.symbol)}
                          className="hover:bg-slate-800/30 transition-colors cursor-pointer group"
                        >
                          <td className="px-6 py-4 text-slate-500">
                             {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                          </td>
                          <td className="px-2 py-4">
                            <div className="flex flex-col">
                              <span className="font-semibold text-white">{agg.name}</span>
                              <span className="text-xs text-slate-500">{agg.symbol}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right text-slate-300 font-mono">
                            {agg.totalQuantity.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-right text-slate-300 font-mono">
                            {agg.averageCost.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-right font-mono font-medium">
                            <div className="flex flex-col items-end">
                              <span className="text-emerald-400 text-base flex items-center gap-1">
                                {Math.round(agg.totalRealizedDividend).toLocaleString()}
                              </span>
                              <span className="text-slate-500 text-[10px]">預估 {agg.totalAnnualDividend.toLocaleString()}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right text-slate-400 font-mono text-xs">
                             <button
                               onClick={(e) => handleOpenManageDividends(e, agg.symbol, agg.name)}
                               className={`flex items-center justify-end gap-1 px-3 py-1.5 rounded-md transition-all ml-auto
                                 ${hasDividendData 
                                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/20' 
                                    : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 hover:text-white'
                                  }`}
                             >
                               <Edit3 size={12}/> 
                               {hasDividendData ? '管理配息' : '設定配息'}
                             </button>
                          </td>
                        </tr>
                        {/* Expanded Batches Rows */}
                        {isExpanded && agg.transactions.map((t, index) => {
                           const today = new Date().toISOString().split('T')[0];
                           const events = agg.dividendEvents;
                           // Calculate realized for this specific batch
                           const validEvents = events
                              .filter(e => e.date > t.purchaseDate && e.date <= today)
                              .sort((a,b) => b.date.localeCompare(a.date)); // Sort descending for display

                           const batchRealized = validEvents.reduce((sum, e) => sum + (e.amount * t.quantity), 0);
                           const unitRealized = validEvents.reduce((sum, e) => sum + e.amount, 0);

                           const hasEvents = events.length > 0;
                           const displayRealized = hasEvents ? batchRealized : (t.exDividendDate && today >= t.exDividendDate && t.purchaseDate < t.exDividendDate ? t.quantity * t.cashDividend : 0);

                           return (
                            <tr key={t.id} className="bg-slate-900/50 text-xs text-slate-400 border-b border-slate-800/50">
                              <td className="px-6 py-4 text-right text-slate-600 align-top">
                                <Layers size={14} className="inline ml-auto" />
                              </td>
                              <td colSpan={2} className="px-2 py-4 pl-4 align-top">
                                <div className="flex flex-col gap-2">
                                  <div className="flex items-center gap-2">
                                    <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-400 border border-slate-700">
                                      批次 {agg.transactions.length - index}
                                    </span>
                                    <span className="flex items-center gap-1 text-slate-500">
                                      <Clock size={12} /> 買入: {t.purchaseDate}
                                    </span>
                                    <span className="text-slate-500">|</span>
                                    <span className="text-slate-300 font-mono">{t.quantity.toLocaleString()} 股 @ ${t.unitPrice}</span>
                                  </div>
                                  
                                  {/* List of Dividend Events */}
                                  {validEvents.length > 0 && (
                                    <div className="mt-2 bg-slate-800/50 rounded-lg p-2 border border-slate-700/50">
                                      <p className="text-[10px] text-slate-500 mb-1 flex items-center gap-1">
                                        <CalendarDays size={10}/> 納入計算的除息日 ({validEvents.length} 次):
                                      </p>
                                      <div className="flex flex-wrap gap-1.5">
                                        {validEvents.map((ev) => (
                                          <span key={ev.date} className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                                            {ev.label && <span className="text-slate-500 mr-1">{ev.label}</span>}
                                            {ev.date} (${ev.amount})
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  {hasEvents && validEvents.length === 0 && (
                                    <p className="text-[10px] text-slate-500 mt-1 italic">
                                      * 此批次買入日期晚於最近一次除息日，尚未領取股利。
                                    </p>
                                  )}
                                </div>
                              </td>
                              
                              <td colSpan={2} className="px-6 py-4 text-right align-top">
                                <div className="flex flex-col items-end gap-1">
                                  <span className={`font-medium flex items-center gap-1 text-sm ${displayRealized > 0 ? 'text-emerald-400' : 'text-slate-500'}`}>
                                    {displayRealized > 0 ? <CheckCircle2 size={12}/> : null}
                                    已領總額: NT$ {Math.round(displayRealized).toLocaleString()}
                                  </span>
                                  {hasEvents && (
                                     <span className="text-[11px] text-slate-500 font-mono">
                                       (累積每股配息: ${unitRealized.toFixed(2)})
                                     </span>
                                  )}
                                </div>
                              </td>
                              
                              <td className="px-6 py-4 text-right align-top">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteTransaction(t.id);
                                  }}
                                  className="text-slate-600 hover:text-red-400 transition-colors p-1"
                                  title="刪除此筆明細"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </React.Fragment>
                    );
                  })}
                  {aggregatedHoldings.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                        目前沒有持股，請點擊右上方「新增明細」。
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Analysis Panel */}
          <div className="bg-gradient-to-br from-indigo-900/20 to-slate-900 rounded-xl border border-indigo-500/30 p-6 flex flex-col h-full shadow-sm relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="bg-indigo-500/20 p-2 rounded-lg text-indigo-400">
                <BrainCircuit size={24} />
              </div>
              <h3 className="text-lg font-semibold text-white">AI 投資健檢</h3>
            </div>

            <div className="flex-1 overflow-y-auto mb-6 min-h-[200px] text-sm text-slate-300 leading-relaxed relative z-10 custom-scrollbar">
              {analysisStatus === AnalysisStatus.IDLE && (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 text-center space-y-3">
                  <Search size={32} className="opacity-50" />
                  <p>點擊下方按鈕，讓 Gemini AI <br/>分析您的投資組合。</p>
                </div>
              )}
              {analysisStatus === AnalysisStatus.LOADING && (
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-indigo-400 animate-pulse">AI 正在分析...</p>
                </div>
              )}
              {analysisStatus === AnalysisStatus.SUCCESS && (
                 <div className="prose prose-invert prose-sm max-w-none">
                   <ReactMarkdown>{aiAnalysis}</ReactMarkdown>
                 </div>
              )}
              {analysisStatus === AnalysisStatus.ERROR && (
                <div className="text-red-400 text-center mt-10">
                  {aiAnalysis}
                </div>
              )}
            </div>

            <button
              onClick={handleAIAnalyze}
              disabled={analysisStatus === AnalysisStatus.LOADING || transactions.length === 0}
              className="w-full relative z-10 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-medium py-3 rounded-lg transition-all active:scale-95 shadow-lg shadow-indigo-900/20 flex items-center justify-center gap-2"
            >
               {analysisStatus === AnalysisStatus.LOADING ? '分析中...' : '開始分析'}
            </button>
          </div>

        </div>
      </main>

      <AddHoldingModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddTransaction}
      />

      <ManageDividendsModal
        isOpen={manageDividendsState.isOpen}
        onClose={() => setManageDividendsState(prev => ({ ...prev, isOpen: false }))}
        symbol={manageDividendsState.symbol}
        name={manageDividendsState.name}
        currentEvents={dividendHistoryMap[manageDividendsState.symbol] || []}
        onSave={handleSaveDividends}
      />
    </div>
  );
}

export default App;
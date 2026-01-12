export interface Transaction {
  id: string;
  symbol: string; // Stock Code e.g., 2330
  name: string;   // Stock Name e.g., TSMC
  quantity: number; // Number of shares in this batch
  unitPrice: number; // Buy price per share for this batch
  cashDividend: number; // User provided Annual estimate
  sector: string; // e.g., Tech, Finance
  purchaseDate: string; // YYYY-MM-DD
  exDividendDate: string; // User provided (optional override)
}

export interface DividendEvent {
  date: string; // Ex-dividend date (YYYY-MM-DD)
  amount: number; // Cash dividend amount
  label?: string; // Optional label e.g., "2025Q3"
}

export interface AggregatedStock {
  symbol: string;
  name: string;
  totalQuantity: number;
  averageCost: number;
  totalCost: number;
  cashDividend: number;
  totalAnnualDividend: number; // Projected annual (Future)
  totalRealizedDividend: number; // Calculated based on Purchase Date vs Actual Ex-Dates
  dividendEvents: DividendEvent[]; // The history fetched from AI or Manual Input
  isAiVerified: boolean; // Flag to show if using actual data
  sector: string;
  transactions: Transaction[];
}

export interface PortfolioStats {
  totalCost: number;
  totalMarketValue: number;
  totalAnnualDividend: number;
  totalRealizedDividend: number;
  yieldRate: number;
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
import { GoogleGenAI } from "@google/genai";
import { AggregatedStock } from "../types";

const API_KEY = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey: API_KEY });

// fetchDividendHistory removed as per user request for manual input only.

export const analyzePortfolio = async (holdings: AggregatedStock[]): Promise<string> => {
  if (!API_KEY) {
    throw new Error("API Key is missing.");
  }

  // Prepare the data for the model
  const portfolioSummary = holdings.map(h => ({
    stock: h.name,
    code: h.symbol,
    sector: h.sector,
    totalValue: h.totalCost,
    realizedDividend: h.totalRealizedDividend,
    projectedAnnualDividend: h.totalAnnualDividend,
    yield: (h.cashDividend / h.averageCost) * 100,
    dividendSource: h.dividendEvents.length > 0 ? "Detailed Records" : "Simple Estimate"
  }));

  const prompt = `
    你是一位專業的財務顧問。請根據以下的股票投資組合 JSON 數據進行分析。
    
    數據說明：
    - realizedDividend: 根據「買入日期」與「實際除息日」精確計算的已到手股利。
    - projectedAnnualDividend: 全年預估總股利 (基於過去12個月 TTM 計算)
    
    數據:
    ${JSON.stringify(portfolioSummary)}

    請提供以下內容（請用繁體中文回答，格式為 Markdown）：
    1. **實際收益分析**: 針對「realizedDividend」進行點評，哪些股票已經提供了穩定的現金流？
    2. **現金流展望**: 請特別點評 2025 年 (包含使用者手動輸入的Q1~Q3) 的配息狀況。
    3. **策略建議**: 針對目前的現金流回收速度，給予再投資建議。
    
    請保持語氣專業且鼓舞人心，並重點標示關鍵字。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });

    return response.text || "無法生成分析結果，請稍後再試。";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
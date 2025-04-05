import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

const mockWebSocket = (callback) => {
  setInterval(() => {
    const price = (Math.random() * 100 + 100).toFixed(2);
    const trade = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      symbol: "AAPL",
      price,
      quantity: Math.floor(Math.random() * 10 + 1),
      bot: Math.random() > 0.5 ? "high" : "low",
    };
    callback(trade);
  }, 2000);
};

export default function TradingDashboard() {
  const [priceData, setPriceData] = useState([]);
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    mockWebSocket((trade) => {
      setPriceData((prev) => [...prev.slice(-19), { timestamp: trade.timestamp, price: parseFloat(trade.price) }]);
      setTrades((prev) => [trade, ...prev.slice(0, 19)]);
    });
  }, []);

  return (
    <div className="p-4 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Trading Multi-Agent Dashboard</h1>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-gray-800 p-4 rounded-2xl shadow">
          <h2 className="text-xl mb-4">Live Stock Chart</h2>
          <LineChart width={600} height={300} data={priceData}>
            <XAxis dataKey="timestamp" tick={{ fill: 'white' }} />
            <YAxis tick={{ fill: 'white' }} />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }} />
            <Line type="monotone" dataKey="price" stroke="#38bdf8" strokeWidth={2} dot={false} />
          </LineChart>
        </div>

        <div className="col-span-1 bg-gray-800 p-4 rounded-2xl shadow overflow-hidden">
          <h2 className="text-xl mb-4">Recent Trades</h2>
          <div className="h-[300px] overflow-y-auto space-y-2 pr-2">
            {trades.map((trade) => (
              <div key={trade.id} className="p-2 border border-gray-700 rounded-lg">
                <div className="text-sm text-gray-400">{trade.timestamp}</div>
                <div className="text-lg font-semibold">{trade.symbol} @ ${trade.price}</div>
                <div className="text-sm">Qty: {trade.quantity}</div>
                <div className={`text-sm ${trade.bot === 'high' ? 'text-red-400' : 'text-green-400'}`}>
                  {trade.bot === 'high' ? 'High Risk Bot' : 'Low Risk Bot'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

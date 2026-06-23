import React from "react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function FinancialChart({ data = [], range, onRangeChange }) {
  const ranges = [
    { label: "Last 1 Month", value: "1m" },
    { label: "Last 3 Months", value: "3m" },
    { label: "Last 6 Months", value: "6m" },
    { label: "Last 1 Year", value: "1y" },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-[#00000014] shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Financial Growth</h3>
          <p className="text-xs text-gray-400">Income vs Expenses over time</p>
        </div>
        
        <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
          {ranges.map((r) => (
            <button
              key={r.value}
              onClick={() => onRangeChange(r.value)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                range === r.value
                  ? "bg-white text-pink-600 shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {r.label.replace("Last ", "")}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 600 }}
              dy={10}
            />
            <Tooltip 
              cursor={{ fill: '#F9FAFB' }}
              contentStyle={{ 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            />
            <Bar 
              dataKey="income" 
              fill="#EC4899" 
              radius={[4, 4, 0, 0]} 
              barSize={range === "1m" ? 8 : 20}
            />
            <Bar 
              dataKey="expense" 
              fill="#616366ff" 
              radius={[4, 4, 0, 0]}   
              barSize={range === "1m" ? 8 : 20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 flex items-center justify-center gap-6 text-xs font-bold">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-pink-500 rounded-full" />
          <span className="text-gray-600">Total Income</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-200 rounded-full" />
          <span className="text-gray-600">Total Expenses</span>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, CartesianGrid, YAxis } from "recharts";

export default function OverviewGraph({ history = [] }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-[#00000010] shadow-sm">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-bold text-gray-800 tracking-tight">Revenue Performance</h3>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Last 7 Days Activity</p>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
          <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
          Live Data
        </div>
      </div>

      {/* CHART */}
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D6336C" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#D6336C" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 700 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 700 }} 
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
              itemStyle={{ fontWeight: 'bold', color: '#D6336C' }}
            />
            <Area 
              type="monotone" 
              dataKey="amount" 
              stroke="#D6336C" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorAmount)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

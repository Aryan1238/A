/**
 * PrepPilot - Recharts Score Trend Visualizer
 * Renders an interactive score-over-time chart comparing ATS and Mock Interview outcomes.
 */

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { TrendingUp } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-slate-700">
        <p className="font-bold text-slate-200">{data.title || label}</p>
        <p className="text-slate-400">Date: {data.date}</p>
        {data.atsScore !== null && (
          <p className="text-blue-400 font-semibold">
            ATS Score: {data.atsScore}/100
          </p>
        )}
        {data.rawInterviewScore !== undefined && (
          <p className="text-emerald-400 font-semibold">
            Interview Score: {data.rawInterviewScore}/10
          </p>
        )}
      </div>
    );
  }
  return null;
};

const ScoreChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
        <TrendingUp className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-3" />
        <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300">
          No Trend Data Yet
        </h3>
        <p className="text-xs text-slate-400 max-w-sm mt-1">
          Complete a resume analysis or mock interview to start tracking your performance timeline!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Score Progression Over Time
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Tracking ATS match percentages and scaled mock interview performance
          </p>
        </div>
      </div>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" />
            <XAxis
              dataKey="date"
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[0, 100]}
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '16px', fontSize: '12px' }}
              iconType="circle"
            />
            <Line
              type="monotone"
              dataKey="atsScore"
              name="Resume ATS Score (/100)"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 5, fill: '#3b82f6' }}
              activeDot={{ r: 7 }}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="interviewScore"
              name="Interview Score (Scaled /100)"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 5, fill: '#10b981' }}
              activeDot={{ r: 7 }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ScoreChart;

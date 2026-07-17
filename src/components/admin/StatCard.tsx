import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  isPositive?: boolean;
}

export function StatCard({ title, value, icon, trend, isPositive }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
      <div className="p-4 bg-indigo-50 text-indigo-600 rounded-xl">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        {trend && (
          <p className={`text-sm mt-1 font-medium ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
            {trend}
          </p>
        )}
      </div>
    </div>
  );
}

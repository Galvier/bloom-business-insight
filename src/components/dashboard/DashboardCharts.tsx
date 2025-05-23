
import React from 'react';
import PerformanceChart from '@/components/PerformanceChart';

interface DepartmentPerformanceData {
  name: string;
  value: number;
}

interface DashboardChartsProps {
  departmentPerformance: DepartmentPerformanceData[];
  monthlyRevenue: { name: string; value: number }[];
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ 
  departmentPerformance,
  monthlyRevenue 
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <PerformanceChart
        title="Desempenho por departamento"
        data={departmentPerformance.length > 0 ? departmentPerformance : [{ name: 'Carregando...', value: 0 }]}
        type="bar"
        percentage={true}
        status="success"
        trend={5.2}
      />
      
      <PerformanceChart
        title="Receita mensal (R$)"
        data={monthlyRevenue}
        color="#10b981"
        type="line"
        status="success"
        trend={3.8}
      />
    </div>
  );
};

export default DashboardCharts;

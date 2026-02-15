
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { FinancialData } from '../types';
import { COLORS } from './constants';

interface Props {
  data: FinancialData;
}

const FinancialChart: React.FC<Props> = ({ data }) => {
  const totalExpenses = 
    data.electricity + 
    data.water + 
    data.rent + 
    data.food + 
    data.health + 
    data.transport + 
    data.education + 
    data.entertainment + 
    data.telecom + 
    data.personalCare + 
    data.others;
    
  const remaining = Math.max(0, data.income - totalExpenses);

  const chartData = [
    { name: 'Energía', value: data.electricity },
    { name: 'Agua', value: data.water },
    { name: 'Arriendo', value: data.rent },
    { name: 'Comida', value: data.food },
    { name: 'Salud', value: data.health },
    { name: 'Transporte', value: data.transport },
    { name: 'Educación', value: data.education },
    { name: 'Ocio', value: data.entertainment },
    { name: 'Internet/Tel', value: data.telecom },
    { name: 'Cuidado Pers.', value: data.personalCare },
    { name: 'Otros', value: data.others },
    { name: 'Disponible', value: remaining },
  ].filter(item => item.value > 0);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS.CHART[index % COLORS.CHART.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => formatCurrency(value)} />
          <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '10px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinancialChart;

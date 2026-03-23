import React, { useState } from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Sector
} from 'recharts';
import Card from '../Common/Card';
import { motion } from 'framer-motion';

const PieChart = ({
  data,
  dataKey = 'value',
  nameKey = 'name',
  title,
  subtitle,
  height = 400,
  showLegend = true,
  showTooltip = true,
  showLabels = true,
  innerRadius = 0,
  outerRadius = 120,
  paddingAngle = 2,
  colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec489a', '#14b8a6', '#f97316'],
  className = '',
  onPieClick,
  loading = false,
  donut = false,
  labelType = 'percent',
}) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const RADIAN = Math.PI / 180;
  
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null;

    if (labelType === 'percent') {
      return (
        <text
          x={x}
          y={y}
          fill="white"
          textAnchor={x > cx ? 'start' : 'end'}
          dominantBaseline="central"
          className="text-xs font-medium"
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      );
    }

    if (labelType === 'name') {
      return (
        <text
          x={x}
          y={y}
          fill="#64748b"
          textAnchor={x > cx ? 'start' : 'end'}
          dominantBaseline="central"
          className="text-xs"
        >
          {name}
        </text>
      );
    }

    return null;
  };

  const renderActiveShape = (props) => {
    const {
      cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload, percent, value, name
    } = props;
    
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          opacity={0.9}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
          className="dark:fill-gray-300 text-sm font-medium"
        >
          {name}
        </text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="#999"
          className="dark:fill-gray-500 text-xs"
        >
          {`${value} (${(percent * 100).toFixed(1)}%)`}
        </text>
      </g>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: payload[0].payload.fill || payload[0].color }}
            />
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {data[nameKey]}
            </p>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Value: <span className="font-semibold text-gray-900 dark:text-white">{data[dataKey]}</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Percentage: <span className="font-semibold text-gray-900 dark:text-white">
              {((data[dataKey] / data.reduce((sum, item) => sum + item[dataKey], 0)) * 100).toFixed(1)}%
            </span>
          </p>
        </motion.div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    const total = data.reduce((sum, item) => sum + item[dataKey], 0);
    
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry, index) => {
          const percentage = ((entry.payload[dataKey] / total) * 100).toFixed(1);
          return (
            <div
              key={index}
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">{entry.value}</span>
              <span className="text-xs text-gray-500 dark:text-gray-500">({percentage}%)</span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center" style={{ height }}>
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-48 h-48 bg-gray-200 dark:bg-gray-700 rounded-full mb-4"></div>
            <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      );
    }

    if (!data || data.length === 0) {
      return (
        <div className="flex items-center justify-center" style={{ height }}>
          <p className="text-gray-500 dark:text-gray-400">No data available</p>
        </div>
      );
    }

    const radius = donut ? outerRadius / 2 : outerRadius;
    const innerRadiusValue = donut ? outerRadius / 3 : innerRadius;

    return (
      <ResponsiveContainer width="100%" height={height}>
        <RechartsPieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={showLabels}
            label={showLabels ? renderCustomizedLabel : false}
            innerRadius={innerRadiusValue}
            outerRadius={radius}
            paddingAngle={paddingAngle}
            dataKey={dataKey}
            nameKey={nameKey}
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            onClick={(data, index) => onPieClick && onPieClick(data, index)}
            onMouseEnter={(data, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color || colors[index % colors.length]}
                stroke="white"
                strokeWidth={2}
              />
            ))}
          </Pie>
          {showTooltip && <Tooltip content={<CustomTooltip />} />}
          {showLegend && <Legend content={<CustomLegend />} />}
        </RechartsPieChart>
      </ResponsiveContainer>
    );
  };

  // Calculate total for summary
  const total = data.reduce((sum, item) => sum + item[dataKey], 0);

  return (
    <Card
      title={title}
      subtitle={subtitle}
      className={`overflow-hidden ${className}`}
    >
      {renderContent()}
      {total > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{total.toLocaleString()}</p>
        </div>
      )}
    </Card>
  );
};

export default PieChart;
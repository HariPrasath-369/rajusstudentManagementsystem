import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
  ReferenceLine,
  Area,
  ComposedChart
} from 'recharts';
import Card from '../Common/Card';
import { motion } from 'framer-motion';

const LineChart = ({
  data,
  lines,
  xAxisKey = 'name',
  title,
  subtitle,
  height = 400,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  showBrush = false,
  showArea = false,
  showReferenceLine = false,
  referenceLineValue,
  referenceLineLabel,
  strokeWidth = 2,
  dotSize = 4,
  colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec489a'],
  className = '',
  onDataPointClick,
  loading = false,
}) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {entry.name}:
              </span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
              </span>
            </div>
          ))}
        </motion.div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center" style={{ height }}>
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
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

    const ChartComponent = showArea ? ComposedChart : RechartsLineChart;

    return (
      <ResponsiveContainer width="100%" height={height}>
        <ChartComponent
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          onClick={(data) => onDataPointClick && onDataPointClick(data)}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e2e8f0"
              strokeOpacity={0.5}
            />
          )}
          <XAxis
            dataKey={xAxisKey}
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickLine={{ stroke: '#cbd5e1' }}
            axisLine={{ stroke: '#cbd5e1' }}
            padding={{ left: 10, right: 10 }}
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickLine={{ stroke: '#cbd5e1' }}
            axisLine={{ stroke: '#cbd5e1' }}
          />
          {showTooltip && <Tooltip content={<CustomTooltip />} />}
          {showLegend && <Legend content={<CustomLegend />} />}
          {showBrush && (
            <Brush
              dataKey={xAxisKey}
              height={30}
              stroke="#3b82f6"
              fill="#3b82f620"
              travellerWidth={10}
            />
          )}
          {showReferenceLine && referenceLineValue && (
            <ReferenceLine
              y={referenceLineValue}
              label={referenceLineLabel}
              stroke="#ef4444"
              strokeDasharray="3 3"
            />
          )}
          {lines.map((line, index) => (
            <React.Fragment key={line.key}>
              {showArea && (
                <Area
                  type="monotone"
                  dataKey={line.key}
                  name={line.name}
                  stroke={colors[index % colors.length]}
                  fill={colors[index % colors.length]}
                  fillOpacity={0.1}
                  strokeWidth={strokeWidth}
                  dot={{ r: dotSize }}
                  activeDot={{ r: dotSize + 2 }}
                />
              )}
              <Line
                type="monotone"
                dataKey={line.key}
                name={line.name}
                stroke={colors[index % colors.length]}
                strokeWidth={strokeWidth}
                dot={{ r: dotSize, fill: colors[index % colors.length] }}
                activeDot={{ r: dotSize + 2, stroke: colors[index % colors.length], strokeWidth: 2 }}
                connectNulls
              />
            </React.Fragment>
          ))}
        </ChartComponent>
      </ResponsiveContainer>
    );
  };

  return (
    <Card
      title={title}
      subtitle={subtitle}
      className={`overflow-hidden ${className}`}
    >
      {renderContent()}
    </Card>
  );
};

export default LineChart;
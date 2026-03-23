import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  LabelList
} from 'recharts';
import Card from '../Common/Card';
import { motion } from 'framer-motion';

const BarChart = ({
  data,
  bars,
  xAxisKey = 'name',
  title,
  subtitle,
  height = 400,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  showLabels = false,
  layout = 'vertical',
  stacked = false,
  borderRadius = 4,
  barSize = 40,
  colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec489a'],
  className = '',
  onBarClick,
  loading = false,
}) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum, entry) => sum + entry.value, 0);
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
              {stacked && (
                <span className="text-xs text-gray-500">
                  ({((entry.value / total) * 100).toFixed(1)}%)
                </span>
              )}
            </div>
          ))}
          {stacked && (
            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total:</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {total.toFixed(2)}
                </span>
              </div>
            </div>
          )}
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

  const renderLabel = (props) => {
    const { x, y, width, height, value } = props;
    return (
      <text
        x={x + width / 2}
        y={y - 5}
        fill="#64748b"
        textAnchor="middle"
        fontSize={12}
        className="dark:fill-gray-400"
      >
        {value}
      </text>
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

    const barLayout = layout === 'vertical' ? 'vertical' : 'horizontal';

    return (
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart
          data={data}
          layout={barLayout}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          onClick={(data) => onBarClick && onBarClick(data)}
          barCategoryGap={barSize === 'auto' ? 'auto' : 10}
          barGap={stacked ? 0 : 4}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e2e8f0"
              strokeOpacity={0.5}
            />
          )}
          <XAxis
            dataKey={layout === 'vertical' ? undefined : xAxisKey}
            type={layout === 'vertical' ? 'number' : 'category'}
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickLine={{ stroke: '#cbd5e1' }}
            axisLine={{ stroke: '#cbd5e1' }}
          />
          <YAxis
            dataKey={layout === 'vertical' ? xAxisKey : undefined}
            type={layout === 'vertical' ? 'category' : 'number'}
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickLine={{ stroke: '#cbd5e1' }}
            axisLine={{ stroke: '#cbd5e1' }}
          />
          {showTooltip && <Tooltip content={<CustomTooltip />} />}
          {showLegend && <Legend content={<CustomLegend />} />}
          {bars.map((bar, index) => (
            <Bar
              key={bar.key}
              dataKey={bar.key}
              name={bar.name}
              fill={colors[index % colors.length]}
              radius={[borderRadius, borderRadius, 0, 0]}
              barSize={barSize}
              stackId={stacked ? 'stack' : undefined}
              onClick={(data) => onBarClick && onBarClick(data)}
            >
              {showLabels && <LabelList dataKey={bar.key} content={renderLabel} />}
              {bar.data && bar.data.map((entry, idx) => (
                <Cell
                  key={`cell-${idx}`}
                  fill={entry.color || colors[idx % colors.length]}
                />
              ))}
            </Bar>
          ))}
        </RechartsBarChart>
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

export default BarChart;
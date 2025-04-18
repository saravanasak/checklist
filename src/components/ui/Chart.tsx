"use client";

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

type ChartType = 'bar' | 'line' | 'pie' | 'doughnut';

interface ChartProps {
  type: ChartType;
  data: ChartData<any>;
  options?: ChartOptions<any>;
  height?: number;
  width?: number;
  className?: string;
}

export default function Chart({
  type,
  data,
  options = {},
  height,
  width,
  className = ''
}: ChartProps) {
  // Default options with Genesys branding colors
  const defaultOptions: ChartOptions<any> = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        backgroundColor: '#0F1941',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#FF4F1F',
        borderWidth: 1,
        padding: 10,
        displayColors: true,
      },
    },
    scales: type !== 'pie' && type !== 'doughnut' ? {
      y: {
        beginAtZero: true,
      },
    } : undefined,
  };

  // Merge default options with provided options
  const mergedOptions = { ...defaultOptions, ...options };

  // Style object for the chart container
  const style: React.CSSProperties = {
    height: height ? `${height}px` : 'auto',
    width: width ? `${width}px` : '100%',
  };

  // Render the appropriate chart based on type
  const renderChart = () => {
    switch (type) {
      case 'bar':
        return <Bar data={data} options={mergedOptions} />
      case 'line':
        return <Line data={data} options={mergedOptions} />
      case 'pie':
        return <Pie data={data} options={mergedOptions} />
      case 'doughnut':
        return <Doughnut data={data} options={mergedOptions} />
      default:
        return <Bar data={data} options={mergedOptions} />
    }
  };

  return (
    <div className={`chart-container ${className}`} style={style}>
      {renderChart()}
    </div>
  );
}

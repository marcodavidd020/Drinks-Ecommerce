import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface ChartComparisonProps {
    title: string;
    data: any;
    chartType: 'line' | 'bar' | 'doughnut';
    height?: number;
}

export default function ChartComparison({ 
    title, 
    data, 
    chartType, 
    height = 300 
}: ChartComparisonProps) {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: {
                        size: 12
                    }
                }
            },
            title: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: true,
                callbacks: {
                    label: function(context: any) {
                        if (chartType === 'doughnut') {
                            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                            const percentage = ((context.parsed * 100) / total).toFixed(1);
                            return `${context.label}: ${new Intl.NumberFormat('es-CO', {
                                style: 'currency',
                                currency: 'COP',
                                minimumFractionDigits: 0
                            }).format(context.parsed)} (${percentage}%)`;
                        } else {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('es-CO', {
                                    style: 'currency',
                                    currency: 'COP',
                                    minimumFractionDigits: 0
                                }).format(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            }
        },
        scales: chartType !== 'doughnut' ? {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                },
                ticks: {
                    callback: function(value: any) {
                        return new Intl.NumberFormat('es-CO', {
                            style: 'currency',
                            currency: 'COP',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        }).format(value);
                    }
                }
            },
            x: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                }
            }
        } : undefined
    };

    const renderChart = () => {
        switch (chartType) {
            case 'line':
                return <Line data={data} options={options} />;
            case 'bar':
                return <Bar data={data} options={options} />;
            case 'doughnut':
                return <Doughnut data={data} options={options} />;
            default:
                return <Line data={data} options={options} />;
        }
    };

    return (
        <div className="card card-adaptive p-6">
            <h3 className="text-adaptive text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 mb-4">
                {title}
            </h3>
            <div style={{ height: `${height}px` }}>
                {renderChart()}
            </div>
        </div>
    );
} 
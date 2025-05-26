import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    BarElement,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    BarElement
);

interface ChartComparisonProps {
    title: string;
    data: any;
    chartType: 'line' | 'doughnut' | 'bar';
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
                    color: 'rgb(107, 114, 128)', // text-gray-500
                }
            },
            title: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: 'white',
                bodyColor: 'white',
                borderColor: 'rgba(107, 114, 128, 0.2)',
                borderWidth: 1,
            }
        },
        scales: chartType !== 'doughnut' ? {
            x: {
                ticks: {
                    color: 'rgb(107, 114, 128)',
                },
                grid: {
                    color: 'rgba(107, 114, 128, 0.1)',
                }
            },
            y: {
                ticks: {
                    color: 'rgb(107, 114, 128)',
                },
                grid: {
                    color: 'rgba(107, 114, 128, 0.1)',
                }
            }
        } : undefined,
    };

    const renderChart = () => {
        switch (chartType) {
            case 'line':
                return <Line data={data} options={options} />;
            case 'doughnut':
                return <Doughnut data={data} options={options} />;
            case 'bar':
                return <Bar data={data} options={options} />;
            default:
                return <Line data={data} options={options} />;
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 mb-4">
                    {title}
                </h3>
                <div style={{ height: `${height}px` }}>
                    {renderChart()}
                </div>
            </div>
        </div>
    );
} 
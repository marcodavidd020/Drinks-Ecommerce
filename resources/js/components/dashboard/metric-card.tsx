interface MetricCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: string;
    colorClass: string;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
}

export default function MetricCard({ 
    title, 
    value, 
    subtitle, 
    icon, 
    colorClass, 
    trend, 
    trendValue 
}: MetricCardProps) {
    const getTrendIcon = () => {
        switch (trend) {
            case 'up':
                return (
                    <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                );
            case 'down':
                return (
                    <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <div className="card card-adaptive p-6">
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    <div className={`w-12 h-12 ${colorClass} rounded-md flex items-center justify-center`}>
                        <span className="text-white text-xl">{icon}</span>
                    </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                    <dl>
                        <dt className="text-adaptive text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                            {title}
                        </dt>
                        <dd className="flex items-baseline">
                            <div className="text-adaptive text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {value}
                            </div>
                            {trend && trendValue && (
                                <div className="ml-2 flex items-baseline text-sm">
                                    {getTrendIcon()}
                                    <span className={`text-adaptive ml-1 ${
                                        trend === 'up' ? 'text-green-600' : 
                                        trend === 'down' ? 'text-red-600' : 
                                        'text-gray-600'
                                    }`}>
                                        {trendValue}
                                    </span>
                                </div>
                            )}
                        </dd>
                    </dl>
                    {subtitle && (
                        <p className="text-adaptive mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
} 
import { useEffect, useState } from "react";

interface TestResult {
  executionTime?: number;
  memoryUsed?: number;
}

interface Submission {
  testResults?: TestResult[];
}

interface HistogramBucket {
  min: number;
  max: number;
  count: number;
  isCurrent: boolean;
  percentage: number;
}

interface ChartData {
  runtime: HistogramBucket[];
  memory: HistogramBucket[];
}

interface BeatsPercentage {
  runtime: number;
  memory: number;
}

export const PerformanceChart = ({ 
  currentRuntime, 
  currentMemory, 
  allSubmissions 
}: {
  currentRuntime: number;
  currentMemory: number;
  allSubmissions: Submission[];
}) => {
  const [chartData, setChartData] = useState<ChartData>({ runtime: [], memory: [] });
  const [beatsPercentage, setBeatsPercentage] = useState<BeatsPercentage>({ runtime: 0, memory: 0 });
  const [hoveredBar, setHoveredBar] = useState<{ type: string; index: number } | null>(null);

  useEffect(() => {
    if (allSubmissions.length === 0) return;

    // Extract runtime and memory data from all submissions
    const runtimeData: number[] = [];
    const memoryData: number[] = [];

    allSubmissions.forEach(submission => {
      if (submission.testResults && submission.testResults.length > 0) {
        const avgRuntime = submission.testResults.reduce((acc: number, test: TestResult) => 
          acc + (test.executionTime || 0), 0) / submission.testResults.length;
        const avgMemory = submission.testResults.reduce((acc: number, test: TestResult) => 
          acc + (test.memoryUsed || 0), 0) / submission.testResults.length;
        
        if (avgRuntime > 0) runtimeData.push(avgRuntime);
        if (avgMemory > 0) memoryData.push(avgMemory / (1024 * 1024)); // Convert to MB
      }
    });

    // Sort data for percentile calculation
    const sortedRuntime = [...runtimeData].sort((a, b) => a - b);
    const sortedMemory = [...memoryData].sort((a, b) => a - b);

    // Calculate beats percentage
    const runtimeBeats = sortedRuntime.length > 0 ? 
      ((sortedRuntime.filter(time => time > currentRuntime).length / sortedRuntime.length) * 100) : 0;
    const memoryBeats = sortedMemory.length > 0 ? 
      ((sortedMemory.filter(mem => mem > (currentMemory / (1024 * 1024))).length / sortedMemory.length) * 100) : 0;

    setBeatsPercentage({
      runtime: Math.round(runtimeBeats * 100) / 100,
      memory: Math.round(memoryBeats * 100) / 100
    });

    // Create histogram data for visualization
    const createHistogramData = (data: number[], current: number): HistogramBucket[] => {
      if (!data || data.length === 0) return [];
      
      const validData = data.filter(value => typeof value === 'number' && !isNaN(value) && isFinite(value));
      if (validData.length === 0) return [];
      
      const min = Math.min(...validData);
      const max = Math.max(...validData);
      
      if (min === max) {
        return [{
          min: min,
          max: max,
          count: validData.length,
          isCurrent: true,
          percentage: 100
        }];
      }
      
      const bucketCount = Math.min(20, Math.max(8, validData.length));
      const bucketSize = (max - min) / bucketCount;
      
      if (bucketSize <= 0) return [];
      
      const buckets: HistogramBucket[] = Array(bucketCount).fill(null).map((_, i) => ({
        min: min + (i * bucketSize),
        max: min + ((i + 1) * bucketSize),
        count: 0,
        isCurrent: false,
        percentage: 0
      }));

      validData.forEach(value => {
        if (typeof value === 'number' && !isNaN(value)) {
          const bucketIndex = Math.min(Math.floor((value - min) / bucketSize), bucketCount - 1);
          if (bucketIndex >= 0 && bucketIndex < buckets.length) {
            buckets[bucketIndex].count++;
          }
        }
      });

      // Calculate percentages
      const totalCount = validData.length;
      buckets.forEach(bucket => {
        bucket.percentage = (bucket.count / totalCount) * 100;
      });

      // Mark bucket containing current value
      if (typeof current === 'number' && !isNaN(current) && isFinite(current)) {
        const currentBucketIndex = Math.min(Math.floor((current - min) / bucketSize), bucketCount - 1);
        if (currentBucketIndex >= 0 && currentBucketIndex < buckets.length) {
          buckets[currentBucketIndex].isCurrent = true;
        }
      }

      return buckets;
    };

    setChartData({
      runtime: createHistogramData(sortedRuntime, currentRuntime),
      memory: createHistogramData(sortedMemory, currentMemory / (1024 * 1024))
    });
  }, [allSubmissions, currentRuntime, currentMemory]);

  const PerformanceCard = ({ 
    title, 
    value, 
    unit, 
    beats, 
    icon, 
    data, 
    type,
    color 
  }: {
    title: string;
    value: number;
    unit: string;
    beats: number;
    icon: React.ReactNode;
    data: HistogramBucket[];
    type: string;
    color: string;
  }) => {
    const maxCount = Math.max(...data.map(d => d.count));
    const currentBucket = data.find(d => d.isCurrent);
    
    // Get color classes based on the color prop
    const getColorClasses = (color: string, isCurrent: boolean, isHovered: boolean) => {
      const colorMap = {
        blue: {
          current: 'bg-blue-400 shadow-lg shadow-blue-400/30 border-blue-300',
          hovered: 'bg-blue-500',
          default: 'bg-blue-600 hover:bg-blue-500'
        },
        green: {
          current: 'bg-green-400 shadow-lg shadow-green-400/30 border-green-300',
          hovered: 'bg-green-500',
          default: 'bg-green-600 hover:bg-green-500'
        }
      };
      
      const colors = colorMap[color as keyof typeof colorMap] || colorMap.blue;
      
      if (isCurrent) return colors.current;
      if (isHovered) return colors.hovered;
      return colors.default;
    };
    
    return (
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="text-gray-400">{icon}</div>
            <h3 className="text-lg font-semibold text-gray-200">{title}</h3>
          </div>
          <div className="text-gray-500 cursor-pointer">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2C13.1,2 14,2.9 14,4C14,5.1 13.1,6 12,6C10.9,6 10,5.1 10,4C10,2.9 10.9,2 12,2M21,9V7L15,1H5C3.9,1 3,1.9 3,3V21C3,22.1 3.9,23 5,23H19C20.1,23 21,22.1 21,21V9M19,9H14V4H5V21H19V9Z"/>
            </svg>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="flex items-center gap-6 mb-6">
          <div>
            <span className="text-3xl font-bold text-white">
              {type === 'runtime' ? Math.round(value) : value.toFixed(2)}
            </span>
            <span className="text-gray-400 ml-2">{unit}</span>
          </div>
          <div className="h-8 w-px bg-gray-600"></div>
          <div>
            <span className="text-gray-400">Beats </span>
            <span className={`font-bold ${beats >= 50 ? 'text-green-400' : 'text-orange-400'}`}>
              {beats.toFixed(2)}%
            </span>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-green-400">🚀</span>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="relative">
          {/* Y-axis markers */}
          <div className="absolute left-0 top-0 h-32 flex flex-col justify-between text-xs text-gray-500">
            {data.length > 0 && (() => {
              const totalCount = data.reduce((sum, d) => sum + d.count, 0);
              return totalCount > 0 ? [
                <span key="100">{Math.round((maxCount * 100) / totalCount)}%</span>,
                <span key="75">{Math.round((maxCount * 75) / totalCount)}%</span>,
                <span key="50">{Math.round((maxCount * 50) / totalCount)}%</span>,
                <span key="25">{Math.round((maxCount * 25) / totalCount)}%</span>,
                <span key="0">0%</span>
              ] : [<span key="0">0%</span>];
            })()}
          </div>

          {/* Chart area */}
          <div className="ml-12 relative">
            {/* Grid lines */}
            <div className="absolute inset-0 h-32">
              {[0, 25, 50, 75, 100].map(percent => (
                <div 
                  key={percent}
                  className="absolute w-full border-t border-gray-700/50"
                  style={{ top: `${100 - percent}%` }}
                />
              ))}
            </div>

            {/* Bars */}
            <div className="relative flex items-end gap-0.5 h-32 px-2">
              {data.map((bucket, index) => {
                const height = maxCount > 0 ? (bucket.count / maxCount) * 100 : 0;
                const isHovered = hoveredBar?.type === type && hoveredBar?.index === index;
                
                return (
                  <div 
                    key={index} 
                    className="relative flex-1 flex items-end justify-center group"
                    onMouseEnter={() => setHoveredBar({ type, index })}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    <div 
                      className={`
                        w-full transition-all duration-200 cursor-pointer border rounded-t
                        ${getColorClasses(color, bucket.isCurrent, isHovered)}
                        ${bucket.isCurrent ? 'relative z-10' : ''}
                      `}
                      style={{ height: `${Math.max(height, 1)}%` }}
                    />
                    
                    {/* Current submission indicator */}
                    {bucket.isCurrent && (
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                        <div className="w-6 h-6 bg-white rounded-full border-2 border-blue-400 flex items-center justify-center">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        </div>
                      </div>
                    )}
                    
                    {/* Hover tooltip */}
                    {isHovered && (
                      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 z-20">
                        <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl border border-gray-600 whitespace-nowrap">
                          <div className="font-medium">
                            {bucket.percentage.toFixed(2)}% of solutions used {bucket.min.toFixed(0)}{unit} of {type}
                          </div>
                          <div className="text-gray-300">
                            Range: {bucket.min.toFixed(1)} - {bucket.max.toFixed(1)} {unit}
                          </div>
                          <div className="text-gray-300">
                            Count: {bucket.count} submissions
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* X-axis labels */}
            <div className="flex justify-between mt-2 px-2">
              {data.map((bucket, index) => {
                if (index % Math.ceil(data.length / 6) !== 0) return <div key={index} className="flex-1"></div>;
                return (
                  <div key={index} className="flex-1 text-center">
                    <span className="text-xs text-gray-500">
                      {bucket.min.toFixed(0)}{unit}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Analyze Complexity Button */}
        <div className="mt-6">
          <button className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
            </svg>
            <span>🔮 Analyze Complexity</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {allSubmissions.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PerformanceCard
            title="Runtime"
            value={currentRuntime}
            unit="ms"
            beats={beatsPercentage.runtime}
            icon={
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.4L16.2,16.2Z"/>
              </svg>
            }
            data={chartData.runtime}
            type="runtime"
            color="blue"
          />
          
          <PerformanceCard
            title="Memory"
            value={currentMemory / (1024 * 1024)}
            unit="MB"
            beats={beatsPercentage.memory}
            icon={
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V10.5A1,1 0 0,0 4,11.5H16A1,1 0 0,0 17,10.5M20,2H8A2,2 0 0,0 6,4V6H4A2,2 0 0,0 2,8V16A2,2 0 0,0 4,18H6V20A2,2 0 0,0 8,22H20A2,2 0 0,0 22,20V4A2,2 0 0,0 20,2Z"/>
              </svg>
            }
            data={chartData.memory}
            type="memory"
            color="green"
          />
        </div>
      ) : (
        <div className="bg-gray-800 rounded-xl p-12 border border-gray-700 text-center">
          <div className="text-gray-500 mb-4">
            <svg className="w-16 h-16 mx-auto" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5,3H19A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3M5,5V19H19V5H5Z"/>
            </svg>
          </div>
          <p className="text-xl font-semibold text-gray-400 mb-2">No Performance Data</p>
          <p className="text-gray-500">Submit more solutions to see performance analysis</p>
        </div>
      )}
    </div>
  );
};
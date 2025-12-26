"use client";

interface RadialGaugeProps {
  value: number; // 0-100
  label: string;
  size?: number;
}

export default function RadialGauge({ value, label, size = 160 }: RadialGaugeProps) {
  const radius = size / 2 - 10;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  
  // Calculate stroke offset for the arc (starts at -90 degrees, goes 270 degrees)
  const offset = circumference - (value / 100) * (circumference * 0.75);
  
  // Determine color based on value (higher = worse = red)
  const getColor = () => {
    if (value >= 70) return '#ef4444'; // Red - Critical
    if (value >= 40) return '#f59e0b'; // Amber - Warning
    return '#10b981'; // Green - Low risk
  };
  
  const getZoneColor = (zone: 'green' | 'amber' | 'red') => {
    if (zone === 'green') return '#10b981';
    if (zone === 'amber') return '#f59e0b';
    return '#ef4444';
  };
  
  const isInZone = (zone: 'green' | 'amber' | 'red') => {
    if (zone === 'green') return value < 40;
    if (zone === 'amber') return value >= 40 && value < 70;
    return value >= 70;
  };
  
  // Calculate needle rotation (starts at -135 deg, rotates 270 deg total)
  const needleRotation = -135 + (value / 100) * 270;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background zones */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#f0f0f0"
            strokeWidth="20"
            strokeDasharray={`${circumference * 0.75} ${circumference}`}
            strokeLinecap="round"
          />
          
          {/* Green zone (0-40) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={getZoneColor('green')}
            strokeWidth="20"
            strokeDasharray={`${circumference * 0.3} ${circumference}`}
            strokeDashoffset={0}
            strokeLinecap="round"
            opacity={isInZone('green') ? 1 : 0.3}
          />
          
          {/* Amber zone (40-70) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={getZoneColor('amber')}
            strokeWidth="20"
            strokeDasharray={`${circumference * 0.225} ${circumference}`}
            strokeDashoffset={-circumference * 0.3}
            strokeLinecap="round"
            opacity={isInZone('amber') ? 1 : 0.3}
          />
          
          {/* Red zone (70-100) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={getZoneColor('red')}
            strokeWidth="20"
            strokeDasharray={`${circumference * 0.225} ${circumference}`}
            strokeDashoffset={-circumference * 0.525}
            strokeLinecap="round"
            opacity={isInZone('red') ? 1 : 0.3}
          />
          
          {/* Value arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={getColor()}
            strokeWidth="22"
            strokeDasharray={`${circumference * 0.75} ${circumference}`}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
          />
        </svg>
        
        {/* Needle */}
        <div 
          className="absolute inset-0 flex items-center justify-center transition-transform duration-1000 ease-out"
          style={{ 
            transform: `rotate(${needleRotation}deg)`,
            transformOrigin: 'center center'
          }}
        >
          <div className="absolute" style={{ width: '2px', height: `${radius - 15}px`, backgroundColor: '#1f2937', bottom: '50%', left: '50%', marginLeft: '-1px' }}>
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-800 rounded-full"></div>
          </div>
        </div>
        
        {/* Center circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-gray-100">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{value}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-2 text-sm font-medium text-gray-700 text-center">
        {label}
      </div>
    </div>
  );
}

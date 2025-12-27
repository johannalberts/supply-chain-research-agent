"use client";

interface RadialGaugeProps {
  value: number; // 0-100
  label: string;
  size?: number;
}

export default function RadialGauge({ value, label, size = 180 }: RadialGaugeProps) {
  // Determine color based on value (higher = worse = red)
  const getColor = () => {
    if (value >= 70) return '#ef4444'; // Critical Red
    if (value >= 40) return '#f59e0b'; // Warning Amber
    return '#14b8a6'; // Success Teal
  };
  
  const getStatusText = () => {
    if (value >= 70) return 'CRITICAL';
    if (value >= 40) return 'CAUTION';
    return 'NOMINAL';
  };

  return (
    <div className="flex flex-col items-center gap-3" style={{ position: 'relative', zIndex: 0 }}>
      {/* Futuristic Gauge Display */}
      <div 
        className="relative flex items-center justify-center sci-panel"
        style={{ 
          width: size, 
          height: size * 0.7,
          background: 'linear-gradient(135deg, #0f1419 0%, #0a0a0a 100%)',
          border: `3px solid ${getColor()}`,
          boxShadow: `inset 0 0 20px rgba(0,0,0,0.5), 0 0 20px ${getColor()}40`,
          position: 'relative',
          zIndex: 0,
        }}
      >
        {/* Left decorative bars */}
        <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col gap-1 p-1">
          <div className="flex-1 rounded-full" style={{ background: '#14b8a6' }}></div>
          <div className="flex-1 rounded-full" style={{ background: '#a855f7' }}></div>
          <div className="flex-1 rounded-full" style={{ background: '#06b6d4' }}></div>
          <div className="flex-1 rounded-full" style={{ background: '#10b981' }}></div>
        </div>

        {/* Right decorative bars */}
        <div className="absolute right-0 top-0 bottom-0 w-12 flex flex-col gap-1 p-1">
          <div className="flex-1 rounded-full" style={{ background: '#f97316' }}></div>
          <div className="flex-1 rounded-full" style={{ background: '#f59e0b' }}></div>
          <div className="flex-1 rounded-full" style={{ background: '#fb7185' }}></div>
          <div className="flex-1 rounded-full" style={{ background: '#6366f1' }}></div>
        </div>

        {/* Center value display */}
        <div className="flex flex-col items-center justify-center" style={{ position: 'relative', zIndex: 1 }}>
          <div 
            className="text-6xl font-bold sci-text glow-effect transition-all duration-500"
            style={{ 
              color: getColor(),
              fontFamily: 'Orbitron, monospace',
              fontWeight: 900,
              position: 'relative',
              zIndex: 1,
            }}
          >
            {value}
          </div>
          <div 
            className="text-xs font-bold mt-1 px-3 py-1 rounded-full"
            style={{ 
              background: getColor(),
              color: '#000',
              fontFamily: 'Antonio, sans-serif',
              letterSpacing: '0.1em',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {getStatusText()}
          </div>
        </div>

        {/* Corner accents */}
        <div className="absolute top-2 left-14 w-8 h-1 rounded-full" style={{ background: getColor(), opacity: 0.5 }}></div>
        <div className="absolute top-2 right-14 w-8 h-1 rounded-full" style={{ background: getColor(), opacity: 0.5 }}></div>
        <div className="absolute bottom-2 left-14 w-8 h-1 rounded-full" style={{ background: getColor(), opacity: 0.5 }}></div>
        <div className="absolute bottom-2 right-14 w-8 h-1 rounded-full" style={{ background: getColor(), opacity: 0.5 }}></div>
      </div>
      
      {/* Label with futuristic styling */}
      <div 
        className="text-sm font-bold text-center px-4 py-2 rounded-full sci-button"
        style={{ 
          background: '#14b8a6',
          color: '#000',
          minWidth: '140px',
        }}
      >
        {label}
      </div>
    </div>
  );
}

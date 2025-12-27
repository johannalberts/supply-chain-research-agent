"use client";

interface NumericalGaugeProps {
  value: number; // 0-10
  label: string;
  size?: number;
}

export default function NumericalGauge({ value, label, size = 180 }: NumericalGaugeProps) {
  const segments = 10; // Number of segments in the bar
  const filledSegments = Math.round((value / 10) * segments);
  
  // Determine color based on value (higher = worse = red)
  const getColor = () => {
    if (value >= 7) return '#ef4444'; // Critical Red (70%+)
    if (value >= 4) return '#f59e0b'; // Warning Amber (40-70%)
    return '#14b8a6'; // Success Teal (<40%)
  };
  
  const getStatusText = () => {
    if (value >= 7) return 'HIGH';
    if (value >= 4) return 'MEDIUM';
    return 'LOW';
  };

  // Get color for individual segment based on position
  const getSegmentColor = (index: number) => {
    const position = (index + 1) / segments;
    if (position >= 0.7) return '#ef4444'; // Red zone
    if (position >= 0.4) return '#f59e0b'; // Amber zone
    return '#14b8a6'; // Teal zone
  };

  // Calculate pulse speed based on risk (higher risk = faster pulse)
  const pulseSpeed = value >= 7 ? '1s' : value >= 4 ? '1.5s' : '2s';

  return (
    <div className="flex flex-col items-center gap-3" style={{ position: 'relative', zIndex: 0 }}>
      <style jsx>{`
        @keyframes pulse-segment {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes light-up {
          0% { opacity: 0.2; }
          100% { opacity: 1; }
        }
      `}</style>

      {/* Futuristic Gauge Display */}
      <div 
        className="relative flex flex-col items-center justify-center sci-panel"
        style={{ 
          width: size, 
          height: size * 0.8,
          background: 'linear-gradient(135deg, #0f1419 0%, #0a0a0a 100%)',
          border: `3px solid ${getColor()}`,
          boxShadow: `inset 0 0 20px rgba(0,0,0,0.5), 0 0 20px ${getColor()}40`,
          position: 'relative',
          zIndex: 0,
          padding: '20px',
        }}
      >
        {/* Numerical value */}
        <div 
          className="text-5xl font-bold sci-text mb-4"
          style={{ 
            color: getColor(),
            fontFamily: 'Orbitron, monospace',
            fontWeight: 900,
            textShadow: `0 0 10px ${getColor()}, 0 0 20px ${getColor()}`,
          }}
        >
          {value.toFixed(1)}
        </div>

        {/* Segmented Progress Bar */}
        <div 
          className="flex gap-1 mb-3"
          style={{ 
            width: '100%',
            height: '40px',
          }}
        >
          {Array.from({ length: segments }).map((_, index) => {
            const isFilled = index < filledSegments;
            const segmentColor = getSegmentColor(index);
            
            return (
              <div
                key={index}
                style={{
                  flex: 1,
                  background: isFilled ? segmentColor : '#1a1a1a',
                  border: `1px solid ${isFilled ? segmentColor : '#333'}`,
                  borderRadius: '4px',
                  opacity: isFilled ? 1 : 0.3,
                  animation: isFilled ? `pulse-segment ${pulseSpeed} ease-in-out infinite, light-up 0.3s ease-out` : 'none',
                  animationDelay: isFilled ? `${index * 0.05}s` : '0s',
                  boxShadow: isFilled ? `0 0 10px ${segmentColor}40` : 'none',
                  transition: 'all 0.3s ease',
                }}
              />
            );
          })}
        </div>

        {/* Status badge */}
        <div 
          className="text-xs font-bold px-4 py-1 rounded-full"
          style={{ 
            background: getColor(),
            color: '#000',
            fontFamily: 'Antonio, sans-serif',
            letterSpacing: '0.1em',
          }}
        >
          {getStatusText()}
        </div>

        {/* Corner decorative accents */}
        <div aria-hidden="true" className="absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 rounded-tl-lg" style={{ borderColor: getColor(), opacity: 0.5 }}></div>
        <div aria-hidden="true" className="absolute top-2 right-2 w-8 h-8 border-r-2 border-t-2 rounded-tr-lg" style={{ borderColor: getColor(), opacity: 0.5 }}></div>
        <div aria-hidden="true" className="absolute bottom-2 left-2 w-8 h-8 border-l-2 border-b-2 rounded-bl-lg" style={{ borderColor: getColor(), opacity: 0.5 }}></div>
        <div aria-hidden="true" className="absolute bottom-2 right-2 w-8 h-8 border-r-2 border-b-2 rounded-br-lg" style={{ borderColor: getColor(), opacity: 0.5 }}></div>
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

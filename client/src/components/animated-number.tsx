import { useEffect, useState } from "react";

interface AnimatedNumberProps {
  value: number;
  className?: string;
  duration?: number;
}

export default function AnimatedNumber({ 
  value, 
  className = "", 
  duration = 1000 
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [previousValue, setPreviousValue] = useState(0);

  useEffect(() => {
    if (value === previousValue) return;
    
    const startValue = displayValue;
    const endValue = value;
    const startTime = Date.now();
    
    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(startValue + (endValue - startValue) * easeOut);
      
      setDisplayValue(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setPreviousValue(value);
      }
    };
    
    animate();
  }, [value, previousValue, displayValue, duration]);

  return (
    <div className={`number-display font-mono tabular-nums transition-all duration-300 ${className}`}>
      {displayValue.toLocaleString()}
    </div>
  );
}

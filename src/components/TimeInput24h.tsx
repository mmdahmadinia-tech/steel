import React, { useState, useRef, useEffect } from 'react';

interface TimeInput24hProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

/**
 * TimeInput24h - A custom 24-hour time input that works in all browsers
 * Format: HH:MM (24-hour)
 * This solves the browser issue where type="time" shows 12-hour format
 */
export default function TimeInput24h({ value, onChange, label, className = '' }: TimeInput24hProps) {
  const [displayValue, setDisplayValue] = useState(value || '');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDisplayValue(value || '');
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    
    // Remove non-numeric characters except colon
    val = val.replace(/[^\d:]/g, '');
    
    // Auto-format as user types
    if (val.length === 1 && parseInt(val) > 2) {
      val = '0' + val + ':';
    } else if (val.length === 2 && !val.includes(':')) {
      val = val + ':';
    } else if (val.length === 4 && val.includes(':')) {
      // Complete time entered
      const [h, m] = val.split(':');
      const hour = parseInt(h);
      const min = parseInt(m);
      
      if (hour >= 0 && hour <= 23 && min >= 0 && min <= 59) {
        setError('');
        setDisplayValue(val);
        onChange(val);
        return;
      } else {
        setError('زمان نامعتبر (00:00 - 23:59)');
      }
    }
    
    setDisplayValue(val);
    setError('');
  };

  const handleBlur = () => {
    if (!displayValue) return;
    
    // Validate and format on blur
    let val = displayValue;
    
    // If only hours entered (e.g., "8" or "14")
    if (!val.includes(':') && val.length <= 2) {
      val = val.padStart(2, '0') + ':00';
    }
    // If hours and single digit minutes (e.g., "8:3")
    else if (val.includes(':') && val.split(':')[1].length === 1) {
      val = val + '0';
    }
    
    const [h, m] = val.split(':').map(Number);
    
    if (isNaN(h) || isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) {
      setError('زمان نامعتبر');
      return;
    }
    
    const formatted = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    setDisplayValue(formatted);
    onChange(formatted);
    setError('');
  };

  return (
    <div className={className}>
      {label && <label className="label-field">{label} (24h)</label>}
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        pattern="[0-9]:?[0-9]?[0-9]:?[0-9]?[0-9]"
        placeholder="HH:MM"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        maxLength={5}
        className={`input-field ${error ? 'border-red-500' : ''}`}
        dir="ltr"
        style={{ textAlign: 'center', fontFamily: 'monospace', letterSpacing: '2px' }}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

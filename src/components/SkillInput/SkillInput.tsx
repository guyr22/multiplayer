import React, { useState, useEffect } from 'react';
import './SkillInput.css';

interface SkillInputProps {
  label: string;
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
  onValueChange: (newValue: number) => void;
  isDecrementDisabled: boolean;
  isIncrementDisabled: boolean;
}
export const SkillInput: React.FC<SkillInputProps> = ({
  label,
  value,
  onDecrement,
  onIncrement,
  onValueChange,
  isDecrementDisabled,
  isIncrementDisabled,
}) => {
  // Local state for the input value as string
  const [inputValue, setInputValue] = useState(value.toString());

  // Keep local input in sync with prop value (when parent changes it)
  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  // Update local state as user types
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // On blur, clamp and commit the value
  const handleInputBlur = () => {
    let numValue = parseInt(inputValue, 10);
    if (isNaN(numValue)) numValue = value; // fallback to current value if invalid

    // Clamp to min/max (replace with your actual min/max)
    const MIN = 6;
    const MAX = 30;
    const clamped = Math.max(MIN, Math.min(numValue, MAX));
    setInputValue(clamped.toString());
    if (clamped !== value) {
      onValueChange(clamped);
    }
  };

  return (
    <div className="skill-input-container">
      <label className="skill-label">{label}</label>
      <div className="skill-controls">
        <button className="control-button" onClick={onDecrement} disabled={isDecrementDisabled}>-</button>
        <input 
          type="number" 
          className="skill-value-input" 
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
        />
        <button className="control-button" onClick={onIncrement} disabled={isIncrementDisabled}>+</button>
      </div>
    </div>
  );
};
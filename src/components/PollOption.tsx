import React from 'react';
import { BarChart2 } from 'lucide-react';

interface PollOptionProps {
  option: string;
  isVotingEnabled: boolean;
  isSelected: boolean;
  percentage: number;
  showResults: boolean;
  onSelect: (option: string) => void;
}

export default function PollOption({
  option,
  isVotingEnabled,
  isSelected,
  percentage,
  showResults,
  onSelect,
}: PollOptionProps) {
  return (
    <div className="relative">
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="flex items-center">
          {isVotingEnabled && (
            <input
              type="radio"
              name="poll-option"
              value={option}
              checked={isSelected}
              onChange={() => onSelect(option)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
            />
          )}
          <label className={`ml-3 ${!isVotingEnabled ? 'text-gray-700' : ''}`}>
            {option}
          </label>
        </div>
        {showResults && (
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-600">
              {percentage.toFixed(1)}%
            </span>
            <BarChart2 className="h-4 w-4 ml-2 text-gray-400" />
          </div>
        )}
      </div>
      {showResults && (
        <div
          className="absolute top-0 left-0 h-full bg-indigo-50 rounded-lg transition-all"
          style={{
            width: `${percentage}%`,
            zIndex: -1
          }}
        />
      )}
    </div>
  );
}
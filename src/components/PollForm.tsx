import React from 'react';
import { PlusCircle, MinusCircle } from 'lucide-react';

interface PollFormProps {
  title: string;
  description: string;
  options: string[];
  startTime: string;
  endTime: string;
  error: string;
  loading: boolean;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onOptionChange: (index: number, value: string) => void;
  onAddOption: () => void;
  onRemoveOption: (index: number) => void;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function PollForm({
  title,
  description,
  options,
  startTime,
  endTime,
  error,
  loading,
  onTitleChange,
  onDescriptionChange,
  onOptionChange,
  onAddOption,
  onRemoveOption,
  onStartTimeChange,
  onEndTimeChange,
  onSubmit,
}: PollFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title
        </label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Options
        </label>
        <div className="space-y-2">
          {options.map((option, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                required
                value={option}
                onChange={(e) => onOptionChange(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={`Option ${index + 1}`}
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => onRemoveOption(index)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <MinusCircle className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={onAddOption}
          className="mt-2 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800"
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          Add Option
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Time
          </label>
          <input
            type="datetime-local"
            required
            value={startTime}
            onChange={(e) => onStartTimeChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Time
          </label>
          <input
            type="datetime-local"
            required
            value={endTime}
            onChange={(e) => onEndTimeChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Poll
        </button>
      </div>
    </form>
  );
}
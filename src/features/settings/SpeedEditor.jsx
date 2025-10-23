import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function SpeedEditor({ settings, onChange, isOpen, onClose }) {
  const [tempSettings, setTempSettings] = useState(settings);

  const speedLevels = [
    { key: 'slowest', label: 'Slowest' },
    { key: 'slow', label: 'Slow' },
    { key: 'normal', label: 'Normal' },
    { key: 'fast', label: 'Fast' },
    { key: 'fastest', label: 'Fastest' }
  ];

  const handleSave = () => {
    onChange(tempSettings);
    onClose();
  };

  const handleCancel = () => {
    setTempSettings(settings);
    onClose();
  };

  const updateSpeedSetting = (level, type, value) => {
    setTempSettings(prev => ({
      ...prev,
      [`${level}${type.charAt(0).toUpperCase() + type.slice(1)}`]: parseInt(value) || 0
    }));
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Edit Speed</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-600">
            <div>Speed Level</div>
            <div>Display Time (ms)</div>
            <div>Interval Time (ms)</div>
          </div>

          {speedLevels.map((level) => (
            <div key={level.key} className="grid grid-cols-3 gap-4 items-center">
              <div className="font-medium">{level.label}</div>
              <input
                type="number"
                min="0"
                value={tempSettings[`${level.key}Display`] || 0}
                onChange={(e) => updateSpeedSetting(level.key, 'display', e.target.value)}
                className="input text-center"
              />
              <input
                type="number"
                min="0"
                value={tempSettings[`${level.key}Interval`] || 0}
                onChange={(e) => updateSpeedSetting(level.key, 'interval', e.target.value)}
                className="input text-center"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
import React from 'react';
import { motion } from 'framer-motion';

export default function Tabs({ value, onChange, options }) {
  return (
    <div className="flex flex-col sm:flex-row w-full sm:w-auto rounded-2xl bg-gray-100/80 p-1 border border-gray-200/50 shadow-md shadow-gray-200/20 gap-1 sm:gap-0 backdrop-blur-sm">
      {options.map((opt) => {
        const optionValue = typeof opt === 'string' ? opt : opt.value;
        const optionLabel = typeof opt === 'string' ? opt : opt.label;
        
        return (
          <motion.button
            key={optionValue}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(optionValue)}
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm transition-all duration-200 ${
              value === optionValue
                ? 'bg-white shadow-md shadow-gray-200/30 font-semibold text-blue-600 border border-blue-200/30'
                : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
            }`}
          >
            {optionLabel}
          </motion.button>
        );
      })}
    </div>
  );
}

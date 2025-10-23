import React from 'react';
import { motion } from 'framer-motion';

export default function Tabs({ value, onChange, options }) {
  return (
    <div className="flex flex-col sm:flex-row w-full sm:w-auto rounded-2xl bg-gray-100 p-1 border gap-1 sm:gap-0">
      {options.map((opt) => {
        const optionValue = typeof opt === 'string' ? opt : opt.value;
        const optionLabel = typeof opt === 'string' ? opt : opt.label;
        
        return (
          <motion.button
            key={optionValue}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(optionValue)}
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm transition-all ${
              value === optionValue
                ? 'bg-white shadow font-semibold text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {optionLabel}
          </motion.button>
        );
      })}
    </div>
  );
}

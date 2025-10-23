import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import NumberDisplay from './NumberDisplay.jsx';

export default function Result({ sequence, result, fontSize = 120 }) {
  const { t } = useTranslation();
  
  return (
    <motion.div 
      className="text-center relative"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Celebration particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full"
          style={{
            background: `hsl(${i * 30}, 70%, 60%)`,
            left: `${20 + (i % 4) * 20}%`,
            top: `${10 + Math.floor(i / 4) * 30}%`
          }}
          initial={{ 
            scale: 0, 
            opacity: 0,
            x: 0,
            y: 0
          }}
          animate={{ 
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            x: [0, (Math.random() - 0.5) * 200],
            y: [0, (Math.random() - 0.5) * 200]
          }}
          transition={{ 
            duration: 2,
            delay: i * 0.1,
            ease: "easeOut"
          }}
        />
      ))}

      {/* Success title with animation */}
      <motion.h3 
        className="text-3xl font-bold mb-8 relative"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        style={{
          background: `linear-gradient(135deg, 
            #10b981 0%, 
            #059669 25%, 
            #047857 50%, 
            #065f46 75%, 
            #064e3b 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}
      >
        <motion.span
          animate={{ rotate: [0, 10, 0] }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="inline-block mr-3"
        >
          🎉
        </motion.span>
{t('flashCalculation.result.title')}:
        <motion.span
          animate={{ rotate: [0, -10, 0] }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="inline-block ml-3"
        >
          🎯
        </motion.span>
      </motion.h3>

      {/* Result display with enhanced styling */}
      <motion.div 
        className="mb-8 relative"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
      >
        {/* Glow effect behind result */}
        <motion.div
          className="absolute inset-0 rounded-3xl opacity-30"
          style={{
            background: `radial-gradient(circle, 
              rgba(16, 185, 129, 0.3) 0%, 
              rgba(5, 150, 105, 0.2) 50%, 
              transparent 100%)`
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <NumberDisplay 
          number={result} 
          fontSize={fontSize} 
          isVisible={true} 
          onComplete={() => {}} 
        />
      </motion.div>

      {/* Sequence breakdown */}
      <motion.div
        className="mt-8 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <h4 className="text-lg font-semibold text-gray-700 mb-4">
          {t('flashCalculation.result.numberSequence')}
        </h4>
        <div className="flex flex-wrap justify-center gap-3">
          {sequence.map((num, index) => (
            <motion.div
              key={index}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold shadow-lg"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: 0.8 + index * 0.1, 
                duration: 0.3,
                type: "spring",
                stiffness: 200
              }}
              whileHover={{ 
                scale: 1.1,
                rotate: -5
              }}
            >
              {num}
              {index < sequence.length - 1 && (
                <motion.span 
                  className="ml-2"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ 
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  +
                </motion.span>
              )}
            </motion.div>
          ))}
        </div>
        
        {/* Total calculation */}
        <motion.div
          className="mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <span className="text-gray-600 font-medium">
            {t('flashCalculation.result.total')} {sequence.join(' + ')} = 
          </span>
          <motion.span
            className="ml-2 text-xl font-bold text-green-600"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              delay: 1.4, 
              duration: 0.5,
              type: "spring",
              stiffness: 200
            }}
          >
            {result}
          </motion.span>
        </motion.div>
      </motion.div>

    </motion.div>
  );
}

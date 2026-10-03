import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NumberDisplay({ number, fontSize, isVisible, speed }) {
  // Përcaktojmë nëse është shpejtësi e lartë (fast ose fastest)
  const isHighSpeed = speed >= 4;
  
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key={number}
          className="number-display relative"
          style={{ 
            fontSize: `${fontSize}px`,
            willChange: 'opacity, transform'
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ 
            duration: isHighSpeed ? 0.05 : 0.15,
            ease: "easeOut"
          }}
        >
          {/* Glow effect background - thjeshtuar për shpejtësi të lartë */}
          {!isHighSpeed && (
            <div
              className="absolute inset-0 rounded-2xl opacity-30"
              style={{
                background: `linear-gradient(135deg, 
                  rgba(99, 102, 241, 0.3) 0%, 
                  rgba(139, 92, 246, 0.3) 50%, 
                  rgba(236, 72, 153, 0.3) 100%)`
              }}
            />
          )}
          
          {/* Main number - stilizim i thjeshtuar për shpejtësi të lartë */}
          <span
            className="relative z-10 font-black tracking-wider"
            style={isHighSpeed ? {
              // Stil minimal për shpejtësi të lartë
              color: '#667eea',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            } : {
              // Stil i plotë për shpejtësi normale
              background: `linear-gradient(135deg, 
                #667eea 0%, 
                #764ba2 25%, 
                #f093fb 50%, 
                #f5576c 75%, 
                #4facfe 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 20px rgba(0, 0, 0, 0.1))',
              textShadow: '0 0 30px rgba(99, 102, 241, 0.5)'
            }}
          >
            {number}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NumberDisplay({ number, fontSize, isVisible, onComplete }) {
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <div
          key={number}
          className="number-display relative"
          style={{ fontSize: `${fontSize}px` }}
        >
          {/* Glow effect background */}
          <div
            className="absolute inset-0 rounded-2xl opacity-30"
            style={{
              background: `linear-gradient(135deg, 
                rgba(99, 102, 241, 0.3) 0%, 
                rgba(139, 92, 246, 0.3) 50%, 
                rgba(236, 72, 153, 0.3) 100%)`
            }}
          />
          
          {/* Main number with enhanced styling */}
          <span
            className="relative z-10 font-black tracking-wider"
            style={{
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
        </div>
      )}
    </AnimatePresence>
  );
}

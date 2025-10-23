import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import NumberDisplay from './NumberDisplay.jsx';
import Result from './Result.jsx';
import { resumeAudio, playHeartbeatBeep, playSuccessChime, initAudioForMobile } from '../utils/audio.js';

export default function CalculationTable({ 
  phase, 
  currentSequence, 
  currentIndex, 
  settings, 
  result
}) {
  const { t } = useTranslation();
  const [showResult, setShowResult] = useState(false);
  const successPlayedRef = useRef(false);

  // Reset showResult kur fillon një sekuencë e re
  useEffect(() => {
    if (phase === 'showing' && currentIndex === 0) {
      setShowResult(false);
    }
  }, [phase, currentIndex]);

  // Play success chime when result is shown
  useEffect(() => {
    const canPlay = phase === 'result' && showResult && settings.enableAudio;

    if (canPlay && !successPlayedRef.current) {
      // Initialize audio for mobile compatibility
      initAudioForMobile().then(() => {
        // siguro që AudioContext është "running" (policy e shfletuesve)
        resumeAudio();
        // 🎉 luaj chime suksesi (pip-pip)
        playSuccessChime();
        successPlayedRef.current = true;
      });
    }

    // ri-lejo tingullin kur dalim nga faza e rezultatit
    if (!canPlay) {
      successPlayedRef.current = false;
    }
  }, [phase, showResult, settings.enableAudio]);

  // Play heartbeat beep when a new number is shown (me delay për sinkronizim)
  useEffect(() => {
    if (phase === 'showing' && currentSequence.length > 0 && settings.enableAudio) {
      // Delay audio për të sinkronizuar me animacionin e NumberDisplay (0.6s)
      const audioDelay = setTimeout(() => {
        // Check if this is the last number
        const isLastNumber = currentIndex === currentSequence.length - 1;
        
        // Initialize audio for mobile compatibility
        initAudioForMobile().then(() => {
          if (isLastNumber) {
            // Different tone for the last number - higher and longer
            playHeartbeatBeep({
              startHz: 1200,
              endHz: 1000,
              durationMs: 1000,
              volume: 0.4,
              wave: 'triangle',
              bandHz: 1600,
              q: 10
            });
          } else {
            // Regular heartbeat beep for other numbers
            playHeartbeatBeep();
          }
        });
      }, 300); // 300ms delay për të sinkronizuar me animacionin

      return () => clearTimeout(audioDelay);
    }
  }, [phase, currentIndex, currentSequence.length, settings.enableAudio]);
  return (
    <motion.div 
      className="w-full max-w-4xl glass-effect rounded-3xl p-8 min-h-96 flex items-center justify-center relative overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 rounded-3xl opacity-20"
        style={{
          background: `linear-gradient(135deg, 
            rgba(99, 102, 241, 0.1) 0%, 
            rgba(139, 92, 246, 0.1) 25%, 
            rgba(236, 72, 153, 0.1) 50%, 
            rgba(16, 185, 129, 0.1) 75%, 
            rgba(59, 130, 246, 0.1) 100%)`
        }}
        animate={{
          background: [
            `linear-gradient(135deg, 
              rgba(99, 102, 241, 0.1) 0%, 
              rgba(139, 92, 246, 0.1) 25%, 
              rgba(236, 72, 153, 0.1) 50%, 
              rgba(16, 185, 129, 0.1) 75%, 
              rgba(59, 130, 246, 0.1) 100%)`,
            `linear-gradient(135deg, 
              rgba(139, 92, 246, 0.1) 0%, 
              rgba(236, 72, 153, 0.1) 25%, 
              rgba(16, 185, 129, 0.1) 50%, 
              rgba(59, 130, 246, 0.1) 75%, 
              rgba(99, 102, 241, 0.1) 100%)`
          ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      <AnimatePresence mode="wait">
        {phase === 'showing' && currentSequence.length > 0 && (
          <motion.div 
            key="showing"
            className="text-center relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <NumberDisplay 
              number={currentSequence[currentIndex]} 
              fontSize={settings.fontSize} 
              isVisible={true} 
              onComplete={() => {}} 
            />
          </motion.div>
        )}

        {phase === 'interval' && currentSequence.length > 0 && (
          <motion.div 
            key="interval"
            className="text-center relative z-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.2 }}
          >
            {/* Interval phase - no animation, just empty space */}
          </motion.div>
        )}
        
        {phase === 'result' && !showResult && (
          <motion.div 
            key="result-button"
            className="text-center relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <motion.button 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }} 
              onClick={() => setShowResult(true)}
              className="btn-result group"
            >
              <motion.span
                animate={{ rotate: [0, 10, 0] }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                🎯
              </motion.span>
{t('flashCalculation.result.showResult')}
            </motion.button>
          </motion.div>
        )}

        {phase === 'result' && showResult && (
          <motion.div
            key="result-display"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative z-10"
          >
            <Result sequence={currentSequence} result={result} fontSize={settings.fontSize} />
          </motion.div>
        )}
        
        {phase === 'idle' && (
          <motion.div 
            key="idle"
            className="text-center relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <motion.h3 
              className="text-2xl font-bold text-gray-800 mb-4"
              animate={{ 
                backgroundPosition: ["0%", "100%", "0%"]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                background: `linear-gradient(90deg, 
                  #667eea 0%, 
                  #764ba2 50%, 
                  #667eea 100%)`,
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              {t('flashCalculation.idle.title')}
            </motion.h3>
            <motion.p 
              className="text-gray-600 text-lg"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {t('flashCalculation.idle.subtitle')}
            </motion.p>
            
            {/* Floating icons */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl opacity-20"
                style={{
                  left: `${20 + i * 20}%`,
                  top: `${30 + (i % 2) * 40}%`
                }}
                animate={{
                  y: [-10, 10, -10],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.5
                }}
              >
                {['🧮', '⚡', '🎯', '🚀'][i]}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

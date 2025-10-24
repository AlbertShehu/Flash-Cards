import React, { useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Zap, Play, Pause, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import CalculationTable from '../../components/CalculationTable.jsx';
import Footer from '../../components/Footer.jsx';
import { getSpeedTable } from '../../utils/speed.js';
import { generateNumber } from '../../utils/random.js';
import { resumeAudio, initAudioForMobile, unlockAudio, playClick, hardUnlockAudio } from '../../utils/audio.js';
import { addHistoryEntry } from '../../components/History.jsx';
import { useEffect } from 'react';

export default function FlashCalculationTrainer({ settings }) {
  const { t } = useTranslation();
  const [isRunning, setIsRunning] = useState(false);
  const [currentSequence, setCurrentSequence] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(0);
  const [phase, setPhase] = useState('idle'); // 'idle', 'showing', 'interval', 'result'

  const speeds = useMemo(() => getSpeedTable(settings), [settings]);
  const currentSpeed = speeds[Math.max(0, Math.min(4, settings.speedFlashCalculation - 1))];

  // Logjika e re për sekuencën - shfaq numrat një nga një
  const showNextInSequence = useCallback(() => {
    setCurrentIndex(prevIndex => {
      if (prevIndex < currentSequence.length - 1) {
        // Kalon në fazën e interval-it (pauzë)
        setPhase('interval');
        return prevIndex + 1;
      } else {
        // Sekuenca përfundoi, kalon në fazën e rezultatit dhe ruaj në history
        setPhase('result');
        setIsRunning(false);
        
        // Ruaj në history - llogarit rezultatin direkt
        if (currentSequence.length > 0) {
          const sum = currentSequence.reduce((acc, num) => {
            const parsed = parseFloat(num);
            return acc + (isNaN(parsed) ? 0 : parsed);
          }, 0);
          
          // Nëse negativeShow është aktiv, rezultati duhet të jetë gjithmonë pozitiv
          const finalSum = settings.negativeShow ? Math.abs(sum) : sum;
          
          const formattedSum = settings.decimalShow && settings.decimalLength > 0 
            ? finalSum.toFixed(settings.decimalLength)
            : finalSum;
            
          addHistoryEntry(currentSequence, formattedSum);
        }
        
        return prevIndex;
      }
    });
  }, [currentSequence, settings]);

  // Kalon nga interval në showing për numrin tjetër
  const startNextNumber = useCallback(() => {
    setPhase('showing');
  }, []);

  const start = useCallback(async () => {
    
    const newSequence = [];
    let runningSum = 0;
    
    for (let i = 0; i < settings.displayFlashCalculation; i++) {
      let number;
      let attempts = 0;
      const maxAttempts = 10; // Për të parandaluar loop të pafund
      
      do {
        // Numri i parë nuk duhet të jetë negativ
        number = generateNumber(settings, i === 0);
        const parsed = parseFloat(number);
        
        if (!isNaN(parsed)) {
          const newSum = runningSum + parsed;
          
          // Nëse negativeShow është aktiv, siguro që rezultati i përkohshëm të mos jetë negativ
          if (settings.negativeShow && newSum < 0) {
            // Nëse rezultati do të jetë negativ, gjenero një numër pozitiv
            number = generateNumber({...settings, negativeShow: false}, i === 0);
            runningSum += parseFloat(number);
          } else {
            runningSum = newSum;
          }
        }
        
        attempts++;
      } while (attempts < maxAttempts && settings.negativeShow && runningSum < 0);
      
      newSequence.push(number);
    }
    
    setCurrentSequence(newSequence);
    setCurrentIndex(0);
    setPhase('showing');
    setIsRunning(true);
    setShowResult(false);
    setResult(0);
    
    // Calculate final result
    const sum = newSequence.reduce((acc, num) => {
      const parsed = parseFloat(num);
      return acc + (isNaN(parsed) ? 0 : parsed);
    }, 0);
    
    // Nëse negativeShow është aktiv, rezultati duhet të jetë gjithmonë pozitiv
    const finalSum = settings.negativeShow ? Math.abs(sum) : sum;
    
    // Format result based on decimalLength
    const formattedSum = settings.decimalShow && settings.decimalLength > 0 
      ? finalSum.toFixed(settings.decimalLength)
      : finalSum;
    
    setResult(formattedSum);
  }, [settings]);

  // Handle start with proper audio unlock for iPhone 13
  const handleStart = useCallback((e) => {
    // 1) UNLOCK – brenda këtij event-i (pa 'await', pa 'setTimeout')
    if (settings.enableAudio) {
      hardUnlockAudio();
      // 2) feedback i menjëherëshëm (opsional)
      playClick();
    }
    // 3) fillo logjikën e app-it
    start();
  }, [settings.enableAudio, start]);

  const stop = useCallback(() => {
    setIsRunning(false);
    setPhase('idle');
    setCurrentSequence([]);
    setCurrentIndex(0);
    setShowResult(false);
    setResult(0);
  }, []);

  // Timer për Display Time - koha që numri shfaqet për memorizim
  useEffect(() => {
    if (!isRunning || phase !== 'showing' || currentSequence.length === 0) return;

    const displayTimer = setTimeout(() => {
      showNextInSequence();
    }, currentSpeed.display);

    return () => clearTimeout(displayTimer);
  }, [isRunning, phase, currentSequence.length, currentIndex, showNextInSequence, currentSpeed.display]);

  // Timer për Interval Time - pauza midis numrave
  useEffect(() => {
    if (!isRunning || phase !== 'interval' || currentSequence.length === 0) return;

    const intervalTimer = setTimeout(() => {
      startNextNumber();
    }, currentSpeed.interval);

    return () => clearTimeout(intervalTimer);
  }, [isRunning, phase, currentSequence.length, currentIndex, startNextNumber, currentSpeed.interval]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-8 relative"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 rounded-full opacity-10"
            style={{
              background: `linear-gradient(135deg, 
                hsl(${i * 45}, 70%, 60%) 0%, 
                hsl(${(i + 1) * 45}, 70%, 60%) 100%)`,
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 30}%`
            }}
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
          />
        ))}
      </div>

      <div className="text-center relative z-10">
        <motion.h2 
          className="text-4xl font-bold mb-6 flex items-center justify-center gap-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Zap className="w-10 h-10 text-yellow-500" />
          </motion.div>
          <motion.span
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
              lineHeight: '1.2',
              paddingBottom: '2px'
            }}
            animate={{
              backgroundPosition: ["0%", "100%", "0%"]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            Flash Training
          </motion.span>
        </motion.h2>

        {/* Back to Home Button */}
        <motion.div 
          className="flex justify-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white/80 hover:bg-white hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Home className="w-4 h-4" />
              {t('common.backToHome')}
            </motion.button>
          </Link>
        </motion.div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mb-8">
          {!isRunning ? (
            <motion.button 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }} 
              onPointerDown={handleStart}
              onClick={handleStart} 
              className="btn-primary relative group flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <Play className="w-5 h-5 sm:w-6 sm:h-6" />
              </motion.div>
              <span className="font-bold text-base sm:text-lg">{t('common.startTraining')}</span>
            </motion.button>
          ) : (
            <motion.button 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }} 
              onClick={stop} 
              className="btn-secondary relative group flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Pause className="w-5 h-5 sm:w-6 sm:h-6" />
              </motion.div>
              <span className="font-bold text-base sm:text-lg">{t('common.stop')}</span>
            </motion.button>
          )}
        </div>
      </div>

      <div className="flex justify-center relative z-10">
        <CalculationTable 
          phase={phase}
          currentSequence={currentSequence}
          currentIndex={currentIndex}
          settings={settings}
          result={result}
        />
      </div>
      
      {/* FOOTER */}
      <Footer />
    </motion.div>
  );
}

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Trash2, Clock, Calculator } from 'lucide-react';
import Footer from './Footer.jsx';

export default function History() {
  const { t } = useTranslation();
  const [history, setHistory] = useState([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Load history from localStorage on component mount
  useEffect(() => {
    const loadHistory = () => {
      const savedHistory = localStorage.getItem('flashMathHistory');
      
      if (savedHistory) {
        try {
          const parsedHistory = JSON.parse(savedHistory);
          setHistory(parsedHistory);
        } catch (error) {
          console.error('Error loading history:', error);
          setHistory([]);
        }
      } else {
        setHistory([]);
      }
    };

    // Load initial history
    loadHistory();

    // Listen for history updates from other components
    const handleHistoryUpdate = () => {
      loadHistory();
    };

    window.addEventListener('historyUpdated', handleHistoryUpdate);

    // Cleanup
    return () => {
      window.removeEventListener('historyUpdated', handleHistoryUpdate);
    };
  }, []);


  // Function to add new entry to history
  const addToHistory = (sequence, result, timestamp) => {
    const newEntry = {
      id: Date.now(),
      sequence,
      result,
      timestamp,
      duration: sequence.length // Number of numbers in sequence
    };
    
    setHistory(prev => [newEntry, ...prev].slice(0, 50)); // Keep only last 50 entries
  };

  // Function to clear all history
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('flashMathHistory'); // Remove from localStorage
    setShowClearConfirm(false);
  };

  // Function to delete single entry
  const deleteEntry = (id) => {
    const updatedHistory = history.filter(entry => entry.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('flashMathHistory', JSON.stringify(updatedHistory));
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Calculate statistics
  const stats = {
    totalSessions: history.length
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header with stats and clear button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-500" />
            {t('history.title')}
          </h2>
          <p className="text-gray-600">{t('history.subtitle')}</p>
        </div>
        
        {history.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowClearConfirm(true)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            {t('history.clearHistory')}
          </motion.button>
        )}
      </div>

      {/* Statistics Card */}
      {history.length > 0 && (
        <div className="flex justify-center mb-6">
          <motion.div
            className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20 w-full max-w-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Calculator className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">{t('history.totalSessions')}</p>
                <p className="text-lg sm:text-xl font-bold text-gray-800">{stats.totalSessions}</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* History List */}
      <div className="space-y-4">
        {history.length === 0 ? (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">{t('history.noHistory')}</h3>
            <p className="text-gray-500">{t('history.noHistoryDescription')}</p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {history.map((entry, index) => (
              <motion.div
                key={entry.id}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                layout
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-2">
                      <span className="text-xs sm:text-sm text-gray-500">{formatTimestamp(entry.timestamp)}</span>
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-600 text-xs rounded-full">
                        {entry.duration} {t('history.numbers')}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {entry.sequence.map((num, i) => (
                        <motion.span
                          key={i}
                          className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-medium"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.05 + i * 0.05 }}
                        >
                          {num}
                        </motion.span>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Result:</span>
                      <span className="text-xl font-bold text-green-600">{entry.result}</span>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => deleteEntry(entry.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Clear Confirmation Modal */}
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 max-w-md mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2">{t('history.clearHistoryConfirm')}</h3>
              <p className="text-gray-600 mb-6">
                This will permanently delete all your training history. This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={clearHistory}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  {t('history.clearAll')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* FOOTER */}
      <Footer />
    </motion.div>
  );
}

// Export function to add entries to history
export const addHistoryEntry = (sequence, result) => {
  const newEntry = {
    id: Date.now() + Math.random(), // Add random to ensure uniqueness
    sequence,
    result,
    timestamp: Date.now(),
    duration: sequence.length
  };
  
  const savedHistory = localStorage.getItem('flashMathHistory');
  const history = savedHistory ? JSON.parse(savedHistory) : [];
  
  // Check if this exact sequence and result already exists (avoid duplicates)
  const isDuplicate = history.some(entry => 
    JSON.stringify(entry.sequence) === JSON.stringify(sequence) && 
    entry.result === result &&
    Date.now() - entry.timestamp < 5000 // Within last 5 seconds
  );
  
  if (!isDuplicate) {
    const updatedHistory = [newEntry, ...history].slice(0, 50);
    localStorage.setItem('flashMathHistory', JSON.stringify(updatedHistory));
    
    // Dispatch custom event to notify History component
    window.dispatchEvent(new CustomEvent('historyUpdated', { 
      detail: { newEntry, totalEntries: updatedHistory.length } 
    }));
  }
};

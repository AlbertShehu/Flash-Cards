import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, RotateCcw, X } from 'lucide-react';

export default function Toast({ message, type = 'success', isVisible, onClose, showConfirm = false, onConfirm, onCancel }) {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    setShow(isVisible);
    if (isVisible && !showConfirm) {
      const timer = setTimeout(() => {
        setShow(false);
        onClose();
      }, 3000); // Auto-hide after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, showConfirm]);

  const handleClose = () => {
    setShow(false);
    onClose();
  };

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return {
          bgColor: 'bg-green-500',
          iconColor: 'text-green-600',
          icon: <CheckCircle className="w-5 h-5" />,
        };
      case 'reset':
        return {
          bgColor: 'bg-white',
          iconColor: 'text-gray-600',
          icon: <RotateCcw className="w-5 h-5" />,
          textColor: 'text-gray-800',
          borderColor: 'border-gray-300',
        };
      case 'confirm':
        return {
          bgColor: 'bg-white',
          iconColor: 'text-yellow-600',
          icon: <CheckCircle className="w-5 h-5" />,
          textColor: 'text-gray-800',
          borderColor: 'border-gray-300',
        };
      default:
        return {
          bgColor: 'bg-green-500',
          iconColor: 'text-green-600',
          icon: <CheckCircle className="w-5 h-5" />,
        };
    }
  };

  const styles = getToastStyles();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
            type === 'reset' || type === 'confirm'
              ? `${styles.bgColor} ${styles.textColor} ${styles.borderColor} border` 
              : styles.bgColor
          } ${type === 'reset' || type === 'confirm' ? '' : 'text-white'} min-w-64`}
        >
          <div className={styles.iconColor}>
            {styles.icon}
          </div>
          <span className="flex-1 font-medium">
            {message}
          </span>
          
          {showConfirm ? (
            <div className="flex gap-2">
              <button
                onClick={onCancel}
                className="px-2 py-1 text-gray-600 hover:text-gray-800 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-2 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
              >
                Yes
              </button>
            </div>
          ) : (
            <button
              onClick={handleClose}
              className={`${type === 'reset' || type === 'confirm' ? 'text-gray-500 hover:text-gray-700' : 'text-white hover:text-gray-200'} transition-colors`}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Settings as SettingsIcon, Save, RotateCcw } from 'lucide-react';
import FlashCalculationSettings from './FlashCalculationSettings';
import Footer from '../../components/Footer.jsx';
import Toast from '../../components/Toast.jsx';
import defaultSettings from '../../config/settings.js';
import { saveSettings, clearSettings } from '../../utils/storage.js';

export default function SettingsPanel({ settings, onChange }) {
  const { t } = useTranslation();
  const [toast, setToast] = useState({ message: '', type: 'success', isVisible: false, showConfirm: false });

  const showToast = (message, type = 'success', showConfirm = false) => {
    setToast({ message, type, isVisible: true, showConfirm });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false, showConfirm: false }));
  };

  const handleSaveSettings = () => {
    const success = saveSettings(settings);
    if (success) {
      showToast(t('settings.flashCalculation.saveSettings'), 'success');
    } else {
      showToast(t('common.error'), 'error');
    }
  };

  const handleResetSettings = () => {
    showToast(t('common.confirm'), 'confirm', true);
  };

  const confirmReset = () => {
    onChange(defaultSettings);
    clearSettings();
    hideToast();
    showToast(t('settings.flashCalculation.resetSettings'), 'reset');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
        <SettingsIcon className="w-6 h-6 sm:w-8 sm:h-8" />
        {t('settings.title')}
      </h2>

      <div className="flex justify-center">
        <div className="w-full max-w-2xl">
          <FlashCalculationSettings settings={settings} onChange={onChange} />
          
          {/* Save/Reset buttons */}
          <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSaveSettings}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold w-full sm:w-auto"
            >
              <Save className="w-4 h-4" />
              {t('settings.flashCalculation.saveSettings')}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleResetSettings}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold w-full sm:w-auto"
            >
              <RotateCcw className="w-4 h-4" />
              {t('common.reset')}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Toast notifications */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
        showConfirm={toast.showConfirm}
        onConfirm={confirmReset}
        onCancel={hideToast}
      />
      
      {/* FOOTER */}
      <Footer />
    </motion.div>
  );
}

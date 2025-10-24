import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header.jsx';
import History from './components/History.jsx';
import defaultSettings from './config/settings.js';
import FlashCalculationTrainer from './features/flashcalculation/FlashCalculationTrainer.jsx';
import SettingsPanel from './features/settings/SettingsPanel.jsx';
import { loadSettings, saveSettings } from './utils/storage.js';
import { unlockAudio } from './utils/audio.js';

export default function App() {
  const [settings, setSettings] = useState(() => loadSettings(defaultSettings));
  const [tab, setTab] = useState('FlashCalculation');

  // Auto-save settings whenever they change
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Global audio unlock on first user interaction
  useEffect(() => {
    const handler = () => unlockAudio();
    window.addEventListener("pointerdown", handler, { once: true });
    window.addEventListener("keydown", handler, { once: true });
    return () => {
      window.removeEventListener("pointerdown", handler);
      window.removeEventListener("keydown", handler);
    };
  }, []);

  const bgClasses = {
    default: 'bg-gradient-to-br from-indigo-50 to-white',
    'gradient-blue': 'bg-gradient-to-br from-blue-50 to-cyan-50',
    'gradient-purple': 'bg-gradient-to-br from-purple-50 to-pink-50',
    dark: 'bg-gradient-to-br from-gray-900 to-gray-800 text-white',
  };

  const bgClass = bgClasses[settings.setBackground] || bgClasses.default;

  return (
    <>
      <Header tab={tab} setTab={setTab} bgClass={bgClass}>
        <AnimatePresence mode="wait">
          {tab === 'Settings' && (
            <motion.div key="settings" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <SettingsPanel settings={settings} onChange={setSettings} />
            </motion.div>
          )}

          {tab === 'History' && (
            <motion.div key="history" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <History />
            </motion.div>
          )}

          {tab === 'FlashCalculation' && (
            <motion.div key="flashcalculation" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <FlashCalculationTrainer settings={settings} />
            </motion.div>
          )}
      </AnimatePresence>
    </Header>
  </>
  );
}
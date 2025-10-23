import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import SpeedEditor from './SpeedEditor';

// ====== Variants & helpers ======
const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: 'easeOut' } },
};

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

function useValuePulse(value, duration = 500) {
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    setPulse(true);
    const t = setTimeout(() => setPulse(false), duration);
    return () => clearTimeout(t);
  }, [value, duration]);
  return pulse;
}

// ====== Animated numeric input (+/-) ======
function AnimatedNumberInput({ value, min = 0, max = 999, step = 1, onChange, className = '' }) {
  const [inputValue, setInputValue] = useState(value.toString());
  const pulse = useValuePulse(value, 450);

  // Update input value when prop value changes
  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const inc = () => onChange(Math.min(max, value + step));
  const dec = () => onChange(Math.max(min, value - step));

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Only update parent if it's a valid number
    const numValue = Number(newValue);
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      onChange(numValue);
    }
  };

  const handleBlur = () => {
    // Reset to current value if input is invalid
    const numValue = Number(inputValue);
    if (isNaN(numValue) || numValue < min || numValue > max) {
      setInputValue(value.toString());
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <motion.button
        type="button"
        whileTap={{ scale: 0.9 }}
        whileHover={{ y: -1 }}
        onClick={dec}
        className="px-2 py-1 rounded-lg border border-gray-300/50 bg-white/70 hover:bg-white shadow-sm hover:shadow-md"
        aria-label="Decrease"
      >
        −
      </motion.button>

      <motion.div
        key={value} // animon kur ndryshon
        initial={{ scale: 0.95, opacity: 0.6 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className={`relative`}
      >
        <input
          type="number"
          value={inputValue}
          min={min}
          max={max}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            // Allow backspace, delete, tab, escape, enter
            if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
                // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                (e.keyCode === 65 && e.ctrlKey === true) ||
                (e.keyCode === 67 && e.ctrlKey === true) ||
                (e.keyCode === 86 && e.ctrlKey === true) ||
                (e.keyCode === 88 && e.ctrlKey === true) ||
                // Allow home, end, left, right
                (e.keyCode >= 35 && e.keyCode <= 40)) {
              return;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
              e.preventDefault();
            }
          }}
          className="input w-24 sm:w-20 text-center font-semibold text-base sm:text-sm border border-gray-300/50 shadow-sm focus:shadow-md focus:border-blue-400/50"
          style={{ fontSize: '16px' }} // Prevent zoom on iOS
        />
        <AnimatePresence>
          {pulse && (
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 0.25, scale: 1.04 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="pointer-events-none absolute inset-0 rounded-lg bg-blue-500/20"
            />
          )}
        </AnimatePresence>
      </motion.div>

      <motion.button
        type="button"
        whileTap={{ scale: 0.9 }}
        whileHover={{ y: -1 }}
        onClick={inc}
        className="px-2 py-1 rounded-lg border border-gray-300/50 bg-white/70 hover:bg-white shadow-sm hover:shadow-md"
        aria-label="Increase"
      >
        +
      </motion.button>
    </div>
  );
}

// ====== Radio as "pill switcher" (po/jo & gjuha) ======
function PillRadio({ name, options, value, onChange }) {
  return (
    <div className="relative inline-flex p-1 rounded-xl bg-gray-100 border border-gray-200/50 shadow-sm">
      {/* background animated pill */}
      <div className="relative flex">
        {options.map((opt) => (
          <label key={opt.value} className="relative">
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="sr-only"
            />
            <motion.span
              className={`relative z-10 px-3 py-1.5 text-sm rounded-lg cursor-pointer select-none ${
                value === opt.value ? 'text-blue-700 font-semibold' : 'text-gray-600'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {opt.label}
            </motion.span>

            {value === opt.value && (
              <motion.span
                layoutId={`${name}-pill`}
                className="absolute inset-0 rounded-lg bg-white shadow-md shadow-gray-200/30"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}
          </label>
        ))}
      </div>
    </div>
  );
}

export default function FlashCalculationSettings({ settings, onChange }) {
  const { t, i18n } = useTranslation();
  const [showSpeedEditor, setShowSpeedEditor] = useState(false);

  const set = useCallback(
    (key, value) => {
      onChange((prev) => ({ ...prev, [key]: value }));
    },
    [onChange]
  );

  const changeLanguage = useCallback(
    (language) => {
      if (language === 'english') i18n.changeLanguage('en');
      else if (language === 'deutsch') i18n.changeLanguage('de');
      set('language', language);
    },
    [i18n, set]
  );

  const speedOptions = useMemo(
    () => [
      { value: 1, label: t('settings.speed.slowest') },
      { value: 2, label: t('settings.speed.slow') },
      { value: 3, label: t('settings.speed.normal') },
      { value: 4, label: t('settings.speed.fast') },
      { value: 5, label: t('settings.speed.fastest') },
    ],
    [t]
  );

  return (
    <motion.div
      className="glass-effect rounded-xl p-6 space-y-5 border border-gray-200/50 shadow-lg shadow-gray-200/20"
      variants={listVariants}
      initial="hidden"
      animate="show"
    >
      <motion.h3 className="font-semibold text-lg flex items-center gap-2 pb-3 border-b border-gray-200/30 shadow-sm" variants={cardVariants}>
        {t('settings.flashCalculation.title')}
        <motion.span
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          className="px-2 py-0.5 text-[11px] rounded bg-blue-50 text-blue-700 border border-blue-200 shadow-sm"
        >
          Live
        </motion.span>
      </motion.h3>

      {/* Digit length */}
      <motion.label className="flex items-center gap-2" variants={cardVariants} whileHover={{ y: -2 }}>
        <span className="w-40">{t('settings.flashCalculation.digitLength')}</span>
        <AnimatedNumberInput
          value={settings.digit}
          min={1}
          max={10}
          onChange={(v) => set('digit', v)}
        />
      </motion.label>

      {/* Number of displays */}
      <motion.label className="flex items-center gap-2" variants={cardVariants} whileHover={{ y: -2 }}>
        <span className="w-40">{t('settings.flashCalculation.numberOfDisplays')}</span>
        <AnimatedNumberInput
          value={settings.displayFlashCalculation}
          min={1}
          max={100}
          onChange={(v) => set('displayFlashCalculation', v)}
        />
      </motion.label>

      {/* Speed + edit */}
      <motion.label className="flex items-center gap-2" variants={cardVariants} whileHover={{ y: -2 }}>
        <span className="w-40">{t('settings.flashCalculation.speed')}</span>
        <select
          value={settings.speedFlashCalculation}
          onChange={(e) => set('speedFlashCalculation', Number(e.target.value))}
          className="input border border-gray-300/50 shadow-sm focus:shadow-md focus:border-blue-400/50"
        >
          {speedOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <motion.button
          onClick={() => setShowSpeedEditor(true)}
          className="ml-2 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300/50 shadow-sm hover:shadow-md"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          animate={{ boxShadow: ['0 0 0 0 rgba(59,130,246,0)', '0 0 0 8px rgba(59,130,246,0.0)'] }}
          transition={{ repeat: Infinity, duration: 2.2 }}
        >
          {t('settings.flashCalculation.editSpeed')}
        </motion.button>
      </motion.label>

      {/* Three groups in grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        variants={listVariants}
      >
        {/* Minus numbers */}
        <motion.div className="space-y-2" variants={cardVariants} whileHover={{ y: -2 }}>
          <span className="block text-sm font-medium">{t('settings.flashCalculation.showingMinusNumbers')}</span>
          <PillRadio
            name="negativeShow"
            value={settings.negativeShow ? 'yes' : 'no'}
            onChange={(val) => set('negativeShow', val === 'yes')}
            options={[
              { value: 'yes', label: t('common.yes') },
              { value: 'no', label: t('common.no') },
            ]}
          />
        </motion.div>

        {/* Decimal numbers */}
        <motion.div className="space-y-2" variants={cardVariants} whileHover={{ y: -2 }}>
          <span className="block text-sm font-medium">{t('settings.flashCalculation.showingDecimalNumbers')}</span>
          <PillRadio
            name="decimalShow"
            value={settings.decimalShow ? 'yes' : 'no'}
            onChange={(val) => set('decimalShow', val === 'yes')}
            options={[
              { value: 'yes', label: t('common.yes') },
              { value: 'no', label: t('common.no') },
            ]}
          />
        </motion.div>

        {/* Enable audio */}
        <motion.div className="space-y-2" variants={cardVariants} whileHover={{ y: -2 }}>
          <span className="block text-sm font-medium">{t('settings.flashCalculation.enableAudio')}</span>
          <PillRadio
            name="enableAudio"
            value={settings.enableAudio ? 'yes' : 'no'}
            onChange={(val) => set('enableAudio', val === 'yes')}
            options={[
              { value: 'yes', label: t('common.yes') },
              { value: 'no', label: t('common.no') },
            ]}
          />
        </motion.div>
      </motion.div>

      {/* Decimal length */}
      <motion.label className="flex items-center gap-2" variants={cardVariants} whileHover={{ y: -2 }}>
        <span className="w-40">{t('settings.flashCalculation.decimalLength')}</span>
        <AnimatedNumberInput
          value={settings.decimalLength}
          min={0}
          max={6}
          onChange={(v) => set('decimalLength', v)}
        />
      </motion.label>

      {/* Font size */}
      <motion.label className="flex items-center gap-2" variants={cardVariants} whileHover={{ y: -2 }}>
        <span className="w-40">{t('settings.flashCalculation.fontSize')}</span>
        <AnimatedNumberInput
          value={settings.fontSize}
          min={24}
          max={200}
          step={2}
          onChange={(v) => set('fontSize', v)}
        />
      </motion.label>

      {/* Language */}
      <motion.div className="pt-4 border-t border-gray-200/50 shadow-sm" variants={cardVariants}>
        <div className="space-y-3">
          
          <PillRadio
            name="language"
            value={settings.language}
            onChange={changeLanguage}
            options={[
              { value: 'english', label: 'English' },
              { value: 'deutsch', label: 'Deutsch' },
            ]}
          />
        </div>
      </motion.div>

      {/* SpeedEditor modal (ruaj siç e ke) */}
      <AnimatePresence>
        {showSpeedEditor && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSpeedEditor(false)}
            />
            {/* modal container */}
            <motion.div
              initial={{ y: 24, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 24, opacity: 0, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              className="relative z-50"
            >
              <SpeedEditor
                settings={settings}
                onChange={onChange}
                isOpen={showSpeedEditor}
                onClose={() => setShowSpeedEditor(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

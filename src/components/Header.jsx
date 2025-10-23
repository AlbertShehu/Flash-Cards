import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Tabs from './Tabs.jsx';
import { Link } from 'react-router-dom';

export default function Header({ tab, setTab, bgClass, children }) {
  const { t } = useTranslation();
  
  return (
    <div className={`min-h-screen transition-all duration-500 ${bgClass}`}>
      <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-8">
        <motion.header 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6"
        >
          <div className="flex-1">
            <Link to="/">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t('common.appName')}
              </h1>
            </Link>
            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">{t('common.tagline')}</p>
          </div>
          <div className="w-full sm:w-auto">
            <Tabs 
              value={tab} 
              onChange={setTab} 
              options={[
                { value: 'FlashCalculation', label: t('navigation.flashCalculation') },
                { value: 'History', label: t('navigation.history') },
                { value: 'Settings', label: t('navigation.settings') }
              ]} 
            />
          </div>
        </motion.header>

        {children}
      </div>
    </div>
  );
}

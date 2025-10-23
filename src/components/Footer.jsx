import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Github, Linkedin } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();
  
  return (
    <footer className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 border-t border-gray-200">
      <div className="text-center">
        <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          {t('common.appName')}
        </h3>
        <p className="text-sm sm:text-base text-gray-500 mb-4">
          {t('footer.builtFor')}
        </p>
        <div className="mb-4">
          <p className="text-xs sm:text-sm text-gray-600 mb-3">
            {t('footer.developedBy')} <span className="font-semibold text-blue-600">Albert Shehu</span>
          </p>
          <div className="flex justify-center gap-3 sm:gap-4">
            <motion.a
              href="https://github.com/AlbertShehu"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="Visit GitHub Profile"
            >
              <Github className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
            </motion.a>
            <motion.a
              href="https://linkedin.com/in/albert-shehu-5202ba2b0/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="Visit LinkedIn Profile"
            >
              <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
            </motion.a>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-gray-400">
          © {new Date().getFullYear()} {t('common.appName')} — {t('footer.copyright')}
        </p>
      </div>
    </footer>
  );
}

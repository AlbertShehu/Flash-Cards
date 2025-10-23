import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Calculator, Zap, Brain, Target, ArrowRight, Play } from 'lucide-react';
import sorobanImage from '../assets/soroban.webp';
import Footer from '../components/Footer.jsx';

export default function Landing() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* NAVBAR */}
      <header className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">
          {t('common.appName')}
        </Link>
        <nav className="flex items-center gap-4">
         
          <Link to="/app" className="btn-primary">
            {t('navigation.tryTheApp')}
          </Link>
        </nav>
      </header>
      

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              {t('landing.hero.title')}
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {t('landing.hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/app" className="btn-primary text-lg px-8 py-4 flex items-center justify-center gap-2">
                <Zap className="w-5 h-5" />
                {t('landing.hero.startTraining')}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#why-abacus" className="btn-secondary text-lg px-8 py-4 flex items-center justify-center gap-2">
                <Brain className="w-5 h-5" />
                {t('landing.hero.learnMore')}
              </a>
            </div>
          </motion.div>
          
          <motion.div
            className="glass-effect rounded-3xl p-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="relative overflow-hidden rounded-2xl">
                <motion.img
                  src={sorobanImage}
                  alt="Hand using abacus soroban - interactive calculation tool"
                className="w-full h-auto rounded-xl shadow-2xl"
                initial={{ scale: 1.05 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                whileHover={{ scale: 1.02 }}
              />
              
              {/* Overlay with description */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <h3 className="text-white text-xl font-bold mb-2">Interactive Learning</h3>
                <p className="text-white/90 text-sm">
                  Hands-on abacus training that develops lightning-fast mental calculation skills
                </p>
              </motion.div>
              
              {/* Floating particles effect */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
                    style={{
                      left: `${20 + i * 15}%`,
                      top: `${30 + (i % 2) * 40}%`,
                    }}
                    animate={{
                      y: [-10, 10, -10],
                      opacity: [0.3, 0.8, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.5,
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHY ABACUS */}
      <section id="why-abacus" className="max-w-6xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('landing.whyAbacus.title')}
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-4xl mx-auto mb-12">
            {t('landing.whyAbacus.description')}
          </p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Target,
                title: t('landing.whyAbacus.focus.title'),
                description: t('landing.whyAbacus.focus.description')
              },
              {
                icon: Zap,
                title: t('landing.whyAbacus.speed.title'),
                description: t('landing.whyAbacus.speed.description')
              },
              {
                icon: Brain,
                title: t('landing.whyAbacus.numberSense.title'),
                description: t('landing.whyAbacus.numberSense.description')
              },
              {
                icon: Calculator,
                title: t('landing.whyAbacus.confidence.title'),
                description: t('landing.whyAbacus.confidence.description')
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                className="glass-effect rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* HISTORY & ORIGINS */}
      <section className="max-w-6xl mx-auto px-6 py-16 bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl mx-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('landing.history.title')}
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-4xl mx-auto mb-12">
            {t('landing.history.description')}
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Historical Timeline */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="glass-effect rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">14th</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{t('landing.history.origins.title')}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {t('landing.history.origins.description')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-effect rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">1938</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{t('landing.history.simplification.title')}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {t('landing.history.simplification.description')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-effect rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">17th</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{t('landing.history.keyFigure.title')}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {t('landing.history.keyFigure.description')}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Modern Impact */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="glass-effect rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">1946</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{t('landing.history.iconicMoment.title')}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {t('landing.history.iconicMoment.description')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-effect rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-rose-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">Flash</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{t('landing.history.flashAnzan.title')}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {t('landing.history.flashAnzan.description')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-effect rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">Today</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{t('landing.history.educationToday.title')}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {t('landing.history.educationToday.description')}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Quote */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="glass-effect rounded-2xl p-8 max-w-4xl mx-auto">
              <blockquote className="text-xl font-medium text-gray-700 italic leading-relaxed">
                "{t('landing.history.quote')}"
              </blockquote>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t('landing.howItWorks.title')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: t('landing.howItWorks.step1.title'),
                description: t('landing.howItWorks.step1.description'),
                color: 'from-blue-500 to-cyan-500'
              },
              {
                step: '2',
                title: t('landing.howItWorks.step2.title'),
                description: t('landing.howItWorks.step2.description'),
                color: 'from-purple-500 to-pink-500'
              },
              {
                step: '3',
                title: t('landing.howItWorks.step3.title'),
                description: t('landing.howItWorks.step3.description'),
                color: 'from-green-500 to-emerald-500'
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                className="glass-effect rounded-2xl p-6 relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center mb-4`}>
                  <span className="text-white font-bold text-lg">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/app" className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2">
              <Play className="w-5 h-5" />
              {t('landing.howItWorks.tryItNow')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </section>


      {/* FOOTER */}
      <Footer />
    </div>
  );
}

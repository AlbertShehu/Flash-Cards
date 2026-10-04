import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import NumberDisplay from './NumberDisplay.jsx';
import Result from './Result.jsx';
import { playHeartbeatBeep, playSuccessChime, unlockAudio } from '../utils/audio.js';

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
      unlockAudio().then(() => {
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

  // Play heartbeat beep when a new number is shown (no delay — numbers flash instantly)
  useEffect(() => {
    if (phase === 'showing' && currentSequence.length > 0 && settings.enableAudio) {
      const isLastNumber = currentIndex === currentSequence.length - 1;

      unlockAudio().then(() => {
        if (isLastNumber) {
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
          playHeartbeatBeep();
        }
      });
    }
  }, [phase, currentIndex, currentSequence.length, settings.enableAudio]);

  return (
    <div className="w-full max-w-4xl bg-white border border-gray-200 rounded-2xl p-8 min-h-96 flex items-center justify-center">
      {/* Numbers: no enter/exit animation so they stay visible at any speed */}
      {phase === 'showing' && currentSequence.length > 0 && (
        <NumberDisplay
          number={currentSequence[currentIndex]}
          fontSize={settings.fontSize}
        />
      )}

      {phase === 'interval' && currentSequence.length > 0 && (
        <div className="min-h-[1em]" aria-hidden="true" />
      )}

      {phase === 'result' && !showResult && (
        <button
          type="button"
          onClick={() => setShowResult(true)}
          className="btn-result"
        >
          {t('flashCalculation.result.showResult')}
        </button>
      )}

      {phase === 'result' && showResult && (
        <Result sequence={currentSequence} result={result} fontSize={settings.fontSize} />
      )}

      {phase === 'idle' && (
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {t('flashCalculation.idle.title')}
          </h3>
          <p className="text-gray-600 text-lg">
            {t('flashCalculation.idle.subtitle')}
          </p>
        </div>
      )}
    </div>
  );
}

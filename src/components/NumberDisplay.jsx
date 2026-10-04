import React from 'react';

export default function NumberDisplay({ number, fontSize }) {
  return (
    <div
      className="number-display font-mono font-bold text-center text-gray-900 select-none"
      style={{ fontSize: `${fontSize}px`, lineHeight: 1.1 }}
    >
      {number}
    </div>
  );
}

import React, { useState } from "react";
import { getAC, hardUnlockAudio, playTone } from "../utils/audio.js";

export function AudioDebug() {
  const [state, setState] = useState(() => getAC()?.state ?? "none");
  const refresh = () => setState(getAC()?.state ?? "none");

  return (
    <div className="fixed bottom-4 right-4 p-3 rounded bg-white/80 shadow text-xs border border-gray-200">
      <div>AudioContext: <b>{state}</b></div>
      <div className="mt-2 flex gap-2">
        <button 
          onPointerDown={() => {
            hardUnlockAudio(); 
            refresh();
          }} 
          className="px-2 py-1 border rounded bg-blue-100 hover:bg-blue-200"
        >
          Unlock
        </button>
        <button 
          onPointerDown={() => {
            playTone(900, 120, 0.4); 
            refresh();
          }} 
          className="px-2 py-1 border rounded bg-green-100 hover:bg-green-200"
        >
          Beep
        </button>
        <button 
          onClick={refresh} 
          className="px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   VoicePlayer.jsx — Placeholder Audio Player
   ============================================================
   A clean, minimal audio player UI with:
     - Circular play/pause toggle button (Lucide icons)
     - Thin progress bar
     - "Listen to my intro" label
     - Pulsing animation on button when "playing"

   No real audio is wired up yet — this is visual-only.
   // TODO: connect real audio file src here
   ============================================================ */

import { useState } from 'react';
import { Play, Pause } from 'lucide-react';

function VoicePlayer() {
  const [isPlaying, setIsPlaying] = useState(false);

  // TODO: connect real audio file src here
  // Once a real audio element is added, replace this toggle
  // with actual play/pause controls and track currentTime for
  // the progress bar.

  return (
    <div className="flex flex-col gap-2 max-w-xs">
      {/* Label */}
      <span className="text-xs uppercase tracking-widest text-neutral-500 font-medium">
        Listen to my intro
      </span>

      {/* Player row: button + progress bar */}
      <div className="flex items-center gap-3">
        {/* Play / Pause button */}
        <button
          onClick={() => setIsPlaying((prev) => !prev)}
          className="relative w-10 h-10 rounded-full border border-neutral-700 bg-neutral-900
                     flex items-center justify-center transition-colors duration-300
                     hover:border-neutral-500 hover:bg-neutral-800 cursor-pointer shrink-0"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {/* Pulsing ring when playing */}
          {isPlaying && (
            <span className="absolute inset-0 rounded-full border border-accent animate-ping opacity-30" />
          )}

          {isPlaying ? (
            <Pause className="w-4 h-4 text-white" strokeWidth={2} />
          ) : (
            <Play className="w-4 h-4 text-white ml-0.5" strokeWidth={2} />
          )}
        </button>

        {/* Progress bar */}
        <div className="flex-1 h-1 bg-neutral-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-300"
            style={{ width: isPlaying ? '45%' : '0%' }}
          />
        </div>

        {/* Duration placeholder */}
        <span className="text-xs text-neutral-600 font-mono tabular-nums">
          0:00
        </span>
      </div>
    </div>
  );
}

export default VoicePlayer;

import React, { useState, useEffect } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';

const TextToSpeech = ({ text, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speech, setSpeech] = useState(null);

  useEffect(() => {
    // Cleanup function to stop speech when component unmounts
    return () => {
      if (speech) {
        speech.cancel();
      }
    };
  }, [speech]);

  const handlePlay = () => {
    if (!text) return;

    if (isPaused && speech) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    // Create new speech instance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Set voice to English (India) if available
    const voices = window.speechSynthesis.getVoices();
    const indianVoice = voices.find(voice => voice.lang === 'en-IN') || 
                       voices.find(voice => voice.lang.startsWith('en-')) ||
                       voices[0];
    if (indianVoice) {
      utterance.voice = indianVoice;
    }

    // Event handlers
    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setSpeech(null);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsPlaying(false);
      setIsPaused(false);
      setSpeech(null);
    };

    // Start speaking
    window.speechSynthesis.speak(utterance);
    setSpeech(utterance);
  };

  const handlePause = () => {
    if (speech && isPlaying) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    if (speech) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      setSpeech(null);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      <Tooltip title={isPlaying ? "Pause" : "Play"}>
        <IconButton
          onClick={isPlaying ? handlePause : handlePlay}
          size="small"
          sx={{
            color: isPlaying ? '#6366F1' : '#94A3B8',
            '&:hover': {
              color: '#6366F1',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
            },
          }}
        >
          {isPlaying ? <PauseIcon fontSize="small" /> : <VolumeUpIcon fontSize="small" />}
        </IconButton>
      </Tooltip>
      {isPlaying && (
        <Tooltip title="Stop">
          <IconButton
            onClick={handleStop}
            size="small"
            sx={{
              color: '#94A3B8',
              '&:hover': {
                color: '#6366F1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
              },
            }}
          >
            <StopIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </div>
  );
};

export default TextToSpeech; 
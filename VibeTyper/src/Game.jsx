import React, { useState, useEffect, useRef } from 'react';
import { Clock, RefreshCw } from 'lucide-react';

export default function TypingSpeedApp() {
  const [text, setText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    fetchNewText();
  }, []);

  const fetchNewText = async () => {
    setIsLoading(true);
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
    setHasStarted(false);
    
    try {
      const response = await fetch('/api/generateText', {
        method: 'POST',
      });
  
      const data = await response.json();
      setText(data.text);
    } catch (error) {
      setText('The quick brown fox jumps over the lazy dog. Practice makes perfect when it comes to typing speed.');
    }
    
    setIsLoading(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    
    if (!hasStarted && value.length > 0) {
      setStartTime(Date.now());
      setHasStarted(true);
    }
    
    setUserInput(value);
    
    if (value.length === text.length) {
      setEndTime(Date.now());
    }
  };

  const calculateResults = () => {
    if (!startTime || !endTime) return null;
    
    const timeInMinutes = (endTime - startTime) / 1000 / 60;
    const wordsTyped = text.split(' ').length;
    const wpm = Math.round(wordsTyped / timeInMinutes);
    
    let correctChars = 0;
    for (let i = 0; i < text.length; i++) {
      if (userInput[i] === text[i]) correctChars++;
    }
    const accuracy = Math.round((correctChars / text.length) * 100);
    
    return { wpm, accuracy, time: ((endTime - startTime) / 1000).toFixed(1) };
  };

  const results = calculateResults();

  const getCharacterClass = (index) => {
    if (index >= userInput.length) return 'text-gray-400';
    return userInput[index] === text[index] ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">VibeTyper</h1>
            <button
              onClick={fetchNewText}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              New Text
            </button>
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-gray-500">Loading new text...</div>
          ) : (
            <>
              <div className="mb-6 p-6 bg-gray-50 rounded-lg font-mono text-lg leading-relaxed">
                {text.split('').map((char, index) => (
                  <span key={index} className={getCharacterClass(index)}>
                    {char}
                  </span>
                ))}
              </div>

              <textarea
                ref={inputRef}
                value={userInput}
                onChange={handleInputChange}
                disabled={!!endTime}
                placeholder="Start typing here..."
                className="w-full p-4 border-2 border-gray-300 rounded-lg font-mono text-lg focus:border-indigo-500 focus:outline-none disabled:bg-gray-100 resize-none"
                rows={4}
              />

              <div className="mt-6 flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>
                    {hasStarted && !endTime
                      ? 'Typing...'
                      : hasStarted && endTime
                      ? 'Finished!'
                      : 'Start typing to begin'}
                  </span>
                </div>
              </div>

              {results && (
                <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Results</h2>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-indigo-600">{results.wpm}</div>
                      <div className="text-gray-600 mt-1">WPM</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600">{results.accuracy}%</div>
                      <div className="text-gray-600 mt-1">Accuracy</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-600">{results.time}s</div>
                      <div className="text-gray-600 mt-1">Time</div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="mt-4 text-center text-sm text-gray-600">
          <p>Made by Kamron Arabi for the Claude Builder Club vibe code challenge!</p>
        </div>
      </div>
    </div>
  );
}
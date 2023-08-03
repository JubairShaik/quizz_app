import React, { useState } from 'react';
import './index.css';
import { AnimatePresence } from 'framer-motion';
import  Countdown  from '../src/components/Countdown';
import  Intro  from '../src/components/Intro';
import  Quiz from '../src/components/Quiz';
 


const App = () => {
  const [displayView, setDisplayView] = useState('intro');

  return (
    <main className="md:h-screen h-full flex flex-col w-full overflow-hidden">
      <AnimatePresence mode="wait">
        {displayView === 'intro' && (
          <Intro
            onGetStartedClick={() => {
              setDisplayView('countdown');
            }}
          />
        )}
        {displayView === 'countdown' && (
          <Countdown
            onGoClick={() => {
              setDisplayView('quiz');
            }}
          />
        )}
        {displayView === 'quiz' && <Quiz />}
      </AnimatePresence>
    </main>
  );
};

export default App;

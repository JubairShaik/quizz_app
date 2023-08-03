import React from 'react';
import { Tick, Close } from '../icons/index.js';




const correctAnswerBadge = (
  <div className="bg-brand-paris-green text-white px-3 py-2 flex items-center justify-center space-x-2 rounded-[53px]">
    <Tick />
    <p className="text-xs font-jakarta font-medium">Correct answer</p>
  </div>
);

const wrongAnswerBadge = (
  <div className="bg-brand-bittersweet text-white px-3 py-2 flex items-center justify-center space-x-2 rounded-[53px]">
    <Close />
    <p className="text-xs font-medium">Your answer</p>
  </div>
);

export const OptionList = ({
  options,
  selectedAnswerIndex,
  onAnswerSelected,
  isCorrectAnswer,
  activeQuestion,
}) => {
  const correctAnswerIndex = options.findIndex(
    (option) => option === activeQuestion.correctAnswer
  );

  console.log({
    correctAnswerIndex,
    activeQuestion,
    options,
  });

  const renderSelectedOptionBadge = (idx) => {
    if (selectedAnswerIndex === -1) {
      return null;
    }

    if (selectedAnswerIndex === idx) {
      return (
        <div className="absolute top-[50%] -translate-y-1/2 right-2 z-10">
          {isCorrectAnswer ? correctAnswerBadge : wrongAnswerBadge}
        </div>
      );
    }
    
  };

  const renderCorrectBadge = (idx) => {
    if (selectedAnswerIndex === -1) {
      return null;
    }

    if (correctAnswerIndex === idx) {
      return (
        <div className="absolute top-[50%] -translate-y-1/2 right-2 z-10">
          {correctAnswerBadge}
        </div>
      );
    }
  };



  return (
    <section className="flex   flex-col  " >
     
      <div className="flex flex-col items-start space-y-1">
        {options.map((option, idx) => (
          <div
            key={idx}
            className={`relative flex items-center space-x-2 rounded-xl border px-6 py-4 w-full cursor-pointer select-none ${
              idx === selectedAnswerIndex
                ? 'border-brand-cerulean-blue'
                : 'border-brand-light-gray'
            }`}
            onClick={() => {
              if (selectedAnswerIndex !== -1) {
                return;
              }
              onAnswerSelected(idx);
            }}
          >
            <div
              className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center ${
                idx === selectedAnswerIndex
                  ? 'bg-brand-cerulean-blue'
                  : 'bg-brand-white-smoke-100'
              }`}
            >
              <div
                className={`w-[14px] h-[14px] rounded-full bg-white ${
                  idx === selectedAnswerIndex
                    ? 'bg-white'
                    : 'bg-brand-white-smoke-100'
                }`}
              />
            </div>
            <p className="text-brand-midnight font-normal text-base">
              {option}
            </p>
            {renderSelectedOptionBadge(idx)}
            {renderCorrectBadge(idx)}
          </div>
        ))}
      </div>
    </section>
  );
};

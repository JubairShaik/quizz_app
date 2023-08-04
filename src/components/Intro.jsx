import React from 'react';
import { CheckCircle } from '../icons/CheckCircle';
import { importantToKnow } from '../content/content.js';
import  Button from './Button';
import answer from "../public/answer.png"



const Intro = ({ onGetStartedClick }) => {
  return (
    <div className="px-5 py-8 md:py-14 flex-1 w-full   lg:gap-[2rem]  gap-[24rem] lg:max-w-4xl mx-auto flex flex-col overflow-hidden">
      <img
        src={answer}
        className="absolute md:bottom-2 bottom-[7rem] p-14 md:p-[7rem]  md:right-14 w-auto z-0 object-cover pointer-events-none "
        alt="Illustration"
      />
      <div className="w-full flex flex-col flex-1 items-center z-10">
        <h1 className="text-brand-cerulean-blue font-bold text-[32px] sm:text-4xl">
          QuizApp
        </h1>
        <h3 className="text-black font-bold text-2xl mt-[20px] md:mt-[51.55px] sm:text-3xl">
          Things to know before you start:
        </h3>
        <div className="flex flex-col items-start mt-6 sm:mt- space-y-5">
          {importantToKnow.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <CheckCircle />
              <p className="text-[1.1rem] text-brand-storm-dust font-normal sm:text-[1.25rem]">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
      <Button 
       className="w-full text-white rounded-md shadow-inner bg-red-500 z-10"
       block size={'small'}
        onClick={onGetStartedClick}>
        {`Let's Get Started`}
      </Button>
    </div>
  );
};

export default Intro;

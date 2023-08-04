import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { quizQuestions } from "../content/content.js";
import { OptionList } from "./OptionList";
import { formatTime } from "../utils/formatTime";
import Result from "./Result";
import Button from "./Button";
import { ToastContainer } from "react-toastify";
import { showCorrectAnswerToast, showIncorrectAnswerToast } from "../utils/toarstHelper.js";


import {
  playCorrectAnswer,
  playWrongAnswer,
  playQuizEnd,
} from "../utils/playSound.js";

const TIME_LIMIT = 30; // 30 Seconds per question

const Quiz = () => {
  const timerRef = useRef(null);

  const [timePassed, setTimePassed] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(-1);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);

  const [results, setResults] = useState({
    correctAnswers: 0,
    wrongAnswers: 0,
    secondsUsed: 0,
  });

  const setupTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTimePassed((prevTimePassed) =>
        prevTimePassed > TIME_LIMIT ? TIME_LIMIT : prevTimePassed + 1
      );
    }, 1000);
  };

  useEffect(() => {
    if (quizFinished) return;

    setupTimer();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [quizFinished]);

  useEffect(() => {
    if (quizFinished) return;

    if (timePassed > TIME_LIMIT) {
      handleNextQuestion();
      // Restart timer for the next Question
      setTimePassed(0);
    }
  }, [timePassed]);

  const handleNextQuestion = () => {
    // Reset selected answer and explanation
    setSelectedAnswerIndex(-1);
    setShowExplanation(false);

    // Check if quiz finished
    if (activeQuestion + 1 >= quizQuestions.length) {
      console.log("Quiz finished!");
      playQuizEnd();
      setQuizFinished(true);
      return;
    }

    // Set next question
    setActiveQuestion((prev) => prev + 1);

    // Reset timer
    setupTimer();
    setTimePassed(0);

    // Reset the states for the next question
    setShowExplanation(false);
    setIsAnswerCorrect(false);
  };





  const handleSelectAnswer = (answerIndex) => {
    // Stop timer
    clearInterval(timerRef.current);
    setSelectedAnswerIndex(answerIndex);

    // Check if answer is correct
    const correctAnswer = quizQuestions[activeQuestion].correctAnswer;
    const selectedAnswer = quizQuestions[activeQuestion].options[answerIndex];

    if (correctAnswer === selectedAnswer) {
      console.log("Correct answer!");
      playCorrectAnswer();
      // Update results
      setResults((prev) => ({
        ...prev,
        secondsUsed: prev.secondsUsed + timePassed,
        correctAnswers: prev.correctAnswers + 1,
      }));

      setIsAnswerCorrect(true);
      showCorrectAnswerToast();
    } else {
      console.log("Wrong answer!");
      playWrongAnswer();
      // Update results
      setResults((prev) => ({
        ...prev,
        secondsUsed: prev.secondsUsed + timePassed,
        wrongAnswers: prev.wrongAnswers + 1,
      }));

      setIsAnswerCorrect(false);
      showIncorrectAnswerToast(); // Show the toast notification for an incorrect answer
    }

    // Show the explanation after a delay
    setTimeout(() => {
      setShowExplanation(true);
    }, 2000);
    
  };



  const { question, options, explanation ,option } = quizQuestions[activeQuestion];
  const numberOfQuestions = quizQuestions.length;

  if (quizFinished) {
    return <Result results={results} totalQuestions={quizQuestions.length} />;
  }

  const progressWidth = ((activeQuestion + 1) / numberOfQuestions) * 100;

  return (
    <motion.div
      key="countdown"
      variants={{
        initial: {
          background: "#FF6A66",
          clipPath: "circle(0% at 50% 50%)",
        },
        animate: {
          background: "#ffffff",
          clipPath: "circle(100% at 50% 50%)",
        },
      }}
      className="w-full h-full md:px-[10rem]  flex justify-center  px-5 py-3"
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }}
    >

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />



      <div className="flex flex-col text-black font-bold text-[30px]  text-center w-full">
       
        <div className=" rounded-2xl border border-brand-light-gray px-3  md:px-7 my:py-4 w-full mb-1">
          <h3 className="text-black  md:mt-8 mt-2  font-medium text-[16px]">
            Question {activeQuestion + 1} / {numberOfQuestions}
          </h3>




          {/* Progress Bar */}
          <div className="relative w-full   sja h-2 mt-2 md:mt-5 bg-slate-300 rounded-md overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-brand-cerulean-blue rounded-md"
              initial={{ width: "0%" }}
              animate={{ width: `${progressWidth}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <h4 className="text-brand-midnight font-normal  md:mt-12 md:mb-8 md:font-semibold text-[1.2rem] md:text-[2rem] mt-[34px]">
            {question}
          </h4>
        </div>




        <div className="flex items-center lg:flex-row gap-4 mt-6 md:m-10 flex-col justify-center">

          
          <div className="flex rounded-xl md:h-[20rem]  items-center justify-center  mybox  overflow-hidden flex-1">
            <img
              className="  flex h-full w-full object-cover"
              src={quizQuestions[activeQuestion]?.imageUrl}
              alt="Quiz Question"
            />
          </div>



          <div className="flex flex-1 mx-1">
            {showExplanation ? (
              <motion.div
                key="explanation"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.5 }}
              > 
                <div className="flex flex-col items-start" >
                  <h3 className="text-[20px] text-green-500 md:text-[27px] font-semibold mt-2 mb-1 md:font-bold" >{option}</h3>
                <p className=" text-start font-normal text-[18px] md:text-[23px]">
                  {explanation}
                </p>

                </div>
                
              </motion.div>
            ) : (
              <OptionList
                activeQuestion={quizQuestions[activeQuestion]}
                options={options}
                selectedAnswerIndex={selectedAnswerIndex}
                onAnswerSelected={handleSelectAnswer}
                isAnswerCorrect={isAnswerCorrect}
              />
            )}
          </div>
        </div>

  
        <div className="flex justify-center items-center w-full mt-[18px]">
            {/* Start time */}
            <span className="text-brand-mountain-mist text-xs font-normal">
              {formatTime(timePassed)}
            </span>
            {/* Bar */}
            <div className="relative flex-1 h-3 bg-[#F0F0F0] mx-1 rounded-full">
              <motion.div
                className="absolute top-0 left-0 h-full bg-green-500 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${(timePassed / TIME_LIMIT) * 100}%` }}
                transition={{ duration: 1 }}
              />
            </div>



            {/* End time */}
            
            <span className="  text-sm text-slate-900 font-normal">
              {formatTime(TIME_LIMIT)}
            </span>
            </div>

        <motion.div
          className="mt-auto w-full z-10"
          animate={{ opacity: showExplanation ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {showExplanation && (
            <Button
              block
              className="bg-green-500 my-6 md:text-[25px] mt-10 
               md:mt-5 text-[20px] py-[0.6rem] md:py-[0.2rem] font-normal rounded-md cursor-pointer text-white"
              onClick={handleNextQuestion}
            >
              Next Question  
            </Button>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Quiz;

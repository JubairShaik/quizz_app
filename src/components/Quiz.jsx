import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

import { quizQuestions } from "../content/content.js";
import Button from "./Button";
import uiux from "../public/uiux6.avif";
import { OptionList } from "./OptionList";
import { formatTime } from "../utils/formatTime";
import Result from "./Result";

// const quizQuestions = [

//     {

//       question: "What does the term 'Information Architecture' refer to in UX design?",

//       imageUrl:uiux,
//       options: [
//         "A. Designing visually appealing graphics",
//         "B. Organizing and structuring content for better usability",
//         "C. Creating responsive layouts for mobile devices",
//         "D. Conducting user interviews and surveys"
//       ],
//       correctAnswer: "B. Organizing and structuring content for better usability",
//       explanation: "The correct answer is B. Information Architecture involves organizing and structuring content in a clear and intuitive way to improve usability. It focuses on creating a coherent navigation system, labeling, and categorizing content to help users find information easily."
//     },

// ]

import {
  playCorrectAnswer,
  playWrongAnswer,
  playQuizEnd,
} from "../utils/playSound";

const TIME_LIMIT = 30; // 30 Seconds per question

export const Quiz = () => {
  const timerRef = useRef(null);

  const [timePassed, setTimePassed] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(-1);
  const [quizFinished, setQuizFinished] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answered, setAnswered] = useState(false);


  // const [activeQuestion, setActiveQuestion] = useState(0);

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
      // The time limit has been reached for this question
      // So the answer will be considered wrong

      // Update results
      if (selectedAnswerIndex === -1) {
        setResults((prev) => ({
          ...prev,
          secondsUsed: prev.secondsUsed + TIME_LIMIT,
          wrongAnswers: prev.wrongAnswers + 1,
        }));
      }

      handleNextQuestion();
      // Restart timer
      setTimePassed(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timePassed]);

  const handleNextQuestion = () => {
    // Reset selected answer
    setSelectedAnswerIndex(-1);
    setShowExplanation(true);

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
  };

  const handleSelectAnswer = (answerIndex) => {
    //  Stop timer
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

      setIsCorrectAnswer(true);
      setIsAnswerCorrect(true); // Set the state to indicate the answer is correct


    } else {
      console.log("Wrong answer!");
      playWrongAnswer();
      // Update results
      setResults((prev) => ({
        ...prev,
        secondsUsed: prev.secondsUsed + timePassed,
        wrongAnswers: prev.wrongAnswers + 1,
      }));
      setIsCorrectAnswer(false);
      setIsAnswerCorrect(false); // Set the state to indicate the answer is wrong
    }
    
  };

  const { question, options } = quizQuestions[activeQuestion];
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
      className="w-full h-full md:px-[10rem]  flex justify-center p-5"
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col text-black font-bold text-[32px]  text-center w-full">
        <h1 className="font-bold text-base text-brand-cerulean-blue">
          QuizApp
        </h1>
        <div className="mt-6 rounded-2xl border border-brand-light-gray px-7 py-4 w-full mb-1">
          <h3 className="text-black font-medium text-sm">
            Question {activeQuestion + 1} / {numberOfQuestions}
          </h3>

          {isAnswerCorrect && (
            <motion.div
              className="absolute top-10  flex items-center justify-center  m-5 0 h-12 w-12 bg-green-500 rounded-full"
              style={{
                marginTop: "-10px",
                transform: `translateX(${progressWidth}%)`,
              }}
              initial={{ opacity: 0, scaleX: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleX: 1, scaleY: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-3 h-3  rounded-full text-green-200  flex items-center justify-center  p-4  font-normal">
                <h3 className="p-5 text-2xl">+10</h3>
              </div>
            </motion.div>
          )}

          {/* Progress Bar */}
          <div className="relative w-full h-2 mt-2 bg-brand-light-gray rounded-md overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-brand-cerulean-blue rounded-md"
              initial={{ width: "0%" }}
              animate={{ width: `${progressWidth}%` }}
              transition={{ duration: 0.5 }}
            />
            {/* Indicate correct answer with circular bulb */}
          </div>

          <div
            key={activeQuestion}
            className="flex justify-center items-center w-full mt-[18px]"
          >
            {/* Start time */}
            <span className="text-brand-mountain-mist text-xs font-normal">
              {formatTime(timePassed)}
            </span>

            {/* Bar */}
            <div className="relative flex-1 h-3 bg-[#F0F0F0] mx-1 rounded-full">
              <motion.div
                className="absolute top-0 left-0 h-full bg-brand-cerulean-blue rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${(timePassed / TIME_LIMIT) * 100}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            {/* End time */}
            <span className="text-brand-mountain-mist text-xs font-normal">
              {formatTime(TIME_LIMIT)}
            </span>
          </div>

          <h4 className="text-brand-midnight font-medium text-base mt-[34px]">
            {question}
          </h4>
        </div>

        <div className="flex items-center lg:flex-row gap-4 m6 md:m-10 flex-col justify-center ">
          <div className="flex rounded-xl h-[20rem]  items-center justify-center   first-letter:  shadow-2xl   overflow-hidden  flex-1">
            <img
              className="     rounded-2xl flex h-full w-full  object-cover  "
              src={quizQuestions[activeQuestion]?.imageUrl}
            />
          </div>




          <div className="flex flex-1">
            {answered ? (
              <p className="text-green-500 text-start font-normal text-[25px]">
                {quizQuestions[activeQuestion]?.explanation}
              </p>
            ) : (
              <OptionList
                activeQuestion={quizQuestions[activeQuestion]}
                options={options}
                selectedAnswerIndex={selectedAnswerIndex}
                onAnswerSelected={handleSelectAnswer}
                isCorrectAnswer={isCorrectAnswer}
              />
            )}
          </div>

          {/* 
          
          <div className="flex flex-1">


            <p className="text-green-500 text-start  font-normal text-[25px]">
              {quizQuestions[activeQuestion]?.explanation}
            </p>

            <OptionList
              activeQuestion={quizQuestions[activeQuestion]}
              options={options}
              selectedAnswerIndex={selectedAnswerIndex}
              onAnswerSelected={handleSelectAnswer}
              isCorrectAnswer={isCorrectAnswer}
            />
          </div> */}
        </div>

        <div className="mt-auto w-full z-10">
          <Button
            disabled={selectedAnswerIndex === -1}
            block
            className="bg-green-600 cursor-pointer text-white"
            onClick={handleNextQuestion}
          >
            Next
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default Quiz;

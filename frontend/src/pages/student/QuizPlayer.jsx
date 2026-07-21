import { useState } from "react";
import { FaQuestionCircle, FaTrophy, FaExclamationCircle, FaCheckCircle } from "react-icons/fa";

const QuizPlayer = ({ block, onPass }) => {
  const questions = block.quizData || [];
  const [currentStep, setCurrentStep] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedWrongIndices, setSelectedWrongIndices] = useState([]);
  const [correctIndexSelected, setCorrectIndexSelected] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleAnswer = (selectedIndex) => {
    if (isTransitioning) return;
    const correctIndex = questions[currentStep].correctAnswerIndex;

    if (selectedIndex === correctIndex) {
      setCorrectIndexSelected(selectedIndex);
      setIsTransitioning(true);

      setTimeout(() => {
        if (currentStep < questions.length - 1) {
          setCurrentStep(currentStep + 1);
          setSelectedWrongIndices([]);
          setCorrectIndexSelected(null);
          setIsTransitioning(false);
        } else {
          setShowResult(true);
          onPass(true);
          setIsTransitioning(false);
        }
      }, 800);
    } else {
      if (!selectedWrongIndices.includes(selectedIndex)) {
        setSelectedWrongIndices([...selectedWrongIndices, selectedIndex]);
      }
    }
  };

  if (questions.length === 0) return <div className="text-gray-500 italic">No questions found.</div>;

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 my-6">
      <div className="flex items-center gap-2 mb-6 text-blue-900 font-bold uppercase tracking-widest text-xs">
        <FaQuestionCircle /> Quiz
      </div>

      {!showResult ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="text-lg font-bold">Question {currentStep + 1} of {questions.length}</h2>
          </div>
          <p className="text-xl font-medium text-gray-800">{questions[currentStep].question}</p>
          <div className="grid grid-cols-1 gap-3">
            {questions[currentStep].options.map((opt, idx) => {
              const isWrong = selectedWrongIndices.includes(idx);
              const isCorrect = correctIndexSelected === idx;

              let borderClass = "border-gray-100 hover:border-blue-900 hover:bg-blue-50";
              if (isWrong) {
                borderClass = "border-red-500 bg-red-50/50 cursor-not-allowed";
              } else if (isCorrect) {
                borderClass = "border-emerald-500 bg-emerald-50/50";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={isWrong || isTransitioning}
                  className={`p-4 text-left border-2 rounded-xl transition-all group ${borderClass}`}
                >
                  <span className={`font-bold mr-3 ${isWrong ? 'text-red-500' : isCorrect ? 'text-emerald-600' : 'text-blue-800 group-hover:text-blue-900'}`}>
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  <span className={isWrong ? 'text-gray-400 line-through' : isCorrect ? 'text-emerald-900 font-bold' : 'text-gray-800'}>
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-6">
          <div className="space-y-6 pt-4 animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 rounded-[2rem] bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto shadow-inner border border-emerald-100 relative group">
              <div className="absolute inset-0 bg-emerald-400/20 rounded-[2rem] animate-pulse opacity-40" />
              <FaTrophy size={40} className="relative z-10" />
            </div>
            <div>
              <h3 className="text-3xl font-black text-slate-800 tracking-tight">Mastery Achieved!</h3>
              <p className="text-sm text-emerald-600 font-bold uppercase tracking-[0.2em] mt-1">100% Correct</p>
            </div>
            <p className="text-slate-500 font-medium max-w-xs mx-auto text-sm leading-relaxed">
              Incredible work! You've successfully passed the quiz with a <span className="text-emerald-600 font-black">Perfect Score</span>.
            </p>
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
              <FaCheckCircle /> Chapter Unlocked
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPlayer;
import { useState } from "react";
import { FaQuestionCircle, FaTrophy, FaExclamationCircle, FaCheckCircle } from "react-icons/fa";

const QuizPlayer = ({ block, onPass }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const questions = block.quizData || [];

  const handleAnswer = (selectedIndex) => {
    const isCorrect = selectedIndex === questions[currentStep].correctAnswerIndex;
    const newScore = score + (isCorrect ? 1 : 0);

    if (currentStep < questions.length - 1) {
      setScore(newScore);
      setCurrentStep(currentStep + 1);
    } else {
      setShowResult(true);
      onPass(newScore === questions.length);
      setScore(newScore);
    }
  };

  const handleTryAgain = () => {
    setScore(0);
    setCurrentStep(0);
    setShowResult(false);
    onPass(false);
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
            <span className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">
              Score: {score}
            </span>
          </div>
          <p className="text-xl font-medium text-gray-800">{questions[currentStep].question}</p>
          <div className="grid grid-cols-1 gap-3">
            {questions[currentStep].options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className="p-4 text-left border-2 border-gray-100 rounded-xl hover:border-blue-900 hover:bg-blue-50 transition-all group"
              >
                <span className="font-bold mr-3 text-blue-800 group-hover:text-blue-900">
                  {String.fromCharCode(65 + idx)}.
                </span>
                {opt}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-6">
          {score === questions.length ? (
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
                <FaCheckCircle /> Module Unlocked
              </div>
            </div>
          ) : (
            <div className="space-y-6 pt-4 animate-in fade-in zoom-in duration-500">
              <div className="w-24 h-24 rounded-[2rem] bg-amber-50 text-amber-500 flex items-center justify-center mx-auto shadow-inner border border-amber-100 relative group">
                <div className="absolute inset-0 bg-amber-400/20 rounded-[2rem] animate-ping opacity-20" />
                <FaExclamationCircle size={40} className="relative z-10" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Almost There!</h3>
                <p className="text-sm text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Score: {score} out of {questions.length}</p>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 max-w-[200px] mx-auto overflow-hidden">
                  <div className="bg-amber-500 h-full transition-all duration-1000" style={{ width: `${(score / questions.length) * 100}%` }} />
                </div>
              </div>
              <p className="text-slate-500 font-medium max-w-xs mx-auto text-sm leading-relaxed">
                You need a <span className="text-blue-900 font-black">Perfect Score</span> to master this module. Let's give it another shot!
              </p>
              <button onClick={handleTryAgain} className="h-14 px-10 bg-blue-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-900/20 hover:bg-blue-800 hover:scale-[1.02] active:scale-[0.98] transition-all">
                Retry Challenge →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizPlayer;
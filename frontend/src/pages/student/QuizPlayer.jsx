import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { FaArrowLeft, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const QuizPlayer = () => {
  const { state } = useLocation();
  const { courseId } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  
  const module = state?.module;
  const questions = module?.quizData || [];
  
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  // RESET FUNCTION FOR "TRY AGAIN"
  const handleTryAgain = () => {
    setScore(0);
    setCurrentStep(0);
    setShowResult(false);
  };

  const handleAnswer = (selectedIndex) => {
    if (selectedIndex === questions[currentStep].correctAnswerIndex) {
      setScore(prev => prev + 1);
    }

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleFinish = async () => {
    // If score is not perfect, just reset the quiz
    if (score !== questions.length) {
      handleTryAgain();
      return;
    }

    // If perfect score, save progress
    try {
      const res = await axiosSecure.patch(`/update-progress/${courseId}`, {
        completedModuleOrder: module.order
      });
      
      if (res.data.success) {
        toast.success("Module Completed! Next module unlocked.");
        navigate(-1); // Go back to learning path
      }
    } catch (err) {
      console.error("Patch failed:", err.response?.data);
      toast.error("Failed to save progress. Please try again.");
    }
  };

  if (!module) return <div className="p-10 text-center">No quiz data found.</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-6 text-gray-500 hover:text-indigo-600 transition">
        <FaArrowLeft /> Back to Course
      </button>

      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        {!showResult ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-bold">Question {currentStep + 1} of {questions.length}</h2>
              <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold">
                Score: {score}
              </span>
            </div>

            <p className="text-2xl font-medium text-gray-800">{questions[currentStep].question}</p>

            <div className="grid grid-cols-1 gap-4">
              {questions[currentStep].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className="p-4 text-left border-2 border-gray-100 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all active:scale-95 group"
                >
                  <span className="font-bold mr-3 text-indigo-400 group-hover:text-indigo-600">
                    {String.fromCharCode(65 + idx)}.
                  </span> 
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6 py-10">
            {score === questions.length ? (
              <>
                <div className="text-green-500 text-7xl flex justify-center"><FaCheckCircle /></div>
                <h2 className="text-3xl font-bold text-gray-800">Perfect Score!</h2>
                <p className="text-gray-500">You've mastered this module. You can now proceed to the next section.</p>
              </>
            ) : (
              <>
                <div className="text-red-500 text-7xl flex justify-center"><FaTimesCircle /></div>
                <h2 className="text-3xl font-bold text-gray-800">Keep Practicing</h2>
                <p className="text-gray-500">You got {score} out of {questions.length}. You need 100% to unlock the next module.</p>
              </>
            )}
            
            <button 
              onClick={handleFinish} 
              className={`btn btn-lg w-full text-white border-none transition-all ${
                score === questions.length 
                ? 'bg-green-500 hover:bg-green-600 shadow-lg shadow-green-100' 
                : 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-100'
              }`}
            >
              {score === questions.length ? "Finish & Unlock Next" : "Try Again"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPlayer;
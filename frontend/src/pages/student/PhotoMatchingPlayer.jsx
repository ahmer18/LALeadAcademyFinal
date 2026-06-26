import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";

const PhotoMatchingPlayer = ({ block }) => {
  const [selections, setSelections] = useState({});
  const [feedback, setFeedback] = useState(null);

  const images = block.images || (block.photoUrl ? [{ url: block.photoUrl, correctTerm: "" }] : []);
  const terms = block.terms || [];
  const hasMatchingGame = terms.length > 0 && images.some(img => img.correctTerm);
  const allSelected = hasMatchingGame && images.every((_, idx) => selections[idx] && selections[idx] !== "");

  const handleImageSelect = (imgIdx, value) => {
    setSelections(prev => ({
      ...prev,
      [imgIdx]: value
    }));
    setFeedback(null);
  };

  const checkImageAnswers = () => {
    const allCorrect = images.every((img, idx) => selections[idx] === img.correctTerm);
    setFeedback(allCorrect ? 'correct' : 'incorrect');
  };

  // Legacy single-image display (no terms/matching)
  if (!hasMatchingGame) {
    return (
      <div className="w-full flex justify-center">
        <div className="bg-white p-4 md:p-6 rounded-3xl shadow-md border border-slate-100 overflow-hidden inline-block">
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img.url}
              alt={block.heading || "Module Image"}
              className="max-w-full h-auto rounded-2xl object-contain max-h-[55vh] shadow-sm"
            />
          ))}
        </div>
      </div>
    );
  }

  // Interactive matching grid
  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {images.map((img, idx) => {
          const isChecked = feedback !== null && feedback !== undefined;
          const isCorrect = isChecked && selections[idx] === img.correctTerm;
          const isIncorrect = isChecked && selections[idx] !== img.correctTerm;

          return (
            <div
              key={idx}
              className={`bg-white rounded-2xl border-2 overflow-hidden shadow-md transition-all duration-300 ${isCorrect ? 'border-emerald-400 shadow-emerald-100' :
                  isIncorrect ? 'border-red-300 shadow-red-100' :
                    'border-slate-100 hover:border-slate-200 hover:shadow-lg'
                }`}
            >
              <div className="aspect-[4/3] bg-slate-50 flex items-center justify-center p-3">
                <img
                  src={img.url}
                  alt={`Image ${idx + 1}`}
                  className="max-w-full max-h-full object-contain rounded-xl"
                />
              </div>
              <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                <select
                  value={selections[idx] || ""}
                  onChange={(e) => handleImageSelect(idx, e.target.value)}
                  disabled={feedback === 'correct'}
                  className={`select select-bordered w-full rounded-xl text-sm font-bold transition-all ${isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-800' :
                      isIncorrect ? 'bg-red-50 border-red-300 text-red-800' :
                        'bg-white border-slate-200 text-slate-700 focus:border-blue-900'
                    }`}
                >
                  <option value="">Select an answer...</option>
                  {terms.map((term, tIdx) => (
                    <option key={tIdx} value={term}>{term}</option>
                  ))}
                </select>
              </div>
            </div>
          );
        })}
      </div>

      {/* Check Answers Button */}
      {feedback !== 'correct' && (
        <div className="flex justify-center">
          <button
            onClick={checkImageAnswers}
            disabled={!allSelected}
            className={`px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg flex items-center gap-2 ${allSelected
                ? 'bg-blue-900 text-white hover:bg-blue-800 hover:scale-[1.02] active:scale-[0.97] shadow-blue-900/20'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
              }`}
          >
            <FaCheckCircle size={14} />
            Check Answers
          </button>
        </div>
      )}

      {/* Feedback Alert */}
      {feedback && (
        <div className={`max-w-3xl mx-auto p-6 rounded-2xl border-2 transition-all duration-500 animate-fadeIn ${feedback === 'correct'
            ? 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200'
            : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200'
          }`}>
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner flex-shrink-0 ${feedback === 'correct' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
              }`}>
              {feedback === 'correct' ? '🎉' : '💡'}
            </div>
            <div>
              <h4 className={`font-black text-lg tracking-tight ${feedback === 'correct' ? 'text-emerald-800' : 'text-amber-800'
                }`}>
                {feedback === 'correct' ? 'Excellent Work!' : 'Keep Learning!'}
              </h4>
              <p className={`text-sm mt-1 font-medium leading-relaxed ${feedback === 'correct' ? 'text-emerald-700/80' : 'text-amber-700/80'
                }`}>
                {feedback === 'correct'
                  ? 'You have fully understood this topic. Every answer is correct — keep up the amazing work!'
                  : "Your concepts aren't quite clear yet, but don't worry! Review the material and try again — you've got this."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoMatchingPlayer;

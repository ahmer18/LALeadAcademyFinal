import { FaFileAlt } from "react-icons/fa";

const AssignmentPlayer = ({ block }) => {
  return (
    <div className="w-full">
      <div className="bg-amber-50 p-6 md:p-8 rounded-2xl border border-amber-200 relative overflow-hidden">
        <FaFileAlt className="absolute -bottom-4 -right-4 text-amber-200/50 text-9xl" />
        <div className="relative z-10 flex items-center gap-3 mb-4">
          <span className="w-10 h-10 rounded-xl bg-amber-200 flex items-center justify-center text-amber-800 shadow-inner">
            <FaFileAlt />
          </span>
          <h3 className="text-xl font-bold text-amber-900">Assignment Task</h3>
        </div>
        <div className="relative z-10 prose prose-amber">
          <p className="whitespace-pre-wrap text-amber-900/80 font-medium">{block.assignmentDetails?.description || block.description}</p>
        </div>
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-amber-900 text-white text-xs font-bold rounded-lg tracking-wider">
          DUE DATE: <span className="text-amber-300">{block.assignmentDetails?.deadline || block.deadline}</span>
        </div>
        <p className="text-xs text-amber-700/60 mt-4 relative z-10 font-bold italic">
          * Return to the Course Dashboard to submit this assignment file when ready.
        </p>
      </div>
    </div>
  );
};

export default AssignmentPlayer;

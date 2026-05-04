import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import StarRatings from "react-star-ratings";
import { useFeedback } from "../../providers/FeedbackProvider";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { FaTimes, FaStar } from "react-icons/fa";

export default function GiveFeedbackModal({
  setIsModalOpen,
  courseId,
  existingFeedbacks,
  queryClient,
}) {
  const { user } = useAuth();
  const { register, handleSubmit, reset } = useForm();
  const [rating, setRating] = useState(existingFeedbacks?.[0]?.rating || 5);
  const modalRef = useRef(null);
  const axiosSecure = useAxiosSecure();
  const { showFeedback } = useFeedback();

  const isUpdating = existingFeedbacks && existingFeedbacks.length > 0;

  // feedback submit mutation
  const addFeedbackMutation = useMutation({
    mutationFn: (data) => {
      return axiosSecure.post(`/feedbacks`, data);
    },
    onSuccess: () => {
      resetTheModal();
      showFeedback("Feedback submitted successfully.", "success");
      queryClient.invalidateQueries(["feedbacks", courseId]);
    },
    onError: (error) => {
      showFeedback("Failed to submit feedback.", "error");
      console.error(error);
    },
  });

  // update feedback mutation
  const updateFeedbackMutation = useMutation({
    mutationFn: (data) => {
      const feedbackId = existingFeedbacks?.[0]?._id;
      if (!feedbackId) throw new Error("No feedback found to update");
      return axiosSecure.patch(`/feedbacks/${feedbackId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["feedbacks", courseId]);
      resetTheModal();
      showFeedback("Feedback updated successfully.", "success");
    },
    onError: (error) => {
      showFeedback("Failed to update feedback.", "error");
      console.error(error);
    },
  });

  const onSubmit = (data) => {
    const feedbackPayload = { 
      feedback: data.feedback, 
      rating, 
      courseId, 
      studentEmail: user.email 
    };
    addFeedbackMutation.mutate(feedbackPayload);
  };

  const onUpdate = (data) => {
    const feedback = { feedback: data.feedback, rating };
    updateFeedbackMutation.mutate(feedback);
  };

  const resetTheModal = () => {
    reset();
    setRating(5);
    setIsModalOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex justify-center items-center p-4 animate-fadeIn">
      <div
        ref={modalRef}
        className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl relative overflow-hidden border border-slate-100 animate-scaleUp"
      >
        {/* Modal Header */}
        <div className="bg-slate-50/50 p-8 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-blue-900 tracking-tight">
              {isUpdating ? "Update Feedback" : "Course Feedback"}
            </h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1 italic">
              Share your learning experience with us
            </p>
          </div>
          <button
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all flex items-center justify-center shadow-sm"
            onClick={() => setIsModalOpen(false)}
          >
            <FaTimes size={18} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(isUpdating ? onUpdate : onSubmit)}
          className="p-8 space-y-8"
        >
          {/* Rating Section */}
          <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100/50">
            <label className="block mb-4 text-[10px] font-black text-blue-900 uppercase tracking-widest flex items-center gap-2">
               Rate your experience
            </label>
            <div className="flex justify-center">
              <StarRatings
                rating={rating}
                starRatedColor="#f59e0b" // bg-amber-500
                starHoverColor="#fbbf24" // bg-amber-400
                starEmptyColor="#cbd5e1" // bg-slate-300
                changeRating={(newRating) => setRating(newRating)}
                numberOfStars={5}
                name="rating"
                starDimension="40px"
                starSpacing="8px"
              />
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-3">
            <label className="block text-[10px] font-black text-blue-900 uppercase tracking-widest ml-1">
              Your Review
            </label>
            <textarea
              {...register("feedback", { required: true })}
              defaultValue={existingFeedbacks?.[0]?.feedback || ""}
              rows={5}
              className="textarea w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-300 rounded-2xl text-sm focus:border-blue-900 focus:ring-4 focus:ring-blue-900/5 transition-all leading-relaxed font-medium p-4 resize-none"
              placeholder="What did you think about the course modules, quizzes, and quality of content? We'd love to hear your thoughts."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4">
             <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addFeedbackMutation.isPending || updateFeedbackMutation.isPending}
              className="flex-[2] py-4 bg-blue-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-800 transition-all shadow-xl shadow-blue-900/10 disabled:opacity-50 active:scale-95"
            >
              {addFeedbackMutation.isPending || updateFeedbackMutation.isPending 
                ? "Processing..." 
                : isUpdating ? "Update Feedback" : "Share Feedback"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

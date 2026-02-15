import { useLocation, useNavigate, useParams } from "react-router";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { toast } from "react-toastify";

const VideoPlayer = () => {
  const { state } = useLocation();
  const { courseId } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const module = state?.module;

  const handleComplete = async () => {
    try {
      // This unlocks the next module in the 1-9 sequence
      await axiosSecure.patch(`/update-progress/${courseId}`, {
        completedModuleOrder: module.order
      });
      toast.success("Progress saved!");
      navigate(-1); // Go back to the learning path
    } catch (err) {
      toast.error("Error updating progress");
    }
  };

  if (!module?.videoUrl) return <div className="p-10 text-center">Video not found.</div>;

  // Simple logic to convert YouTube link to embed link
  const embedUrl = module.videoUrl.replace("watch?v=", "embed/");

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-bold">
        <FaArrowLeft /> Back to Path
      </button>
      
      <div className="aspect-video w-full shadow-2xl rounded-2xl overflow-hidden bg-black">
        <iframe
          width="100%"
          height="100%"
          src={embedUrl}
          title={module.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{module.title}</h2>
          <p className="text-gray-500">Module {module.order} • Video Lecture</p>
        </div>
        <button 
          onClick={handleComplete}
          className="btn btn-success text-white flex gap-2"
        >
          <FaCheckCircle /> Mark as Completed
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;
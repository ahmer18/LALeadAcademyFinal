import { useState } from "react";
import { FaSpinner } from "react-icons/fa";

const VideoPlayer = ({ videoUrl, title }) => {
  const [isLoading, setIsLoading] = useState(true);

  const getYouTubeId = (url) => {
    if (!url) return "";
    if (url.includes("watch?v=")) {
      return url.split("watch?v=")[1]?.split("&")[0];
    } else if (url.includes("youtu.be/")) {
      return url.split("youtu.be/")[1]?.split("?")[0];
    } else if (url.includes("youtube.com/embed/")) {
      return url.split("embed/")[1]?.split("?")[0];
    }
    return url;
  };

  const videoId = getYouTubeId(videoUrl);
  const embedUrl = `https://www.youtube.com/embed/${videoId}?controls=1&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0`;

  return (
    <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black select-none">
      {/* Youtube Iframe */}
      {videoId && (
        <iframe
          width="100%"
          height="100%"
          src={embedUrl}
          title={title || "Video Player"}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          onLoad={() => setIsLoading(false)}
          className={`absolute inset-0 z-10 w-full h-full transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"
            }`}
        ></iframe>
      )}

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-white z-20 gap-3">
          <FaSpinner className="animate-spin text-4xl text-indigo-500" />
          <span className="text-xs uppercase font-black tracking-widest text-slate-400">Loading Video...</span>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
import React, { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

const FeedbackContext = createContext();

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error("useFeedback must be used within a FeedbackProvider");
  }
  return context;
};

export const FeedbackProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const showFeedback = useCallback((message, type = "success") => {
    const id = Date.now();
    setNotification({ message, type, id });
    
    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      setNotification(prev => prev?.id === id ? null : prev);
    }, 2000);
  }, []);

  const hideFeedback = useCallback(() => setNotification(null), []);

  return (
    <FeedbackContext.Provider value={{ showFeedback, hideFeedback }}>
      {children}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] pointer-events-none"
          >
            <div className="flex items-center gap-4 px-6 py-3 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] pointer-events-auto min-w-[320px]">
              <div className={`p-2 rounded-xl ${
                notification.type === "success" ? "bg-green-50 text-green-600" :
                notification.type === "error" ? "bg-red-50 text-red-600" :
                "bg-blue-50 text-blue-600"
              }`}>
                {notification.type === "success" && <CheckCircle size={20} />}
                {notification.type === "error" && <AlertCircle size={20} />}
                {notification.type === "info" && <Info size={20} />}
              </div>
              
              <div className="flex-1">
                  {/* <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-900 opacity-60 leading-none mb-1">
                    System {notification.type}
                  </p> */}
                <p className="text-sm font-bold text-slate-800 leading-tight">
                  {notification.message}
                </p>
              </div>

              <button 
                onClick={hideFeedback}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors text-slate-400"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </FeedbackContext.Provider>
  );
};

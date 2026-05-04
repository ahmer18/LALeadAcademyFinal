export default function LoaderSpinner() {
  return (
    <div className="flex flex-col justify-center items-center h-full min-h-[200px] gap-6">
      <div className="relative w-24 h-24">
        {/* Outer glowing ring */}
        <div className="absolute inset-0 border-t-4 border-l-4 border-blue-600 rounded-full animate-spin shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
        {/* Middle reverse ring */}
        <div className="absolute inset-3 border-r-4 border-b-4 border-cyan-400 rounded-full animate-[spin_1.5s_linear_infinite_reverse] shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
        {/* Inner ring */}
        <div className="absolute inset-6 border-t-4 border-r-4 border-[#1B365D] rounded-full animate-[spin_2s_linear_infinite]"></div>
        {/* Center Logo text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-cyan-400">LA</span>
        </div>
      </div>
      <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 animate-pulse">
        Loading...
      </p>
    </div>
  );
}

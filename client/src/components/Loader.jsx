const Loader = ({ label = 'Analyzing code...' }) => {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-3 text-sm text-cyan-200">
      <span className="h-3 w-3 animate-pulse rounded-full bg-cyan-400" />
      <span>{label}</span>
    </div>
  );
};

export default Loader;

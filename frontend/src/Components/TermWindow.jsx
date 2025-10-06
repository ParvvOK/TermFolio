export const TermWindow = ({ children }) => {
  return (
    <div className="hidden sm:flex items-center justify-center min-h-screen px-4">
      <div className="bg-slate-800 w-[90%] max-w-8xl rounded-md shadow-lg flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-700 rounded-t-md">
          <span className="w-3 h-3 bg-red-500 rounded-full"></span>
          <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
        </div>

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

import { NavLink, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import History from './pages/History.jsx';

const navClassName = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-medium transition ${isActive ? 'bg-cyan-400 text-slate-950' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`;

const App = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-300">Production Tooling</p>
            <h1 className="text-lg font-semibold text-white">AI Code Reviewer By Thanooj</h1>
          </div>
          <nav className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 p-1">
            <NavLink to="/" end className={navClassName}>Review</NavLink>
            <NavLink to="/history" className={navClassName}>History</NavLink>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </main>

      <footer className="border-t border-slate-800/80 bg-slate-950/70">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-5 text-sm text-slate-400 lg:px-6">
          <p>Built by Thanooj</p>
          <p className="text-slate-500">AI-assisted code review for bugs, performance and security.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;

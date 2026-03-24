import { useEffect, useMemo, useRef, useState } from 'react';
import CodeEditor from '../components/CodeEditor.jsx';
import ReviewResult from '../components/ReviewResult.jsx';
import Loader from '../components/Loader.jsx';
import { createReview } from '../services/api.js';

const languages = ['javascript', 'typescript', 'python', 'java', 'cpp', 'go', 'rust', 'php', 'csharp'];

const initialSnippet = `function loginUser(username, password) {
  if (username == 'admin' && password == 'admin123') {
    return true;
  }

  return false;
}`;

const Home = () => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(initialSnippet);
  const [review, setReview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const reviewSectionRef = useRef(null);

  const stats = useMemo(() => {
    const lines = code ? code.split('\n').length : 0;
    return { characters: code.length, lines };
  }, [code]);

  useEffect(() => {
    if (!isLoading && !review && !error) {
      return;
    }

    reviewSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, [isLoading, review, error]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await createReview({ language, code });
      setReview(response.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to review code right now.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 lg:px-6">
      <section className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 shadow-[0_30px_100px_rgba(15,23,42,0.65)] backdrop-blur">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.32em] text-cyan-300">AI Code Reviewer</p>
            <h1 className="text-3xl font-semibold text-white">Paste code. Ship safer.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
              Run an AI-assisted review focused on defects, performance bottlenecks, and security concerns before the code reaches production.
            </p>
          </div>
          <div className="grid min-w-[180px] gap-3 rounded-3xl border border-slate-800 bg-slate-950/80 p-4 text-sm text-slate-400 sm:grid-cols-2 lg:grid-cols-1">
            <div>
              <span className="block text-xs uppercase tracking-[0.18em] text-slate-500">Characters</span>
              <strong className="text-lg text-slate-100">{stats.characters}</strong>
            </div>
            <div>
              <span className="block text-xs uppercase tracking-[0.18em] text-slate-500">Lines</span>
              <strong className="text-lg text-slate-100">{stats.lines}</strong>
            </div>
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-3 text-sm text-slate-300">
              <span>Language</span>
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
              >
                {languages.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-cyan-800"
            >
              {isLoading ? 'Reviewing...' : 'Review Code'}
            </button>
          </div>

          <CodeEditor language={language} value={code} onChange={setCode} />
        </form>
      </section>

      <section ref={reviewSectionRef} className="space-y-5 scroll-mt-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Review Output</p>
            <h2 className="text-2xl font-semibold text-white">Your AI review appears here</h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-400">
              After you submit code, the summary and findings will show up in this section automatically.
            </p>
          </div>
        </div>
        {isLoading && <Loader />}
        {error && <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>}
        <ReviewResult review={review} />
      </section>
    </div>
  );
};

export default Home;

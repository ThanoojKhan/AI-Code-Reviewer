import { useEffect, useState } from 'react';
import Loader from '../components/Loader.jsx';
import { deleteReview, fetchReviewById, fetchReviewMetrics, fetchReviews } from '../services/api.js';

const History = () => {
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [error, setError] = useState('');

  const loadReviews = async () => {
    setIsLoading(true);
    setError('');

    try {
      const [reviewsResponse, metricsResponse] = await Promise.all([
        fetchReviews({ page: 1, limit: 10 }),
        fetchReviewMetrics(),
      ]);
      setReviews(reviewsResponse.data);
      setPagination(reviewsResponse.pagination);
      setMetrics(metricsResponse.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to fetch review history.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleView = async (id) => {
    setIsDetailLoading(true);

    try {
      const response = await fetchReviewById(id);
      setSelectedReview(response.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load review details.');
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteReview(id);
      if (selectedReview?._id === id) {
        setSelectedReview(null);
      }
      await loadReviews();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to delete review.');
    }
  };

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:px-6 xl:grid-cols-[0.85fr_1.15fr]">
      <section className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 shadow-[0_30px_100px_rgba(15,23,42,0.65)]">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.32em] text-cyan-300">Review History</p>
            <h1 className="text-3xl font-semibold text-white">Stored analysis</h1>
          </div>
          {pagination && <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400">{pagination.total} total reviews</span>}
        </div>

        {metrics && (
          <div className="mb-6 grid gap-3 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">AI Cost</p>
              <p className="mt-2 text-2xl font-semibold text-white">${Number(metrics.totalEstimatedCostUsd || 0).toFixed(6)}</p>
              <p className="mt-2 text-sm text-slate-400">
                {metrics.totalPromptTokens} prompt tokens and {metrics.totalCompletionTokens} completion tokens processed.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Cache Efficiency</p>
              <p className="mt-2 text-2xl font-semibold text-white">{metrics.totalCacheHits}</p>
              <p className="mt-2 text-sm text-slate-400">
                Cache hits served across {metrics.cachedResponsesServed} cached review entries.
              </p>
            </div>
          </div>
        )}

        {isLoading ? (
          <Loader label="Loading history..." />
        ) : (
          <div className="space-y-4">
            {reviews.length ? (
              reviews.map((review) => (
                <article key={review._id} className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-medium text-slate-100">{review.language}</h2>
                        {review.isCachedResult && (
                          <span className="rounded-full border border-emerald-500/30 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-emerald-300">
                            Cached x{review.cacheHitCount}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">{new Date(review.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => handleView(review._id)} className="rounded-2xl border border-cyan-400/30 px-3 py-2 text-xs font-medium text-cyan-200 transition hover:border-cyan-300 hover:text-cyan-100">View</button>
                      <button type="button" onClick={() => handleDelete(review._id)} className="rounded-2xl border border-rose-500/30 px-3 py-2 text-xs font-medium text-rose-200 transition hover:border-rose-400">Delete</button>
                    </div>
                  </div>
                  <p className="max-h-[4.5rem] overflow-hidden text-sm leading-6 text-slate-400">{review.analysis?.summary || 'No summary available.'}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                    <span className="rounded-full border border-slate-800 px-2 py-1">{review.totalTokens} tokens</span>
                    <span className="rounded-full border border-slate-800 px-2 py-1">${Number(review.estimatedCostUsd || 0).toFixed(6)}</span>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-950/60 p-6 text-sm text-slate-400">No reviews stored yet.</div>
            )}
          </div>
        )}
      </section>

      <section className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 shadow-[0_30px_100px_rgba(15,23,42,0.65)]">
        <div className="mb-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.32em] text-cyan-300">Detail View</p>
          <h2 className="text-2xl font-semibold text-white">Review payload</h2>
        </div>

        {error && <div className="mb-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>}
        {isDetailLoading ? (
          <Loader label="Loading review detail..." />
        ) : selectedReview ? (
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2 text-xs text-slate-400">
              <span className="rounded-full border border-slate-700 px-3 py-1">{selectedReview.language}</span>
              <span className="rounded-full border border-slate-700 px-3 py-1">{selectedReview.model}</span>
              <span className="rounded-full border border-slate-700 px-3 py-1">{selectedReview.totalTokens} tokens</span>
              <span className="rounded-full border border-slate-700 px-3 py-1">${Number(selectedReview.estimatedCostUsd || 0).toFixed(6)}</span>
              {selectedReview.isCachedResult && (
                <span className="rounded-full border border-emerald-500/30 px-3 py-1 text-emerald-300">Cache hit x{selectedReview.cacheHitCount}</span>
              )}
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">Summary</h3>
              <p className="text-sm leading-7 text-slate-300">{selectedReview.analysis.summary}</p>
            </div>
            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">Code</h3>
                <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap text-xs leading-6 text-slate-300">{selectedReview.code}</pre>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">Analysis JSON</h3>
                <pre className="max-h-[420px] overflow-auto text-xs leading-6 text-slate-300">{JSON.stringify(selectedReview.analysis, null, 2)}</pre>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-950/60 p-6 text-sm text-slate-400">Select a review from the left to inspect the stored code and AI analysis.</div>
        )}
      </section>
    </div>
  );
};

export default History;

const Section = ({ title, items, emptyText, renderItem }) => (
  <section className="flex h-full min-w-0 flex-col rounded-[1.75rem] border border-slate-800 bg-slate-900/80 p-5">
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">{title}</h3>
      <span className="rounded-full border border-slate-700 px-2.5 py-1 text-[11px] text-slate-500">{items.length} items</span>
    </div>
    {items.length ? (
      <div className="space-y-3">{items.map(renderItem)}</div>
    ) : (
      <p className="mt-auto text-sm leading-6 text-slate-400">{emptyText}</p>
    )}
  </section>
);

const ReviewResult = ({ review }) => {
  if (!review) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-900/50 p-8 text-sm text-slate-400">
        Submit code to generate an AI review with bugs, performance suggestions and security findings.
      </div>
    );
  }

  const { analysis, language, model, createdAt, totalTokens, estimatedCostUsd, isCachedResult, cacheHitCount } = review;

  return (
    <div className="space-y-6">
      <section className="rounded-4xl border border-cyan-500/20 bg-slate-900/90 p-6 shadow-[0_24px_80px_rgba(8,145,178,0.15)]">
        <div className="mb-5 flex flex-wrap gap-3 text-xs text-slate-400">
          <span className="rounded-full border border-slate-700 px-3 py-1">{language}</span>
          <span className="rounded-full border border-slate-700 px-3 py-1">{model}</span>
          <span className="rounded-full border border-slate-700 px-3 py-1">{totalTokens} tokens</span>
          <span className="rounded-full border border-slate-700 px-3 py-1">${Number(estimatedCostUsd || 0).toFixed(6)}</span>
          <span className={`rounded-full border px-3 py-1 ${isCachedResult ? 'border-emerald-500/30 text-emerald-300' : 'border-slate-700'}`}>
            {isCachedResult ? `Cache hit x${cacheHitCount}` : 'Fresh AI result'}
          </span>
          <span className="rounded-full border border-slate-700 px-3 py-1">{new Date(createdAt).toLocaleString()}</span>
        </div>
        <h2 className="mb-2 text-xl font-semibold text-slate-100">Review summary</h2>
        <p className="max-w-4xl text-sm leading-7 text-slate-300 sm:text-base">{analysis.summary || 'No summary generated.'}</p>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <Section
          title="Bugs"
          items={analysis.bugs || []}
          emptyText="No bug findings reported."
          renderItem={(item, index) => (
            <article key={`${item.line}-${index}`} className="min-w-0 rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4">
              <p className="mb-2 text-xs uppercase tracking-[0.18em] text-rose-300">
                {item.line ? `Line ${item.line}` : 'General finding'}
              </p>
              <p className="wrap-break-word text-sm leading-6 text-slate-200">{item.description}</p>
            </article>
          )}
        />
        <Section
          title="Performance"
          items={analysis.performance || []}
          emptyText="No performance suggestions reported."
          renderItem={(item, index) => (
            <article key={index} className="min-w-0 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
              <p className="wrap-break-word text-sm leading-6 text-slate-200">{item.suggestion}</p>
            </article>
          )}
        />
        <Section
          title="Security"
          items={analysis.security || []}
          emptyText="No security issues reported."
          renderItem={(item, index) => (
            <article key={index} className="min-w-0 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4">
              <p className="wrap-break-word text-sm leading-6 text-slate-200">{item.issue}</p>
            </article>
          )}
        />
      </div>
    </div>
  );
};

export default ReviewResult;

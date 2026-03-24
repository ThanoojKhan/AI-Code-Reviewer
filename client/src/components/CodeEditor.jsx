import Editor from '@monaco-editor/react';

const editorOptions = {
  minimap: { enabled: false },
  fontSize: 14,
  fontFamily: 'Consolas, monospace',
  lineNumbersMinChars: 3,
  scrollBeyondLastLine: false,
  automaticLayout: true,
  wordWrap: 'on',
  padding: { top: 16 },
};

const CodeEditor = ({ language, value, onChange }) => {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-[0_24px_80px_rgba(2,6,23,0.55)]">
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-3 text-xs text-slate-400">
        <span>editor://snippet.{language}</span>
        <span>Monaco</span>
      </div>
      <Editor
        height="480px"
        theme="vs-dark"
        language={language}
        value={value}
        options={editorOptions}
        onChange={(nextValue) => onChange(nextValue || '')}
      />
    </div>
  );
};

export default CodeEditor;

import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Sparkles, Target, UploadCloud, CheckCircle2 } from 'lucide-react';
import { Shell, Notice } from '../components/Ui';
import { errorMessage } from '../services/api';
import { analyzeCandidateResume, getAiJobMatches, type ResumeAnalysis, type JobMatch } from '../services/candidateAiService';

export function CandidateAiPage() {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [busy, setBusy] = useState(false);
  const [matching, setMatching] = useState(false);
  const [matchesRequested, setMatchesRequested] = useState(false);
  const [error, setError] = useState('');

  const analyze = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) { setError('Choose a PDF, DOC, or DOCX resume first.'); return; }
    setBusy(true); setError(''); setMatches([]); setMatchesRequested(false);
    try {
      const result = await analyzeCandidateResume(file);
      setAnalysis(result);
    } catch (e) { setError(errorMessage(e)); }
    finally { setBusy(false); }
  };

  const findMatches = async () => {
    setMatching(true); setError(''); setMatchesRequested(true);
    try { const result = await getAiJobMatches(); setMatches(result.matches || []); }
    catch (e) { setError(errorMessage(e)); }
    finally { setMatching(false); }
  };

  return <Shell><main className="page mx-auto max-w-5xl">
    <div className="mb-7"><p className="text-sm font-bold text-brand">CAREERDOCK AI</p><h1 className="mt-1 text-3xl font-bold text-ink">AI career tools</h1><p className="mt-2 text-slate-600">Understand your resume and discover jobs that fit your demonstrated skills.</p></div>
    {error && <div className="mb-5"><Notice message={error}/></div>}
    <section className="card">
      <div className="flex items-center gap-3"><span className="rounded-xl bg-indigo-50 p-3 text-indigo-700"><FileText/></span><div><h2 className="text-xl font-bold text-ink">1. AI resume analyzer</h2><p className="text-sm text-slate-600">Upload a text-based PDF, DOC, or DOCX (maximum 10 MB).</p></div></div>
      <form onSubmit={analyze} className="mt-5 flex flex-col gap-3 sm:flex-row">
        <label className="flex flex-1 cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-600"><UploadCloud/><span className="min-w-0 flex-1 truncate">{file?.name || 'Choose your resume'}</span><input type="file" accept=".pdf,.doc,.docx" className="sr-only" onChange={e => setFile(e.target.files?.[0] || null)}/></label>
        <button disabled={busy || !file} className="btn-primary inline-flex items-center justify-center gap-2 disabled:opacity-50"><Sparkles size={17}/>{busy ? 'Analyzing…' : 'Analyze resume'}</button>
      </form>
      {analysis && <div className="mt-6 space-y-5 border-t border-slate-100 pt-5">
        <div><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Professional summary</p><p className="mt-2 leading-7 text-slate-700">{analysis.professionalSummary}</p><p className="mt-2 text-sm text-slate-500">Estimated experience level: {analysis.experienceLevel}</p></div>
        <div className="grid gap-4 md:grid-cols-3">
          <ResultList title="Extracted skills" values={analysis.skills}/>
          <ResultList title="Strengths" values={analysis.strengths}/>
          <ResultList title="Areas to improve" values={analysis.improvementAreas}/>
        </div>
        <button onClick={findMatches} disabled={matching} className="btn-primary inline-flex items-center gap-2"><Target size={17}/>{matching ? 'Finding matches…' : 'Find matching jobs'}</button>
      </div>}
    </section>
    {(matchesRequested || matches.length > 0 || matching) && <section className="mt-6 space-y-4"><div><h2 className="text-xl font-bold text-ink">2. Your AI job matches</h2><p className="text-sm text-slate-600">Scores are advisory estimates based on the resume and job descriptions, not hiring decisions.</p></div>
      {matches.map(match => <article key={match.jobId} className="card">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="text-lg font-bold text-ink">{match.jobTitle}</h3><p className="mt-1 text-sm text-slate-600">{match.explanation}</p></div><div className="rounded-xl bg-indigo-50 px-4 py-2 text-center"><p className="text-2xl font-bold text-indigo-700">{match.matchScore}%</p><p className="text-xs font-semibold text-indigo-700">Match</p></div></div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2"><ResultList title="Matching skills" values={match.matchingSkills}/><ResultList title="Skills to develop" values={match.missingSkills}/></div>
        <Link to={`/jobs/${match.jobId}`} className="mt-4 inline-block text-sm font-bold text-brand">View job →</Link>
      </article>)}
      {!matching && matches.length===0 && <p className="card text-sm text-slate-600">No active job matches were returned. Try again after more jobs are posted.</p>}
    </section>}
    <p className="mt-5 text-xs text-slate-500">Your resume text is processed by the configured AI provider to generate these results. Do not upload sensitive information that is not needed for job applications.</p>
  </main></Shell>;
}

function ResultList({ title, values }: { title: string; values: string[] }) {
  return <div><h3 className="mb-2 text-sm font-bold text-ink">{title}</h3>{values.length ? <ul className="space-y-2">{values.map((value, i) => <li key={i} className="flex items-start gap-2 text-sm text-slate-700"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-600"/>{value}</li>)}</ul> : <p className="text-sm text-slate-500">Not identified.</p>}</div>;
}

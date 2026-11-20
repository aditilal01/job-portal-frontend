import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, MapPin, Trash2 } from 'lucide-react';
import { Shell, Loading, Notice } from '../components/Ui';
import { getSavedJobs, removeSavedJob } from '../services/savedJobService';
import type { SavedJob } from '../types';

export function SavedJobsPage() {
  const [jobs, setJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try { setError(''); setJobs(await getSavedJobs()); }
    catch (err) { setError(err instanceof Error ? err.message : 'Could not load saved jobs.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, []);

  const remove = async (jobId: string) => {
    try {
      await removeSavedJob(jobId);
      setJobs(current => current.filter(job => job.jobId !== jobId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not remove this saved job.');
    }
  };

  return <Shell><section className="mx-auto max-w-5xl px-4 py-10">
    <div className="mb-8 flex items-center gap-3">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand/10 text-brand"><Bookmark size={23}/></span>
      <div><h1 className="text-3xl font-extrabold text-ink">Saved jobs</h1><p className="mt-1 text-sm text-slate-600">Keep interesting opportunities in one place and apply when you're ready.</p></div>
    </div>
    {error && <div className="mb-5"><Notice message={error}/></div>}
    {loading ? <Loading/> : jobs.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <Bookmark className="mx-auto mb-3 text-slate-400" size={30}/><h2 className="font-bold text-ink">No saved jobs yet</h2>
      <p className="mt-1 text-sm text-slate-600">Browse open roles and bookmark the ones you want to revisit.</p>
      <Link to="/jobs" className="mt-5 inline-block rounded-lg bg-brand px-5 py-2.5 text-sm font-bold text-white">Explore jobs</Link>
    </div> : <div className="grid gap-4">{jobs.map(job => <article key={job.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="text-lg font-bold text-ink">{job.title}</h2>{job.isActive ? <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">Active</span> : <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">No longer active</span>}</div>
          <p className="mt-1 text-sm text-slate-600">{job.recruiterName}</p><div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-600"><span className="flex items-center gap-1"><MapPin size={15}/>{job.location}</span><span>{job.experienceRequired}+ years experience</span><span>{job.salaryRange || 'Salary discussed during interview'}</span></div>
          <p className="mt-3 line-clamp-2 text-sm text-slate-600">{job.requiredSkills}</p>
        </div>
        <button onClick={() => void remove(job.jobId)} className="inline-flex items-center gap-2 rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"><Trash2 size={15}/>Remove</button>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4"><span className="text-xs text-slate-500">Saved {new Date(job.savedAt).toLocaleDateString()}</span><Link to={`/jobs/${job.jobId}`} className="text-sm font-bold text-brand">{job.isActive ? 'View job and apply →' : 'View job details →'}</Link></div>
    </article>)}</div>}
  </section></Shell>;
}
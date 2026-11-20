import { useEffect, useState, type FormEvent } from 'react'; import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'; import { ArrowRight, Building2, CheckCircle2, Clock3, Upload } from 'lucide-react'; import { getJob, getJobs } from '../services/jobService'; import { applyToJob, myApplications } from '../services/applicationService'; import { errorMessage } from '../services/api'; import { JobCard, Loading, Notice, SearchBar, Shell, StatusBadge } from '../components/Ui'; import type { Application, Job, Page } from '../types'; import { useAuth } from '../context/AuthContext';
export function HomePage() { const [jobs, setJobs] = useState<Job[]>([]); useEffect(() => { getJobs({ page: 0, size: 3, sortBy: 'createdAt', sortDir: 'desc' }).then(p => setJobs(p.content)).catch(() => setJobs([])); }, []); return <Shell><section className="bg-ink"><div className="page grid gap-10 py-16 md:grid-cols-[1.1fr_.9fr] md:py-24"><div><p className="mb-5 font-bold uppercase tracking-[.2em] text-indigo-300">Your next chapter starts here</p><h1 className="max-w-xl text-4xl font-extrabold leading-tight text-white md:text-6xl">Find the work that moves your career forward.</h1><p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">Discover thoughtful teams, meaningful roles, and a clearer path to your next opportunity.</p><div className="mt-8"><SearchBar/></div></div><div className="rounded-3xl bg-white/10 p-8 text-white"><div className="grid h-full content-center gap-5"><div className="flex items-center gap-3"><span className="rounded-xl bg-indigo-400/20 p-3"><Building2/></span><div><strong>For thoughtful teams</strong><p className="text-sm text-slate-300">Meet candidates with the skills you need.</p></div></div><div className="flex items-center gap-3"><span className="rounded-xl bg-indigo-400/20 p-3"><CheckCircle2/></span><div><strong>For ambitious people</strong><p className="text-sm text-slate-300">Keep every application in one place.</p></div></div></div></div></div></section><section className="page"><div className="flex items-end justify-between"><div><p className="text-sm font-bold uppercase tracking-wider text-brand">Fresh opportunities</p><h2 className="mt-1 text-3xl font-bold text-ink">Explore featured roles</h2></div><Link to="/jobs" className="hidden font-bold text-brand sm:block">Browse all jobs <ArrowRight className="inline" size={17}/></Link></div><div className="mt-8 grid gap-4 md:grid-cols-3">{jobs.length ? jobs.map(job => <JobCard key={job.id} job={job}/>) : <p className="col-span-full text-slate-500">Jobs will appear here when the backend is running.</p>}</div></section><section className="border-y border-slate-200 bg-white"><div className="page grid gap-8 md:grid-cols-3"><div><h3 className="font-bold text-ink">1. Discover</h3><p className="mt-2 text-sm text-slate-600">Search roles that fit your skills and where you want to work.</p></div><div><h3 className="font-bold text-ink">2. Apply simply</h3><p className="mt-2 text-sm text-slate-600">Use one clear application flow and track the outcome.</p></div><div><h3 className="font-bold text-ink">3. Move forward</h3><p className="mt-2 text-sm text-slate-600">Stay organized from application through offer.</p></div></div></section></Shell>; }
export function JobsPage() {
  const [params, setParams] = useSearchParams();
  const [result, setResult] = useState<Page<Job> | null>(null);
  const [error, setError] = useState('');
  const pageNumber = Number(params.get('page') || 0);
  const [title, setTitle] = useState(params.get('title') || '');
  const [skill, setSkill] = useState(params.get('skill') || '');
  const [location, setLocation] = useState(params.get('location') || '');
  const [experience, setExperience] = useState(params.get('experience') || '');
  const [sortBy, setSortBy] = useState(params.get('sortBy') || 'createdAt');
  const [sortDir, setSortDir] = useState(params.get('sortDir') || 'desc');

  useEffect(() => {
    setTitle(params.get('title') || '');
    setSkill(params.get('skill') || '');
    setLocation(params.get('location') || '');
    setExperience(params.get('experience') || '');
    setSortBy(params.get('sortBy') || 'createdAt');
    setSortDir(params.get('sortDir') || 'desc');
    setResult(null); setError('');
    getJobs({
      title: params.get('title') || undefined,
      skill: params.get('skill') || undefined,
      location: params.get('location') || undefined,
      experience: params.get('experience') || undefined,
      page: pageNumber, size: 9,
      sortBy: params.get('sortBy') || 'createdAt',
      sortDir: params.get('sortDir') || 'desc',
    }).then(setResult).catch(e => setError(errorMessage(e)));
  }, [params]);

  const applyFilters = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = new URLSearchParams();
    if (title.trim()) next.set('title', title.trim());
    if (skill.trim()) next.set('skill', skill.trim());
    if (location.trim()) next.set('location', location.trim());
    if (experience.trim()) next.set('experience', experience.trim());
    next.set('sortBy', sortBy);
    next.set('sortDir', sortDir);
    next.set('page', '0');
    setParams(next);
  };

  const clearFilters = () => {
    setTitle(''); setSkill(''); setLocation(''); setExperience('');
    setSortBy('createdAt'); setSortDir('desc');
    setParams(new URLSearchParams({ page: '0', sortBy: 'createdAt', sortDir: 'desc' }));
  };

  return <Shell><div className="page">
    <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm font-bold uppercase tracking-wider text-brand">OPPORTUNITIES</p><h1 className="mt-1 text-3xl font-bold text-ink">Find your next role</h1><p className="mt-2 text-sm text-slate-600">Narrow the list by title, skills, location and experience.</p></div></div>
    <form onSubmit={applyFilters} className="card mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <label><span className="label">Job title</span><input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Software Engineer"/></label>
      <label><span className="label">Skills / keywords</span><input className="input" value={skill} onChange={e => setSkill(e.target.value)} placeholder="e.g. Java, Python, React"/></label>
      <label><span className="label">Location</span><input className="input" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Bengaluru, Remote"/></label>
      <label><span className="label">Maximum experience (years)</span><input className="input" type="number" min="0" max="50" value={experience} onChange={e => setExperience(e.target.value)} placeholder="e.g. 2"/></label>
      <label><span className="label">Sort by</span><select className="input" value={sortBy} onChange={e => setSortBy(e.target.value)}><option value="createdAt">Date posted</option><option value="title">Job title</option><option value="location">Location</option><option value="experienceRequired">Experience</option></select></label>
      <label><span className="label">Sort direction</span><select className="input" value={sortDir} onChange={e => setSortDir(e.target.value)}><option value="desc">Descending</option><option value="asc">Ascending</option></select></label>
      <div className="flex flex-wrap gap-3 md:col-span-2 lg:col-span-3"><button type="submit" className="btn-primary">Apply filters</button><button type="button" onClick={clearFilters} className="btn border">Clear all</button></div>
    </form>
    {error ? <div className="mt-6"><Notice message={error}/></div> : !result ? <Loading/> : result.content.length === 0 ? <div className="mt-8 card text-center"><p className="font-semibold text-ink">No active jobs match these filters.</p><p className="mt-1 text-sm text-slate-500">Try a broader title, skill or location.</p><button className="mt-4 text-sm font-bold text-brand" onClick={clearFilters}>Clear filters</button></div> : <>
      <div className="mt-6 flex items-center justify-between"><p className="text-sm text-slate-600"><strong>{result.totalElements}</strong> matching {result.totalElements === 1 ? 'job' : 'jobs'}</p><p className="text-xs text-slate-500">Page {pageNumber + 1} of {result.totalPages || 1}</p></div>
      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{result.content.map(job => <JobCard key={job.id} job={job}/>)}</div>
      <div className="mt-8 flex items-center justify-between"><button className="btn border" disabled={pageNumber === 0} onClick={() => { const next = new URLSearchParams(params); next.set('page', String(pageNumber - 1)); setParams(next); }}>Previous</button><span className="text-sm text-slate-500">{result.totalElements} results</span><button className="btn border" disabled={result.last} onClick={() => { const next = new URLSearchParams(params); next.set('page', String(pageNumber + 1)); setParams(next); }}>Next</button></div>
    </>}
  </div></Shell>;
}
export function JobDetailsPage() { const { id = '' } = useParams(); const { user } = useAuth(); const navigate = useNavigate(); const [job, setJob] = useState<Job | null>(null); const [myApps, setMyApps] = useState<Application[]>([]); const [resume, setResume] = useState<File>(); const [busy, setBusy] = useState(false); const [message, setMessage] = useState(''); const [error, setError] = useState(''); useEffect(() => { getJob(id).then(setJob).catch(e => setError(errorMessage(e))); if (user?.role === 'CANDIDATE') myApplications().then(setMyApps).catch(() => undefined); }, [id, user?.role]); if (error) return <Shell><div className="page"><Notice message={error}/></div></Shell>; if (!job) return <Shell><Loading/></Shell>; const applied = myApps.find(a => a.jobId === id); const submit = async () => { if (!user) return navigate('/login'); if (user.role !== 'CANDIDATE') return; if (resume && (!/\.(pdf|docx)$/i.test(resume.name) || resume.size > 10 * 1024 * 1024)) return setError('Resume must be a PDF or DOCX up to 10MB.'); setBusy(true); setError(''); try { const application = await applyToJob(id, resume); setMyApps(current => [application, ...current]); setMessage('Application submitted successfully.'); } catch (e) { setError(errorMessage(e)); } finally { setBusy(false); } }; return <Shell><div className="page max-w-4xl"><Link className="text-sm font-semibold text-brand" to="/jobs">← All jobs</Link><article className="mt-5 card"><p className="text-sm font-bold text-brand">{job.recruiterName}</p><h1 className="mt-2 text-3xl font-bold text-ink">{job.title}</h1><div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600"><span>{job.location}</span><span>{job.experienceRequired}+ years experience</span><span>{job.salaryRange || 'Salary not specified'}</span></div><hr className="my-7"/><h2 className="text-lg font-bold">About this role</h2><p className="mt-3 whitespace-pre-line leading-7 text-slate-700">{job.description}</p><h2 className="mt-7 text-lg font-bold">Skills</h2><div className="mt-3 flex flex-wrap gap-2">{job.requiredSkills.split(',').map(s => <span key={s} className="rounded-full bg-slate-100 px-3 py-1 text-sm">{s.trim()}</span>)}</div></article>{user?.role === 'CANDIDATE' && <section className="mt-5 card"><h2 className="font-bold text-ink">Apply for this role</h2>{applied || message ? <div className="mt-3 flex items-center gap-2 text-emerald-700"><CheckCircle2 size={18}/>{message || <>Already applied — <StatusBadge status={applied!.status}/></>}</div> : <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center"><label className="btn border cursor-pointer"><Upload size={16} className="mr-2"/> {resume?.name || 'Attach optional resume'}<input className="hidden" type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={e => setResume(e.target.files?.[0])}/></label><button className="btn-primary" disabled={busy} onClick={submit}>{busy ? 'Submitting…' : 'Apply now'}</button></div>}{error && <div className="mt-3"><Notice message={error}/></div>}</section>}{!user && <section className="mt-5 card"><p>Ready to apply? <Link className="font-bold text-brand" to="/login">Log in to continue</Link>.</p></section>}</div></Shell>; }

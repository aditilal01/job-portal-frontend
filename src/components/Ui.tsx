import { type ReactNode } from 'react'; import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Bookmark, BriefcaseBusiness, LogOut, MapPin, Search } from 'lucide-react';
import { useState } from 'react';
import { saveJob } from '../services/savedJobService';
import { useAuth } from '../context/AuthContext';
import type { ApplicationStatus, Job } from '../types';
export const statusClass: Record<ApplicationStatus, string> = { APPLIED: 'bg-slate-100 text-slate-700', SHORTLISTED: 'bg-indigo-50 text-indigo-700', INTERVIEW: 'bg-amber-50 text-amber-700', REJECTED: 'bg-rose-50 text-rose-700', HIRED: 'bg-emerald-50 text-emerald-700' };
export function StatusBadge({ status }: { status: ApplicationStatus }) { return <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusClass[status]}`}>{status}</span>; }
export function Header() { const { user, signOut } = useAuth(); const navigate = useNavigate(); const dashboard = user?.role === 'CANDIDATE' ? '/candidate' : user?.role === 'RECRUITER' ? '/recruiter' : '/admin'; return <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur"><div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4"><Link to="/" className="flex items-center gap-2 font-bold text-ink"><span className="grid h-9 w-9 place-items-center rounded-xl bg-ink text-white"><BriefcaseBusiness size={19}/></span>CareerDock</Link><nav className="hidden items-center gap-6 text-sm font-medium md:flex"><NavLink to="/jobs">Find jobs</NavLink>{user && <NavLink to={dashboard}>Dashboard</NavLink>}{user?.role === 'CANDIDATE' && <><NavLink to="/candidate/profile">My profile</NavLink><NavLink to="/candidate/saved-jobs">Saved jobs</NavLink><NavLink to="/candidate/ai-tools">AI career tools</NavLink></>}</nav><div className="flex items-center gap-3">{user ? <><span className="hidden text-sm text-slate-600 sm:block">Hi, {user.name.split(' ')[0]}</span><button aria-label="Log out" onClick={() => { signOut(); navigate('/'); }} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"><LogOut size={18}/></button></> : <><Link to="/login" className="text-sm font-semibold text-ink">Log in</Link><Link to="/register" className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white">Get started</Link></>}</div></div></header>; }
export function Shell({ children }: { children: ReactNode }) { return <><Header/><main>{children}</main></>; }
export function Loading() { return <div className="grid min-h-[260px] place-items-center text-slate-500"><span className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-brand"/></div>; }
export function Notice({ message }: { message: string }) { return <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{message}</div>; }
export function JobCard({ job }: { job: Job }) {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const handleSave = async () => {
    if (saving || saved) return;
    setSaving(true); setSaveError('');
    try { await saveJob(job.id); setSaved(true); }
    catch (error) { setSaveError(error instanceof Error ? error.message : 'Could not save this job.'); }
    finally { setSaving(false); }
  };
  return <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-card">
    <div className="flex items-start justify-between gap-4"><div><h3 className="text-lg font-bold text-ink">{job.title}</h3><p className="mt-1 text-sm text-slate-600">{job.recruiterName}</p></div><span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-semibold">{job.experienceRequired}+ yrs</span></div>
    <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-600"><span className="flex items-center gap-1"><MapPin size={15}/>{job.location}</span><span>{job.salaryRange || 'Salary discussed during interview'}</span></div>
    <p className="mt-4 line-clamp-2 text-sm text-slate-600">{job.requiredSkills}</p>
    {saveError && <p role="alert" className="mt-3 text-xs text-rose-700">{saveError}</p>}
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3"><Link to={'/jobs/' + job.id} className="text-sm font-bold text-brand">View details →</Link>
      {user?.role === 'CANDIDATE' && <button type="button" onClick={() => void handleSave()} disabled={saving || saved} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-ink hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"><Bookmark size={15}/>{saving ? 'Saving…' : saved ? 'Saved' : 'Save job'}</button>}
    </div>
  </article>;
}
export function SearchBar({ initialSkill = '', initialLocation = '' }: { initialSkill?: string; initialLocation?: string }) { const navigate = useNavigate(); return <form onSubmit={(e) => { e.preventDefault(); const data = new FormData(e.currentTarget); navigate(`/jobs?skill=${encodeURIComponent(String(data.get('skill') || ''))}&location=${encodeURIComponent(String(data.get('location') || ''))}`); }} className="grid gap-2 rounded-2xl bg-white p-2 shadow-card md:grid-cols-[1fr_1fr_auto]"><label className="flex items-center gap-2 rounded-xl px-3"><Search size={18} className="text-slate-400"/><input name="skill" defaultValue={initialSkill} aria-label="Skills" placeholder="Job title or skills" className="w-full py-3 outline-none"/></label><label className="flex items-center gap-2 rounded-xl px-3"><MapPin size={18} className="text-slate-400"/><input name="location" defaultValue={initialLocation} aria-label="Location" placeholder="Location" className="w-full py-3 outline-none"/></label><button className="rounded-xl bg-brand px-6 py-3 font-bold text-white">Search jobs</button></form>; }

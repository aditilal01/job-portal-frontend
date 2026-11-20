import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Save, UserRound } from 'lucide-react';
import { getCandidateProfile, saveCandidateProfile } from '../services/candidateProfileService';
import { errorMessage } from '../services/api';
import { Loading, Notice, Shell } from '../components/Ui';
import { useAuth } from '../context/AuthContext';
import type { CandidateProfile } from '../types';

type ProfileForm = { [K in keyof Omit<CandidateProfile, 'userId' | 'name' | 'email' | 'updatedAt' | 'id' | 'profileVisibleToRecruiters'>]-?: string };
const emptyForm: ProfileForm = {
  headline: '', phone: '', location: '', summary: '', skills: '',
  education: '', experience: '', portfolioUrl: '', linkedInUrl: '', githubUrl: '',
};

const fields: { key: keyof ProfileForm; label: string; hint: string; multiline?: boolean }[] = [
  { key: 'headline', label: 'Professional headline', hint: 'e.g. Computer Science Student | Aspiring AI/ML Engineer' },
  { key: 'phone', label: 'Phone number', hint: 'Your contact number' },
  { key: 'location', label: 'Location', hint: 'City, country' },
  { key: 'summary', label: 'Professional summary', hint: 'Introduce yourself, your strengths and career goals', multiline: true },
  { key: 'skills', label: 'Skills', hint: 'Comma-separated skills, e.g. Java, Python, React, Machine Learning', multiline: true },
  { key: 'education', label: 'Education', hint: 'Degree, institution, graduation year and relevant details', multiline: true },
  { key: 'experience', label: 'Experience and projects', hint: 'Internships, work experience and notable projects', multiline: true },
  { key: 'portfolioUrl', label: 'Portfolio URL', hint: 'https://your-portfolio.example' },
  { key: 'linkedInUrl', label: 'LinkedIn URL', hint: 'https://linkedin.com/in/your-profile' },
  { key: 'githubUrl', label: 'GitHub URL', hint: 'https://github.com/your-username' },
];

export function CandidateProfilePage() {
  const { user } = useAuth();
  const [form, setForm] = useState<ProfileForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [accountEmail, setAccountEmail] = useState('');
  const [profileVisible, setProfileVisible] = useState(false);

  useEffect(() => {
    getCandidateProfile()
      .then(profile => {
        setAccountEmail(profile.email || '');
        setProfileVisible(Boolean(profile.profileVisibleToRecruiters));
        setForm({
          headline: profile.headline || '', phone: profile.phone || '',
          location: profile.location || '', summary: profile.summary || '',
          skills: profile.skills || '', education: profile.education || '',
          experience: profile.experience || '', portfolioUrl: profile.portfolioUrl || '',
          linkedInUrl: profile.linkedInUrl || '', githubUrl: profile.githubUrl || '',
        });
      })
      .catch(e => setError(errorMessage(e)))
      .finally(() => setLoading(false));
  }, []);

  const completion = useMemo(() => {
    const completed = Object.values(form).filter(value => value.trim().length > 0).length;
    return Math.round((completed / Object.keys(emptyForm).length) * 100);
  }, [form]);

  const updateField = (key: keyof ProfileForm, value: string) => {
    setForm(current => ({ ...current, [key]: value }));
    setSuccess('');
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await saveCandidateProfile({ ...form, profileVisibleToRecruiters: profileVisible });
      setSuccess('Your profile has been saved.');
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Shell><Loading /></Shell>;

  return (
    <Shell>
      <div className="page max-w-4xl">
        <Link to="/candidate" className="inline-flex items-center gap-2 text-sm font-semibold text-brand"><ArrowLeft size={16}/> Back to dashboard</Link>
        <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-brand">CANDIDATE PROFILE</p>
            <h1 className="mt-1 text-3xl font-bold text-ink">Your professional profile</h1>
            <p className="mt-2 text-slate-600">Help recruiters understand your background, skills and interests.</p>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-3 text-sm font-bold text-indigo-700"><UserRound size={18}/>{completion}% complete</div>
        </div>

        <section className="card mt-6">
          <div className="flex items-center justify-between text-sm"><span className="font-semibold text-ink">Profile completeness</span><span className="text-slate-500">{completion}%</span></div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-brand transition-all" style={{ width: `${completion}%` }}/></div>
          <p className="mt-3 text-xs text-slate-500">Your account identity is managed separately and cannot be changed here.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div><p className="text-xs font-semibold uppercase text-slate-500">Full name</p><p className="mt-1 font-semibold text-ink">{user?.name}</p></div>
            <div><p className="text-xs font-semibold uppercase text-slate-500">Email address</p><p className="mt-1 font-semibold text-ink">{accountEmail || 'Your registered email'}</p></div>
          </div>
        </section>

        {error && <div className="mt-5"><Notice message={error}/></div>}
        {success && <div role="status" className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"><CheckCircle2 size={18}/>{success}</div>}

        <form onSubmit={submit} className="card mt-5 grid gap-5 md:grid-cols-2">
          {fields.map(field => (
            <label key={field.key} className={field.multiline ? 'md:col-span-2' : ''}>
              <span className="label">{field.label}</span>
              {field.multiline ? (
                <textarea className="input min-h-28" maxLength={field.key === 'summary' ? 2000 : field.key === 'skills' ? 1000 : field.key === 'education' ? 2000 : 3000} placeholder={field.hint} value={form[field.key]} onChange={e => updateField(field.key, e.target.value)}/>
              ) : (
                <input className="input" maxLength={field.key === 'headline' ? 120 : field.key === 'phone' ? 30 : field.key === 'location' ? 120 : 500} placeholder={field.hint} value={form[field.key]} onChange={e => updateField(field.key, e.target.value)}/>
              )}
            </label>
          ))}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
            <label className="flex items-start gap-3"><input type="checkbox" className="mt-1 h-4 w-4 accent-brand" checked={profileVisible} onChange={e => setProfileVisible(e.target.checked)}/><span><span className="block text-sm font-semibold text-ink">Share my professional profile with recruiters</span><span className="mt-1 block text-xs leading-5 text-slate-600">When enabled, recruiters handling your job applications can view your headline, skills, experience, education and portfolio links. Your phone number is never shared through this view.</span></span></label>
          </div>
          <div className="flex flex-wrap items-center gap-3 md:col-span-2">
            <button className="btn-primary inline-flex items-center gap-2" disabled={saving}><Save size={16}/>{saving ? 'Saving…' : 'Save profile'}</button>
            <span className="text-xs text-slate-500">Recruiters only see these details when you enable profile sharing.</span>
          </div>
        </form>
      </div>
    </Shell>
  );
}

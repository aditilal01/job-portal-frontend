import { api, unwrap } from './api';
import type { CandidateProfile } from '../types';

export const getCandidateProfile = () =>
  api.get('/api/candidate/profile').then(unwrap<CandidateProfile>);

export const saveCandidateProfile = (profile: CandidateProfile) =>
  api.put('/api/candidate/profile', profile).then(unwrap<CandidateProfile>);

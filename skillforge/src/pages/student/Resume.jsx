import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Upload, FileText, Image, Award, Brain, Target,
  AlertCircle, Map, Eye, CheckCircle2, Loader2, RefreshCw
} from 'lucide-react';
import { uploadApi } from '../../api/uploadApi';
import { aiApi } from '../../api/aiApi';
import { profileApi } from '../../api/profileApi';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';

const UploadZone = ({ label, icon: Icon, accept, onUpload, uploaded, uploading }) => (
  <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${uploaded ? 'border-green-500/40 bg-green-500/5' : 'border-white/10 hover:border-indigo-500/40 hover:bg-indigo-500/5'}`}>
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 ${uploaded ? 'bg-green-500/15' : 'bg-white/5'}`}>
      {uploaded ? <CheckCircle2 size={22} className="text-green-400" /> : <Icon size={22} className="text-white/30" />}
    </div>
    <div className="font-medium text-white text-sm mb-1">{label}</div>
    {uploaded
      ? <div className="text-xs text-green-400 mb-3">Uploaded ✓</div>
      : <div className="text-xs text-white/30 mb-4">PDF or image, max 5MB</div>}
    <label className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${uploaded ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}>
      {uploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
      {uploaded ? 'Re-upload' : 'Upload File'}
      <input type="file" accept={accept} className="hidden" onChange={e => { if (e.target.files[0]) onUpload(e.target.files[0]); e.target.value = ''; }} />
    </label>
  </div>
);

const AIResult = ({ title, icon: Icon, content, loading, color = 'indigo' }) => {
  const colorMap = {
    indigo: 'border-indigo-500/20 bg-indigo-500/5 text-indigo-400',
    cyan: 'border-cyan-500/20 bg-cyan-500/5 text-cyan-400',
    yellow: 'border-yellow-500/20 bg-yellow-500/5 text-yellow-400',
    green: 'border-green-500/20 bg-green-500/5 text-green-400',
  };
  const c = colorMap[color] || colorMap.indigo;

  return (
    <div className={`glass rounded-2xl border overflow-hidden ${c.split(' ')[0]}`}>
      <div className={`px-5 py-4 border-b border-white/6 flex items-center justify-between ${c.split(' ')[1]}`}>
        <div className="flex items-center gap-2">
          <Icon size={16} className={c.split(' ')[2]} />
          <h3 className="font-semibold text-white text-sm">{title}</h3>
        </div>
        {loading && <Loader2 size={14} className="text-white/40 animate-spin" />}
      </div>
      <div className="p-5 max-h-72 overflow-y-auto">
        {loading
          ? <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-3 rounded" style={{ width: `${70 + Math.random() * 30}%` }} />)}</div>
          : content
          ? <pre className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap font-sans">{content}</pre>
          : <div className="text-white/25 text-sm text-center py-6">Run the analysis to see results here</div>}
      </div>
    </div>
  );
};

export const ResumeCenter = () => {
  const [profile, setProfile] = useState(null);
  const resumeFileRef = useRef(null); // keep file in ref so it persists without re-render issues
  const [resumeReady, setResumeReady] = useState(false);
  const [uploading, setUploading] = useState({ resume: false, photo: false, cert: false });
  const [aiLoading, setAiLoading] = useState({ analysis: false, gaps: false, questions: false, roadmap: false });
  const [aiData, setAiData] = useState({});
  const [targetRole, setTargetRole] = useState('');
  const [interviewRole, setInterviewRole] = useState('');

  useEffect(() => {
    profileApi.getProfile()
      .then(({ data }) => setProfile(data.profile))
      .catch(() => {});
  }, []);

  const handleUpload = async (type, file) => {
    if (!file) return;
    setUploading(u => ({ ...u, [type]: true }));
    try {
      if (type === 'resume') {
        const res = await uploadApi.uploadResume(file);
        // Keep file reference for AI analysis in the same session
        resumeFileRef.current = file;
        setResumeReady(true);
        setProfile(p => ({ ...(p || {}), resume: res.data.url }));
        toast.success('Resume uploaded! You can now run AI analysis.');
      } else if (type === 'photo') {
        const res = await uploadApi.uploadPhoto(file);
        setProfile(p => ({ ...(p || {}), profilePhoto: res.data.url }));
        toast.success('Photo uploaded!');
      } else {
        const res = await uploadApi.uploadCertificate(file);
        setProfile(p => ({ ...(p || {}), certificates: [...(p?.certificates || []), res.data.url] }));
        toast.success('Certificate uploaded!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    }
    setUploading(u => ({ ...u, [type]: false }));
  };

  const runAnalysis = async () => {
    // Check if file is in memory (same session)
    if (!resumeFileRef.current) {
      if (profile?.resume) {
        toast.error('Please re-upload your resume to run AI analysis (file not in memory)');
      } else {
        toast.error('Please upload your resume first');
      }
      return;
    }
    setAiLoading(l => ({ ...l, analysis: true }));
    try {
      const { data } = await aiApi.analyzeResume(resumeFileRef.current);
      setAiData(d => ({ ...d, analysis: data.analysis }));
      toast.success('Resume analyzed!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Analysis failed');
    }
    setAiLoading(l => ({ ...l, analysis: false }));
  };

  const runSkillGap = async () => {
    if (!targetRole.trim()) { toast.error('Enter your target role first'); return; }
    setAiLoading(l => ({ ...l, gaps: true }));
    try {
      const { data } = await aiApi.getSkillGap(targetRole);
      setAiData(d => ({ ...d, gaps: data.analysis }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Skill gap analysis failed');
    }
    setAiLoading(l => ({ ...l, gaps: false }));
  };

  const runInterviewQ = async () => {
    if (!interviewRole.trim()) { toast.error('Enter the role for interview questions'); return; }
    setAiLoading(l => ({ ...l, questions: true }));
    try {
      const { data } = await aiApi.getInterviewQuestions(interviewRole);
      setAiData(d => ({ ...d, questions: data.questions }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate questions');
    }
    setAiLoading(l => ({ ...l, questions: false }));
  };

  const runRoadmap = async () => {
    if (!targetRole.trim()) { toast.error('Enter your target role first'); return; }
    setAiLoading(l => ({ ...l, roadmap: true }));
    try {
      const { data } = await aiApi.getLearningRoadmap(targetRole);
      setAiData(d => ({ ...d, roadmap: data.roadmap }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate roadmap');
    }
    setAiLoading(l => ({ ...l, roadmap: false }));
  };

  const canAnalyze = resumeReady || !!resumeFileRef.current;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Resume Center</h1>
        <p className="text-white/40 text-sm mt-1">Upload documents · Get AI-powered career insights</p>
      </motion.div>

      {/* Uploads */}
      <div className="glass rounded-2xl p-6 border border-white/6">
        <h3 className="font-semibold text-white mb-5">Document Uploads</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <UploadZone label="Resume / CV (PDF only)" icon={FileText} accept=".pdf"
            onUpload={f => handleUpload('resume', f)}
            uploaded={!!profile?.resume} uploading={uploading.resume} />
          <UploadZone label="Profile Photo" icon={Image} accept="image/*"
            onUpload={f => handleUpload('photo', f)}
            uploaded={!!profile?.profilePhoto} uploading={uploading.photo} />
          <UploadZone label="Certificate" icon={Award} accept=".pdf,image/*"
            onUpload={f => handleUpload('cert', f)}
            uploaded={(profile?.certificates?.length || 0) > 0} uploading={uploading.cert} />
        </div>

        {/* Status bar */}
        <div className="mt-4 space-y-2">
          {profile?.resume && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-green-500/8 border border-green-500/20">
              <CheckCircle2 size={15} className="text-green-400 shrink-0" />
              <span className="text-sm text-green-300 flex-1">Resume saved to your profile</span>
              <a href={profile.resume} target="_blank" rel="noreferrer"
                className="flex items-center gap-1 text-xs text-white/40 hover:text-white transition-colors shrink-0">
                <Eye size={12} /> View
              </a>
            </div>
          )}
          {profile?.resume && !canAnalyze && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-yellow-500/8 border border-yellow-500/20">
              <AlertCircle size={15} className="text-yellow-400 shrink-0" />
              <span className="text-sm text-yellow-300 flex-1">
                To run AI analysis, re-upload your resume above (file must be in current session)
              </span>
            </div>
          )}
          {canAnalyze && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-indigo-500/8 border border-indigo-500/20">
              <Brain size={15} className="text-indigo-400 shrink-0" />
              <span className="text-sm text-indigo-300">Resume ready for AI analysis ✓</span>
            </div>
          )}
        </div>
      </div>

      {/* AI Tools */}
      <div className="glass rounded-2xl p-6 border border-white/6">
        <h3 className="font-semibold text-white mb-5">AI Tools</h3>
        <div className="space-y-4">
          {/* Row 1: Analyze resume */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/2 border border-white/6">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Brain size={18} className="text-indigo-400" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-white">Resume Analysis</div>
              <div className="text-xs text-white/40">ATS score, skills found, improvement tips</div>
            </div>
            <Button onClick={runAnalysis} loading={aiLoading.analysis}
              disabled={!canAnalyze} size="sm"
              className={!canAnalyze ? 'opacity-50 cursor-not-allowed' : ''}>
              {canAnalyze ? 'Analyze' : 'Upload PDF first'}
            </Button>
          </div>

          {/* Row 2: Skill gap + Roadmap */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/2 border border-white/6">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
              <Target size={18} className="text-cyan-400" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-white mb-2">Skill Gap & Learning Roadmap</div>
              <input value={targetRole} onChange={e => setTargetRole(e.target.value)}
                placeholder="Enter target role (e.g. Full Stack Developer)"
                className="input-field text-sm w-full" />
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <Button onClick={runSkillGap} loading={aiLoading.gaps} size="sm" variant="secondary">
                Skill Gap
              </Button>
              <Button onClick={runRoadmap} loading={aiLoading.roadmap} size="sm" variant="secondary">
                Roadmap
              </Button>
            </div>
          </div>

          {/* Row 3: Interview questions */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/2 border border-white/6">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0">
              <AlertCircle size={18} className="text-yellow-400" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-white mb-2">Interview Questions</div>
              <input value={interviewRole} onChange={e => setInterviewRole(e.target.value)}
                placeholder="Enter role (e.g. React Developer, Data Analyst)"
                className="input-field text-sm w-full" />
            </div>
            <Button onClick={runInterviewQ} loading={aiLoading.questions} size="sm" className="shrink-0">
              Generate
            </Button>
          </div>
        </div>
      </div>

      {/* AI Results Grid */}
      {Object.values(aiData).some(Boolean) || Object.values(aiLoading).some(Boolean) ? (
        <div className="grid md:grid-cols-2 gap-5">
          <AIResult title="Resume Analysis" icon={Brain} content={aiData.analysis} loading={aiLoading.analysis} color="indigo" />
          <AIResult title="Skill Gap Analysis" icon={Target} content={aiData.gaps} loading={aiLoading.gaps} color="cyan" />
          <AIResult title="Interview Questions" icon={AlertCircle} content={aiData.questions} loading={aiLoading.questions} color="yellow" />
          <AIResult title="Learning Roadmap" icon={Map} content={aiData.roadmap} loading={aiLoading.roadmap} color="green" />
        </div>
      ) : null}
    </div>
  );
};

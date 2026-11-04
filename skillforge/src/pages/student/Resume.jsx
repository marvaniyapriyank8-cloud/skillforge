import { useRef, useState } from 'react';
import {
  Award, Brain, CheckCircle2, ExternalLink, FileSearch, FileText, Image as ImageIcon,
  Route, Target, Upload,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useFetch } from '../../hooks/useFetch';
import { profileApi } from '../../api/profileApi';
import { uploadApi } from '../../api/uploadApi';
import { aiApi } from '../../api/aiApi';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Tabs } from '../../components/ui/Tabs';
import { Skeleton } from '../../components/ui/Skeleton';
import { AiOutput } from '../../components/ui/AiOutput';
import { errorMessage } from '../../utils/format';

const MAX_BYTES = 5 * 1024 * 1024;
const IMAGE_TYPES = ['image/png', 'image/jpeg'];
const PDF = 'application/pdf';

/** Client-side check that mirrors what the backend accepts. */
const validateFile = (file, allowed) => {
  if (!allowed.includes(file.type)) return 'That file type is not supported.';
  if (file.size > MAX_BYTES) return 'File must be 5 MB or smaller.';
  return null;
};

const UploadCard = ({ icon: Icon, title, description, accept, allowed, onUpload, busy, done, children }) => {
  const inputRef = useRef(null);

  const onChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const problem = validateFile(file, allowed);
    if (problem) return toast.error(problem);
    onUpload(file);
  };

  return (
    <Card className="flex flex-col p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-subtle text-fg-muted">
          <Icon size={18} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-fg">{title}</h3>
          <p className="mt-0.5 text-sm text-fg-muted">{description}</p>
        </div>
      </div>
      <div className="mt-4 min-h-6 text-sm">{children}</div>
      <div className="mt-auto pt-4">
        <Button variant="secondary" size="sm" onClick={() => inputRef.current?.click()} loading={busy}>
          {!busy && <Upload size={14} aria-hidden="true" />}
          {done ? 'Replace' : 'Upload'}
        </Button>
        <input ref={inputRef} type="file" accept={accept} onChange={onChange} className="sr-only" tabIndex={-1} aria-label={`Choose file for ${title}`} />
      </div>
    </Card>
  );
};

const UploadedLink = ({ href, label }) => (
  <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-medium text-success-fg hover:underline">
    <CheckCircle2 size={14} aria-hidden="true" /> {label} <ExternalLink size={12} aria-hidden="true" className="opacity-70" />
  </a>
);

const TOOLS = [
  { id: 'analysis', label: 'Resume analysis', icon: FileSearch },
  { id: 'gaps', label: 'Skill gap', icon: Target },
  { id: 'questions', label: 'Interview questions', icon: Brain },
  { id: 'roadmap', label: 'Learning roadmap', icon: Route },
];

const ResultArea = ({ busy, text, emptyHint }) => {
  if (busy) {
    return (
      <div role="status" aria-label="Generating" className="space-y-2.5">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-11/12" />
        <Skeleton className="h-3.5 w-4/5" />
        <Skeleton className="h-3.5 w-2/3" />
      </div>
    );
  }
  if (!text) return <p className="text-sm text-fg-subtle">{emptyHint}</p>;
  return <AiOutput text={text} />;
};

export const ResumeCenter = () => {
  const { data: profile } = useFetch(() => profileApi.getProfile().then((res) => res.data.profile ?? null));

  // Uploaded URLs are tracked locally so the UI updates immediately, whether or not
  // the backend also writes them to the profile.
  const [uploads, setUploads] = useState({ resume: null, photo: null, certificates: [] });
  const [uploading, setUploading] = useState(null);

  const [tool, setTool] = useState('analysis');
  const [resumeFile, setResumeFile] = useState(null);
  const [targetRole, setTargetRole] = useState('');
  const [interviewRole, setInterviewRole] = useState('');
  const [results, setResults] = useState({});
  const [running, setRunning] = useState(null);
  const analysisInput = useRef(null);

  const resumeUrl = uploads.resume || profile?.resume || null;
  const photoUrl = uploads.photo || profile?.profilePhoto || null;
  const certificates = [...new Set([...(profile?.certificates ?? []), ...uploads.certificates])];

  const upload = async (kind, file) => {
    setUploading(kind);
    try {
      if (kind === 'resume') {
        const res = await uploadApi.uploadResume(file);
        setUploads((u) => ({ ...u, resume: res.data.url }));
        if (file.type === PDF) setResumeFile(file); // ready to analyze without picking it again
        toast.success('Resume uploaded');
      } else if (kind === 'photo') {
        const res = await uploadApi.uploadPhoto(file);
        setUploads((u) => ({ ...u, photo: res.data.url }));
        toast.success('Profile photo uploaded');
      } else {
        const res = await uploadApi.uploadCertificate(file);
        setUploads((u) => ({ ...u, certificates: [...u.certificates, res.data.url] }));
        toast.success('Certificate uploaded');
      }
    } catch (err) {
      toast.error(errorMessage(err, 'Upload failed'));
    } finally {
      setUploading(null);
    }
  };

  const run = async (key, request, pick) => {
    setRunning(key);
    try {
      const { data } = await request();
      setResults((r) => ({ ...r, [key]: pick(data) }));
    } catch (err) {
      toast.error(errorMessage(err, 'The AI request failed. Please try again.'));
    } finally {
      setRunning(null);
    }
  };

  const onPickAnalysisFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const problem = validateFile(file, [PDF]);
    if (problem) return toast.error(problem === 'That file type is not supported.' ? 'Resume analysis needs a PDF file.' : problem);
    setResumeFile(file);
  };

  const requireText = (value, message) => {
    if (value.trim()) return true;
    toast.error(message);
    return false;
  };

  return (
    <>
      <PageHeader title="Resume & AI tools" description="Store your documents and get AI-assisted feedback to prepare for applications." />

      <section aria-labelledby="documents-heading">
        <h2 id="documents-heading" className="mb-3 text-sm font-semibold text-fg">Documents</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <UploadCard
            icon={FileText}
            title="Resume"
            description="PDF, up to 5 MB."
            accept="application/pdf"
            allowed={[PDF]}
            busy={uploading === 'resume'}
            done={Boolean(resumeUrl)}
            onUpload={(f) => upload('resume', f)}
          >
            {resumeUrl ? <UploadedLink href={resumeUrl} label="Resume uploaded" /> : <span className="text-fg-subtle">Not uploaded yet</span>}
          </UploadCard>

          <UploadCard
            icon={ImageIcon}
            title="Profile photo"
            description="PNG or JPEG, up to 5 MB."
            accept="image/png,image/jpeg"
            allowed={IMAGE_TYPES}
            busy={uploading === 'photo'}
            done={Boolean(photoUrl)}
            onUpload={(f) => upload('photo', f)}
          >
            {photoUrl ? (
              <div className="flex items-center gap-3">
                <img src={photoUrl} alt="Your profile" className="h-10 w-10 rounded-full border border-line object-cover" />
                <UploadedLink href={photoUrl} label="Photo uploaded" />
              </div>
            ) : (
              <span className="text-fg-subtle">Not uploaded yet</span>
            )}
          </UploadCard>

          <UploadCard
            icon={Award}
            title="Certificates"
            description="PDF, PNG or JPEG, up to 5 MB each."
            accept="application/pdf,image/png,image/jpeg"
            allowed={[PDF, ...IMAGE_TYPES]}
            busy={uploading === 'cert'}
            done={certificates.length > 0}
            onUpload={(f) => upload('cert', f)}
          >
            {certificates.length > 0 ? (
              <ul className="space-y-1">
                {certificates.map((href, i) => (
                  <li key={href}><UploadedLink href={href} label={`Certificate ${i + 1}`} /></li>
                ))}
              </ul>
            ) : (
              <span className="text-fg-subtle">None uploaded yet</span>
            )}
          </UploadCard>
        </div>
      </section>

      <Card className="mt-8">
        <CardHeader title="AI assistant" description="Results are generated by a language model and may contain mistakes. Use them as guidance." />
        <Tabs tabs={TOOLS} value={tool} onChange={setTool} label="AI tools" withPanels className="px-3" />

        <CardBody>
          {tool === 'analysis' && (
            <div role="tabpanel" id="panel-analysis" aria-labelledby="tab-analysis" className="space-y-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex min-w-0 flex-1 items-center gap-3 rounded-lg border border-dashed border-line-strong px-4 py-3">
                  <FileText size={18} aria-hidden="true" className="shrink-0 text-fg-subtle" />
                  <p className="min-w-0 flex-1 truncate text-sm text-fg-muted">
                    {resumeFile ? <span className="font-medium text-fg">{resumeFile.name}</span> : 'Choose a PDF resume to analyze'}
                  </p>
                  <Button variant="secondary" size="sm" onClick={() => analysisInput.current?.click()}>
                    {resumeFile ? 'Change' : 'Choose PDF'}
                  </Button>
                  <input ref={analysisInput} type="file" accept="application/pdf" onChange={onPickAnalysisFile} className="sr-only" tabIndex={-1} aria-label="Choose a PDF resume to analyze" />
                </div>
                <Button
                  loading={running === 'analysis'}
                  onClick={() => {
                    if (!resumeFile) return toast.error('Choose a PDF resume first');
                    run('analysis', () => aiApi.analyzeResume(resumeFile), (d) => d.analysis);
                  }}
                >
                  Analyze resume
                </Button>
              </div>
              <ResultArea busy={running === 'analysis'} text={results.analysis} emptyHint="Your ATS-style score, detected skills, gaps and suggestions will appear here." />
            </div>
          )}

          {tool === 'gaps' && (
            <div role="tabpanel" id="panel-gaps" aria-labelledby="tab-gaps" className="space-y-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <Input label="Target role" placeholder="e.g. Full-stack developer" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} hint="Compared against the skills on your Skills page." />
                </div>
                <Button
                  loading={running === 'gaps'}
                  onClick={() => requireText(targetRole, 'Enter a target role first') && run('gaps', () => aiApi.getSkillGap(targetRole.trim()), (d) => d.analysis)}
                >
                  Analyze skill gap
                </Button>
              </div>
              <ResultArea busy={running === 'gaps'} text={results.gaps} emptyHint="Missing skills, weak areas and learning suggestions will appear here." />
            </div>
          )}

          {tool === 'questions' && (
            <div role="tabpanel" id="panel-questions" aria-labelledby="tab-questions" className="space-y-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <Input label="Role you're interviewing for" placeholder="e.g. React developer" value={interviewRole} onChange={(e) => setInterviewRole(e.target.value)} hint="Questions use your skills and projects." />
                </div>
                <Button
                  loading={running === 'questions'}
                  onClick={() => requireText(interviewRole, 'Enter a role first') && run('questions', () => aiApi.getInterviewQuestions(interviewRole.trim()), (d) => d.questions)}
                >
                  Generate questions
                </Button>
              </div>
              <ResultArea busy={running === 'questions'} text={results.questions} emptyHint="Technical, project-based and HR questions will appear here." />
            </div>
          )}

          {tool === 'roadmap' && (
            <div role="tabpanel" id="panel-roadmap" aria-labelledby="tab-roadmap" className="space-y-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <Input label="Target role" placeholder="e.g. Backend developer" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} hint="Builds a plan from the skills on your Skills page." />
                </div>
                <Button
                  loading={running === 'roadmap'}
                  onClick={() => requireText(targetRole, 'Enter a target role first') && run('roadmap', () => aiApi.getLearningRoadmap(targetRole.trim()), (d) => d.roadmap)}
                >
                  Generate roadmap
                </Button>
              </div>
              <ResultArea busy={running === 'roadmap'} text={results.roadmap} emptyHint="A week-by-week learning plan will appear here." />
            </div>
          )}
        </CardBody>
      </Card>
    </>
  );
};

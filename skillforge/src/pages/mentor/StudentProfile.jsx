
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  UserRound,
  GraduationCap,
  Briefcase,
  Code2,
  FileText,
  ExternalLink
} from 'lucide-react';

import { mentorApi } from '../../api/mentorApi';
import { CardSkeleton } from '../../components/ui/Skeleton';
import toast from 'react-hot-toast';

export const MentorStudentProfile = () => {
  const { id } = useParams();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudent = async () => {
      try {
        const { data } = await mentorApi.getStudentProfile(id);
        setStudent(data.student);
      } catch (error) {
        toast.error(
          error.response?.data?.message || 'Failed to load student profile'
        );
      } finally {
        setLoading(false);
      }
    };

    loadStudent();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-5">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h2 className="font-semibold text-slate-900">
          Student not found
        </h2>

        <Link
          to="/mentor/dashboard"
          className="mt-3 inline-block text-sm text-indigo-600 hover:text-indigo-700"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const profile = student.profile || {};
  const skills = student.skills || [];
  const projects = student.projects || [];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/mentor/dashboard"
          className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 shadow-sm hover:bg-slate-50"
        >
          <ArrowLeft size={19} />
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Student Profile
          </h1>

          <p className="text-sm text-slate-500">
            Review student details and progress
          </p>
        </div>
      </div>

      {/* Student Information */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">

          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500">
            {profile.profilePhoto ? (
              <img
                src={profile.profilePhoto}
                alt={student.fullName}
                className="h-full w-full object-cover"
              />
            ) : (
              <UserRound size={34} className="text-white" />
            )}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-bold text-slate-900">
              {student.fullName}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {student.email}
            </p>

            {profile.college && (
              <p className="mt-2 flex items-center justify-center gap-2 text-sm text-slate-600 sm:justify-start">
                <GraduationCap size={15} />
                {profile.college}
              </p>
            )}

            {profile.experience && (
              <span className="mt-3 inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                {profile.experience}
              </span>
            )}
          </div>

          {profile.resume && (
            <a
              href={profile.resume}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
            >
              <FileText size={16} />
              View Resume
              <ExternalLink size={13} />
            </a>
          )}
        </div>

        {profile.bio && (
          <div className="mt-6 border-t border-slate-200 pt-5">
            <h3 className="mb-2 text-sm font-semibold text-slate-900">
              About Student
            </h3>

            <p className="text-sm leading-relaxed text-slate-600">
              {profile.bio}
            </p>
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-4">

          {profile.socialLinks?.github && (
            <a
              href={profile.socialLinks.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600"
            >
              <ExternalLink size={16} />
              GitHub
            </a>
          )}

          {profile.socialLinks?.linkedin && (
            <a
              href={profile.socialLinks.linkedin}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600"
            >
              <ExternalLink size={16} />
              LinkedIn
            </a>
          )}

          {profile.socialLinks?.portfolio && (
            <a
              href={profile.socialLinks.portfolio}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600"
            >
              <ExternalLink size={16} />
              Portfolio
            </a>
          )}
        </div>
      </motion.div>

      {/* Skills */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-5 flex items-center gap-2">
          <Code2 size={19} className="text-indigo-600" />
          <h3 className="font-semibold text-slate-900">
            Skills
          </h3>
        </div>

        {skills.length === 0 ? (
          <p className="text-sm text-slate-500">
            No skills added yet.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {skills.map((skill, index) => (
              <div
                key={skill._id || index}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3"
              >
                <span className="text-sm font-medium text-slate-800">
                  {skill.name}
                </span>

                <span className="text-xs font-medium text-indigo-600">
                  {skill.level}
                </span>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Projects */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-5 flex items-center gap-2">
          <Briefcase size={19} className="text-cyan-600" />
          <h3 className="font-semibold text-slate-900">
            Projects
          </h3>
        </div>

        {projects.length === 0 ? (
          <p className="text-sm text-slate-500">
            No projects added yet.
          </p>
        ) : (
          <div className="space-y-4">
            {projects.map((project, index) => (
              <div
                key={project._id || index}
                className="rounded-xl border border-slate-100 bg-slate-50 p-4"
              >
                <h4 className="font-semibold text-slate-900">
                  {project.title}
                </h4>

                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {project.description}
                </p>

                {project.techStack?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.techStack.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {project.githubLink && (
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-cyan-700 hover:text-cyan-800"
                  >
                    <ExternalLink size={14} />
                    View GitHub Project
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </motion.div>

    </div>
  );
};

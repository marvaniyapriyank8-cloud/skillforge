import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { User, Phone, MapPin, Globe, Save, Camera, Edit3, Eye } from 'lucide-react';
import { profileApi } from '../../api/profileApi';
import { uploadApi } from '../../api/uploadApi';
import { useAuthStore } from '../../store/authStore';
import { Input, Textarea, Select } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { CardSkeleton } from '../../components/ui/Skeleton';
import toast from 'react-hot-toast';

export const StudentProfile = () => {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    profileApi.getProfile()
      .then(({ data }) => {
        const p = data.profile;
        setProfile(p);
        if (p) {
          // Flatten socialLinks for form
          reset({
            bio: p.bio,
            college: p.college,
            experience: p.experience,
            github: p.socialLinks?.github,
            linkedin: p.socialLinks?.linkedin,
            portfolio: p.socialLinks?.portfolio,
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      // Re-nest socialLinks for backend
      const payload = {
        bio: data.bio,
        college: data.college,
        experience: data.experience,
        socialLinks: {
          github: data.github,
          linkedin: data.linkedin,
          portfolio: data.portfolio,
        },
      };

      let res;
      if (profile) {
        res = await profileApi.updateProfile(payload);
      } else {
        res = await profileApi.createProfile(payload);
      }
      setProfile(res.data.profile);
      toast.success('Profile saved!');
    } catch { toast.error('Save failed'); }
    setSaving(false);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadApi.uploadPhoto(file);
      // Save photo URL to profile
      await profileApi.updateProfile({ profilePhoto: res.data.url });
      setProfile(p => ({ ...p, profilePhoto: res.data.url }));
      toast.success('Photo updated!');
    } catch { toast.error('Upload failed'); }
    setUploading(false);
  };

  if (loading) return (
    <div className="grid lg:grid-cols-3 gap-6">
      <CardSkeleton />
      <div className="lg:col-span-2 space-y-4">{[...Array(2)].map((_, i) => <CardSkeleton key={i} />)}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Profile</h1>
          <p className="text-white/40 text-sm mt-1">Manage your public profile</p>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Avatar card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="glass rounded-2xl p-6 border border-white/6 text-center">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center mx-auto overflow-hidden">
                {profile?.profilePhoto ? (
                  <img src={profile.profilePhoto} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-white">{user?.name?.[0]?.toUpperCase() || 'U'}</span>
                )}
              </div>
              <label className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-indigo-500 transition-all">
                {uploading
                  ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <Camera size={14} className="text-white" />}
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </label>
            </div>
            <div className="text-lg font-semibold text-white">{user?.name}</div>
            <div className="text-sm text-white/40 mt-1">{user?.email}</div>
            <div className="mt-3">
              <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400 capitalize">
                {user?.role}
              </span>
            </div>
            {profile?.college && (
              <div className="mt-3 text-sm text-white/50">{profile.college}</div>
            )}
            {profile?.resume && (
              <a href={profile.resume} target="_blank" rel="noreferrer"
                className="mt-4 flex items-center justify-center gap-2 text-xs text-cyan-400 hover:text-cyan-300">
                <Eye size={12} /> View Resume
              </a>
            )}
          </div>
        </motion.div>

        {/* Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* About */}
            <div className="glass rounded-2xl p-6 border border-white/6">
              <div className="flex items-center gap-2 mb-5">
                <User size={16} className="text-indigo-400" />
                <h3 className="font-semibold text-white">About</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <Input label="College / University" placeholder="IIT Bombay" icon={Edit3} {...register('college')} />
                <Select label="Experience Level" {...register('experience')}>
                  <option value="">Select level</option>
                  <option value="Fresher">Fresher</option>
                  <option value="0-1 Year">0-1 Year</option>
                  <option value="1-3 Years">1-3 Years</option>
                  <option value="3+ Years">3+ Years</option>
                </Select>
              </div>
              <div className="mt-4">
                <Textarea label="Bio" placeholder="Tell recruiters about yourself..." {...register('bio')} />
              </div>
            </div>

            {/* Social links */}
            <div className="glass rounded-2xl p-6 border border-white/6">
              <div className="flex items-center gap-2 mb-5">
                <Globe size={16} className="text-cyan-400" />
                <h3 className="font-semibold text-white">Social Links</h3>
              </div>
              <div className="space-y-4">
                <Input label="GitHub URL" placeholder="https://github.com/username" {...register('github')} />
                <Input label="LinkedIn URL" placeholder="https://linkedin.com/in/username" {...register('linkedin')} />
                <Input label="Portfolio URL" placeholder="https://yoursite.com" {...register('portfolio')} />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" loading={saving} size="lg">
                <Save size={16} /> Save Profile
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

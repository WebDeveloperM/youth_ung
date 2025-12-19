import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { contentAPI } from '../../api';

interface ProjectFormProps {
  project?: any | null;
  onClose: () => void;
  onSuccess: () => void;
}

const ProjectForm = ({ project, onClose, onSuccess }: ProjectFormProps) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'uz' | 'ru' | 'en'>('ru');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title_uz: '',
    title_ru: '',
    title_en: '',
    short_description_uz: '',
    short_description_ru: '',
    short_description_en: '',
    content_uz: '',
    content_ru: '',
    content_en: '',
    location: '',
    image: null as File | null,
    category: 'infrastructure',
    status: 'active',
    progress: 0,
    team: 0,
    budget: '',
    duration: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
    is_published: true,
    is_featured: false,
  });

  useEffect(() => {
    if (project) {
      setFormData({
        title_uz: project.title_uz || '',
        title_ru: project.title_ru || '',
        title_en: project.title_en || '',
        short_description_uz: project.short_description_uz || '',
        short_description_ru: project.short_description_ru || '',
        short_description_en: project.short_description_en || '',
        content_uz: project.content_uz || '<p><br></p>',
        content_ru: project.content_ru || '<p><br></p>',
        content_en: project.content_en || '<p><br></p>',
        location: project.location || '',
        image: null,
        category: project.category || 'infrastructure',
        status: project.status || 'active',
        progress: project.progress || 0,
        team: project.team || 0,
        budget: project.budget || '',
        duration: project.duration || '',
        start_date: project.start_date || new Date().toISOString().split('T')[0],
        end_date: project.end_date || new Date().toISOString().split('T')[0],
        is_published: project.is_published,
        is_featured: project.is_featured,
      });
      if (project.image) {
        setImagePreview(project.image);
      }
    }
  }, [project]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const loadingToast = toast.loading(project ? 'Сақланмоқда...' : 'Яратилмоқда...');

    try {
      const submitData = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (key !== 'image') {
          const value = formData[key as keyof typeof formData];
          if (value !== null && value !== undefined) {
            submitData.append(key, String(value));
          }
        }
      });

      if (formData.image) {
        submitData.append('image', formData.image);
      }

      if (project) {
        await contentAPI.projects.update(project.id, submitData);
        toast.success('Loyiha muvaffaqiyatli yangilandi! ✅', { id: loadingToast });
      } else {
        await contentAPI.projects.create(submitData);
        toast.success('Loyiha muvaffaqiyatli yaratildi! 🎉', { id: loadingToast });
      }
      
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Ошибка:', error);
      console.error('Детали ошибки:', error.response?.data);
      toast.error('Xatolik yuz berdi! ' + (error.response?.data?.message || error.message), { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-4xl my-8">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {project ? 'Loyihani tahrirlash' : 'Yangi loyiha'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="flex space-x-2 border-b border-gray-200">
            {['uz', 'ru', 'en'].map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setActiveTab(lang as any)}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === lang
                    ? 'border-b-2 border-primary-600 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sarlavha ({activeTab.toUpperCase()}) *
            </label>
            <input
              type="text"
              required
              value={formData[`title_${activeTab}` as keyof typeof formData] as string}
              onChange={(e) => setFormData({ ...formData, [`title_${activeTab}`]: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Qisqacha tavsif ({activeTab.toUpperCase()}) *
            </label>
            <textarea
              required
              rows={3}
              value={formData[`short_description_${activeTab}` as keyof typeof formData] as string}
              onChange={(e) => setFormData({ ...formData, [`short_description_${activeTab}`]: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mazmun ({activeTab.toUpperCase()}) *
            </label>
            <ReactQuill
              theme="snow"
              value={formData[`content_${activeTab}` as keyof typeof formData] as string}
              onChange={(value) => setFormData({ ...formData, [`content_${activeTab}`]: value })}
              className="bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Joylashuv ({activeTab.toUpperCase()})
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {activeTab === 'ru' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kategoriya *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="infrastructure">Infratuzilma</option>
                    <option value="digital">Raqamlashtirish</option>
                    <option value="ecology">Ekologiya</option>
                    <option value="education">Ta'lim</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="active">Faol</option>
                    <option value="completed">Yakunlangan</option>
                    <option value="planned">Rejalashtirilgan</option>
                    <option value="paused">To'xtatilgan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Progress (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.progress}
                    onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Jamoa hajmi</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.team}
                    onChange={(e) => setFormData({ ...formData, team: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Byudjet</label>
                  <input
                    type="text"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Davomiyligi</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Boshlangan sana *</label>
                  <input
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tugash sanasi</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rasm</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="mt-4 max-h-48 rounded-lg" />
                )}
              </div>

              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm font-medium text-gray-700">Nashr qilish</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm font-medium text-gray-700">Tanlangan</span>
                </label>
              </div>
            </>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Saqlanmoqda...' : project ? 'Saqlash' : 'Yaratish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;


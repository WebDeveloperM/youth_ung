import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Job, jobsAPI } from '../../api';

interface JobFormProps {
  job?: Job | null;
  onClose: () => void;
  onSuccess: () => void;
}

const JobForm = ({ job, onClose, onSuccess }: JobFormProps) => {
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
    content_uz: '<p><br></p>',
    content_ru: '<p><br></p>',
    content_en: '<p><br></p>',
    image: null as File | null,
    salary: '',
    location: '',
    type: '',
    experience: '',
    deadline: new Date().toISOString().split('T')[0],
    status: 'active' as 'active' | 'closed' | 'paused',
    category: 'it' as 'it' | 'engineering' | 'hr' | 'marketing' | 'finance',
    employment_type: 'full-time' as 'full-time' | 'part-time' | 'contract' | 'intern',
    positions: '1',
  });

  useEffect(() => {
    if (job) {
      console.log('📝 ЗАГРУЗКА ВАКАНСИИ ДЛЯ РЕДАКТИРОВАНИЯ:', job);
      setFormData({
        title_uz: job.title_uz || '',
        title_ru: job.title_ru || '',
        title_en: job.title_en || '',
        short_description_uz: job.short_description_uz || '',
        short_description_ru: job.short_description_ru || '',
        short_description_en: job.short_description_en || '',
        content_uz: job.content_uz || '<p><br></p>',
        content_ru: job.content_ru || '<p><br></p>',
        content_en: job.content_en || '<p><br></p>',
        image: null,
        salary: job.salary || '',
        location: job.location || '',
        type: job.type || '',
        experience: job.experience || '',
        deadline: job.deadline || new Date().toISOString().split('T')[0],
        status: job.status || 'active',
        category: job.category || 'it',
        employment_type: job.employment_type || 'full-time',
        positions: String(job.positions || '1'),
      });
      if (job.image) {
        setImagePreview(job.image);
      }
    }
  }, [job]);

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

    // Validation
    if (!formData.title_uz || !formData.title_ru || !formData.title_en) {
      toast.error('Илтимос, барча тилларда сарлавҳа киритинг!');
      return;
    }

    if (!formData.short_description_uz || !formData.short_description_ru || !formData.short_description_en) {
      toast.error('Илтимос, қисқача таъриф киритинг!');
      return;
    }

    if (!formData.salary || !formData.location || !formData.type || !formData.experience || !formData.deadline) {
      toast.error('Илтимос, вакансия маълумотларини тўлдиринг!');
      return;
    }

    if (!formData.positions || parseInt(formData.positions) < 1) {
      toast.error('Илтимос, ўринлар сонини киритинг (минимум 1)!');
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading(job ? 'Сақланмоқда...' : 'Яратилмоқда...');

    try {
      const submitData: any = { ...formData };
      
      console.log('📝 ОТПРАВЛЯЕМ ВАКАНСИЮ:', submitData);
      console.log('✅ title_ru:', submitData.title_ru);
      console.log('✅ short_description_ru:', submitData.short_description_ru);
      console.log('✅ content_uz:', submitData.content_uz);
      console.log('✅ content_ru:', submitData.content_ru);
      console.log('✅ content_en:', submitData.content_en);
      console.log('✅ category:', submitData.category);
      console.log('✅ employment_type:', submitData.employment_type);
      
      // Если редактирование и нет нового изображения, удаляем поле image
      if (job && !formData.image) {
        delete submitData.image;
      }

      if (job) {
        await jobsAPI.update(job.id, submitData);
        toast.success('Вакансия муваффақиятли янгиланди! ✅', { id: loadingToast });
      } else {
        const result = await jobsAPI.create(submitData);
        console.log('✅ ВАКАНСИЯ СОЗДАНА:', result);
        toast.success('Вакансия муваффақиятли яратилди! 🎉', { id: loadingToast });
      }
      
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Ошибка при сохранении вакансии:', error);
      
      // Better error messages
      if (error.response?.data) {
        const errors = error.response.data;
        if (typeof errors === 'object') {
          const errorMessages = Object.entries(errors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('\n');
          toast.error(`Хатолик:\n${errorMessages}`, { id: loadingToast });
        } else {
          toast.error(`Хатолик: ${errors}`, { id: loadingToast });
        }
      } else {
        toast.error(`Хатолик: ${error.message}`, { id: loadingToast });
      }
    } finally {
      setLoading(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ color: [] }, { background: [] }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {job ? 'Вакансияни таҳрирлаш' : 'Янги вакансия қўшиш'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Language Tabs - Sticky */}
          <div className="sticky top-0 bg-white dark:bg-gray-800 z-10 -mx-6 px-6 pb-4">
            <div className="flex gap-2 border-b-2 border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setActiveTab('uz')}
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === 'uz'
                    ? 'text-blue-600 border-b-2 border-blue-600 -mb-0.5'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                🇺🇿 O'zbekcha
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ru')}
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === 'ru'
                    ? 'text-blue-600 border-b-2 border-blue-600 -mb-0.5'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                🇷🇺 Русский
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('en')}
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === 'en'
                    ? 'text-blue-600 border-b-2 border-blue-600 -mb-0.5'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                🇬🇧 English
              </button>
            </div>
          </div>

          {/* Content for active tab */}
          {activeTab === 'uz' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Сарлавҳа (O'zbekcha) *
                </label>
                <input
                  type="text"
                  value={formData.title_uz}
                  onChange={(e) => setFormData({ ...formData, title_uz: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Лавозим номи..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Қисқача таъриф *
                </label>
                <textarea
                  value={formData.short_description_uz}
                  onChange={(e) => setFormData({ ...formData, short_description_uz: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Қисқача таъриф..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Тўлиқ маълумот *
                </label>
                <ReactQuill
                  theme="snow"
                  value={formData.content_uz}
                  onChange={(value) => setFormData({ ...formData, content_uz: value })}
                  modules={quillModules}
                  className="bg-white dark:bg-gray-700 rounded-lg"
                />
              </div>
            </div>
          )}

          {activeTab === 'ru' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Название (Русский) *
                </label>
                <input
                  type="text"
                  value={formData.title_ru}
                  onChange={(e) => setFormData({ ...formData, title_ru: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Название должности..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Краткое описание *
                </label>
                <textarea
                  value={formData.short_description_ru}
                  onChange={(e) => setFormData({ ...formData, short_description_ru: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Краткое описание..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Полное описание *
                </label>
                <ReactQuill
                  theme="snow"
                  value={formData.content_ru}
                  onChange={(value) => setFormData({ ...formData, content_ru: value })}
                  modules={quillModules}
                  className="bg-white dark:bg-gray-700 rounded-lg"
                />
              </div>
            </div>
          )}

          {activeTab === 'en' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title (English) *
                </label>
                <input
                  type="text"
                  value={formData.title_en}
                  onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Job title..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Short Description *
                </label>
                <textarea
                  value={formData.short_description_en}
                  onChange={(e) => setFormData({ ...formData, short_description_en: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Short description..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Description *
                </label>
                <ReactQuill
                  theme="snow"
                  value={formData.content_en}
                  onChange={(value) => setFormData({ ...formData, content_en: value })}
                  modules={quillModules}
                  className="bg-white dark:bg-gray-700 rounded-lg"
                />
              </div>
            </div>
          )}

          {/* Image Upload */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Расм
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="mt-4 max-h-48 rounded-lg object-cover" />
            )}
          </div>

          {/* Job Details */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Маош *
              </label>
              <input
                type="text"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="5000 - 7000 USD"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Жойлашув *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Тошкент, Ўзбекистон"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Иш тури *
              </label>
              <input
                type="text"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Офисда / Masofadan"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Тажриба *
              </label>
              <input
                type="text"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="3-5 йил"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Арiza муддати *
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ўринлар сони *
              </label>
              <input
                type="number"
                min="1"
                value={formData.positions}
                onChange={(e) => setFormData({ ...formData, positions: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Категория *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="it">IT / Технологии</option>
                <option value="engineering">Инженерия</option>
                <option value="hr">HR / Кадрлар</option>
                <option value="marketing">Маркетинг</option>
                <option value="finance">Молия</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Бандлик тури *
              </label>
              <select
                value={formData.employment_type}
                onChange={(e) => setFormData({ ...formData, employment_type: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="full-time">Тўлиқ кун</option>
                <option value="part-time">Ярим кун</option>
                <option value="contract">Шартнома</option>
                <option value="intern">Стажёр</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Статус *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="active">Фаол</option>
                <option value="paused">Тўхтатилган</option>
                <option value="closed">Ёпилган</option>
              </select>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Бекор қилиш
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Сақланмоқда...
              </>
            ) : (
              <>💾 Saqlash</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobForm;


import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { contentAPI } from '../../api';

interface ResultFormProps {
  result?: any | null;
  onClose: () => void;
  onSuccess: () => void;
}

const ResultForm = ({ result, onClose, onSuccess }: ResultFormProps) => {
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
    metrics_uz: '',
    metrics_ru: '',
    metrics_en: '',
    achievements_uz: '',
    achievements_ru: '',
    achievements_en: '',
    image: null as File | null,
    category: 'project',
    status: 'completed',
    year: new Date().getFullYear(),
    is_published: true,
    is_featured: false,
  });

  useEffect(() => {
    if (result) {
      setFormData({
        title_uz: result.title_uz || '',
        title_ru: result.title_ru || '',
        title_en: result.title_en || '',
        short_description_uz: result.short_description_uz || '',
        short_description_ru: result.short_description_ru || '',
        short_description_en: result.short_description_en || '',
        content_uz: result.content_uz || '<p><br></p>',
        content_ru: result.content_ru || '<p><br></p>',
        content_en: result.content_en || '<p><br></p>',
        metrics_uz: result.metrics_uz || '',
        metrics_ru: result.metrics_ru || '',
        metrics_en: result.metrics_en || '',
        achievements_uz: result.achievements_uz || '',
        achievements_ru: result.achievements_ru || '',
        achievements_en: result.achievements_en || '',
        image: null,
        category: result.category || 'project',
        status: result.status || 'completed',
        year: result.year || new Date().getFullYear(),
        is_published: result.is_published,
        is_featured: result.is_featured,
      });
      if (result.image) {
        setImagePreview(result.image);
      }
    }
  }, [result]);

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

    const loadingToast = toast.loading(result ? 'Сақланмоқда...' : 'Яратилмоқда...');

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

      if (result) {
        await contentAPI.results.update(result.id, submitData);
        toast.success('Natija muvaffaqiyatli yangilandi! ✅', { id: loadingToast });
      } else {
        await contentAPI.results.create(submitData);
        toast.success('Natija muvaffaqiyatli yaratildi! 🎉', { id: loadingToast });
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
            {result ? 'Natijani tahrirlash' : 'Yangi natija'}
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
              Metrikalar ({activeTab.toUpperCase()})
            </label>
            <textarea
              rows={2}
              value={formData[`metrics_${activeTab}` as keyof typeof formData] as string}
              onChange={(e) => setFormData({ ...formData, [`metrics_${activeTab}`]: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="Ko'rsatkichlar..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Yutuqlar ({activeTab.toUpperCase()})
            </label>
            <textarea
              rows={3}
              value={formData[`achievements_${activeTab}` as keyof typeof formData] as string}
              onChange={(e) => setFormData({ ...formData, [`achievements_${activeTab}`]: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="Erishilgan natijalar..."
            />
          </div>

          {activeTab === 'ru' && (
            <>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kategoriya *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="project">Loyiha</option>
                    <option value="program">Dastur</option>
                    <option value="research">Tadqiqot</option>
                    <option value="ecology">Ekologiya</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="completed">Yakunlangan</option>
                    <option value="ongoing">Jarayonda</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Yil *</label>
                  <input
                    type="number"
                    required
                    min="2000"
                    max="2100"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
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
              {loading ? 'Saqlanmoqda...' : result ? 'Saqlash' : 'Yaratish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResultForm;


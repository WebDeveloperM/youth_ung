import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { contentAPI } from '../../api';

interface TechnologyFormProps {
  technology?: any | null;
  onClose: () => void;
  onSuccess: () => void;
}

const TechnologyForm = ({ technology, onClose, onSuccess }: TechnologyFormProps) => {
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
    image: null as File | null,
    category: 'exploration',
    date: new Date().toISOString().split('T')[0],
    is_published: true,
    is_featured: false,
  });

  useEffect(() => {
    if (technology) {
      setFormData({
        title_uz: technology.title_uz || '',
        title_ru: technology.title_ru || '',
        title_en: technology.title_en || '',
        short_description_uz: technology.short_description_uz || '',
        short_description_ru: technology.short_description_ru || '',
        short_description_en: technology.short_description_en || '',
        content_uz: technology.content_uz || '<p><br></p>',
        content_ru: technology.content_ru || '<p><br></p>',
        content_en: technology.content_en || '<p><br></p>',
        image: null,
        category: technology.category || 'exploration',
        date: technology.date || new Date().toISOString().split('T')[0],
        is_published: technology.is_published,
        is_featured: technology.is_featured,
      });
      if (technology.image) {
        setImagePreview(technology.image);
      }
    }
  }, [technology]);

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

    const loadingToast = toast.loading(technology ? 'Сақланмоқда...' : 'Яратилмоқда...');

    try {
      const submitData = new FormData();
      
      // Add all text fields
      Object.keys(formData).forEach(key => {
        if (key !== 'image') {
          const value = formData[key as keyof typeof formData];
          if (value !== null && value !== undefined) {
            submitData.append(key, String(value));
          }
        }
      });

      // Add image if exists
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      if (technology) {
        await contentAPI.technologies.update(technology.id, submitData);
        toast.success('Texnologiya muvaffaqiyatli yangilandi! ✅', { id: loadingToast });
      } else {
        await contentAPI.technologies.create(submitData);
        toast.success('Texnologiya muvaffaqiyatli yaratildi! 🎉', { id: loadingToast });
      }
      
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('❌ ПОЛНАЯ ОШИБКА:', error);
      console.error('❌ Response:', error.response);
      console.error('❌ Response Data:', error.response?.data);
      console.error('❌ Response Status:', error.response?.status);
      console.error('❌ Response Headers:', error.response?.headers);
      
      let errorMessage = 'Xatolik yuz berdi!';
      if (error.response?.data) {
        if (typeof error.response.data === 'object') {
          errorMessage = JSON.stringify(error.response.data);
        } else {
          errorMessage = String(error.response.data);
        }
      }
      
      toast.error(errorMessage, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-4xl my-8">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {technology ? 'Texnologiyani tahrirlash' : 'Yangi texnologiya'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Tabs */}
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

          {/* Title */}
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

          {/* Short Description */}
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

          {/* Content */}
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

          {activeTab === 'ru' && (
            <>
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kategoriya *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="exploration">Razvedka</option>
                    <option value="drilling">Burenie</option>
                    <option value="extraction">Dobycha</option>
                    <option value="ecology">Ekologiya</option>
                    <option value="automation">Avtomatizatsiya</option>
                    <option value="processing">Pererabotka</option>
                  </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sana *</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Image */}
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

              {/* Checkboxes */}
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

          {/* Buttons */}
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
              {loading ? 'Saqlanmoqda...' : technology ? 'Saqlash' : 'Yaratish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TechnologyForm;


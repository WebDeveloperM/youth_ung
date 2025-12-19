import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { contentAPI } from '../../api';

interface ResearchFormProps {
  research?: any | null;
  onClose: () => void;
  onSuccess: () => void;
}

const ResearchForm = ({ research, onClose, onSuccess }: ResearchFormProps) => {
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
    department_uz: '',
    department_ru: '',
    department_en: '',
    image: null as File | null,
    category: 'technology',
    status: 'active',
    authors: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
    publications: 0,
    citations: 0,
    budget: '',
    is_published: true,
    is_featured: false,
  });

  useEffect(() => {
    if (research) {
      setFormData({
        title_uz: research.title_uz || '',
        title_ru: research.title_ru || '',
        title_en: research.title_en || '',
        short_description_uz: research.short_description_uz || '',
        short_description_ru: research.short_description_ru || '',
        short_description_en: research.short_description_en || '',
        content_uz: research.content_uz || '<p><br></p>',
        content_ru: research.content_ru || '<p><br></p>',
        content_en: research.content_en || '<p><br></p>',
        department_uz: research.department_uz || '',
        department_ru: research.department_ru || '',
        department_en: research.department_en || '',
        image: null,
        category: research.category || 'technology',
        status: research.status || 'active',
        authors: research.authors || '',
        start_date: research.start_date || new Date().toISOString().split('T')[0],
        end_date: research.end_date || new Date().toISOString().split('T')[0],
        publications: research.publications || 0,
        citations: research.citations || 0,
        budget: research.budget || '',
        is_published: research.is_published,
        is_featured: research.is_featured,
      });
      if (research.image) {
        setImagePreview(research.image);
      }
    }
  }, [research]);

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

    const loadingToast = toast.loading(research ? 'Сақланмоқда...' : 'Яратилмоқда...');

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

      if (research) {
        await contentAPI.research.update(research.id, submitData);
        toast.success('Tadqiqot muvaffaqiyatli yangilandi! ✅', { id: loadingToast });
      } else {
        await contentAPI.research.create(submitData);
        toast.success('Tadqiqot muvaffaqiyatli yaratildi! 🎉', { id: loadingToast });
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
            {research ? 'Tadqiqotni tahrirlash' : 'Yangi tadqiqot'}
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
              Bo'lim ({activeTab.toUpperCase()})
            </label>
            <input
              type="text"
              value={formData[`department_${activeTab}` as keyof typeof formData] as string}
              onChange={(e) => setFormData({ ...formData, [`department_${activeTab}`]: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {activeTab === 'ru' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mualliflar *</label>
                <input
                  type="text"
                  required
                  value={formData.authors}
                  onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Ism Familiya, Ism Familiya..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kategoriya *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="technology">Texnologiyalar</option>
                    <option value="ecology">Ekologiya</option>
                    <option value="digital">Raqamlashtirish</option>
                    <option value="geology">Geologiya</option>
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
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nashrlar</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.publications}
                    onChange={(e) => setFormData({ ...formData, publications: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Iqtiboslar</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.citations}
                    onChange={(e) => setFormData({ ...formData, citations: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Boshlangan</label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tugagan</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
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
              {loading ? 'Saqlanmoqda...' : research ? 'Saqlash' : 'Yaratish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResearchForm;


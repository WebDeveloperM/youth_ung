import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { News, newsAPI } from '../../api';

interface NewsFormProps {
  news?: News | null;
  onClose: () => void;
  onSuccess: () => void;
}

const NewsForm = ({ news, onClose, onSuccess }: NewsFormProps) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'uz' | 'ru' | 'en'>('ru');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title_uz: '',
    title_ru: '',
    title_en: '',
    content_uz: '',
    content_ru: '',
    content_en: '',
    image: null as File | null,
    date: new Date().toISOString().split('T')[0],
    is_published: true,
    is_featured: false,
  });

  useEffect(() => {
    if (news) {
      console.log('📝 ЗАГРУЗКА ДАННЫХ ДЛЯ РЕДАКТИРОВАНИЯ:', news);
      setFormData({
        title_uz: news.title_uz || '',
        title_ru: news.title_ru || '',
        title_en: news.title_en || '',
        content_uz: news.content_uz || '<p><br></p>',
        content_ru: news.content_ru || '<p><br></p>',
        content_en: news.content_en || '<p><br></p>',
        image: null,
        date: news.date || new Date().toISOString().split('T')[0],
        is_published: news.is_published,
        is_featured: news.is_featured,
      });
      if (news.image) {
        setImagePreview(news.image);
      }
    }
  }, [news]);

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

    try {
      const submitData: any = { ...formData };
      
      // ОТЛАДКА: Проверяем что отправляем
      console.log('📝 ОТПРАВЛЯЕМ ДАННЫЕ:', submitData);
      console.log('✅ title_uz:', submitData.title_uz);
      console.log('✅ title_ru:', submitData.title_ru);
      console.log('✅ title_en:', submitData.title_en);
      console.log('✅ content_uz:', submitData.content_uz);
      console.log('✅ content_ru:', submitData.content_ru);
      console.log('✅ content_en:', submitData.content_en);
      
      // Если редактирование и нет нового изображения, удаляем поле image
      if (news && !formData.image) {
        delete submitData.image;
      }

      if (news) {
        await newsAPI.update(news.id, submitData);
      } else {
        const result = await newsAPI.create(submitData);
        console.log('✅ РЕЗУЛЬТАТ СОЗДАНИЯ:', result);
      }
      
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('❌ ОШИБКА СОХРАНЕНИЯ:', error);
      console.error('❌ Response data:', error.response?.data);
      alert(`Хатолик: ${JSON.stringify(error.response?.data) || error.message}`);
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
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900">
            {news ? 'Янгиликни таҳрирлаш' : 'Янги янгилик қўшиш'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Расм <span className="text-gray-400">(ихтиёрий)</span>
            </label>
            <div className="flex items-center space-x-4">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 rounded-lg object-cover"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Агар расм қўшмасангиз, новость расмсиз сақланади
            </p>
          </div>

          {/* Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Сана <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="flex items-end space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">Нашр қилиш</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">Танланган</span>
              </label>
            </div>
          </div>

          {/* Language Tabs - Sticky */}
          <div className="sticky top-0 bg-white z-10 -mx-6 px-6 pb-4">
            <div className="flex gap-2 border-b-2 border-gray-200">
              {(['uz', 'ru', 'en'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveTab(lang)}
                  className={`px-6 py-3 font-bold text-lg transition-all ${
                    activeTab === lang
                      ? 'text-indigo-600 border-b-4 border-indigo-600 bg-indigo-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div>

            {/* Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Сарлавҳа ({activeTab.toUpperCase()}) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData[`title_${activeTab}` as keyof typeof formData] as string}
                onChange={(e) =>
                  setFormData({ ...formData, [`title_${activeTab}`]: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder={`Сарлавҳани киритинг (${activeTab.toUpperCase()})`}
              />
            </div>

            {/* Content - Rich Text Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Мазмун ({activeTab.toUpperCase()}) <span className="text-red-500">*</span>
              </label>
              
              {/* Отдельный ReactQuill для каждого языка */}
              <div style={{ display: activeTab === 'uz' ? 'block' : 'none' }}>
                <ReactQuill
                  key={`editor-uz-${news?.id || 'new'}-${formData.content_uz.substring(0, 10)}`}
                  theme="snow"
                  value={formData.content_uz}
                  onChange={(value) => setFormData(prev => ({ ...prev, content_uz: value }))}
                  modules={quillModules}
                  className="bg-white rounded-lg"
                  style={{ height: '300px', marginBottom: '50px' }}
                />
              </div>
              
              <div style={{ display: activeTab === 'ru' ? 'block' : 'none' }}>
                <ReactQuill
                  key={`editor-ru-${news?.id || 'new'}-${formData.content_ru.substring(0, 10)}`}
                  theme="snow"
                  value={formData.content_ru}
                  onChange={(value) => setFormData(prev => ({ ...prev, content_ru: value }))}
                  modules={quillModules}
                  className="bg-white rounded-lg"
                  style={{ height: '300px', marginBottom: '50px' }}
                />
              </div>
              
              <div style={{ display: activeTab === 'en' ? 'block' : 'none' }}>
                <ReactQuill
                  key={`editor-en-${news?.id || 'new'}-${formData.content_en.substring(0, 10)}`}
                  theme="snow"
                  value={formData.content_en}
                  onChange={(value) => setFormData(prev => ({ ...prev, content_en: value }))}
                  modules={quillModules}
                  className="bg-white rounded-lg"
                  style={{ height: '300px', marginBottom: '50px' }}
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
        </form>

        {/* Buttons - Fixed at bottom */}
        <div className="flex gap-4 p-6 border-t border-gray-200 bg-white">
          <button
            type="submit"
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              const form = document.querySelector('form');
              if (form) form.requestSubmit();
            }}
            className="flex-1 bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Сақланмоқда...' : news ? 'Сақлаш' : 'Қўшиш'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Бекор қилиш
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsForm;


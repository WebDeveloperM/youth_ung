import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Innovation, innovationsAPI } from '../../api';

interface InnovationFormProps {
  innovation?: Innovation | null;
  onClose: () => void;
  onSuccess: () => void;
}

const InnovationForm = ({ innovation, onClose, onSuccess }: InnovationFormProps) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'uz' | 'ru' | 'en'>('ru');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title_uz: '',
    title_ru: '',
    title_en: '',
    content_uz: '<p><br></p>',
    content_ru: '<p><br></p>',
    content_en: '<p><br></p>',
    image: null as File | null,
    date: new Date().toISOString().split('T')[0],
    category: 'technology' as 'technology' | 'ecology' | 'digital',
    is_featured: false,
  });

  useEffect(() => {
    if (innovation) {
      console.log('📝 ЗАГРУЗКА ИННОВАЦИИ ДЛЯ РЕДАКТИРОВАНИЯ:', innovation);
      setFormData({
        title_uz: innovation.title_uz || '',
        title_ru: innovation.title_ru || '',
        title_en: innovation.title_en || '',
        content_uz: innovation.content_uz || '<p><br></p>',
        content_ru: innovation.content_ru || '<p><br></p>',
        content_en: innovation.content_en || '<p><br></p>',
        image: null,
        date: innovation.date || new Date().toISOString().split('T')[0],
        category: innovation.category || 'technology',
        is_featured: innovation.is_featured || false,
      });
      if (innovation.image) {
        setImagePreview(innovation.image);
      }
    }
  }, [innovation]);

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

    if (!formData.date) {
      toast.error('Илтимос, санани киритинг!');
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading(innovation ? 'Сақланмоқда...' : 'Яратилмоқда...');

    try {
      const submitData: any = { ...formData };
      
      console.log('📝 ОТПРАВЛЯЕМ ИННОВАЦИЮ:', submitData);
      console.log('✅ title_ru:', submitData.title_ru);
      console.log('✅ content_uz:', submitData.content_uz);
      console.log('✅ content_ru:', submitData.content_ru);
      console.log('✅ content_en:', submitData.content_en);
      console.log('✅ category:', submitData.category);
      
      // Если редактирование и нет нового изображения, удаляем поле image
      if (innovation && !formData.image) {
        delete submitData.image;
      }

      if (innovation) {
        await innovationsAPI.update(innovation.id, submitData);
        toast.success('Инновация муваффақиятли янгиланди! ✅', { id: loadingToast });
      } else {
        const result = await innovationsAPI.create(submitData);
        console.log('✅ ИННОВАЦИЯ СОЗДАНА:', result);
        toast.success('Инновация муваффақиятли яратилди! 🎉', { id: loadingToast });
      }
      
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Ошибка при сохранении инновации:', error);
      
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {innovation ? 'Редактировать инновацию' : 'Новая инновация'}
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
              {(['uz', 'ru', 'en'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveTab(lang)}
                  className={`px-6 py-3 font-bold text-lg transition-all ${
                    activeTab === lang
                      ? 'text-indigo-600 border-b-4 border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Titles */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Название ({activeTab.toUpperCase()})
            </label>
            <input
              type="text"
              value={formData[`title_${activeTab}` as keyof typeof formData] as string}
              onChange={(e) =>
                setFormData({ ...formData, [`title_${activeTab}`]: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>

          {/* Content - Раздельные ReactQuill для каждого языка */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Описание ({activeTab.toUpperCase()})
            </label>
            
            {/* UZ */}
            <div style={{ display: activeTab === 'uz' ? 'block' : 'none' }}>
              <ReactQuill
                key="content_uz"
                theme="snow"
                value={formData.content_uz}
                onChange={(value) => setFormData({ ...formData, content_uz: value })}
                className="bg-white dark:bg-gray-700 rounded-lg"
                modules={{
                  toolbar: [
                    [{ header: [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['link', 'image'],
                    ['clean'],
                  ],
                }}
              />
            </div>

            {/* RU */}
            <div style={{ display: activeTab === 'ru' ? 'block' : 'none' }}>
              <ReactQuill
                key="content_ru"
                theme="snow"
                value={formData.content_ru}
                onChange={(value) => setFormData({ ...formData, content_ru: value })}
                className="bg-white dark:bg-gray-700 rounded-lg"
                modules={{
                  toolbar: [
                    [{ header: [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['link', 'image'],
                    ['clean'],
                  ],
                }}
              />
            </div>

            {/* EN */}
            <div style={{ display: activeTab === 'en' ? 'block' : 'none' }}>
              <ReactQuill
                key="content_en"
                theme="snow"
                value={formData.content_en}
                onChange={(value) => setFormData({ ...formData, content_en: value })}
                className="bg-white dark:bg-gray-700 rounded-lg"
                modules={{
                  toolbar: [
                    [{ header: [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['link', 'image'],
                    ['clean'],
                  ],
                }}
              />
            </div>
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Изображение
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="mt-4 w-full h-64 object-cover rounded-lg" />
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Дата
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Категория
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="technology">Технологии</option>
              <option value="ecology">Экология</option>
              <option value="digital">Цифровизация</option>
            </select>
          </div>

          {/* Is Featured */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_featured"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="is_featured" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Избранное (отображать на главной странице)
            </label>
          </div>

        </form>

        {/* Buttons - Fixed at bottom */}
        <div className="flex gap-4 p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <button
            type="submit"
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              const form = document.querySelector('form');
              if (form) form.requestSubmit();
            }}
            className="flex-1 bg-linear-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg disabled:opacity-50"
          >
            {loading ? 'Сохранение...' : innovation ? 'Сохранить изменения' : 'Создать инновацию'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};

export default InnovationForm;



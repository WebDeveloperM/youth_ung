import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Internship, internshipsAPI } from '../../api';

interface InternshipFormProps {
  internship?: Internship | null;
  onClose: () => void;
  onSuccess: () => void;
}

const InternshipForm = ({ internship, onClose, onSuccess }: InternshipFormProps) => {
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
    stipend: '',
    duration: '',
    deadline: new Date().toISOString().split('T')[0],
    start_date: new Date().toISOString().split('T')[0],
    positions: '1',
    status: 'active' as 'active' | 'closed' | 'upcoming',
    category: 'summer' as 'summer' | 'international' | 'technical',
  });

  useEffect(() => {
    if (internship) {
      console.log('📝 ЗАГРУЗКА СТАЖИРОВКИ ДЛЯ РЕДАКТИРОВАНИЯ:', internship);
      setFormData({
        title_uz: internship.title_uz || '',
        title_ru: internship.title_ru || '',
        title_en: internship.title_en || '',
        short_description_uz: internship.short_description_uz || '',
        short_description_ru: internship.short_description_ru || '',
        short_description_en: internship.short_description_en || '',
        content_uz: internship.content_uz || '<p><br></p>',
        content_ru: internship.content_ru || '<p><br></p>',
        content_en: internship.content_en || '<p><br></p>',
        image: null,
        stipend: internship.stipend || '',
        duration: internship.duration || '',
        deadline: internship.deadline || new Date().toISOString().split('T')[0],
        start_date: internship.start_date || new Date().toISOString().split('T')[0],
        positions: String(internship.positions || '1'),
        status: internship.status || 'active',
        category: internship.category || 'summer',
      });
      if (internship.image) {
        setImagePreview(internship.image);
      }
    }
  }, [internship]);

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

    if (!formData.stipend || !formData.duration || !formData.deadline || !formData.start_date) {
      toast.error('Илтимос, стажировка маълумотларини тўлдиринг!');
      return;
    }

    if (!formData.positions || parseInt(formData.positions) < 1) {
      toast.error('Илтимос, ўринлар сонини киритинг (минимум 1)!');
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading(internship ? 'Сақланмоқда...' : 'Яратилмоқда...');

    try {
      const submitData: any = { ...formData };
      
      console.log('📝 ОТПРАВЛЯЕМ СТАЖИРОВКУ:', submitData);
      console.log('✅ title_ru:', submitData.title_ru);
      console.log('✅ short_description_ru:', submitData.short_description_ru);
      console.log('✅ content_uz:', submitData.content_uz);
      console.log('✅ content_ru:', submitData.content_ru);
      console.log('✅ content_en:', submitData.content_en);
      console.log('✅ category:', submitData.category);
      
      // Если редактирование и нет нового изображения, удаляем поле image
      if (internship && !formData.image) {
        delete submitData.image;
      }

      if (internship) {
        await internshipsAPI.update(internship.id, submitData);
        toast.success('Стажировка муваффақиятли янгиланди! ✅', { id: loadingToast });
      } else {
        const result = await internshipsAPI.create(submitData);
        console.log('✅ СТАЖИРОВКА СОЗДАНА:', result);
        toast.success('Стажировка муваффақиятли яратилди! 🎉', { id: loadingToast });
      }
      
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Ошибка при сохранении стажировки:', error);
      
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
            {internship ? 'Редактировать стажировку' : 'Новая стажировка'}
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

          {/* Short Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Краткое описание ({activeTab.toUpperCase()})
            </label>
            <textarea
              value={formData[`short_description_${activeTab}` as keyof typeof formData] as string}
              onChange={(e) =>
                setFormData({ ...formData, [`short_description_${activeTab}`]: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>

          {/* Content - Раздельные ReactQuill для каждого языка */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Полное описание ({activeTab.toUpperCase()})
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

          {/* Stipend */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Стипендия
            </label>
            <input
              type="text"
              value={formData.stipend}
              onChange={(e) => setFormData({ ...formData, stipend: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="напр. $1,000/месяц"
              required
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Длительность
            </label>
            <input
              type="text"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="напр. 3 месяца"
              required
            />
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Срок подачи заявок
            </label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Дата начала
            </label>
            <input
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>

          {/* Positions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Количество мест
            </label>
            <input
              type="number"
              min="1"
              value={formData.positions}
              onChange={(e) => setFormData({ ...formData, positions: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Статус
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="active">Активная</option>
              <option value="closed">Закрыта</option>
              <option value="upcoming">Скоро</option>
            </select>
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
              <option value="summer">Летняя</option>
              <option value="international">Международная</option>
              <option value="technical">Техническая</option>
            </select>
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
            {loading ? 'Сохранение...' : internship ? 'Сохранить изменения' : 'Создать стажировку'}
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

export default InternshipForm;



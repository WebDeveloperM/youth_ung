import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Grant, grantsAPI } from '../../api';

interface GrantFormProps {
  grant?: Grant | null;
  onClose: () => void;
  onSuccess: () => void;
}

const GrantForm = ({ grant, onClose, onSuccess }: GrantFormProps) => {
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
    amount: '',
    duration: '',
    deadline: new Date().toISOString().split('T')[0],
    status: 'active' as 'active' | 'closed' | 'upcoming',
    category: 'innovation' as 'innovation' | 'ecology' | 'digital' | 'social',
  });

  useEffect(() => {
    if (grant) {
      console.log('📝 ЗАГРУЗКА ГРАНТА ДЛЯ РЕДАКТИРОВАНИЯ:', grant);
      setFormData({
        title_uz: grant.title_uz || '',
        title_ru: grant.title_ru || '',
        title_en: grant.title_en || '',
        short_description_uz: grant.short_description_uz || '',
        short_description_ru: grant.short_description_ru || '',
        short_description_en: grant.short_description_en || '',
        content_uz: grant.content_uz || '<p><br></p>',
        content_ru: grant.content_ru || '<p><br></p>',
        content_en: grant.content_en || '<p><br></p>',
        image: null,
        amount: grant.amount || '',
        duration: grant.duration || '',
        deadline: grant.deadline || new Date().toISOString().split('T')[0],
        status: grant.status || 'active',
        category: grant.category || 'innovation',
      });
      if (grant.image) {
        setImagePreview(grant.image);
      }
    }
  }, [grant]);

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

    if (!formData.amount || !formData.duration || !formData.deadline) {
      toast.error('Илтимос, грант ма\'лумотларини тўлдиринг!');
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading(grant ? 'Сақланмоқда...' : 'Яратилмоқда...');

    try {
      const submitData: any = { ...formData };
      
      // ОТЛАДКА
      console.log('📝 ОТПРАВЛЯЕМ ГРАНТ:', submitData);
      console.log('✅ content_uz:', submitData.content_uz);
      console.log('✅ content_ru:', submitData.content_ru);
      console.log('✅ content_en:', submitData.content_en);
      
      // Если редактирование и нет нового изображения, удаляем поле image
      if (grant && !formData.image) {
        delete submitData.image;
      }

      if (grant) {
        await grantsAPI.update(grant.id, submitData);
        toast.success('Грант муваффақиятли янгиланди! ✅', { id: loadingToast });
      } else {
        const result = await grantsAPI.create(submitData);
        console.log('✅ ГРАНТ СОЗДАН:', result);
        toast.success('Грант муваффақиятли яратилди! 🎉', { id: loadingToast });
      }
      
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('❌ ОШИБКА СОХРАНЕНИЯ ГРАНТА:', error);
      console.error('❌ Response data:', error.response?.data);
      
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
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900">
            {grant ? 'Грантни таҳрирлаш' : 'Янги грант қўшиш'}
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
          </div>

          {/* Grant Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Сумма <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="10,000 USD"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Давомийлик <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="6 месяцев"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Дедлайн <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Статус <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="active">Активный</option>
                <option value="upcoming">Скоро</option>
                <option value="closed">Закрыт</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Категория <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="innovation">Инновации</option>
                <option value="ecology">Экология</option>
                <option value="digital">Цифровые технологии</option>
                <option value="social">Социальные проекты</option>
              </select>
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
                Номи ({activeTab.toUpperCase()}) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData[`title_${activeTab}` as keyof typeof formData] as string}
                onChange={(e) =>
                  setFormData({ ...formData, [`title_${activeTab}`]: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder={`Грант номини киритинг (${activeTab.toUpperCase()})`}
              />
            </div>

            {/* Short Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Қисқача тавсиф ({activeTab.toUpperCase()}) <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={formData[`short_description_${activeTab}` as keyof typeof formData] as string}
                onChange={(e) =>
                  setFormData({ ...formData, [`short_description_${activeTab}`]: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder={`Қисқача тавсиф (${activeTab.toUpperCase()})`}
              />
            </div>

            {/* Content - Rich Text Editor - ОТДЕЛЬНЫЙ ДЛЯ КАЖДОГО ЯЗЫКА! */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тўлиқ тавсиф ({activeTab.toUpperCase()}) <span className="text-red-500">*</span>
              </label>
              
              {/* Отдельный ReactQuill для каждого языка */}
              <div style={{ display: activeTab === 'uz' ? 'block' : 'none' }}>
                <ReactQuill
                  key={`editor-uz-${grant?.id || 'new'}-${formData.content_uz.substring(0, 10)}`}
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
                  key={`editor-ru-${grant?.id || 'new'}-${formData.content_ru.substring(0, 10)}`}
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
                  key={`editor-en-${grant?.id || 'new'}-${formData.content_en.substring(0, 10)}`}
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
            {loading ? 'Сақланмоқда...' : grant ? 'Сақлаш' : 'Қўшиш'}
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

export default GrantForm;


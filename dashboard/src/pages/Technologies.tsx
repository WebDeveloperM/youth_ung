import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { contentAPI } from '../api';
import TechnologyForm from '../components/forms/TechnologyForm';
import { format } from 'date-fns';

interface Technology {
  id: number;
  title_uz: string;
  title_ru: string;
  title_en: string;
  short_description_uz: string;
  short_description_ru: string;
  short_description_en: string;
  content_uz: string;
  content_ru: string;
  content_en: string;
  image?: string;
  category: string;
  date: string;
  views: number;
  likes: number;
  is_published: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

const Technologies = () => {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTechnology, setEditingTechnology] = useState<Technology | null>(null);

  useEffect(() => {
    loadTechnologies();
  }, [searchTerm]);

  const loadTechnologies = async () => {
    try {
      setLoading(true);
      const response = await contentAPI.technologies.getList();
      setTechnologies(Array.isArray(response.data) ? response.data : response.data?.results || []);
    } catch (error) {
      console.error('Ошибка загрузки технологий:', error);
      toast.error('Texnologiyalarni yuklashda xatolik');
      setTechnologies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Texnologiyani o\'chirishga ishonchingiz komilmi?')) return;
    
    const loadingToast = toast.loading('O\'chirilmoqda...');
    try {
      await contentAPI.technologies.delete(id);
      toast.success('Texnologiya muvaffaqiyatli o\'chirildi!', { id: loadingToast });
      loadTechnologies();
    } catch (error) {
      console.error('Ошибка удаления:', error);
      toast.error('Texnologiyani o\'chirishda xatolik!', { id: loadingToast });
    }
  };

  const filteredTechnologies = technologies.filter(tech =>
    tech.title_ru.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tech.title_uz.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Texnologiyalar</h1>
          <p className="text-gray-600 mt-1">Barcha texnologiyalarni boshqarish</p>
        </div>
        <button
          onClick={() => {
            setEditingTechnology(null);
            setIsModalOpen(true);
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Yangi texnologiya</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Texnologiyani qidirish..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sarlavha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategoriya</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sana</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ko'rishlar</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amallar</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTechnologies.map((tech) => (
              <tr key={tech.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tech.id}</td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{tech.title_ru}</div>
                  <div className="text-sm text-gray-500">{tech.title_uz}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tech.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(tech.date), 'dd.MM.yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-gray-400" />
                    <span>{tech.views}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {tech.is_published ? (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Nashr qilingan
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                      Qoralama
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      setEditingTechnology(tech);
                      setIsModalOpen(true);
                    }}
                    className="text-primary-600 hover:text-primary-900 mr-4"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(tech.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredTechnologies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Texnologiyalar topilmadi</p>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {isModalOpen && (
        <TechnologyForm
          technology={editingTechnology}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTechnology(null);
          }}
          onSuccess={() => {
            loadTechnologies();
          }}
        />
      )}
    </div>
  );
};

export default Technologies;


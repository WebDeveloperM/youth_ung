import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { contentAPI } from '../api';
import ResearchForm from '../components/forms/ResearchForm';

interface Research {
  id: number;
  title_uz: string;
  title_ru: string;
  title_en: string;
  category: string;
  status: string;
  authors: string;
  start_date: string;
  end_date: string;
  publications: number;
  citations: number;
  is_published: boolean;
  is_featured: boolean;
}

const Research = () => {
  const [research, setResearch] = useState<Research[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResearch, setEditingResearch] = useState<Research | null>(null);

  useEffect(() => {
    loadResearch();
  }, []);

  const loadResearch = async () => {
    try {
      setLoading(true);
      const response = await contentAPI.research.getList();
      setResearch(Array.isArray(response.data) ? response.data : response.data?.results || []);
    } catch (error) {
      console.error('Ошибка загрузки исследований:', error);
      toast.error('Tadqiqotlarni yuklashda xatolik');
      setResearch([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tadqiqotni o\'chirishga ishonchingiz komilmi?')) return;
    
    try {
      await contentAPI.research.delete(id);
      toast.success('Tadqiqot muvaffaqiyatli o\'chirildi!');
      loadResearch();
    } catch (error) {
      toast.error('Tadqiqotni o\'chirishda xatolik!');
    }
  };

  const filteredResearch = research.filter(res =>
    res.title_ru.toLowerCase().includes(searchTerm.toLowerCase()) ||
    res.title_uz.toLowerCase().includes(searchTerm.toLowerCase()) ||
    res.authors.toLowerCase().includes(searchTerm.toLowerCase())
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tadqiqotlar</h1>
          <p className="text-gray-600 mt-1">Barcha tadqiqotlarni boshqarish</p>
        </div>
        <button
          onClick={() => {
            setEditingResearch(null);
            setIsModalOpen(true);
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Yangi tadqiqot</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Tadqiqotni qidirish..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sarlavha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mualliflar</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategoriya</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nashrlar</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amallar</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredResearch.map((res) => (
              <tr key={res.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{res.id}</td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{res.title_ru}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{res.authors}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{res.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{res.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{res.publications}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      setEditingResearch(res);
                      setIsModalOpen(true);
                    }}
                    className="text-primary-600 hover:text-primary-900 mr-4"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(res.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredResearch.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Tadqiqotlar topilmadi</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <ResearchForm
          research={editingResearch}
          onClose={() => {
            setIsModalOpen(false);
            setEditingResearch(null);
          }}
          onSuccess={() => {
            loadResearch();
          }}
        />
      )}
    </div>
  );
};

export default Research;


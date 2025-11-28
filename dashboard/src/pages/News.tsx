import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, ThumbsUp } from 'lucide-react';
import { newsAPI, News as NewsType, ListResponse } from '../api';
import { format } from 'date-fns';
import NewsForm from '../components/forms/NewsForm';

const News = () => {
  const [news, setNews] = useState<NewsType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsType | null>(null);

  useEffect(() => {
    loadNews();
  }, [currentPage, searchTerm]);

  const loadNews = async () => {
    try {
      setLoading(true);
      const response: ListResponse<NewsType> = await newsAPI.getList({
        page: currentPage,
        page_size: 20,
        search: searchTerm,
        ordering: '-date',
      });
      setNews(response.results);
      setTotalPages(Math.ceil(response.count / 20));
    } catch (error) {
      console.error('Ошибка загрузки новостей:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Новостни ўчиришга ишончингиз комилми?')) return;
    
    try {
      await newsAPI.delete(id);
      loadNews();
    } catch (error) {
      console.error('Ошибка удаления:', error);
      alert('Хатолик юз берди');
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Yangiliklar</h1>
          <p className="text-gray-600 mt-1">Barcha yangiliklarni boshqarish</p>
        </div>
        <button
          onClick={() => {
            setEditingNews(null);
            setIsModalOpen(true);
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Yangi yangilik</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card">
          <h3 className="text-sm font-medium text-gray-600">Jami yangiliklar</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{news.length}</p>
        </div>
        <div className="stat-card">
          <h3 className="text-sm font-medium text-gray-600">Nashr qilingan</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {news.filter(n => n.is_published).length}
          </p>
        </div>
        <div className="stat-card">
          <h3 className="text-sm font-medium text-gray-600">Tanlangan</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {news.filter(n => n.is_featured).length}
          </p>
        </div>
        <div className="stat-card">
          <h3 className="text-sm font-medium text-gray-600">Jami ko'rishlar</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            {news.reduce((sum, n) => sum + n.views, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Yangilik qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* News Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sarlavha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rasm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sana
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ko'rishlar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Likelar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Holat
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amallar
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {news.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    #{item.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 max-w-md truncate">
                      {item.title_ru}
                    </div>
                    {item.is_featured && (
                      <span className="inline-flex mt-1 px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        ⭐ Tanlangan
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title_ru}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(item.date), 'dd.MM.yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Eye className="w-4 h-4 mr-1 text-gray-400" />
                      {item.views.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <ThumbsUp className="w-4 h-4 mr-1 text-gray-400" />
                      {item.likes.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.is_published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {item.is_published ? 'Nashr qilingan' : 'Qoralama'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={async () => {
                        // Загружаем ПОЛНУЮ новость с сервера (включая content)
                        try {
                          const fullNews = await newsAPI.getOne(item.id);
                          console.log('📰 ЗАГРУЖЕНА ПОЛНАЯ НОВОСТЬ:', fullNews);
                          setEditingNews(fullNews);
                          setIsModalOpen(true);
                        } catch (error) {
                          console.error('Ошибка загрузки новости:', error);
                          alert('Ошибка загрузки новости');
                        }
                      }}
                      className="text-primary-600 hover:text-primary-900 mr-4"
                      title="Tahrirlash"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-900"
                      title="O'chirish"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Oldingi
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Keyingi
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">{currentPage}</span> / <span className="font-medium">{totalPages}</span> sahifa
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Oldingi
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Keyingi
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* News Form Modal */}
      {isModalOpen && (
        <NewsForm
          news={editingNews}
          onClose={() => {
            setIsModalOpen(false);
            setEditingNews(null);
          }}
          onSuccess={() => {
            loadNews();
          }}
        />
      )}
    </div>
  );
};

export default News;


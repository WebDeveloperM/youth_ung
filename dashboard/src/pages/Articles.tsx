import { useState, useEffect } from 'react';
import { Search, Eye, Download, Heart, CheckCircle, XCircle, Clock, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { articlesAPI, Article, ListResponse } from '../api';
import { format } from 'date-fns';

const Articles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'revision'>('approve');
  const [adminComment, setAdminComment] = useState('');

  useEffect(() => {
    loadArticles();
  }, [currentPage, searchTerm, statusFilter]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        page_size: 20,
        search: searchTerm,
        ordering: '-created_at',
      };
      
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      const response: ListResponse<Article> = await articlesAPI.getList(params);
      setArticles(response.results);
      setTotalPages(Math.ceil(response.count / 20));
    } catch (error) {
      console.error('Maqolalarni yuklashda xatolik:', error);
      toast.error('Maqolalarni yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number, comment: string = '') => {
    const loadingToast = toast.loading('Tasdiqlanmoqda...');
    try {
      await articlesAPI.approve(id, { admin_comment: comment });
      toast.success('Maqola tasdiqlandi!', { id: loadingToast });
      setShowActionModal(false);
      setAdminComment('');
      loadArticles();
    } catch (error) {
      console.error('Tasdiqlashda xatolik:', error);
      toast.error('Tasdiqlashda xatolik!', { id: loadingToast });
    }
  };

  const handleReject = async (id: number, comment: string) => {
    if (!comment.trim()) {
      toast.error('Rad etish sababini kiriting!');
      return;
    }

    const loadingToast = toast.loading('Rad etilmoqda...');
    try {
      await articlesAPI.reject(id, { admin_comment: comment });
      toast.success('Maqola rad etildi', { id: loadingToast });
      setShowActionModal(false);
      setAdminComment('');
      loadArticles();
    } catch (error) {
      console.error('Rad etishda xatolik:', error);
      toast.error('Rad etishda xatolik!', { id: loadingToast });
    }
  };

  const handleRequestRevision = async (id: number, comment: string) => {
    if (!comment.trim()) {
      toast.error('Qayta ko\'rib chiqish sababini kiriting!');
      return;
    }

    const loadingToast = toast.loading('Yuborilmoqda...');
    try {
      await articlesAPI.requestRevision(id, { admin_comment: comment });
      toast.success('Qayta ko\'rib chiqishga yuborildi', { id: loadingToast });
      setShowActionModal(false);
      setAdminComment('');
      loadArticles();
    } catch (error) {
      console.error('Xatolik:', error);
      toast.error('Xatolik yuz berdi!', { id: loadingToast });
    }
  };

  const openActionModal = (article: Article, type: 'approve' | 'reject' | 'revision') => {
    setSelectedArticle(article);
    setActionType(type);
    setShowActionModal(true);
    setAdminComment('');
  };

  const confirmAction = () => {
    if (!selectedArticle) return;

    switch (actionType) {
      case 'approve':
        handleApprove(selectedArticle.id, adminComment);
        break;
      case 'reject':
        handleReject(selectedArticle.id, adminComment);
        break;
      case 'revision':
        handleRequestRevision(selectedArticle.id, adminComment);
        break;
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { label: 'Kutilmoqda', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      approved: { label: 'Tasdiqlangan', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { label: 'Rad etilgan', color: 'bg-red-100 text-red-800', icon: XCircle },
      revision: { label: 'Qayta ko\'rish', color: 'bg-blue-100 text-blue-800', icon: MessageSquare },
    };
    const item = config[status as keyof typeof config] || config.pending;
    const Icon = item.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${item.color}`}>
        <Icon className="w-3 h-3" />
        {item.label}
      </span>
    );
  };

  const getCategoryLabel = (category: string) => {
    const categories = {
      international: 'Xalqaro',
      local: 'Mahalliy',
      scientific: 'Ilmiy',
      analytical: 'Tahliliy',
      practical: 'Amaliy',
    };
    return categories[category as keyof typeof categories] || category;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const stats = {
    total: articles.length,
    pending: articles.filter(a => a.status === 'pending').length,
    approved: articles.filter(a => a.status === 'approved').length,
    rejected: articles.filter(a => a.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Xalqaro va mahalliy maqolalar</h1>
          <p className="text-gray-600 mt-1">Foydalanuvchilar tomonidan yuklangan maqolalarni boshqarish</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card">
          <h3 className="text-sm font-medium text-gray-600">Jami maqolalar</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
        </div>
        <div className="stat-card">
          <h3 className="text-sm font-medium text-gray-600">Kutilmoqda</h3>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pending}</p>
        </div>
        <div className="stat-card">
          <h3 className="text-sm font-medium text-gray-600">Tasdiqlangan</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.approved}</p>
        </div>
        <div className="stat-card">
          <h3 className="text-sm font-medium text-gray-600">Rad etilgan</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">{stats.rejected}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Maqola qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          >
            <option value="all">Barcha statuslar</option>
            <option value="pending">Kutilmoqda</option>
            <option value="approved">Tasdiqlangan</option>
            <option value="rejected">Rad etilgan</option>
            <option value="revision">Qayta ko'rish</option>
          </select>
        </div>
      </div>

      {/* Articles Table */}
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
                  Muallif
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategoriya
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statistika
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sana
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amallar
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    #{article.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 max-w-md">
                      {article.title_uz || article.title_ru || article.title_en}
                    </div>
                    {article.is_featured && (
                      <span className="inline-flex mt-1 px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        ⭐ Tanlangan
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {article.author.first_name && article.author.last_name
                        ? `${article.author.first_name} ${article.author.last_name}`
                        : article.author.username}
                    </div>
                    <div className="text-xs text-gray-500">{article.author.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                      {getCategoryLabel(article.category)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(article.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" /> {article.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="w-3 h-3" /> {article.downloads}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" /> {article.likes}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(article.created_at), 'dd.MM.yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedArticle(article);
                          setShowDetailModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        title="Ko'rish"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      {article.status === 'pending' && (
                        <>
                          <button
                            onClick={() => openActionModal(article, 'approve')}
                            className="text-green-600 hover:text-green-900"
                            title="Tasdiqlash"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => openActionModal(article, 'reject')}
                            className="text-red-600 hover:text-red-900"
                            title="Rad etish"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => openActionModal(article, 'revision')}
                            className="text-blue-600 hover:text-blue-900"
                            title="Qayta ko'rib chiqish"
                          >
                            <MessageSquare className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
          >
            Oldingi
          </button>
          <span className="px-4 py-2">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
          >
            Keyingi
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedArticle.title_uz || selectedArticle.title_ru || selectedArticle.title_en}
              </h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Cover Image */}
            {selectedArticle.cover_image && (
              <img
                src={selectedArticle.cover_image}
                alt="Cover"
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
            )}

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700">Muallif:</h3>
                <p>
                  {selectedArticle.author.first_name && selectedArticle.author.last_name
                    ? `${selectedArticle.author.first_name} ${selectedArticle.author.last_name}`
                    : selectedArticle.author.username} ({selectedArticle.author.email})
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700">Kategoriya:</h3>
                <p>{getCategoryLabel(selectedArticle.category)}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700">Annotatsiya (UZ):</h3>
                <p className="text-gray-600">{selectedArticle.abstract_uz}</p>
              </div>

              {selectedArticle.abstract_ru && (
                <div>
                  <h3 className="font-semibold text-gray-700">Annotatsiya (RU):</h3>
                  <p className="text-gray-600">{selectedArticle.abstract_ru}</p>
                </div>
              )}

              <div>
                <h3 className="font-semibold text-gray-700">To'liq matn (UZ):</h3>
                <div className="text-gray-600 max-h-60 overflow-y-auto p-4 bg-gray-50 rounded">
                  {selectedArticle.content_uz}
                </div>
              </div>

              {selectedArticle.keywords_uz && (
                <div>
                  <h3 className="font-semibold text-gray-700">Kalit so'zlar:</h3>
                  <p className="text-gray-600">{selectedArticle.keywords_uz}</p>
                </div>
              )}

              {selectedArticle.doi && (
                <div>
                  <h3 className="font-semibold text-gray-700">DOI:</h3>
                  <p className="text-gray-600 font-mono">{selectedArticle.doi}</p>
                </div>
              )}

              {selectedArticle.pdf_file && (
                <div>
                  <h3 className="font-semibold text-gray-700">PDF fayl:</h3>
                  <a
                    href={selectedArticle.pdf_file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    PDF ni yuklash
                  </a>
                </div>
              )}

              {selectedArticle.admin_comment && (
                <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400">
                  <h3 className="font-semibold text-gray-700">Admin izohi:</h3>
                  <p className="text-gray-600">{selectedArticle.admin_comment}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              {selectedArticle.status === 'pending' && (
                <>
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      openActionModal(selectedArticle, 'approve');
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Tasdiqlash
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      openActionModal(selectedArticle, 'revision');
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Qayta ko'rish
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      openActionModal(selectedArticle, 'reject');
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Rad etish
                  </button>
                </>
              )}
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Modal */}
      {showActionModal && selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {actionType === 'approve' && 'Maqolani tasdiqlash'}
              {actionType === 'reject' && 'Maqolani rad etish'}
              {actionType === 'revision' && 'Qayta ko\'rib chiqishga yuborish'}
            </h2>
            
            <div className="mb-4">
              <p className="text-gray-600 mb-2">
                <strong>Maqola:</strong> {selectedArticle.title_uz || selectedArticle.title_ru}
              </p>
              <p className="text-gray-600">
                <strong>Muallif:</strong> {selectedArticle.author.email}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Admin izohi {actionType !== 'approve' && <span className="text-red-500">*</span>}
              </label>
              <textarea
                value={adminComment}
                onChange={(e) => setAdminComment(e.target.value)}
                rows={4}
                placeholder={
                  actionType === 'approve'
                    ? 'Izoh (ixtiyoriy)'
                    : actionType === 'reject'
                    ? 'Rad etish sababi...'
                    : 'Qayta ko\'rib chiqish sababi...'
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowActionModal(false);
                  setAdminComment('');
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Bekor qilish
              </button>
              <button
                onClick={confirmAction}
                className={`px-4 py-2 text-white rounded-lg ${
                  actionType === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : actionType === 'reject'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                Tasdiqlash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Articles;


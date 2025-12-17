import { useState, useEffect } from 'react';
import { Check, X, Search, Trash2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { commentsAPI, Comment, ListResponse } from '../api';

const Comments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModerated, setFilterModerated] = useState<'all' | 'pending' | 'approved'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedComments, setSelectedComments] = useState<number[]>([]);

  useEffect(() => {
    loadComments();
  }, [currentPage, searchTerm, filterModerated]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        page_size: 20,
        search: searchTerm,
        ordering: '-created_at',
      };

      if (filterModerated === 'pending') {
        params.is_moderated = false;
      } else if (filterModerated === 'approved') {
        params.is_moderated = true;
      }

      const response: ListResponse<Comment> = await commentsAPI.getList(params);
      setComments(response.results);
      setTotalPages(Math.ceil(response.count / 20));
    } catch (error) {
      console.error('Ошибка загрузки комментариев:', error);
      toast.error('Комментарияларни юклашда хатолик!');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    const loadingToast = toast.loading('Тасдиқланмоқда...');
    try {
      await commentsAPI.moderate(id, { is_moderated: true });
      toast.success('Комментария тасдиқланди! ✅', { id: loadingToast });
      loadComments();
    } catch (error) {
      console.error('Ошибка одобрения:', error);
      toast.error('Тасдиқлашда хатолик!', { id: loadingToast });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Комментарийни ўчиришга ишончингиз комилми?')) return;
    
    const loadingToast = toast.loading('Ўчирилмоқда...');
    try {
      await commentsAPI.delete(id);
      toast.success('Комментария ўчирилди! ✅', { id: loadingToast });
      loadComments();
    } catch (error) {
      console.error('Ошибка удаления:', error);
      toast.error('Ўчиришда хатолик!', { id: loadingToast });
    }
  };

  const handleBulkAction = async (action: 'approve' | 'delete' | 'spam') => {
    if (selectedComments.length === 0) {
      toast.warning('Камида битта комментарий танланг!');
      return;
    }

    if (action === 'delete' && !window.confirm(`${selectedComments.length} та комментарийни ўчиришга ишончингиз комилми?`)) {
      return;
    }

    const loadingToast = toast.loading(`${selectedComments.length} та комментария ${action === 'approve' ? 'тасдиқланмоқда' : 'ўчирилмоқда'}...`);
    try {
      await commentsAPI.bulkModerate(selectedComments, action);
      toast.success(`${selectedComments.length} та комментария ${action === 'approve' ? 'тасдиқланди' : 'ўчирилди'}! ✅`, { id: loadingToast });
      setSelectedComments([]);
      loadComments();
    } catch (error) {
      console.error('Ошибка массового действия:', error);
      toast.error('Хатолик юз берди!', { id: loadingToast });
    }
  };

  const toggleSelectComment = (id: number) => {
    setSelectedComments(prev =>
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedComments.length === comments.length) {
      setSelectedComments([]);
    } else {
      setSelectedComments(comments.map(c => c.id));
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
          <h1 className="text-3xl font-bold text-gray-900">Kommentariyalar</h1>
          <p className="text-gray-600 mt-1">Barcha kommentariyalarni moderatsiya qilish</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card">
          <h3 className="text-sm font-medium text-gray-600">Jami kommentariyalar</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{comments.length}</p>
        </div>
        <div className="stat-card">
          <h3 className="text-sm font-medium text-gray-600">Tasdiqlangan</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {comments.filter(c => c.is_moderated && !c.is_deleted).length}
          </p>
        </div>
        <div className="stat-card">
          <h3 className="text-sm font-medium text-gray-600">Kutilmoqda</h3>
          <p className="text-3xl font-bold text-orange-600 mt-2">
            {comments.filter(c => !c.is_moderated && !c.is_deleted).length}
          </p>
        </div>
        <div className="stat-card">
          <h3 className="text-sm font-medium text-gray-600">O'chirilgan</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">
            {comments.filter(c => c.is_deleted).length}
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Kommentariya qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilterModerated('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterModerated === 'all'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Barchasi
            </button>
            <button
              onClick={() => setFilterModerated('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterModerated === 'pending'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Kutilmoqda
            </button>
            <button
              onClick={() => setFilterModerated('approved')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterModerated === 'approved'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tasdiqlangan
            </button>
          </div>

          {/* Bulk Actions */}
          {selectedComments.length > 0 && (
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkAction('approve')}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
              >
                <Check className="w-4 h-4" />
                <span>Tasdiqlash ({selectedComments.length})</span>
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>O'chirish ({selectedComments.length})</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Comments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedComments.length === comments.length && comments.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Muallif
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kommentariya
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kontent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sana
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
              {comments.map((comment) => (
                <tr key={comment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedComments.includes(comment.id)}
                      onChange={() => toggleSelectComment(comment.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {comment.author.first_name[0]}{comment.author.last_name[0]}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {comment.author.first_name} {comment.author.last_name}
                        </div>
                        <div className="text-sm text-gray-500">{comment.author.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-md truncate">
                      {comment.content}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      👍 {comment.likes} · 👎 {comment.dislikes}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{comment.content_type}</div>
                    <div className="text-xs text-gray-500">#{comment.object_id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(comment.created_at).toLocaleDateString('uz-UZ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {comment.is_deleted ? (
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        O'chirilgan
                      </span>
                    ) : comment.is_moderated ? (
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Tasdiqlangan
                      </span>
                    ) : (
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                        Kutilmoqda
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {!comment.is_moderated && !comment.is_deleted && (
                      <button
                        onClick={() => handleApprove(comment.id)}
                        className="text-green-600 hover:text-green-900 mr-4"
                        title="Tasdiqlash"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    )}
                    {!comment.is_deleted && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="text-red-600 hover:text-red-900"
                        title="O'chirish"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
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
        )}
      </div>
    </div>
  );
};

export default Comments;


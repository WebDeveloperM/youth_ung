import { useState, useEffect, ReactNode } from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => ReactNode;
  sortable?: boolean;
}

interface ContentListPageProps<T> {
  title: string;
  description: string;
  api: {
    getList: (params?: any) => Promise<{ count: number; results: T[] }>;
    delete: (id: number) => Promise<void>;
  };
  columns: Column<T>[];
  searchPlaceholder?: string;
  onAddNew?: () => void;
  onEdit?: (item: T) => void;
  statsCards?: { label: string; value: number | string; color?: string }[];
  filters?: ReactNode;
}

function ContentListPage<T extends { id: number }>({
  title,
  description,
  api,
  columns,
  searchPlaceholder = 'Поиск...',
  onAddNew,
  onEdit,
  statsCards,
  filters,
}: ContentListPageProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadItems();
  }, [currentPage, searchTerm]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const response = await api.getList({
        page: currentPage,
        page_size: 20,
        search: searchTerm,
      });
      setItems(response.results);
      setTotalPages(Math.ceil(response.count / 20));
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      toast.error('Маълумотларни юклашда хатолик!');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Ўчиришга ишончингиз комилми?')) return;

    const loadingToast = toast.loading('Ўчирилмоқда...');
    try {
      await api.delete(id);
      toast.success(`${title} муваффақиятли ўчирилди! ✅`, { id: loadingToast });
      loadItems();
    } catch (error) {
      console.error('Ошибка удаления:', error);
      toast.error('Ўчиришда хатолик!', { id: loadingToast });
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
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600 mt-1">{description}</p>
        </div>
        {onAddNew && (
          <button
            onClick={onAddNew}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Янги қўшиш</span>
          </button>
        )}
      </div>

      {/* Stats Cards */}
      {statsCards && statsCards.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <div key={index} className="stat-card">
              <h3 className="text-sm font-medium text-gray-600">{stat.label}</h3>
              <p className={`text-3xl font-bold mt-2 ${stat.color || 'text-gray-900'}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
        </div>
        {filters && <div className="mt-4">{filters}</div>}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column.label}
                  </th>
                ))}
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Амаллар
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4">
                      {column.render
                        ? column.render(item)
                        : String((item as any)[column.key] || '-')}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(item)}
                        className="text-primary-600 hover:text-primary-900 mr-4"
                        title="Tahrirlash"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                    )}
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
            <div>
              <p className="text-sm text-gray-700">
                <span className="font-medium">{currentPage}</span> /{' '}
                <span className="font-medium">{totalPages}</span> sahifa
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Олдинги
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Кейинги
                </button>
              </nav>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContentListPage;


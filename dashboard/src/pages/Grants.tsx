import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { FileText } from 'lucide-react';
import { toast } from 'sonner';
import ContentListPage from '../components/common/ContentListPage';
import GrantForm from '../components/forms/GrantForm';
import ContentApplicationsModal from '../components/ContentApplicationsModal';
import { grantsAPI, Grant } from '../api';

const Grants = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGrant, setEditingGrant] = useState<Grant | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [viewingApplications, setViewingApplications] = useState<{ id: number; title: string } | null>(null);

  const columns = [
    {
      key: 'id',
      label: 'ID',
      render: (grant: Grant) => <span className="text-sm text-gray-900">#{grant.id}</span>,
    },
    {
      key: 'title_ru',
      label: 'Номи',
      render: (grant: Grant) => (
        <div className="max-w-md">
          <div className="text-sm font-medium text-gray-900 truncate">{grant.title_ru}</div>
          <div className="text-xs text-gray-500 mt-1">{grant.category}</div>
        </div>
      ),
    },
    {
      key: 'image',
      label: 'Расм',
      render: (grant: Grant) =>
        grant.image ? (
          <img src={grant.image} alt={grant.title_ru} className="w-16 h-16 rounded-lg object-cover" />
        ) : (
          <div className="w-16 h-16 rounded-lg bg-gray-200"></div>
        ),
    },
    {
      key: 'amount',
      label: 'Сумма',
      render: (grant: Grant) => <span className="text-sm font-medium text-green-600">{grant.amount}</span>,
    },
    {
      key: 'deadline',
      label: 'Мудати',
      render: (grant: Grant) => (
        <span className="text-sm text-gray-500">
          {format(new Date(grant.deadline), 'dd.MM.yyyy')}
        </span>
      ),
    },
    {
      key: 'applicants',
      label: 'Аризалар',
      render: (grant: Grant) => (
        <button
          onClick={() => setViewingApplications({ id: grant.id, title: grant.title_ru })}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
        >
          <FileText size={16} />
          <span className="font-bold">{grant.applicants}</span>
        </button>
      ),
    },
    {
      key: 'status',
      label: 'Холат',
      render: (grant: Grant) => {
        const statusColors = {
          active: 'bg-green-100 text-green-800',
          closed: 'bg-red-100 text-red-800',
          upcoming: 'bg-blue-100 text-blue-800',
        };
        const statusLabels = {
          active: 'Фаол',
          closed: 'Ёпилган',
          upcoming: 'Тез орада',
        };
        return (
          <span
            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
              statusColors[grant.status]
            }`}
          >
            {statusLabels[grant.status]}
          </span>
        );
      },
    },
  ];

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    totalApplications: 0,
  });

  const loadStats = async () => {
    try {
      const response = await grantsAPI.getList();
      const grants = response.results;
      setStats({
        total: response.count,
        active: grants.filter(g => g.status === 'active').length,
        totalApplications: grants.reduce((sum, g) => sum + (g.applicants || 0), 0),
      });
    } catch (error) {
      console.error('Статистика юклашда хатолик:', error);
    }
  };

  useEffect(() => {
    loadStats();
  }, [refreshKey]);

  const statsCards = [
    { label: 'Жами грантлар', value: stats.total.toString() },
    { label: 'Фаол', value: stats.active.toString(), color: 'text-green-600' },
    { label: 'Жами аризалар', value: stats.totalApplications.toString(), color: 'text-blue-600' },
  ];

  return (
    <>
      <ContentListPage<Grant>
        key={refreshKey}
        title="Грантлар"
        description="Барча грантларни бошқариш"
        api={grantsAPI}
        columns={columns}
        searchPlaceholder="Грант қидириш..."
        onAddNew={() => {
          setEditingGrant(null);
          setIsModalOpen(true);
        }}
        onEdit={async (grant) => {
          // Загружаем ПОЛНЫЙ грант с сервера (включая content)
          try {
            const fullGrant = await grantsAPI.getOne(grant.id);
            console.log('📰 ЗАГРУЖЕН ПОЛНЫЙ ГРАНТ:', fullGrant);
            setEditingGrant(fullGrant);
            setIsModalOpen(true);
          } catch (error: any) {
            console.error('Ошибка загрузки гранта:', error);
            toast.error('Грантни юклашда хатолик!');
          }
        }}
        statsCards={statsCards}
      />

      {/* Grant Form Modal */}
      {isModalOpen && (
        <GrantForm
          grant={editingGrant}
          onClose={() => {
            setIsModalOpen(false);
            setEditingGrant(null);
          }}
          onSuccess={() => {
            setRefreshKey(prev => prev + 1); // Обновляем таблицу
          }}
        />
      )}

      {/* Applications Modal */}
      {viewingApplications && (
        <ContentApplicationsModal
          contentId={viewingApplications.id}
          contentTitle={viewingApplications.title}
          contentType="grant"
          onClose={() => setViewingApplications(null)}
        />
      )}
    </>
  );
};

export default Grants;


import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { FileText } from 'lucide-react';
import { toast } from 'sonner';
import ContentListPage from '../components/common/ContentListPage';
import InternshipForm from '../components/forms/InternshipForm';
import ContentApplicationsModal from '../components/ContentApplicationsModal';
import { internshipsAPI, Internship } from '../api';

const Internships = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInternship, setEditingInternship] = useState<Internship | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [viewingApplications, setViewingApplications] = useState<{ id: number; title: string } | null>(null);

  const columns = [
    {
      key: 'id',
      label: 'ID',
      render: (internship: Internship) => <span className="text-sm text-gray-900">#{internship.id}</span>,
    },
    {
      key: 'title_ru',
      label: 'Номи',
      render: (internship: Internship) => (
        <div className="max-w-md">
          <div className="text-sm font-medium text-gray-900 truncate">{internship.title_ru}</div>
          <div className="text-xs text-gray-500 mt-1">{internship.category}</div>
        </div>
      ),
    },
    {
      key: 'image',
      label: 'Расм',
      render: (internship: Internship) =>
        internship.image ? (
          <img src={internship.image} alt={internship.title_ru} className="w-16 h-16 rounded-lg object-cover" />
        ) : (
          <div className="w-16 h-16 rounded-lg bg-gray-200"></div>
        ),
    },
    {
      key: 'stipend',
      label: 'Стипендия',
      render: (internship: Internship) => <span className="text-sm font-medium text-green-600">{internship.stipend}</span>,
    },
    {
      key: 'deadline',
      label: 'Мудати',
      render: (internship: Internship) => (
        <span className="text-sm text-gray-500">
          {format(new Date(internship.deadline), 'dd.MM.yyyy')}
        </span>
      ),
    },
    {
      key: 'applicants',
      label: 'Аризалар',
      render: (internship: Internship) => (
        <button
          onClick={() => setViewingApplications({ id: internship.id, title: internship.title_ru })}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
        >
          <FileText size={16} />
          <span className="font-bold">{internship.applicants}</span>
        </button>
      ),
    },
    {
      key: 'positions',
      label: 'Ўринлар',
      render: (internship: Internship) => <span className="text-sm font-medium">{internship.positions}</span>,
    },
    {
      key: 'status',
      label: 'Холат',
      render: (internship: Internship) => {
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
              statusColors[internship.status]
            }`}
          >
            {statusLabels[internship.status]}
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
      const response = await internshipsAPI.getList();
      const internships = response.results;
      setStats({
        total: response.count,
        active: internships.filter(i => i.status === 'active').length,
        totalApplications: internships.reduce((sum, i) => sum + (i.applicants || 0), 0),
      });
    } catch (error) {
      console.error('Статистика юклашда хатолик:', error);
    }
  };

  useEffect(() => {
    loadStats();
  }, [refreshKey]);

  const statsCards = [
    { label: 'Жами стажировкалар', value: stats.total.toString() },
    { label: 'Фаол', value: stats.active.toString(), color: 'text-green-600' },
    { label: 'Жами аризалар', value: stats.totalApplications.toString(), color: 'text-blue-600' },
  ];

  return (
    <>
      <ContentListPage<Internship>
        key={refreshKey}
        title="Стажировкалар"
        description="Барча стажировкаларни бошқариш"
        api={internshipsAPI}
        columns={columns}
        searchPlaceholder="Стажировка қидириш..."
        onAddNew={() => {
          setEditingInternship(null);
          setIsModalOpen(true);
        }}
        onEdit={async (internship) => {
          // Загружаем ПОЛНУЮ стажировку с сервера (включая content)
          try {
            const fullInternship = await internshipsAPI.getOne(internship.id);
            console.log('🎓 ЗАГРУЖЕНА ПОЛНАЯ СТАЖИРОВКА:', fullInternship);
            setEditingInternship(fullInternship);
            setIsModalOpen(true);
          } catch (error: any) {
            console.error('Ошибка загрузки стажировки:', error);
            toast.error('Стажировкани юклашда хатолик!');
          }
        }}
        statsCards={statsCards}
      />

      {/* Internship Form Modal */}
      {isModalOpen && (
        <InternshipForm
          internship={editingInternship}
          onClose={() => {
            setIsModalOpen(false);
            setEditingInternship(null);
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
          contentType="internship"
          onClose={() => setViewingApplications(null)}
        />
      )}
    </>
  );
};

export default Internships;


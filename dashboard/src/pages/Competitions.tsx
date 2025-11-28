import { useState } from 'react';
import { format } from 'date-fns';
import { FileText } from 'lucide-react';
import ContentListPage from '../components/common/ContentListPage';
import CompetitionForm from '../components/forms/CompetitionForm';
import ContentApplicationsModal from '../components/ContentApplicationsModal';
import { competitionsAPI, Competition } from '../api';

const Competitions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompetition, setEditingCompetition] = useState<Competition | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [viewingApplications, setViewingApplications] = useState<{ id: number; title: string } | null>(null);

  const columns = [
    {
      key: 'id',
      label: 'ID',
      render: (competition: Competition) => <span className="text-sm text-gray-900">#{competition.id}</span>,
    },
    {
      key: 'title_ru',
      label: 'Номи',
      render: (competition: Competition) => (
        <div className="max-w-md">
          <div className="text-sm font-medium text-gray-900 truncate">{competition.title_ru}</div>
          <div className="text-xs text-gray-500 mt-1">{competition.category}</div>
        </div>
      ),
    },
    {
      key: 'image',
      label: 'Расм',
      render: (competition: Competition) =>
        competition.image ? (
          <img src={competition.image} alt={competition.title_ru} className="w-16 h-16 rounded-lg object-cover" />
        ) : (
          <div className="w-16 h-16 rounded-lg bg-gray-200"></div>
        ),
    },
    {
      key: 'prize',
      label: 'Мукофот',
      render: (competition: Competition) => <span className="text-sm font-medium text-green-600">{competition.prize}</span>,
    },
    {
      key: 'start_date',
      label: 'Бошланиши',
      render: (competition: Competition) => (
        <span className="text-sm text-gray-500">
          {format(new Date(competition.start_date), 'dd.MM.yyyy')}
        </span>
      ),
    },
    {
      key: 'participants',
      label: 'Иштирокчилар',
      render: (competition: Competition) => (
        <button
          onClick={() => setViewingApplications({ id: competition.id, title: competition.title_ru })}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
        >
          <FileText size={16} />
          <span className="font-bold">{competition.participants}</span>
        </button>
      ),
    },
    {
      key: 'status',
      label: 'Холат',
      render: (competition: Competition) => {
        const statusColors = {
          active: 'bg-green-100 text-green-800',
          closed: 'bg-red-100 text-red-800',
          upcoming: 'bg-blue-100 text-blue-800',
        };
        const statusLabels = {
          active: 'Фаол',
          closed: 'Тугаган',
          upcoming: 'Тез орада',
        };
        return (
          <span
            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
              statusColors[competition.status]
            }`}
          >
            {statusLabels[competition.status]}
          </span>
        );
      },
    },
  ];

  const statsCards = [
    { label: 'Жами конкурслар', value: '0' },
    { label: 'Фаол', value: '0', color: 'text-green-600' },
    { label: 'Жами иштирокчилар', value: '0', color: 'text-blue-600' },
  ];

  return (
    <>
      <ContentListPage<Competition>
        key={refreshKey}
        title="Конкурслар"
        description="Барча конкурсларни бошқариш"
        api={competitionsAPI}
        columns={columns}
        searchPlaceholder="Конкурс қидириш..."
        onAddNew={() => {
          setEditingCompetition(null);
          setIsModalOpen(true);
        }}
        onEdit={async (competition) => {
          // Загружаем ПОЛНЫЙ конкурс с сервера (включая content)
          try {
            const fullCompetition = await competitionsAPI.getOne(competition.id);
            console.log('🏆 ЗАГРУЖЕН ПОЛНЫЙ КОНКУРС:', fullCompetition);
            setEditingCompetition(fullCompetition);
            setIsModalOpen(true);
          } catch (error) {
            console.error('Ошибка загрузки конкурса:', error);
            alert('Ошибка загрузки конкурса');
          }
        }}
        statsCards={statsCards}
      />

      {/* Competition Form Modal */}
      {isModalOpen && (
        <CompetitionForm
          competition={editingCompetition}
          onClose={() => {
            setIsModalOpen(false);
            setEditingCompetition(null);
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
          contentType="competition"
          onClose={() => setViewingApplications(null)}
        />
      )}
    </>
  );
};

export default Competitions;


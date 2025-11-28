import { useState } from 'react';
import { format } from 'date-fns';
import { FileText } from 'lucide-react';
import ContentListPage from '../components/common/ContentListPage';
import ScholarshipForm from '../components/forms/ScholarshipForm';
import ContentApplicationsModal from '../components/ContentApplicationsModal';
import { scholarshipsAPI, Scholarship } from '../api';

const Scholarships = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState<Scholarship | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [viewingApplications, setViewingApplications] = useState<{ id: number; title: string } | null>(null);

  const columns = [
    {
      key: 'id',
      label: 'ID',
      render: (scholarship: Scholarship) => <span className="text-sm text-gray-900">#{scholarship.id}</span>,
    },
    {
      key: 'title_ru',
      label: 'Номи',
      render: (scholarship: Scholarship) => (
        <div className="max-w-md">
          <div className="text-sm font-medium text-gray-900 truncate">{scholarship.title_ru}</div>
          <div className="text-xs text-gray-500 mt-1">{scholarship.category}</div>
        </div>
      ),
    },
    {
      key: 'image',
      label: 'Расм',
      render: (scholarship: Scholarship) =>
        scholarship.image ? (
          <img src={scholarship.image} alt={scholarship.title_ru} className="w-16 h-16 rounded-lg object-cover" />
        ) : (
          <div className="w-16 h-16 rounded-lg bg-gray-200"></div>
        ),
    },
    {
      key: 'amount',
      label: 'Сумма',
      render: (scholarship: Scholarship) => <span className="text-sm font-medium text-green-600">{scholarship.amount}</span>,
    },
    {
      key: 'deadline',
      label: 'Мудати',
      render: (scholarship: Scholarship) => (
        <span className="text-sm text-gray-500">
          {format(new Date(scholarship.deadline), 'dd.MM.yyyy')}
        </span>
      ),
    },
    {
      key: 'recipients',
      label: 'Аризалар',
      render: (scholarship: Scholarship) => (
        <button
          onClick={() => setViewingApplications({ id: scholarship.id, title: scholarship.title_ru })}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
        >
          <FileText size={16} />
          <span className="font-bold">{scholarship.recipients}</span>
        </button>
      ),
    },
    {
      key: 'status',
      label: 'Холат',
      render: (scholarship: Scholarship) => {
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
              statusColors[scholarship.status]
            }`}
          >
            {statusLabels[scholarship.status]}
          </span>
        );
      },
    },
  ];

  const statsCards = [
    { label: 'Жами стипендиялар', value: '0' },
    { label: 'Фаол', value: '0', color: 'text-green-600' },
    { label: 'Жами аризалар', value: '0', color: 'text-blue-600' },
  ];

  return (
    <>
      <ContentListPage<Scholarship>
        key={refreshKey}
        title="Стипендиялар"
        description="Барча стипендияларни бошқариш"
        api={scholarshipsAPI}
        columns={columns}
        searchPlaceholder="Стипендия қидириш..."
        onAddNew={() => {
          setEditingScholarship(null);
          setIsModalOpen(true);
        }}
        onEdit={async (scholarship) => {
          // Загружаем ПОЛНУЮ стипендию с сервера (включая content)
          try {
            const fullScholarship = await scholarshipsAPI.getOne(scholarship.id);
            console.log('📰 ЗАГРУЖЕНА ПОЛНАЯ СТИПЕНДИЯ:', fullScholarship);
            setEditingScholarship(fullScholarship);
            setIsModalOpen(true);
          } catch (error) {
            console.error('Ошибка загрузки стипендии:', error);
            alert('Ошибка загрузки стипендии');
          }
        }}
        statsCards={statsCards}
      />

      {/* Scholarship Form Modal */}
      {isModalOpen && (
        <ScholarshipForm
          scholarship={editingScholarship}
          onClose={() => {
            setIsModalOpen(false);
            setEditingScholarship(null);
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
          contentType="scholarship"
          onClose={() => setViewingApplications(null)}
        />
      )}
    </>
  );
};

export default Scholarships;


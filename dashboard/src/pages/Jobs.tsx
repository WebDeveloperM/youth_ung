import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { FileText } from 'lucide-react';
import { toast } from 'sonner';
import ContentListPage from '../components/common/ContentListPage';
import JobForm from '../components/forms/JobForm';
import ContentApplicationsModal from '../components/ContentApplicationsModal';
import { jobsAPI, Job } from '../api';

const Jobs = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [viewingApplications, setViewingApplications] = useState<{ id: number; title: string } | null>(null);

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    totalApplications: 0,
  });

  const loadStats = async () => {
    try {
      const response = await jobsAPI.getList();
      const jobs = response.results;
      setStats({
        total: response.count,
        active: jobs.filter(j => j.status === 'active').length,
        totalApplications: jobs.reduce((sum, j) => sum + (j.applicants || 0), 0),
      });
    } catch (error) {
      console.error('Статистика юклашда хатолик:', error);
    }
  };

  useEffect(() => {
    loadStats();
  }, [refreshKey]);

  const columns = [
    {
      key: 'id',
      label: 'ID',
      render: (job: Job) => <span className="text-sm text-gray-900">#{job.id}</span>,
    },
    {
      key: 'title_ru',
      label: 'Лавозим',
      render: (job: Job) => (
        <div className="max-w-md">
          <div className="text-sm font-medium text-gray-900 truncate">{job.title_ru}</div>
          <div className="text-xs text-gray-500 mt-1">{job.category}</div>
        </div>
      ),
    },
    {
      key: 'image',
      label: 'Расм',
      render: (job: Job) =>
        job.image ? (
          <img src={job.image} alt={job.title_ru} className="w-16 h-16 rounded-lg object-cover" />
        ) : (
          <div className="w-16 h-16 rounded-lg bg-gray-200"></div>
        ),
    },
    {
      key: 'salary',
      label: 'Маош',
      render: (job: Job) => <span className="text-sm font-medium text-green-600">{job.salary}</span>,
    },
    {
      key: 'location',
      label: 'Жойлашув',
      render: (job: Job) => <span className="text-sm text-gray-700">{job.location}</span>,
    },
    {
      key: 'deadline',
      label: 'Мудати',
      render: (job: Job) => (
        <span className="text-sm text-gray-500">
          {format(new Date(job.deadline), 'dd.MM.yyyy')}
        </span>
      ),
    },
    {
      key: 'applicants',
      label: 'Аризалар',
      render: (job: Job) => (
        <button
          onClick={() => setViewingApplications({ id: job.id, title: job.title_ru })}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
        >
          <FileText size={16} />
          <span className="font-bold">{job.applicants}</span>
        </button>
      ),
    },
    {
      key: 'positions',
      label: 'Ўринлар',
      render: (job: Job) => <span className="text-sm font-medium">{job.positions}</span>,
    },
    {
      key: 'status',
      label: 'Холат',
      render: (job: Job) => {
        const statusColors = {
          active: 'bg-green-100 text-green-800',
          closed: 'bg-red-100 text-red-800',
          paused: 'bg-yellow-100 text-yellow-800',
        };
        const statusLabels = {
          active: 'Фаол',
          closed: 'Ёпилган',
          paused: 'Тўхтатилган',
        };
        return (
          <span
            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
              statusColors[job.status]
            }`}
          >
            {statusLabels[job.status]}
          </span>
        );
      },
    },
  ];

  const statsCards = [
    { label: 'Жами вакансиялар', value: stats.total.toString() },
    { label: 'Фаол', value: stats.active.toString(), color: 'text-green-600' },
    { label: 'Жами аризалар', value: stats.totalApplications.toString(), color: 'text-blue-600' },
  ];

  return (
    <>
      <ContentListPage<Job>
        key={refreshKey}
        title="Вакансиялар"
        description="Барча вакансияларни бошқариш"
        api={jobsAPI}
        columns={columns}
        searchPlaceholder="Вакансия қидириш..."
        onAddNew={() => {
          setEditingJob(null);
          setIsModalOpen(true);
        }}
        onEdit={async (job) => {
          // Загружаем ПОЛНУЮ вакансию с сервера (включая content)
          try {
            const fullJob = await jobsAPI.getOne(job.id);
            console.log('💼 ЗАГРУЖЕНА ПОЛНАЯ ВАКАНСИЯ:', fullJob);
            setEditingJob(fullJob);
            setIsModalOpen(true);
          } catch (error: any) {
            console.error('Ошибка загрузки вакансии:', error);
            toast.error('Вакансияни юклашда хатолик!');
          }
        }}
        statsCards={statsCards}
      />

      {/* Job Form Modal */}
      {isModalOpen && (
        <JobForm
          job={editingJob}
          onClose={() => {
            setIsModalOpen(false);
            setEditingJob(null);
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
          contentType="job"
          onClose={() => setViewingApplications(null)}
        />
      )}
    </>
  );
};

export default Jobs;


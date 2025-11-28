import { format } from 'date-fns';
import ContentListPage from '../components/common/ContentListPage';
import { jobsAPI, Job } from '../api';

const Jobs = () => {
  const columns = [
    { key: 'id', label: 'ID', render: (item: Job) => `#${item.id}` },
    { key: 'title_ru', label: 'Лавозим' },
    { key: 'salary', label: 'Маош', render: (item: Job) => <span className="text-green-600 font-medium">{item.salary}</span> },
    { key: 'location', label: 'Жойлашув' },
    { key: 'deadline', label: 'Мудати', render: (item: Job) => format(new Date(item.deadline), 'dd.MM.yyyy') },
    { key: 'applicants', label: 'Аризалар', render: (item: Job) => <span className="font-bold text-blue-600">{item.applicants}</span> },
    {
      key: 'status',
      label: 'Холат',
      render: (item: Job) => (
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
          item.status === 'active' ? 'bg-green-100 text-green-800' : 
          item.status === 'paused' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {item.status === 'active' ? 'Фаол' : item.status === 'paused' ? 'Тўхтатилган' : 'Ёпилган'}
        </span>
      ),
    },
  ];

  return (
    <ContentListPage<Job>
      title="Вакансиялар"
      description="Барча вакансияларни бошқариш"
      api={jobsAPI}
      columns={columns}
      searchPlaceholder="Вакансия қидириш..."
    />
  );
};

export default Jobs;


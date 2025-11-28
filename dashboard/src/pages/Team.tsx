import ContentListPage from '../components/common/ContentListPage';
import { teamAPI, TeamMember } from '../api';

const Team = () => {
  const columns = [
    { key: 'order', label: 'Тартиб', render: (item: TeamMember) => <span className="font-bold">{item.order}</span> },
    {
      key: 'photo',
      label: 'Фото',
      render: (item: TeamMember) =>
        item.photo ? (
          <img src={item.photo} alt={item.name_ru} className="w-12 h-12 rounded-full object-cover" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
            {item.name_ru.split(' ').map(n => n[0]).join('')}
          </div>
        ),
    },
    {
      key: 'name_ru',
      label: 'Исм',
      render: (item: TeamMember) => (
        <div>
          <div className="font-medium">{item.name_ru}</div>
          <div className="text-sm text-gray-500">{item.position_ru}</div>
        </div>
      ),
    },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Телефон' },
    {
      key: 'is_active',
      label: 'Холат',
      render: (item: TeamMember) => (
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
          item.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {item.is_active ? 'Фаол' : 'Нофаол'}
        </span>
      ),
    },
  ];

  return (
    <ContentListPage<TeamMember>
      title="Жамоа"
      description="Барча жамоа аъзоларини бошқариш"
      api={teamAPI}
      columns={columns}
      searchPlaceholder="Жамоа аъзоси қидириш..."
    />
  );
};

export default Team;


import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import ContentListPage from '../components/common/ContentListPage';
import TeamForm from '../components/forms/TeamForm';
import { teamAPI, TeamMember } from '../api';

const Team = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
  });

  const loadStats = async () => {
    try {
      const response = await teamAPI.getList();
      const members = response.results;
      setStats({
        total: response.count,
        active: members.filter(m => m.is_active).length,
      });
    } catch (error) {
      console.error('Статистика юклашда хатолик:', error);
    }
  };

  useEffect(() => {
    loadStats();
  }, [refreshKey]);

  const categoryLabels: Record<string, string> = {
    'leadership': 'Руководство',
    'innovation': 'Инновации',
    'education': 'Образование',
    'media': 'Медиа',
    'sports': 'Спорт',
  };

  const columns = [
    { key: 'order', label: 'Тартиб', render: (item: TeamMember) => <span className="font-bold">{item.order}</span> },
    {
      key: 'photo',
      label: 'Фото',
      render: (item: TeamMember) =>
        item.photo ? (
          <img src={item.photo} alt={item.name_ru} className="w-12 h-12 rounded-full object-cover" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
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
    {
      key: 'category',
      label: 'Категория',
      render: (item: TeamMember) => (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
          {categoryLabels[item.category] || item.category}
        </span>
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

  const statsCards = [
    { label: 'Жами аъзолар', value: stats.total.toString() },
    { label: 'Фаол', value: stats.active.toString(), color: 'text-green-600' },
  ];

  return (
    <>
      <ContentListPage<TeamMember>
        key={refreshKey}
        title="Жамоа"
        description="Барча жамоа аъзоларини бошқариш"
        api={teamAPI}
        columns={columns}
        searchPlaceholder="Жамоа аъзоси қидириш..."
        onAddNew={() => {
          setEditingMember(null);
          setIsModalOpen(true);
        }}
        onEdit={async (member) => {
          const loadingToast = toast.loading('Жамоа аъзоси юкланмоқда...');
          try {
            const fullMember = await teamAPI.getOne(member.id);
            console.log('👤 ЗАГРУЖЕН ПОЛНЫЙ ЧЛЕН КОМАНДЫ:', fullMember);
            setEditingMember(fullMember);
            setIsModalOpen(true);
            toast.dismiss(loadingToast);
          } catch (error: any) {
            console.error('Ошибка загрузки члена команды:', error);
            toast.error('Жамоа аъзосини юклашда хатолик!', { id: loadingToast });
          }
        }}
        statsCards={statsCards}
      />

      {/* Team Form Modal */}
      {isModalOpen && (
        <TeamForm
          member={editingMember}
          onClose={() => {
            setIsModalOpen(false);
            setEditingMember(null);
          }}
          onSuccess={() => {
            setRefreshKey(prev => prev + 1);
          }}
        />
      )}
    </>
  );
};

export default Team;



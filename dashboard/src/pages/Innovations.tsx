import { useState } from 'react';
import { format } from 'date-fns';
import { Eye, ThumbsUp } from 'lucide-react';
import ContentListPage from '../components/common/ContentListPage';
import InnovationForm from '../components/forms/InnovationForm';
import { innovationsAPI, Innovation } from '../api';

const Innovations = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInnovation, setEditingInnovation] = useState<Innovation | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const columns = [
    { key: 'id', label: 'ID', render: (item: Innovation) => `#${item.id}` },
    {
      key: 'title_ru',
      label: 'Номи',
      render: (item: Innovation) => (
        <div>
          <div className="font-medium">{item.title_ru}</div>
          {item.is_featured && <span className="text-xs text-yellow-600">⭐ Танланган</span>}
        </div>
      ),
    },
    {
      key: 'image',
      label: 'Расм',
      render: (item: Innovation) =>
        item.image ? (
          <img src={item.image} alt={item.title_ru} className="w-16 h-16 rounded-lg object-cover" />
        ) : (
          <div className="w-16 h-16 rounded-lg bg-gray-200"></div>
        ),
    },
    { key: 'category', label: 'Категория' },
    { key: 'date', label: 'Сана', render: (item: Innovation) => format(new Date(item.date), 'dd.MM.yyyy') },
    {
      key: 'views',
      label: 'Кўришлар',
      render: (item: Innovation) => (
        <div className="flex items-center">
          <Eye className="w-4 h-4 mr-1 text-gray-400" />
          {item.views}
        </div>
      ),
    },
    {
      key: 'likes',
      label: 'Лайклар',
      render: (item: Innovation) => (
        <div className="flex items-center">
          <ThumbsUp className="w-4 h-4 mr-1 text-gray-400" />
          {item.likes}
        </div>
      ),
    },
  ];

  const statsCards = [
    { label: 'Жами инновациялар', value: '0' },
    { label: 'Танланган', value: '0', color: 'text-yellow-600' },
    { label: 'Жами кўришлар', value: '0', color: 'text-blue-600' },
  ];

  return (
    <>
      <ContentListPage<Innovation>
        key={refreshKey}
        title="Инновациялар"
        description="Барча инновацияларни бошқариш"
        api={innovationsAPI}
        columns={columns}
        searchPlaceholder="Инновация қидириш..."
        onAddNew={() => {
          setEditingInnovation(null);
          setIsModalOpen(true);
        }}
        onEdit={async (innovation) => {
          // Загружаем ПОЛНУЮ инновацию с сервера (включая content)
          try {
            const fullInnovation = await innovationsAPI.getOne(innovation.id);
            console.log('💡 ЗАГРУЖЕНА ПОЛНАЯ ИННОВАЦИЯ:', fullInnovation);
            setEditingInnovation(fullInnovation);
            setIsModalOpen(true);
          } catch (error) {
            console.error('Ошибка загрузки инновации:', error);
            alert('Ошибка загрузки инновации');
          }
        }}
        statsCards={statsCards}
      />

      {/* Innovation Form Modal */}
      {isModalOpen && (
        <InnovationForm
          innovation={editingInnovation}
          onClose={() => {
            setIsModalOpen(false);
            setEditingInnovation(null);
          }}
          onSuccess={() => {
            setRefreshKey(prev => prev + 1); // Обновляем таблицу
          }}
        />
      )}
    </>
  );
};

export default Innovations;


import { useState, useEffect } from 'react';
import { Users, FolderKanban, FileText, TrendingUp, Eye, MessageCircle } from 'lucide-react';
import StatCard from '../components/StatCard';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { analyticsAPI, DashboardStats, DailyVisitor, PageAnalytics } from '../api';

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [dailyVisitors, setDailyVisitors] = useState<DailyVisitor[]>([]);
  const [pageAnalytics, setPageAnalytics] = useState<PageAnalytics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, visitorsData, pagesData] = await Promise.all([
        analyticsAPI.getDashboardStats(),
        analyticsAPI.getVisitorsStats({ period: 'month' }),
        analyticsAPI.getPageAnalytics({ period: 'month' }),
      ]);
      
      setStats(statsData);
      setDailyVisitors(visitorsData.daily);
      setPageAnalytics(pagesData);
    } catch (error) {
      console.error('Ошибка загрузки данных dashboard:', error);
      // Fallback to mock data if API fails
      import('../data/mockData').then(({ mockDashboardStats, mockDailyVisitors, mockPageAnalytics }) => {
        setStats(mockDashboardStats as any);
        setDailyVisitors(mockDailyVisitors);
        setPageAnalytics(mockPageAnalytics);
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  // Data for pie chart - распределение контента по типам
  const distributionData = [
    { name: 'Yangiliklar', value: stats.total_news, color: '#3b82f6' },
    { name: 'Grantlar', value: stats.total_grants, color: '#10b981' },
    { name: 'Stipendiyalar', value: stats.total_scholarships, color: '#f59e0b' },
    { name: 'Konkurslar', value: stats.total_competitions, color: '#8b5cf6' },
    { name: 'Innovatsiyalar', value: stats.total_innovations, color: '#ec4899' },
    { name: 'Stajirovkalar', value: stats.total_internships, color: '#06b6d4' },
    { name: 'Vakansiyalar', value: stats.total_jobs, color: '#84cc16' },
  ];

  // Top pages for bar chart
  const topPages = pageAnalytics.slice(0, 5).map(page => ({
    name: page.page.length > 15 ? page.page.substring(0, 15) + '...' : page.page,
    'Ko\'rishlar': page.views,
    'Tashrif': page.uniqueVisitors
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Boshqaruv Paneli</h1>
        <p className="text-gray-600 mt-1">Tizim statistikasi va ko'rsatkichlar</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Foydalanuvchilar"
          value={stats.total_users}
          icon={Users}
          trend={stats.user_growth}
          color="blue"
        />
        <StatCard
          title="Jami Kontentlar"
          value={stats.total_news + stats.total_innovations + stats.total_grants + stats.total_scholarships + stats.total_competitions + stats.total_internships + stats.total_jobs}
          icon={FolderKanban}
          trend={stats.content_growth}
          color="green"
        />
        <StatCard
          title="Ko'rishlar"
          value={stats.total_views}
          icon={Eye}
          trend={stats.views_growth}
          color="purple"
        />
        <StatCard
          title="Kommentariyalar"
          value={stats.total_comments}
          icon={MessageCircle}
          trend={0}
          color="orange"
        />
      </div>

      {/* Content Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Yangiliklar</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total_news}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Grantlar</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total_grants}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Stipendiyalar</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total_scholarships}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Konkurslar</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total_competitions}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Innovatsiyalar</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total_innovations}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Stajirovkalar</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total_internships}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Vakansiyalar</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total_jobs}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Kutilmoqda moderatsiya</p>
          <p className="text-2xl font-bold text-orange-600">{stats.pending_comments}</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Visitors Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Kunlik tashrif statistikasi
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dailyVisitors}>
              <defs>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).getDate().toString()}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="visitors" 
                stroke="#3b82f6" 
                strokeWidth={2}
                fill="url(#colorVisitors)"
                name="Tashrif"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Distribution Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Ma'lumotlar taqsimoti
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages Bar Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Eng ko'p ko'rilgan sahifalar
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topPages}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="koʻrishlar" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="tashrif" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Page Views Trend */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Sahifa ko'rishlari tendensiyasi
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyVisitors}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).getDate().toString()}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="pageViews" 
                stroke="#8b5cf6" 
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', r: 5 }}
                name="Sahifa ko'rishlari"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            So'nggi faoliyat
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sahifa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ko'rishlar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Noyob tashrif
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  O'rtacha vaqt
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pageAnalytics.map((page, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{page.page}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{page.views.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{page.uniqueVisitors.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{page.avgDuration}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


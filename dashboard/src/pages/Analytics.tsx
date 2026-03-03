import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer 
} from 'recharts';
import { TrendingUp, Eye, Users, Clock } from 'lucide-react';
import { mockDailyVisitors, mockPageAnalytics } from '../data/mockDATA';

const Analytics = () => {
  // Calculate totals
  const totalViews = mockPageAnalytics.reduce((sum, page) => sum + page.views, 0);
  const totalVisitors = mockPageAnalytics.reduce((sum, page) => sum + page.uniqueVisitors, 0);
  const avgDuration = '4:32';

  // Data for comparison chart
  const pageComparisonData = mockPageAnalytics.map(page => ({
    name: page.page.length > 15 ? page.page.substring(0, 15) + '...' : page.page,
    'Koʻrishlar': page.views,
    'Tashrif': page.uniqueVisitors
  }));

  // Weekly data (simplified from daily)
  const weeklyData = mockDailyVisitors.slice(-7).map(day => ({
    kun: new Date(day.date).toLocaleDateString('uz-UZ', { weekday: 'short' }),
    tashrif: day.visitors,
    sahifa: day.pageViews
  }));

  // Hourly data (mock)
  const hourlyData = [
    { soat: '00:00', foydalanuvchilar: 120 },
    { soat: '04:00', foydalanuvchilar: 80 },
    { soat: '08:00', foydalanuvchilar: 450 },
    { soat: '12:00', foydalanuvchilar: 680 },
    { soat: '16:00', foydalanuvchilar: 850 },
    { soat: '20:00', foydalanuvchilar: 520 },
    { soat: '23:59', foydalanuvchilar: 250 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analitika</h1>
        <p className="text-gray-600 mt-1">Batafsil statistika va tahlil</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Jami ko'rishlar</h3>
            <Eye className="w-5 h-5 text-primary-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalViews.toLocaleString()}</p>
          <p className="text-sm text-green-600 mt-2">+18.2% o'sish</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Noyob tashrif</h3>
            <Users className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalVisitors.toLocaleString()}</p>
          <p className="text-sm text-green-600 mt-2">+12.5% o'sish</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">O'rtacha vaqt</h3>
            <Clock className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{avgDuration}</p>
          <p className="text-sm text-red-600 mt-2">-2.3% kamayish</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">O'sish sur'ati</h3>
            <TrendingUp className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">23.4%</p>
          <p className="text-sm text-green-600 mt-2">Yuqori o'sish</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Trend */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Haftalik tendensiya
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="colorTashrif" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSahifa" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="kun" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="tashrif" 
                stroke="#3b82f6" 
                strokeWidth={2}
                fill="url(#colorTashrif)"
                name="Tashrif"
              />
              <Area 
                type="monotone" 
                dataKey="sahifa" 
                stroke="#10b981" 
                strokeWidth={2}
                fill="url(#colorSahifa)"
                name="Sahifa ko'rishlari"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Hourly Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Soatlik faollik
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="soat" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="foydalanuvchilar" 
                stroke="#8b5cf6" 
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', r: 5 }}
                name="Foydalanuvchilar"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Page Comparison Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Sahifalar taqqoslash
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={pageComparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar dataKey="Koʻrishlar" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            <Bar dataKey="Tashrif" fill="#10b981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            Batafsil sahifa statistikasi
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Konversiya
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockPageAnalytics.map((page, index) => (
                <tr key={page.page} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-green-600">
                      {((page.uniqueVisitors / page.views) * 100).toFixed(1)}%
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
          <h3 className="text-sm font-medium opacity-90 mb-2">Eng ko'p ko'rilgan</h3>
          <p className="text-2xl font-bold">{mockPageAnalytics[0].page}</p>
          <p className="text-sm opacity-90 mt-2">{mockPageAnalytics[0].views.toLocaleString()} ko'rish</p>
        </div>

        <div className="bg-linear-to-br from-green-500 to-green-600 rounded-xl shadow-sm p-6 text-white">
          <h3 className="text-sm font-medium opacity-90 mb-2">Eng uzun vaqt</h3>
          <p className="text-2xl font-bold">{mockPageAnalytics[2].page}</p>
          <p className="text-sm opacity-90 mt-2">{mockPageAnalytics[2].avgDuration} o'rtacha</p>
        </div>

        <div className="bg-linear-to-br from-purple-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
          <h3 className="text-sm font-medium opacity-90 mb-2">Eng yuqori konversiya</h3>
          <p className="text-2xl font-bold">{mockPageAnalytics[3].page}</p>
          <p className="text-sm opacity-90 mt-2">
            {((mockPageAnalytics[3].uniqueVisitors / mockPageAnalytics[3].views) * 100).toFixed(1)}% konversiya
          </p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;


import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Menu, 
  X,
  Bell,
  Settings,
  LogOut,
  Newspaper,
  Award,
  GraduationCap,
  Trophy,
  Lightbulb,
  Briefcase,
  Target,
  UsersRound,
  MessageCircle,
  FileText,
  Shield,
  BookOpen
} from 'lucide-react';
import { authAPI } from '../api';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const location = useLocation();

  // Загружаем текущего пользователя при монтировании
  useEffect(() => {
    const loadUser = async () => {
      try {
        console.log('🔄 ЗАГРУЖАЕМ ПОЛЬЗОВАТЕЛЯ...');
        const user = await authAPI.getMe();
        console.log('👤 ==========================================');
        console.log('👤 ПОЛНЫЙ ОБЪЕКТ ПОЛЬЗОВАТЕЛЯ:', user);
        console.log('👤 ==========================================');
        console.log('🆔 ID:', user.id);
        console.log('📧 Email:', user.email);
        console.log('👔 Role:', user.role);
        console.log('🛡️ is_superuser:', user.is_superuser);
        console.log('🔑 allowed_menus:', user.allowed_menus);
        console.log('📊 allowed_menus length:', user.allowed_menus?.length);
        console.log('👤 ==========================================');
        setCurrentUser(user);
      } catch (error) {
        console.error('❌ ОШИБКА ЗАГРУЗКИ ПОЛЬЗОВАТЕЛЯ:', error);
      }
    };

    loadUser();
  }, []);

  const allNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, key: 'dashboard' },
    { name: 'Yangiliklar', href: '/news', icon: Newspaper, key: 'news' },
    { name: 'Grantlar', href: '/grants', icon: Award, key: 'grants' },
    { name: 'Stipendiyalar', href: '/scholarships', icon: GraduationCap, key: 'scholarships' },
    { name: 'Konkurslar', href: '/competitions', icon: Trophy, key: 'competitions' },
    { name: 'Innovatsiyalar', href: '/innovations', icon: Lightbulb, key: 'innovations' },
    { name: 'Stajirovkalar', href: '/internships', icon: Target, key: 'internships' },
    { name: 'Vakansiyalar', href: '/jobs', icon: Briefcase, key: 'jobs' },
    { name: 'Jamoa', href: '/team', icon: UsersRound, key: 'team' },
    { name: 'Maqolalar', href: '/articles', icon: BookOpen, key: 'articles' },
    { name: 'Foydalanuvchilar', href: '/users', icon: Users, key: 'users' },
    { name: 'Kommentariyalar', href: '/comments', icon: MessageCircle, key: 'comments' },
    { name: 'Arizalar', href: '/applications', icon: FileText, key: 'applications' },
    { name: 'Analitika', href: '/analytics', icon: BarChart3, key: 'analytics' },
    { name: 'Administratorlar', href: '/administrators', icon: Shield, key: 'admins' },
  ];

  // Фильтруем меню на основе прав пользователя
  console.log('🔍 ========== ПРОВЕРКА ПРАВ ДОСТУПА ==========');
  console.log('🔍 currentUser существует:', !!currentUser);
  console.log('🔍 is_superuser:', currentUser?.is_superuser);
  console.log('🔍 role:', currentUser?.role);
  console.log('🔍 allowed_menus:', currentUser?.allowed_menus);
  console.log('🔍 allowed_menus is array:', Array.isArray(currentUser?.allowed_menus));
  console.log('🔍 allowed_menus length:', currentUser?.allowed_menus?.length);
  
  const showAllMenus = 
    currentUser?.is_superuser === true || // Superuser видит всё
    (currentUser?.role === 'Admin' && (!currentUser?.allowed_menus || currentUser?.allowed_menus?.length === 0)); // Admin без ограничений видит всё
  
  console.log('🔍 ПОКАЗАТЬ ВСЕ МЕНЮ?', showAllMenus);
  console.log('🔍 ПРОВЕРКА: is_superuser === true?', currentUser?.is_superuser === true);
  console.log('🔍 ПРОВЕРКА: role === Admin?', currentUser?.role === 'Admin');
  console.log('🔍 ПРОВЕРКА: allowed_menus пустой?', !currentUser?.allowed_menus || currentUser?.allowed_menus?.length === 0);
  
  const navigation = showAllMenus
    ? allNavigation // Показываем все меню
    : allNavigation.filter(item => {
        const hasAccess = currentUser?.allowed_menus?.includes(item.key) || item.key === 'dashboard';
        console.log(`🔍 Меню "${item.name}" (${item.key}): ${hasAccess ? '✅' : '❌'}`);
        return hasAccess;
      });
  
  console.log('🔍 ИТОГО ДОСТУПНЫХ МЕНЮ:', navigation.length, 'из', allNavigation.length);
  console.log('🔍 ==========================================');

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-white border-r border-gray-200 w-64`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-primary-50 text-primary-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                {currentUser?.first_name?.[0]}{currentUser?.last_name?.[0]}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {currentUser?.first_name} {currentUser?.last_name}
                </p>
                <p className="text-xs text-gray-500">{currentUser?.email}</p>
                <p className="text-xs text-indigo-600 font-semibold">{currentUser?.role}</p>
              </div>
            </div>
            <button 
              onClick={() => {
                if (window.confirm('Чиқишга ишончингиз комилми?')) {
                  localStorage.removeItem('admin_token');
                  window.location.href = '/login';
                }
              }}
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Chiqish</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`${sidebarOpen ? 'lg:ml-64' : ''} transition-all duration-300`}>
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 rounded-lg hover:bg-gray-100">
                <Bell className="w-6 h-6 text-gray-700" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <Settings className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;


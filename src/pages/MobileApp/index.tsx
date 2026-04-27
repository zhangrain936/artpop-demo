import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Home, Compass, User as UserIcon, Briefcase, ShoppingBag, Grid, MessageSquare } from 'lucide-react';
import { MobileHome } from './MobileHome';
import { MobileDetail } from './MobileDetail';
import { MobileProfile } from './MobileProfile';
import { MobileWorkspace } from './MobileWorkspace';
import { MobileCart } from './MobileCart';
import { MobileCategory } from './MobileCategory';
import { MobileAuthor } from './MobileAuthor';
import { MobileFavorites } from './MobileFavorites';
import { MobileSearch } from './MobileSearch';
import { MobileVerify } from './MobileVerify';
import { MobileEditProfile } from './MobileEditProfile';
import { MobileWithdraw } from './MobileWithdraw';
import { MobileSellerOrders } from './MobileSellerOrders';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    const container = document.getElementById('mobile-scroll-container');
    if (container) container.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function MobileApp() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (loading) return <div className="h-screen w-full flex items-center justify-center bg-zinc-100 min-h-screen">加载中...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;

  const isSeller = user.role === 'seller';

  const _tabs = isSeller ? [
    { path: '/', icon: Home, label: '首页' },
    { path: '/messages', icon: MessageSquare, label: '消息' },
    { path: '/workspace', icon: Briefcase, label: '工作台' },
    { path: '/profile', icon: UserIcon, label: '我的' },
  ] : [
    { path: '/', icon: Home, label: '首页' },
    { path: '/category', icon: Compass, label: '分类' },
    { path: '/cart', icon: ShoppingBag, label: '购物车' },
    { path: '/profile', icon: UserIcon, label: '我的' },
  ];

  const hideTabBarRoutes = ['/product', '/search', '/profile/edit', '/profile/verify', '/profile/withdraw', '/profile/orders'];
  const showTabBar = !hideTabBarRoutes.some(route => location.pathname.startsWith(route));

  return (
    <div className="min-h-screen bg-zinc-200 flex items-center justify-center sm:p-4 font-sans">
      <div className="w-full min-h-screen sm:min-h-0 sm:w-[414px] sm:h-[896px] bg-white sm:rounded-[3rem] sm:shadow-2xl overflow-hidden relative flex flex-col sm:border-[8px] sm:border-zinc-900">
        
        <ScrollToTop />
        <div id="mobile-scroll-container" className="flex-1 overflow-y-auto bg-white pb-16 no-scrollbar relative">
          <Routes>
            <Route path="/" element={<MobileHome />} />
            <Route path="/search" element={<MobileSearch />} />
            <Route path="/cart" element={<MobileCart />} />
            <Route path="/category" element={<MobileCategory />} />
            <Route path="/messages" element={<div className="p-8 text-center mt-20 text-zinc-400">消息功能开发中...</div>} />
            <Route path="/product/:id" element={<MobileDetail />} />
            <Route path="/author/:id" element={<MobileAuthor />} />
            <Route path="/favorites" element={<MobileFavorites />} />
            <Route path="/profile" element={<MobileProfile />} />
            <Route path="/profile/edit" element={<MobileEditProfile />} />
            <Route path="/profile/verify" element={<MobileVerify />} />
            <Route path="/profile/withdraw" element={<MobileWithdraw />} />
            <Route path="/profile/orders" element={<MobileSellerOrders />} />
            {isSeller && <Route path="/workspace" element={<MobileWorkspace />} />}
          </Routes>
        </div>

        {showTabBar && (
          <div className="absolute bottom-0 left-0 right-0 h-[83px] pb-5 bg-white/95 backdrop-blur-xl border-t border-zinc-100/80 flex items-center justify-around px-2 z-50">
            {_tabs.map(tab => {
              const active = location.pathname === tab.path || (tab.path !== '/' && location.pathname.startsWith(tab.path));
              const Icon = tab.icon;
              return (
                 <button
                   key={tab.path}
                   onClick={() => navigate(tab.path)}
                   className="flex flex-col items-center justify-center w-full h-full pt-1 space-y-1 relative"
                 >
                   <div className={`transition-all duration-300 ease-out flex items-center justify-center w-12 h-8 rounded-full ${active ? 'bg-zinc-100 text-zinc-900 scale-100' : 'text-zinc-400 scale-95'}`}>
                      <Icon size={active ? 22 : 24} strokeWidth={active && tab.icon !== UserIcon ? 2.5 : 1.75} fill={active && tab.icon === UserIcon ? 'currentColor' : 'none'} />
                   </div>
                   <span className={`text-[10px] tracking-wide transition-colors ${active ? 'font-bold text-zinc-900' : 'font-medium text-zinc-400'}`}>
                     {tab.label}
                   </span>
                 </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

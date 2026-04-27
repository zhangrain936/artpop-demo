import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, ChevronRight, CheckCircle2, AlertCircle, Edit3 } from 'lucide-react';

export function MobileProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAlert = (msg: string) => {
    alert(msg);
  };

  if (!user) return null;

  const isSeller = user.role === 'seller';

  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      {/* Header Profile Cover */}
      <div className="bg-white pt-16 pb-8 px-6 shadow-sm relative">
        <button 
          onClick={() => navigate('/profile/edit')}
          className="absolute top-16 right-6 text-zinc-500 hover:text-zinc-900 border border-zinc-200 bg-white shadow-sm p-2 rounded-full transition active:scale-95"
        >
          <Edit3 size={16} />
        </button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">{user.name}</h1>
            <div className="flex items-center gap-1 mt-2">
              {isSeller ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-zinc-900 text-white font-medium">
                  <CheckCircle2 size={12} />
                  认证创作者
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-zinc-100 text-zinc-500 font-medium tracking-wide">
                  普通用户
                </span>
              )}
            </div>
          </div>
          <div className="w-16 h-16 bg-zinc-200 rounded-full flex items-center justify-center text-xl font-bold text-zinc-400">
            {user.name[0]}
          </div>
        </div>

        {isSeller && (
          <div className="mt-8 flex gap-8">
            <div className="cursor-pointer" onClick={() => navigate('/profile/withdraw')}>
              <div className="text-2xl font-bold text-zinc-900">¥{user.balance || 0}</div>
              <div className="text-[10px] text-zinc-400 mt-1 uppercase tracking-wider font-medium">可提现收益</div>
            </div>
            <div className="cursor-pointer" onClick={() => navigate('/profile/orders')}>
              <div className="text-2xl font-bold text-zinc-900">0</div>
              <div className="text-[10px] text-zinc-400 mt-1 uppercase tracking-wider font-medium">待发货订单</div>
            </div>
          </div>
        )}
      </div>

      {/* Menu List */}
      <div className="mt-4 px-4 space-y-3">
        {!isSeller && (
          <div className="bg-zinc-900 text-white rounded-2xl p-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold flex items-center gap-2">
                <AlertCircle size={16} className="text-yellow-400" />
                申请入驻创作者
              </div>
              <div className="text-xs text-zinc-400 mt-1">提交学生证件，开启画作变现</div>
            </div>
            <button 
              onClick={() => navigate('/profile/verify')}
              className="px-4 py-1.5 bg-white text-zinc-900 rounded-full text-xs font-bold active:scale-95 transition"
            >
              去认证
            </button>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden mt-6">
          <MenuItem title="我的订单" onClick={() => handleAlert('您还没有相关订单记录')} />
          <MenuItem title={isSeller ? "我的作品" : "我的收藏"} onClick={isSeller ? () => navigate('/workspace') : () => navigate('/favorites')} />
          <MenuItem title="收货地址" onClick={() => handleAlert('收货地址管理开发中')} />
          <MenuItem title="联系客服" onClick={() => handleAlert('客服工作时间：工作日 9:00 - 18:00\n微信客服：ArtPop_Support')} />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden mt-6">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-4 text-red-500 hover:bg-zinc-50 transition"
          >
            <span className="text-sm font-medium">退出登录</span>
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function MenuItem({ title, onClick }: { title: string, onClick?: () => void }) {
  return (
    <div onClick={onClick} className="flex items-center justify-between p-4 border-b border-zinc-50 last:border-0 active:bg-zinc-50 transition cursor-pointer">
      <span className="text-sm font-medium text-zinc-700">{title}</span>
      <ChevronRight size={16} className="text-zinc-300" />
    </div>
  );
}

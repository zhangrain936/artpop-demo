import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, LayoutDashboard, Image as ImageIcon, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

export function AdminApp() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />; // Only admin allowed

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-row">
      <div className="w-64 bg-zinc-900 border-r border-zinc-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-zinc-800">
          <span className="text-white font-bold tracking-widest uppercase">Admin Panel</span>
        </div>
        <div className="flex-1 py-6 px-4 space-y-1">
          <button onClick={() => navigate('/admin')} className="w-full text-left px-4 py-2.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition flex items-center gap-3">
             <LayoutDashboard size={18} /> 大盘看板
          </button>
          <button onClick={() => navigate('/admin/products')} className="w-full text-left px-4 py-2.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition flex items-center gap-3">
             <ImageIcon size={18} /> 内容审核 <span className="ml-auto bg-red-500 text-[10px] text-white px-1.5 py-0.5 rounded-full font-bold">1</span>
          </button>
          <button onClick={() => navigate('/admin/users')} className="w-full text-left px-4 py-2.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition flex items-center gap-3">
             <Users size={18} /> 学生资质认证
          </button>
        </div>
        <div className="p-4 border-t border-zinc-800">
          <button onClick={() => { logout(); navigate('/login'); }} className="w-full px-4 py-2 text-zinc-400 hover:text-white flex items-center gap-2 transition rounded hover:bg-zinc-800">
             <LogOut size={16}/> 退出登录
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto bg-zinc-50">
         <div className="p-10">
           <Routes>
             <Route path="/" element={<Dashboard />} />
             <Route path="/products" element={<ProductAudit />} />
             <Route path="/users" element={<UserAudit />} />
           </Routes>
         </div>
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-zinc-900">大盘数据 (Mock)</h2>
      <div className="grid grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200">
            <div className="text-zinc-500 text-sm font-medium">总上架画作</div>
            <div className="text-3xl font-bold mt-2">12</div>
         </div>
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200">
            <div className="text-zinc-500 text-sm font-medium">认证学生数</div>
            <div className="text-3xl font-bold mt-2">48</div>
         </div>
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200">
            <div className="text-zinc-500 text-sm font-medium">促成总交易额</div>
            <div className="text-3xl font-bold mt-2">¥ 8,420</div>
         </div>
      </div>
    </div>
  );
}

function ProductAudit() {
  const [products, setProducts] = useState<any[]>([]);

  const loadProducts = () => {
    fetch('/api/admin/products').then(res => res.json()).then(setProducts);
  };

  useEffect(() => { loadProducts(); }, []);

  const handleReview = async (id: string, status: string) => {
    await fetch(`/api/admin/products/${id}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    loadProducts();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-zinc-900 mb-6">内容审核队列 (先审后发)</h2>
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 border-b border-zinc-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-zinc-600">作品名</th>
              <th className="px-6 py-4 font-semibold text-zinc-600">作者 / 价格</th>
              <th className="px-6 py-4 font-semibold text-zinc-600">状态</th>
              <th className="px-6 py-4 font-semibold text-zinc-600">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {products.map(p => (
              <tr key={p.id}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={p.imageUrl} className="w-10 h-10 object-cover rounded shadow-sm" />
                    <span className="font-medium text-zinc-900">{p.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                   <div className="text-sm font-medium">{p.sellerName}</div>
                   <div className="text-xs text-zinc-400">¥{p.price}</div>
                </td>
                <td className="px-6 py-4">
                  {p.status === 'pending' && <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold">待审核</span>}
                  {p.status === 'approved' && <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold">已上架</span>}
                  {p.status === 'rejected' && <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">已驳回</span>}
                </td>
                <td className="px-6 py-4">
                  {p.status === 'pending' && (
                    <div className="flex gap-2">
                      <button onClick={() => handleReview(p.id, 'approved')} className="bg-zinc-900 text-white px-3 py-1.5 rounded text-xs font-medium cursor-pointer">通过</button>
                      <button onClick={() => handleReview(p.id, 'rejected')} className="bg-zinc-100 text-zinc-700 hover:bg-red-100 hover:text-red-600 px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition">驳回</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UserAudit() {
  const [users, setUsers] = useState<any[]>([]);

  const loadUsers = () => {
    fetch('/api/admin/users').then(res => res.json()).then(setUsers);
  };
  useEffect(() => { loadUsers(); }, []);

  const handleCertify = async (id: string) => {
    await fetch(`/api/admin/users/${id}/certify`, { method: 'POST' });
    loadUsers();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-zinc-900 mb-6">入驻创作者 (学生资质)</h2>
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 border-b border-zinc-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-zinc-600">用户信息</th>
              <th className="px-6 py-4 font-semibold text-zinc-600">当前角色</th>
              <th className="px-6 py-4 font-semibold text-zinc-600">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {users.map(u => (
              <tr key={u.id}>
                <td className="px-6 py-4 font-medium text-zinc-900">{u.name} <span className="text-zinc-500 font-normal">({u.email})</span></td>
                <td className="px-6 py-4">
                  {u.verifiedStudent ? (
                     <span className="bg-indigo-100 text-indigo-700 px-2 py-1 flex w-fit items-center gap-1 rounded text-xs font-bold">已认证创作者</span>
                  ) : (
                     <span className="bg-zinc-100 text-zinc-600 px-2 py-1 rounded text-xs font-bold w-fit">普通用户</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {!u.verifiedStudent && (
                    <button onClick={() => handleCertify(u.id)} className="border border-zinc-300 hover:border-zinc-900 text-zinc-800 px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition">
                      通过资质审核
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

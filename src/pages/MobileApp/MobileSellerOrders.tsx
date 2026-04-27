import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Package } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function MobileSellerOrders() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);

  // Mock fetching orders. In a real app we would call an API.
  useEffect(() => {
    // For demo purposes, we will just set a mock order
    setOrders([
      {
        id: 'ORDER-123456',
        createdAt: Date.now() - 3600000, // 1 hour ago
        status: 'pending', // pending | shipped | refunded
        product: {
           title: '央美毕业季 | 原创油画作品《星夜》',
           price: 8800,
           imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&auto=format&fit=crop&q=60'
        },
        user: { name: 'ArtLover***' },
        shipping: 'free' // 'free' | 'collect'
      }
    ]);
  }, [token]);

  const handleAction = (id: string, action: string) => {
    if (action === 'ship') {
       const confirm = window.confirm('确认已发货吗？');
       if (confirm) {
           setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'shipped' } : o));
           alert('已标记为发货');
       }
    } else if (action === 'refund') {
       const confirm = window.confirm('确认退款并取消此订单吗？');
       if (confirm) {
           setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'refunded' } : o));
           alert('已退款');
       }
    }
  };

  return (
    <div className="bg-zinc-50 h-full flex flex-col pb-24">
      <div className="flex items-center p-4 bg-white border-b border-zinc-100 sticky top-0 z-50">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-zinc-700">
           <ChevronLeft size={24} />
        </button>
        <span className="font-bold flex-1 text-center -ml-6 text-zinc-900">订单管理</span>
      </div>

      <div className="px-5 py-6 space-y-4">
        {orders.length === 0 && (
           <div className="text-center text-zinc-400 py-10 text-sm">暂无订单</div>
        )}
        
        {orders.map(order => (
           <div key={order.id} className="bg-white rounded-2xl p-4 shadow-sm border border-zinc-100">
              <div className="flex justify-between items-center mb-3">
                 <span className="text-[10px] text-zinc-400 font-mono tracking-wider">{order.id}</span>
                 <span className={`text-[11px] font-bold px-2 py-0.5 rounded-sm ${
                    order.status === 'pending' ? 'bg-indigo-50 text-indigo-600' :
                    order.status === 'shipped' ? 'bg-emerald-50 text-emerald-600' :
                    'bg-zinc-100 text-zinc-500'
                 }`}>
                    {order.status === 'pending' ? '待发货' : order.status === 'shipped' ? '已发货' : '已退款'}
                 </span>
              </div>
              <div className="flex gap-3 mb-4">
                 <div className="w-16 h-16 bg-zinc-100 rounded-lg overflow-hidden shrink-0">
                    <img src={order.product.imageUrl} className="w-full h-full object-cover" />
                 </div>
                 <div className="flex-1 flex flex-col justify-between py-0.5">
                    <h3 className="text-sm font-bold text-zinc-900 line-clamp-1">{order.product.title}</h3>
                    <div className="text-xs text-zinc-500">买家: {order.user.name}</div>
                    <div className="text-red-600 font-bold text-sm tracking-tight">
                       ¥{order.product.price} <span className="text-[10px] text-zinc-400 ml-1 font-normal">({order.shipping === 'free' ? '包邮' : '买家付邮'})</span>
                    </div>
                 </div>
              </div>
              
              {order.status === 'pending' && (
                 <div className="flex gap-2 justify-end pt-3 border-t border-zinc-50">
                    <button 
                      onClick={() => handleAction(order.id, 'refund')}
                      className="px-4 py-1.5 rounded-full border border-zinc-200 text-zinc-600 text-xs font-bold active:bg-zinc-50 transition"
                    >
                       退款
                    </button>
                    <button 
                      onClick={() => handleAction(order.id, 'ship')}
                      className="px-4 py-1.5 rounded-full bg-zinc-900 text-white text-xs font-bold active:scale-95 transition flex items-center gap-1.5"
                    >
                       <Package size={14} /> 去发货
                    </button>
                 </div>
              )}
           </div>
        ))}
      </div>
    </div>
  );
}

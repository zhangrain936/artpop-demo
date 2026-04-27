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
    <div className="bg-[#F8F8F8] h-full flex flex-col pb-24">
      <div className="flex items-center p-4 bg-white border-b border-[#E0E0E0] sticky top-0 z-50">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-[#666666]">
           <ChevronLeft size={24} />
        </button>
        <span className="font-bold flex-1 text-center -ml-6 text-[#1A1A1A]">订单管理</span>
      </div>

      <div className="px-5 py-6 space-y-4">
        {orders.length === 0 && (
           <div className="text-center text-[#999999] py-10 text-sm">暂无订单</div>
        )}
        
        {orders.map(order => (
           <div key={order.id} className="bg-white rounded-2xl p-4 shadow-sm border border-[#E0E0E0]">
              <div className="flex justify-between items-center mb-3">
                 <span className="text-[10px] text-[#999999] font-mono tracking-wider">{order.id}</span>
                 <span className={`text-[11px] font-bold px-2 py-0.5 rounded-sm ${
                    order.status === 'pending' ? 'bg-[#F8F8F8] text-[#1A1A1A] border border-[#E0E0E0]' :
                    order.status === 'shipped' ? 'bg-[#F8F8F8] text-[#666666] border border-[#E0E0E0]' :
                    'bg-[#F8F8F8] text-[#999999] border border-[#E0E0E0]'
                 }`}>
                    {order.status === 'pending' ? '待发货' : order.status === 'shipped' ? '已发货' : '已退款'}
                 </span>
              </div>
              <div className="flex gap-3 mb-4">
                 <div className="w-16 h-16 bg-[#F8F8F8] rounded-lg overflow-hidden shrink-0">
                    <img src={order.product.imageUrl} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect width='100%25' height='100%25' fill='%23e0e0e0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14px' fill='%23999999'%3EArtPop%3C/text%3E%3C/svg%3E" }}/>
                 </div>
                 <div className="flex-1 flex flex-col justify-between py-0.5">
                    <h3 className="text-sm font-bold text-[#1A1A1A] line-clamp-1">{order.product.title}</h3>
                    <div className="text-xs text-[#666666]">买家: {order.user.name}</div>
                    <div className="text-[#1A1A1A] font-bold text-sm tracking-tight">
                       <span className="text-[#C5A059] font-bold">¥{order.product.price}</span> <span className="text-[10px] text-[#999999] ml-1 font-normal">({order.shipping === 'free' ? '包邮' : '买家付邮'})</span>
                    </div>
                 </div>
              </div>
              
              {order.status === 'pending' && (
                 <div className="flex gap-2 justify-end pt-3 border-t border-[#F8F8F8]">
                    <button 
                      onClick={() => handleAction(order.id, 'refund')}
                      className="px-4 py-1.5 rounded-full border border-[#E0E0E0] text-[#666666] text-xs font-bold active:bg-[#F8F8F8] transition"
                    >
                       退款
                    </button>
                    <button 
                      onClick={() => handleAction(order.id, 'ship')}
                      className="px-4 py-1.5 rounded-full bg-[#1A1A1A] text-white text-xs font-bold active:scale-95 transition flex items-center gap-1.5"
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

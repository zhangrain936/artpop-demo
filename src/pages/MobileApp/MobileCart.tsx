import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Trash2, ShoppingCart as CartIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function MobileCart() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const navigate = useNavigate();

  const loadCart = () => {
    fetch('/api/cart', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        setCartItems(data);
        setLoading(false);
      });
  };

  useEffect(() => { loadCart(); }, [token]);

  const handleRemove = async (id: string) => {
    await fetch(`/api/cart/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    loadCart();
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.product.price, 0);

  if (loading) return <div className="p-8 text-center text-zinc-400">加载中...</div>;

  return (
    <div className="flex flex-col min-h-full bg-zinc-50 relative pb-20">
      <div className="pt-12 pb-4 px-5 bg-white sticky top-0 z-10">
        <h1 className="text-xl font-bold tracking-tight text-zinc-900">购物车</h1>
      </div>

      <div className="flex-1 p-4 space-y-4">
        {cartItems.map((item) => (
          <div key={item.id} className="bg-white p-3 rounded-2xl flex gap-3 shadow-sm border border-zinc-100">
            <div 
              className="w-20 h-24 bg-zinc-100 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer"
              onClick={() => navigate(`/product/${item.product.id}`)}
            >
              <img src={item.product.imageUrl} className="w-full h-full object-cover" alt="" onError={(e) => { e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect width='100%25' height='100%25' fill='%23f4f4f5'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14px' fill='%23a1a1aa'%3E暂无图片%3C/text%3E%3C/svg%3E" }} />
            </div>
            <div className="flex-1 flex flex-col justify-between py-1">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 line-clamp-2">{item.product.title}</h3>
                <p className="text-xs text-zinc-500 mt-1">{item.product.sellerName}</p>
                <div className="text-xs text-zinc-400 mt-0.5">{item.product.material} / {item.product.size}</div>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-sm font-bold text-red-600">¥{item.product.price}</span>
                <button 
                  onClick={() => handleRemove(item.id)}
                  className="text-zinc-400 hover:text-red-500 transition p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {cartItems.length === 0 && (
          <div className="text-center py-24 flex flex-col items-center">
            <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mb-4 text-zinc-300">
              <CartIcon size={32} />
            </div>
            <p className="text-zinc-500 text-sm">购物车空空如也，去选购一些佳作吧</p>
            <button 
              onClick={() => navigate('/')} 
              className="mt-6 px-6 py-2 border border-zinc-300 text-zinc-700 rounded-full text-sm font-medium hover:bg-zinc-50"
            >
              去逛逛
            </button>
          </div>
        )}
      </div>

      {/* Checkout Bar */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-16 sm:absolute sm:bottom-16 left-0 right-0 bg-white border-t border-zinc-100 px-4 py-3 flex items-center justify-between z-40">
           <div className="flex flex-col">
             <span className="text-xs text-zinc-500">合计 (不含运费)</span>
             <span className="text-lg font-bold text-red-600">¥{totalPrice.toLocaleString()}</span>
           </div>
           <button 
             onClick={() => {
               alert('🎉 结算成功！订单已生成。');
               cartItems.forEach(item => handleRemove(item.id));
               setTimeout(() => navigate('/profile'), 500);
             }}
             className="px-8 py-2.5 bg-zinc-900 text-white font-medium text-sm rounded-full active:scale-95 transition"
           >
             结算 ({cartItems.length})
           </button>
        </div>
      )}
    </div>
  );
}

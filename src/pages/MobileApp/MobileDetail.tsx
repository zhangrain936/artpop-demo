import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, MessageCircle, ShoppingBag, ShoppingCart, Heart, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function MobileDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [product, setProduct] = useState<any>(null);

  const [isAddingCart, setIsAddingCart] = useState(false);
  const [showCartSuccess, setShowCartSuccess] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data));
      
    if (token) {
       fetch('/api/favorites', {
         headers: { Authorization: `Bearer ${token}` }
       })
       .then(res => res.json())
       .then(favs => {
          if (favs.find((f: any) => f.id === id)) {
             setIsFavorited(true);
          }
       });
    }
  }, [id, token]);

  const handleAddToCart = async () => {
    if (!token) return navigate('/login');
    setIsAddingCart(true);
    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ productId: product.id })
      });
      setShowCartSuccess(true);
      setTimeout(() => setShowCartSuccess(false), 2000);
    } finally {
      setIsAddingCart(false);
    }
  };

  const handleFavorite = async () => {
    if (!token) return navigate('/login');
    if (favoriteLoading) return;
    setFavoriteLoading(true);
    try {
      await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ productId: product.id })
      });
      setIsFavorited(!isFavorited);
    } finally {
      setFavoriteLoading(false);
    }
  };

  if (!product) return <div className="p-8 text-center text-zinc-400">加载中...</div>;

  const isBuyer = user?.role === 'buyer';

  return (
    <div className="bg-zinc-50 min-h-screen pb-24 font-sans relative">
      {/* Back Button */}
      <div 
        className="fixed top-10 left-4 z-50 w-8 h-8 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer shadow-sm"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft size={20} className="text-white relative pr-[2px]" />
      </div>

      {/* Image Gallery */}
      <div className="w-full h-[60vh] bg-zinc-200">
          <img 
            src={product.imageUrl} 
            className="w-full h-full object-cover" 
            alt={product.title} 
            onError={(e) => { e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect width='100%25' height='100%25' fill='%23f4f4f5'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14px' fill='%23a1a1aa'%3E暂无图片%3C/text%3E%3C/svg%3E" }}
          />
      </div>

      {/* Info Section - Price & Title */}
      <div className="bg-white p-4">
        <div className="flex items-end justify-between">
          <span className="text-2xl font-bold text-red-600">¥{product.price}</span>
          <div className="flex gap-4">
            <button onClick={handleFavorite} className={`flex flex-col items-center transition ${isFavorited ? 'text-red-500' : 'text-zinc-500 hover:text-red-500'}`}>
               <Heart size={20} fill={isFavorited ? 'currentColor' : 'none'} className={isFavorited ? 'scale-110 transition-transform' : 'transition-transform'} />
               <span className="text-[10px] mt-1">{isFavorited ? '已收藏' : '收藏'}</span>
            </button>
          </div>
        </div>
        
        <h1 className="text-lg font-bold text-zinc-900 mt-3">{product.title}</h1>
        <p className="text-xs text-zinc-500 mt-1 pb-2">
           {product.material || '综合材料'} · {product.size || '未知尺寸'} · {product.year || '2026创作'}
        </p>
      </div>

      <div className="mt-2 bg-white px-4 py-3 text-sm text-zinc-700 flex justify-between items-center border-b border-zinc-100">
        <div className="flex items-center gap-3">
           <span className="text-zinc-400">发货</span>
           <span>发货地 | 运费: {product.shipping === 'free' ? '包邮' : '顺丰到付'}</span>
        </div>
      </div>
      <div className="bg-white px-4 py-3 text-sm text-zinc-700 flex justify-between items-center">
        <div className="flex items-center gap-3">
           <span className="text-zinc-400">保障</span>
           <span className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-red-500"></span>官方认证</span>
           <span className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-red-500"></span>安全交易</span>
        </div>
      </div>

      {/* Author minimalist card */}
      <div className="mt-2 flex items-center justify-between p-4 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center font-bold text-zinc-400">
            {product.sellerName?.[0] || '佚'}
          </div>
          <div>
            <div className="font-bold text-sm text-zinc-900">{product.sellerName || '佚名'}</div>
            <div className="text-xs text-zinc-500 mt-0.5">实名认证艺术生</div>
          </div>
        </div>
        <button onClick={() => navigate(`/author/${product.sellerId}`)} className="px-4 py-1.5 border border-zinc-300 rounded-full text-xs font-medium text-zinc-700 active:bg-zinc-50">
          进主页
        </button>
      </div>

      {/* Details */}
      <div className="mt-2 bg-white p-4">
        <h2 className="text-sm border-b border-zinc-100 pb-2 font-bold text-zinc-800 mb-3 block">作品详情</h2>
        <p className="text-sm leading-relaxed text-zinc-600 whitespace-pre-wrap">
          {product.desc}
        </p>
        <img 
          src={product.imageUrl} 
          className="w-full mt-4 rounded-lg shadow-sm" 
          alt="" 
          onError={(e) => { e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect width='100%25' height='100%25' fill='%23f4f4f5'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14px' fill='%23a1a1aa'%3E暂无图片%3C/text%3E%3C/svg%3E" }}
        />
      </div>

      {/* Comments Section */}
      <div className="mt-2 bg-white p-4">
        <div className="flex items-center justify-between mb-4 border-b border-zinc-100 pb-2">
          <h2 className="text-sm font-bold text-zinc-800">全部评论 (0)</h2>
        </div>
        <div className="text-center py-6 text-zinc-400 text-sm">
          还没有人发言，来说两句吧~
        </div>
        <div className="flex mt-2">
          <div className="w-6 h-6 rounded-full bg-zinc-200 mr-3 flex-shrink-0"></div>
          <div className="flex-1 bg-zinc-100 rounded-full px-4 py-2 text-xs text-zinc-500">
            留下你的评论...
          </div>
        </div>
      </div>

      {/* Hide IAA for Buyers */}
      {user?.role === 'seller' && (
        <div className="mt-4 p-4 mx-4 border border-blue-100 bg-blue-50/50 rounded-2xl flex items-center justify-between">
           <div>
             <div className="text-sm font-medium text-blue-900">🎁 创作者扶持广告位</div>
             <div className="text-xs text-blue-700/70 mt-1">观看广告增加作品曝光</div>
           </div>
           <button className="px-3 py-1.5 bg-blue-600 text-white rounded-full text-xs font-medium shadow-sm transition">
             去观看
           </button>
        </div>
      )}

      {/* Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-2 sm:absolute sm:bottom-0 bg-white border-t border-zinc-200 flex items-center z-40 pb-safe">
        <div className="flex gap-4 px-4 pl-2 pr-6 border-r border-zinc-100">
          <button className="flex flex-col items-center justify-center text-zinc-600 hover:text-zinc-900">
             <MessageCircle size={20} strokeWidth={1.5} />
             <span className="text-[10px] mt-1 font-medium">客服</span>
          </button>
          <button onClick={() => navigate('/cart')} className="flex flex-col items-center justify-center text-zinc-600 hover:text-zinc-900 overflow-visible relative">
             <ShoppingCart size={20} strokeWidth={1.5} />
             <span className="text-[10px] mt-1 font-medium">购物车</span>
             {showCartSuccess && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap animate-in fade-in slide-in-from-bottom-2">
                  +1
                </div>
             )}
          </button>
        </div>
        <div className="flex-1 flex gap-2 pl-4 pr-2 py-1">
          <button 
            onClick={handleAddToCart} 
            disabled={isAddingCart}
            className={`flex-1 h-10 ${showCartSuccess ? 'bg-green-500' : 'bg-[#ffb03a]'} text-white rounded-full font-bold text-sm active:scale-95 transition flex items-center justify-center shadow-md`}
          >
            {isAddingCart ? '加入中...' : showCartSuccess ? '已加入' : '加入购物车'}
          </button>
          <button className="flex-1 h-10 bg-red-600 text-white rounded-full font-bold text-sm active:scale-95 transition flex items-center justify-center shadow-md">
            立即购买
          </button>
        </div>
      </div>
    </div>
  );
}

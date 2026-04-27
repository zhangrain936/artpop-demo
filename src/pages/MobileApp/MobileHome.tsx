import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Heart, ShoppingCart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function MobileHome() {
  const [products, setProducts] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('作品');
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  
  // Simulated search results mapping
  const tabs = ['作品', '创作者'];

  useEffect(() => {
    fetch(`/api/products?search=${encodeURIComponent(searchText)}${category ? `&search=${encodeURIComponent(category)}` : ''}`)
      .then(res => res.json())
      .then(data => setProducts(data));
  }, [searchText, category]);

  const filteredProducts = useMemo(() => {
    if (activeTab === '创作者') return [];
    return products;
  }, [products, activeTab]);

  // CSS column based masonry
  return (
    <div className="flex flex-col h-full bg-[#f6f6f6] min-h-screen">
      {/* Top Header */}
      <div className="bg-white sticky top-0 z-20 pt-12 pb-2">
        <div className="px-4 flex items-center justify-between mb-4">
          <div className="text-2xl font-bold font-serif tracking-tighter">ArtPop</div>
          {user?.role === 'buyer' && (
             <div className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-600" onClick={() => navigate('/cart')}>
               <ShoppingCart size={16} />
             </div>
          )}
        </div>

        {/* Search */}
        <div className="px-4">
          <div 
            onClick={() => navigate('/search')}
            className="relative bg-zinc-100 rounded-full flex items-center px-4 h-10 cursor-pointer"
          >
            <Search className="text-zinc-400 mr-2" size={16} />
            <div className="flex-1 bg-transparent text-sm text-zinc-400">
              {searchText || category || '搜索你感兴趣的艺术风格或作者'}
            </div>
            {(searchText || category) && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setSearchText('');
                  navigate('/');
                }} 
                className="w-5 h-5 bg-zinc-300 rounded-full flex items-center justify-center text-white ml-2"
              >
                 <span className="text-xs leading-none mt-[-1px]">×</span>
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 mt-4 flex gap-6 text-sm">
          {tabs.map(tab => (
            <div 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`pb-2 relative cursor-pointer ${activeTab === tab ? 'text-black font-bold' : 'text-zinc-500 font-medium'}`}
            >
              {tab}
              {activeTab === tab && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-emerald-500 rounded-full"></div>}
            </div>
          ))}
        </div>
      </div>

      {/* Waterfall Feed List */}
      <div className="p-3 w-full bg-[#f6f6f6]">
        {/* Horizontal Banner Ad */}
        {activeTab === '作品' && (
          <div className="w-full h-24 bg-zinc-900 rounded-xl overflow-hidden relative mb-3 shadow-[0_2px_8px_rgba(0,0,0,0.06)] cursor-pointer" onClick={() => navigate('/category')}>
            <div className="absolute inset-0 opacity-50 bg-[url('https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&auto=format&fit=crop&q=60')] bg-cover bg-center"></div>
            <div className="relative h-full flex items-center justify-between px-4 text-white">
              <div>
                <h3 className="font-serif text-lg font-bold tracking-wider mb-1 shadow-sm">央美毕业季 · 新锐首发</h3>
                <div className="text-[10px] font-medium tracking-wide bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5 inline-block">发现未来的艺术大师</div>
              </div>
              <div className="bg-white text-zinc-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                立即探索
              </div>
            </div>
            <div className="absolute top-1 left-1 bg-black/40 text-white/80 text-[8px] px-1 rounded shadow-sm scale-75 origin-top-left">AD</div>
          </div>
        )}
        
        <div className="columns-2 gap-3 space-y-3">
          {filteredProducts.map((p, index) => (
            <div key={p.id} className="break-inside-avoid">
              {/* Inject an Ad slot after the second card */}
              {index === 2 && (
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] mb-3 p-4 flex flex-col items-center justify-center border border-blue-200/50">
                   <div className="text-xs font-bold text-blue-600 mb-1">🎁 广告</div>
                   <div className="text-[13px] font-bold text-blue-900 text-center leading-snug">ArtPop 创作者扶持计划</div>
                   <div className="text-[10px] text-blue-700/70 mt-1 mb-3 text-center">发布作品得现金流量奖励</div>
                   <button className="bg-blue-600 text-white rounded-full px-4 py-1.5 text-xs font-bold shadow-sm">
                     立即参与
                   </button>
                </div>
              )}
              
              <div 
                onClick={() => navigate(`/product/${p.id}`)}
                className="bg-white rounded-lg overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] cursor-pointer pb-3 flex flex-col"
              >
                <div className="relative w-full">
                  <img 
                    src={p.imageUrl} 
                    alt={p.title} 
                    className="w-full object-cover" 
                    onError={(e) => { e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect width='100%25' height='100%25' fill='%23f4f4f5'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14px' fill='%23a1a1aa'%3E暂无图片%3C/text%3E%3C/svg%3E" }}
                  />
                  {p.boost > 0 && (
                    <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded shadow-sm font-bold">
                      HOT
                    </div>
                  )}
                </div>
                
                <div className="px-2.5 pt-3">
                  <h3 className="font-bold text-zinc-900 text-[15px] leading-tight">
                    {p.sellerName} | {p.title}
                  </h3>
                  <p className="text-zinc-500 text-[11px] mt-1.5 mb-2 leading-snug">
                    {p.material || '综合材料'} {p.material ? `(${p.material})` : ''} /
                    <br />
                    {p.size || '未知尺寸'} / {p.year || '2026'}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="text-red-600 font-bold text-sm tracking-tight">
                      ¥{p.price?.toLocaleString()}
                    </div>
                    <button className="text-zinc-300 hover:text-red-500 transition">
                      <Heart size={16} strokeWidth={2} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {products.length === 0 && (
          <div className="text-center py-20 text-zinc-400 text-sm w-full">
            暂无相关画作
          </div>
        )}
      </div>
    </div>
  );
}

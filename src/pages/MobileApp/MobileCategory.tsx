import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';

export function MobileCategory() {
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchProducts = async () => {
      const qs = selectedCategories.length > 0 ? `?categories=${encodeURIComponent(selectedCategories.join(','))}` : '';
      const res = await fetch(`/api/products${qs}`);
      const data = await res.json();
      setProducts(data);
    };
    fetchProducts();
  }, [selectedCategories]);

  const toggleCategory = (c: string) => {
    setSelectedCategories(prev => 
      prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]
    );
  };
  
  const categoryGroups = [
    {
      title: '材质',
      items: ['油画', '水彩', '国画', '素描', '插画', '装饰画', '版画', '综合材料']
    },
    {
      title: '题材',
      items: ['风景', '人物', '静物', '抽象', '动植物', '观念思维', '二次元']
    },
    {
      title: '尺寸',
      items: ['微型 (<30cm)', '小型 (30-60cm)', '中型 (60-100cm)', '大型 (>100cm)']
    }
  ];

  return (
    <div className="bg-[#f6f6f6] min-h-screen pb-20">
      <div className="bg-white sticky top-0 z-50 pt-12 pb-3 px-4 shadow-sm">
         <div className="text-lg font-bold text-center">分类发现</div>
      </div>
      
      <div className="px-4 mt-4">
        {/* Banner Area */}
        <div className="w-full h-32 bg-zinc-900 rounded-xl overflow-hidden relative mb-6 cursor-pointer" onClick={() => toggleCategory('央美毕业季')}>
          <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=60')] bg-cover bg-center"></div>
          <div className="relative h-full flex flex-col items-center justify-center text-white">
            <h3 className="font-serif text-2xl font-bold tracking-widest mb-1 shadow-sm">央美毕业季专区</h3>
            <div className={`text-xs font-medium tracking-widest border rounded-full px-3 py-1 transition ${selectedCategories.includes('央美毕业季') ? 'bg-white text-zinc-900 border-white' : 'border-white/50 text-white'}`}>
              {selectedCategories.includes('央美毕业季') ? '已选择' : '探索新生代力量'}
            </div>
          </div>
        </div>

        {categoryGroups.map(group => (
          <div key={group.title} className="mb-6 bg-white p-4 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <h2 className="text-[15px] font-bold mb-3 flex items-center justify-between text-zinc-900">
              {group.title}
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {group.items.map(c => {
                 const isSelected = selectedCategories.includes(c);
                 return (
                   <div 
                     key={c} 
                     onClick={() => toggleCategory(c)} 
                     className={`px-3.5 py-1.5 border rounded-lg text-[13px] font-medium transition whitespace-nowrap cursor-pointer ${
                       isSelected 
                         ? 'bg-zinc-900 border-zinc-900 text-white shadow-sm' 
                         : 'bg-zinc-50 border-zinc-100 text-zinc-600 active:bg-zinc-100'
                     }`}
                   >
                     {c}
                   </div>
                 );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Waterfall Feed List corresponding to filter */}
      <div className="p-3 w-full bg-[#f6f6f6] mt-2">
        <h2 className="text-zinc-800 font-bold px-2 mb-4 text-[15px]">发现作品 ({products.length})</h2>
        <div className="columns-2 gap-3 space-y-3">
          {products.map(p => (
            <div 
              key={p.id} 
              onClick={() => navigate(`/product/${p.id}`)}
              className="break-inside-avoid bg-white rounded-lg overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] cursor-pointer pb-3 flex flex-col"
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
                <h3 className="font-bold text-zinc-900 text-[15px] leading-tight mb-1">
                  {p.sellerName} | {p.title}
                </h3>
                <p className="text-zinc-500 text-[11px] mb-2 leading-snug line-clamp-2">
                  {p.material || '综合材料'} {p.size ? ` / ${p.size}` : ''} / {p.year || '2026'}
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
          ))}
        </div>
        {products.length === 0 && (
           <div className="text-center py-10 text-zinc-400 text-sm">
             未找到与您选择的类别相关的作品
           </div>
        )}
      </div>
    </div>
  );
}

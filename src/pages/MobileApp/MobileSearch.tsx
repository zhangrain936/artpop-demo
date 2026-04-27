import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, X, Search as SearchIcon, Heart } from 'lucide-react';

export function MobileSearch() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || '全部';
  
  const [query, setQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(!!initialQuery || initialCategory !== '全部');
  const [activeTab, setActiveTab] = useState('作品');
  const [products, setProducts] = useState<any[]>([]);

  // Filters State
  const [category, setCategory] = useState(initialCategory);
  const [saleType, setSaleType] = useState('全部');
  const [priceRange, setPriceRange] = useState('全部');
  const [sizeRange, setSizeRange] = useState('全部');
  const [sortOrder, setSortOrder] = useState('默认');

  useEffect(() => {
    if (isSearching) {
      const qs = new URLSearchParams();
      if (query) qs.append('search', query);
      if (category !== '全部') qs.append('categories', category);
      
      fetch(`/api/products?${qs.toString()}`)
        .then(res => res.json())
        .then(data => setProducts(Array.isArray(data) ? data : []));
    }
  }, [query, isSearching, category]);

  const history = ['国画', '油画'];
  const popular = ['国画', '油画', '雕塑', '书法', '抽象', '版画', '超现实', '杨婉', '工笔', '李兴和'];

  const performSearch = (q: string) => {
    setQuery(q);
    setIsSearching(true);
  };

  const clearSearch = () => {
    setQuery('');
    setIsSearching(false);
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen flex flex-col">
      {/* Header Search Bar */}
      <div className="bg-[#FAF9F5] sticky top-0 z-50 pt-12 pb-2 px-3 shadow-sm border-b border-[#E0E0E0]">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 -ml-1 text-[#666666]">
             <ChevronLeft size={24} />
          </button>
          <div className="flex-1 flex items-center bg-[#FAF9F5] rounded-full px-3 py-1.5 border border-[#E0E0E0]/50">
            <SearchIcon size={16} className="text-[#999999] mr-2" />
            <input 
              type="text" 
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && performSearch(query)}
              placeholder="搜作品 / 找艺术家" 
              className="flex-1 bg-transparent text-[14px] focus:outline-none placeholder:text-[#999999]"
              autoFocus={!initialQuery}
            />
            {query && (
              <button onClick={clearSearch} className="w-4 h-4 bg-zinc-300 rounded-full flex items-center justify-center text-white ml-2">
                 <X size={10} />
              </button>
            )}
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex justify-around mt-4 text-[15px]">
          {['作品', '用户'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`pb-2 px-2 relative ${activeTab === tab ? 'text-[#C5A059] font-bold' : 'text-[#666666] font-medium'}`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[3px] bg-[#C5A059] rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {!isSearching ? (
        <div className="p-4 bg-white flex-1 animate-in fade-in">
          <div className="flex items-center justify-between mb-4">
             <h3 className="text-[13px] font-bold text-[#1A1A1A]">搜索历史</h3>
             <button className="text-[12px] text-[#999999] p-1">清空历史</button>
          </div>
          <div className="flex flex-wrap gap-2.5 mb-8">
             {history.map(h => (
               <button key={h} onClick={() => performSearch(h)} className="px-3.5 py-1.5 bg-[#FAF9F5]/80 hover:bg-zinc-200 transition rounded-full text-[13px] font-medium text-[#666666]">
                 {h}
               </button>
             ))}
          </div>

          <h3 className="text-[13px] font-bold text-[#1A1A1A] mb-4">大家都在搜</h3>
          <div className="flex flex-wrap gap-2.5">
             {popular.map((p, i) => (
               <button key={p} onClick={() => performSearch(p)} className="px-3.5 py-1.5 border border-[#E0E0E0] hover:bg-[#FAF9F5] transition rounded-full text-[13px] font-medium text-[#666666] flex items-center gap-1.5">
                 {i < 3 && <span className="text-[10px] text-[#C5A059] font-bold italic mr-0.5">HOT</span>}
                 {p}
               </button>
             ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
           {/* Filters */}
           <div className="bg-white border-b border-[#E0E0E0]">
              <div className="flex flex-col text-[13px]">
                <FilterRow label="类别" options={['全部', '油画', '国画', '丙烯', '水彩', '综合材料']} active={category} onSelect={setCategory} />
                <FilterRow label="出售" options={['全部', '一口价', '拍卖', '闪购']} active={saleType} onSelect={setSaleType} />
                <FilterRow label="价格" options={['全部', '800元以下', '800~2000元', '2000~5000元']} active={priceRange} onSelect={setPriceRange} />
                <FilterRow label="尺寸" options={['全部', '0~20cm', '20~50cm', '50~80cm', '80~100cm']} active={sizeRange} onSelect={setSizeRange} />
                <FilterRow label="排序" options={['默认', '价格由低到高', '价格由高到低']} active={sortOrder} onSelect={setSortOrder} />
              </div>
           </div>

           {/* Results Waterfall */}
           <div className="p-3 w-full bg-[#FAF9F5]">
            <div className="columns-2 gap-3 space-y-3">
              {products.map(p => (
                <div 
                  key={p.id} 
                  className="break-inside-avoid bg-white overflow-hidden shadow-sm flex flex-col"
                >
                  <img src={p.imageUrl} alt={p.title} onClick={() => navigate(`/product/${p.id}`)} className="w-full object-cover cursor-pointer min-h-[120px] bg-zinc-200" onError={(e) => { e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect width='100%25' height='100%25' fill='%23e0e0e0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14px' fill='%23999999'%3EArtPop%3C/text%3E%3C/svg%3E" }} />
                  <div className="p-3 flex flex-col flex-1">
                    <h3 className="text-[14px] font-bold text-[#1A1A1A] leading-relaxed mb-3">{p.sellerName || '王耀峰'} | {p.title || '无题'}</h3>
                    <div className="text-[12px] text-[#666666] mb-3">{p.category} / 138x69cm / 2025</div>
                    <div className="mt-auto flex items-end justify-between">
                      <span className="text-[18px] font-bold text-[#C5A059]">¥{p.price}</span>
                      <button className="text-[#E0E0E0] hover:text-[#C5A059]">
                         <Heart size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterRow({ label, options, active, onSelect }: { label: string, options: string[], active: string, onSelect: (v: string) => void }) {
  return (
    <div className="flex px-3 py-2.5 items-center whitespace-nowrap overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
       <span className="text-[#666666] mr-4 shrink-0">{label}</span>
       <div className="flex gap-4">
         {options.map(opt => (
            <button 
              key={opt} 
              onClick={() => onSelect(opt)}
              className={active === opt ? 'bg-[#FAF9F5] px-2.5 py-0.5 rounded text-[#1A1A1A] font-medium' : 'text-[#666666] px-2.5 py-0.5'}
            >
              {opt}
            </button>
         ))}
       </div>
    </div>
  );
}

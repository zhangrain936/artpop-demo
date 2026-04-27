import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  { id: '油画', name: '油画', eng: 'Oil Painting', count: '12,540', img: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&auto=format&fit=crop&q=60' },
  { id: '国画', name: '国画', eng: 'Chinese Painting', count: '8,100', img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&auto=format&fit=crop&q=60' },
  { id: '水彩', name: '水彩', eng: 'Watercolor', count: '3,850', img: 'https://images.unsplash.com/photo-1582201942988-13e60cb53f57?w=800&auto=format&fit=crop&q=60' },
  { id: '雕塑', name: '雕塑', eng: 'Sculpture', count: '5,020', img: 'https://images.unsplash.com/photo-1582760144131-fe55e378ad5f?w=800&auto=format&fit=crop&q=60' },
  { id: '摄影', name: '摄影', eng: 'Photography', count: '10,210', img: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=60' },
  { id: '综合材料', name: '数字艺术', eng: 'Digital Art', count: '4,650', img: 'https://images.unsplash.com/photo-1560416313-414b33c856a9?w=800&auto=format&fit=crop&q=60' },
];

export function MobileCategory() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#FAF9F5] min-h-screen pb-20">
      <div className="bg-white sticky top-0 z-50 pt-12 pb-3 px-4 shadow-sm">
         <div className="text-lg font-bold text-center">分类发现</div>
      </div>
      
      <div className="px-4 mt-4 flex flex-col gap-3">
        {CATEGORIES.map(c => (
          <div 
            key={c.id}
            onClick={() => navigate(`/search?category=${encodeURIComponent(c.id)}`)}
            className="relative w-full h-[140px] rounded-lg overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
          >
            <img src={c.img} alt={c.name} className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect width='100%25' height='100%25' fill='%23e0e0e0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14px' fill='%23999999'%3EArtPop%3C/text%3E%3C/svg%3E" }}/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute bottom-3 left-4 text-white z-10 w-full pr-4">
               <h2 className="text-[22px] font-sans font-medium tracking-wide mb-0.5">{c.eng} / {c.name}</h2>
               <div className="text-[13px] font-light text-white/90">{c.count} artworks</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


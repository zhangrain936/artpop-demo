import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function MobileFavorites() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    fetch('/api/favorites', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setFavorites(Array.isArray(data) ? data : []));
  }, [token]);

  return (
    <div className="bg-[#F8F8F8] min-h-screen pb-10">
      <div className="bg-white sticky top-0 z-50 pt-12 pb-3 px-4 shadow-sm flex items-center justify-between">
         <div onClick={() => navigate(-1)} className="cursor-pointer p-2 -ml-2">
           <ChevronLeft size={24} />
         </div>
         <div className="text-lg font-bold">我的收藏</div>
         <div className="w-8"></div>
      </div>
      
      {favorites.length === 0 ? (
        <div className="p-12 text-center text-[#999999] text-sm">暂无收藏</div>
      ) : (
        <div className="p-3 w-full columns-2 gap-3 space-y-3">
          {favorites.map(p => (
            <div 
              key={p.id} 
              onClick={() => navigate(`/product/${p.id}`)}
              className="break-inside-avoid bg-white rounded-xl overflow-hidden shadow-sm active:scale-[0.98] transition-transform duration-200"
            >
              <img 
                src={p.imageUrl} 
                alt={p.title} 
                className="w-full object-cover" 
                onError={(e) => { e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect width='100%25' height='100%25' fill='%23e0e0e0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14px' fill='%23999999'%3EArtPop%3C/text%3E%3C/svg%3E" }}
              />
              <div className="p-3">
                <h3 className="text-sm font-bold text-[#1A1A1A] line-clamp-2 leading-relaxed mb-3">{p.title}</h3>
                <div className="flex items-end justify-between mt-2">
                  <span className="text-lg font-bold text-[#C5A059]">¥{p.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

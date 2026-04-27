import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export function MobileAuthor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [author, setAuthor] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/users/${id}`)
      .then(res => res.json())
      .then(setAuthor);
  }, [id]);

  if (!author) return <div className="p-8 text-center text-zinc-400">加载中...</div>;

  return (
    <div className="bg-white min-h-screen pb-10">
      <div 
        className="fixed top-10 left-4 z-50 w-8 h-8 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer shadow-sm"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft size={20} className="text-white relative pr-[2px]" />
      </div>
      <div className="bg-zinc-100 h-32"></div>
      <div className="px-6 relative -mt-10">
         <div className="w-20 h-20 rounded-full border-4 border-white bg-zinc-200 text-2xl font-bold flex items-center justify-center text-zinc-500 mb-4">
             {author.name[0]}
         </div>
         <h1 className="text-xl font-bold">{author.name}</h1>
         <div className="text-sm text-zinc-500 mt-1">认证学生创作者 | 央美艺术</div>
         <button className="mt-4 px-6 py-2 bg-zinc-900 text-white rounded-full text-sm font-medium">关注</button>
      </div>
      <div className="px-5 mt-8 grid grid-cols-2 gap-3 pb-20">
         {author.products.map((p: any) => (
             <div key={p.id} onClick={() => navigate(`/product/${p.id}`)} className="bg-zinc-100 rounded-lg overflow-hidden cursor-pointer">
                <img 
                  src={p.imageUrl} 
                  className="w-full aspect-square object-cover" 
                  alt={p.title}
                  onError={(e) => { e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect width='100%25' height='100%25' fill='%23f4f4f5'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14px' fill='%23a1a1aa'%3E暂无图片%3C/text%3E%3C/svg%3E" }}
                />
                <div className="p-2 text-xs font-medium truncate">{p.title}</div>
             </div>
         ))}
      </div>
    </div>
  );
}

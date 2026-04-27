import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Plus, Zap, CheckCircle2, Clock } from 'lucide-react';

export function MobileWorkspace() {
  const { token } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [iaaLoading, setIaaLoading] = useState<string | null>(null);

  const loadProducts = () => {
    fetch('/api/seller/products', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setProducts(data));
  };

  useEffect(() => {
    loadProducts();
  }, [token]);

  const handleBoost = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setIaaLoading(id);
    // Simulate 3s video ad watching
    setTimeout(async () => {
      await fetch(`/api/seller/products/${id}/boost`, { method: 'POST' });
      setIaaLoading(null);
      loadProducts(); // refresh
      alert('🌟 曝光权重已提升！');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-zinc-50 pb-20 relative">
      <div className="pt-12 pb-4 px-5 bg-white sticky top-0 z-10 shadow-sm flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">工作台</h1>
        <button 
          onClick={() => setShowAdd(true)}
          className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-800"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {products.map(p => (
          <div 
            key={p.id} 
            onClick={() => setEditingProduct(p)}
            className="bg-white p-4 rounded-2xl shadow-sm border border-zinc-100 flex gap-4 cursor-pointer active:scale-[0.98] transition"
          >
            <div className="w-20 h-24 rounded-lg bg-zinc-100 overflow-hidden flex-shrink-0">
              <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect width='100%25' height='100%25' fill='%23f4f4f5'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14px' fill='%23a1a1aa'%3E暂无图片%3C/text%3E%3C/svg%3E" }} />
            </div>
            <div className="flex-1 min-w-0 py-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-zinc-900 text-sm truncate">{p.title}</h3>
                  <div className="text-sm font-bold text-zinc-900">¥{p.price}</div>
                </div>
                <div className="flex items-center gap-1.5 mt-1.5">
                  {p.status === 'approved' ? (
                    <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-medium flex items-center gap-1"><CheckCircle2 size={10}/> 已上架</span>
                  ) : p.status === 'pending' ? (
                    <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded font-medium flex items-center gap-1"><Clock size={10}/> 审核中</span>
                  ) : (
                    <span className="text-[10px] text-red-600 bg-red-50 px-1.5 py-0.5 rounded font-medium">已驳回</span>
                  )}
                  {p.boost > 0 && <span className="text-[10px] text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded font-medium">🔥 热量 {p.boost}</span>}
                </div>
              </div>
              <div className="mt-2 text-right">
                {p.status === 'approved' && (
                  <button 
                    onClick={(e) => handleBoost(e, p.id)}
                    disabled={iaaLoading === p.id}
                    className="inline-flex items-center gap-1 text-[10px] font-bold bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full shadow-sm active:scale-95 transition disabled:opacity-50"
                  >
                    {iaaLoading === p.id ? '播放视频中...' : <><Zap size={12}/> 看广告加曝光</>}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <div className="text-center py-20 text-zinc-400 text-sm">
            还没有发布过作品，点击右上角发布
          </div>
        )}
      </div>

      {(showAdd || editingProduct) && (
        <AddEditProductModal 
          product={editingProduct}
          onClose={() => { setShowAdd(false); setEditingProduct(null); }} 
          refresh={loadProducts} 
        />
      )}
    </div>
  );
}

function AddEditProductModal({ product, onClose, refresh }: { product?: any, onClose: () => void, refresh: () => void }) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState(product?.price || '');
  const isEdit = !!product;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());
    
    // Default mock image if none provided yet
    payload.imageUrl = product?.imageUrl || "https://images.unsplash.com/photo-1518991669955-9c7e68bc63a4?w=800&q=80";

    if (isEdit) {
       await fetch(`/api/seller/products/${product.id}`, {
         method: 'PUT',
         headers: {
           'Content-Type': 'application/json',
           Authorization: `Bearer ${token}`
         },
         body: JSON.stringify(payload)
       });
       alert('修改成功！');
    } else {
       await fetch('/api/seller/products', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           Authorization: `Bearer ${token}`
         },
         body: JSON.stringify(payload)
       });
    }
    
    setLoading(false);
    refresh();
    onClose();
  };

  const currentPrice = Number(price);
  const commission = currentPrice ? (currentPrice * 0.1).toFixed(2) : '0.00';
  const earnings = currentPrice ? (currentPrice * 0.9).toFixed(2) : '0.00';

  return (
    <div className="absolute inset-0 z-50 bg-white flex flex-col">
      <div className="pt-12 pb-4 px-4 border-b border-zinc-100 flex items-center justify-between bg-white shadow-sm">
        <button onClick={onClose} className="text-zinc-500 font-medium text-sm px-2">取消</button>
        <span className="font-bold text-zinc-900">{isEdit ? '编辑作品详情' : '发布画作'}</span>
        <div className="w-10"></div>
      </div>
      <form onSubmit={handleSubmit} className="flex-1 p-5 space-y-5 overflow-y-auto no-scrollbar pb-32">
        <div>
          <label className="block text-sm font-bold text-zinc-700 mb-2">作品名称</label>
          <input name="title" defaultValue={product?.title} required className="w-full bg-zinc-50 rounded-xl px-4 py-3 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 mb-2" placeholder="如：星空下的向日葵" />
        </div>
        <div>
          <label className="block text-sm font-bold text-zinc-700 mb-2">类别 (如：油画/国画等)</label>
          <input name="category" defaultValue={product?.category} required className="w-full bg-zinc-50 rounded-xl px-4 py-3 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 mb-2" placeholder="填写主要材质类别" />
        </div>
        <div className="flex gap-4">
           <div className="flex-1">
             <label className="block text-sm font-bold text-zinc-700 mb-2">尺寸</label>
             <input name="size" defaultValue={product?.size} className="w-full bg-zinc-50 rounded-xl px-4 py-3 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900" placeholder="如：50x40cm" />
           </div>
           <div className="flex-1">
             <label className="block text-sm font-bold text-zinc-700 mb-2">年份</label>
             <input name="year" defaultValue={product?.year} className="w-full bg-zinc-50 rounded-xl px-4 py-3 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900" placeholder="如：2026" />
           </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-zinc-700 mb-2">价格设定</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-medium">¥</span>
            <input name="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="0.00" className="w-full bg-zinc-50 rounded-xl pl-8 pr-4 py-3 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900" />
          </div>
          {currentPrice > 0 && (
            <div className="text-xs text-zinc-500 mt-2 px-3 py-2.5 bg-zinc-50 rounded-xl border border-zinc-100 flex justify-between">
              <span>预计平台佣金(10%): ¥{commission}</span>
              <span className="font-bold text-green-600">预计收入: ¥{earnings}</span>
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-bold text-zinc-700 mb-2">运费设置</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer relative">
              <input type="radio" name="shipping" value="free" defaultChecked={product?.shipping !== 'collect'} className="text-zinc-900 focus:ring-zinc-900 accent-zinc-900" />
              <span className="text-sm text-zinc-700">包邮</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer relative">
              <input type="radio" name="shipping" value="collect" defaultChecked={product?.shipping === 'collect'} className="text-zinc-900 focus:ring-zinc-900 accent-zinc-900" />
              <span className="text-sm text-zinc-700">顺丰到付</span>
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-zinc-700 mb-2">作品描述/创作故事</label>
          <textarea name="desc" defaultValue={product?.desc} required rows={3} className="w-full bg-zinc-50 rounded-xl px-4 py-3 placeholder:text-zinc-400 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900" placeholder="尺寸、材质（如布面油画）、创作年份、是否带框..." />
        </div>
        <div>
          <label className="block text-sm font-bold text-zinc-700 mb-2">作品主图</label>
          <div className="w-full h-40 border-2 border-dashed border-zinc-200 rounded-xl overflow-hidden flex flex-col items-center justify-center text-zinc-400 text-sm bg-zinc-50 relative cursor-pointer">
            {product?.imageUrl ? (
              <img src={product.imageUrl} className="w-full h-full object-cover" />
            ) : (
              <span>[点击上传照片]</span>
            )}
          </div>
        </div>
        
        <button disabled={loading} className="w-full bg-zinc-900 text-white rounded-xl py-4 font-bold shadow-lg disabled:opacity-50 active:scale-95 transition mt-8">
          {isEdit ? '保存修改' : '提交审核'}
        </button>
      </form>
    </div>
  );
}

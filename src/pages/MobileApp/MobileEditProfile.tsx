import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Camera } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function MobileEditProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);
    // Mock update request
    setTimeout(() => {
       alert('资料已保存！');
       setLoading(false);
       navigate(-1);
    }, 1000);
  };

  const isSeller = user?.role === 'seller';

  return (
    <div className="bg-white h-full flex flex-col pb-24">
      <div className="flex items-center p-4 border-b border-[#E0E0E0] sticky top-0 bg-white z-50">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-[#666666]">
           <ChevronLeft size={24} />
        </button>
        <span className="font-bold flex-1 text-center -ml-6 text-[#1A1A1A]">编辑资料</span>
      </div>

      <div className="px-5 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center mb-8">
            <div className="relative">
               <div className="w-24 h-24 bg-zinc-200 rounded-full flex items-center justify-center text-3xl font-bold text-[#999999] overflow-hidden">
                 {user?.name?.[0]}
               </div>
               <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#1A1A1A] text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm cursor-pointer">
                 <Camera size={14} />
               </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#666666] mb-2">昵称</label>
            <input name="name" defaultValue={user?.name} required className="w-full bg-[#F8F8F8] rounded-xl px-4 py-3 placeholder:text-[#999999] focus:outline-none focus:ring-1 focus:ring-[#1A1A1A]" />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#666666] mb-2">个人简介</label>
            <textarea name="bio" rows={4} className="w-full bg-[#F8F8F8] rounded-xl px-4 py-3 placeholder:text-[#999999] focus:outline-none focus:ring-1 focus:ring-[#1A1A1A]" placeholder="分享你的创作理念和故事..." />
          </div>
          {isSeller && (
            <div>
              <label className="block text-sm font-bold text-[#666666] mb-2">微信联系方式 (仅买家可见)</label>
              <input name="wechat" className="w-full bg-[#F8F8F8] rounded-xl px-4 py-3 placeholder:text-[#999999] focus:outline-none focus:ring-1 focus:ring-[#1A1A1A]" placeholder="微信号" />
            </div>
          )}

          <button disabled={loading} className="w-full bg-[#1A1A1A] text-white rounded-xl py-4 font-bold shadow-lg mt-8 active:scale-95 transition disabled:opacity-50">
            {loading ? '保存中...' : '保存修改'}
          </button>
        </form>
      </div>
    </div>
  );
}

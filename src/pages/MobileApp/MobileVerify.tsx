import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Camera } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function MobileVerify() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);
    // Simulate upload and admin approval
    fetch(`/api/admin/users/${user?.id}/certify`, { method: 'POST' })
      .then(res => res.json())
      .then(data => {
         // Auto login to simulate real time refresh
         alert('🎉 认证成功！欢迎加入 ArtPop 创作者计划！');
         window.location.href = '/workspace';
      });
  };

  return (
    <div className="bg-white h-full flex flex-col pb-24">
      <div className="flex items-center p-4 border-b border-[#E0E0E0] sticky top-0 bg-white z-50">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-[#666666]">
           <ChevronLeft size={24} />
        </button>
        <span className="font-bold flex-1 text-center -ml-6 text-[#1A1A1A]">申请创作者入驻</span>
      </div>

      <div className="px-5 py-6">
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">欢迎加入我们，<br/>新锐艺术家！</h2>
        <p className="text-sm text-[#666666] mb-8">我们需要验证您的学生身份，通过后您将可以发布并出售自己的艺术作品。</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-[#666666] mb-2">真实姓名</label>
            <input required className="w-full bg-[#F8F8F8] rounded-xl px-4 py-3 placeholder:text-[#999999] focus:outline-none focus:ring-1 focus:ring-[#1A1A1A]" placeholder="与证件一致" />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#666666] mb-2">就读院校</label>
            <input required className="w-full bg-[#F8F8F8] rounded-xl px-4 py-3 placeholder:text-[#999999] focus:outline-none focus:ring-1 focus:ring-[#1A1A1A]" placeholder="如：中央美术学院" />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#666666] mb-2">专业/院系</label>
            <input required className="w-full bg-[#F8F8F8] rounded-xl px-4 py-3 placeholder:text-[#999999] focus:outline-none focus:ring-1 focus:ring-[#1A1A1A]" placeholder="如：油画系" />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-[#666666] mb-2">学生证人像页照片上传</label>
            <div className="w-full h-40 border-2 border-dashed border-[#E0E0E0] rounded-xl flex flex-col items-center justify-center text-[#999999] text-sm bg-[#F8F8F8] cursor-pointer hover:bg-[#F8F8F8] transition">
               <Camera size={32} className="mb-2 text-[#E0E0E0]" />
               <span className="font-medium text-[#666666]">点击上传学生证/一卡通照片</span>
            </div>
          </div>

          <button disabled={loading} className="w-full bg-[#1A1A1A] text-white rounded-xl py-4 font-bold shadow-lg mt-8 active:scale-95 transition disabled:opacity-50">
            {loading ? '提交审核中...' : '提交申请'}
          </button>
        </form>
      </div>
    </div>
  );
}

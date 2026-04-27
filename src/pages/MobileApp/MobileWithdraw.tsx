import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function MobileWithdraw() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');

  const handleWithdraw = () => {
    if (!amount || Number(amount) <= 0) return alert('请输入提现金额');
    if (Number(amount) > (user?.balance || 0)) return alert('余额不足');
    
    setLoading(true);
    setTimeout(() => {
      alert('提现申请已提交，预计1-3个工作日到账支付宝');
      setLoading(false);
      navigate(-1);
    }, 1500);
  };

  return (
    <div className="bg-zinc-50 h-full flex flex-col pb-24">
      <div className="flex items-center p-4 bg-white border-b border-zinc-100 sticky top-0 z-50">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-zinc-700">
           <ChevronLeft size={24} />
        </button>
        <span className="font-bold flex-1 text-center -ml-6 text-zinc-900">余额提现</span>
      </div>

      <div className="px-5 py-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100">
          <div className="text-sm text-zinc-500 mb-2">可提现金额</div>
          <div className="text-4xl font-bold text-zinc-900 mb-8">¥{user?.balance || 0}</div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">提现金额</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">¥</span>
                <input 
                   type="number"
                   value={amount}
                   onChange={e => setAmount(e.target.value)}
                   className="w-full bg-zinc-50 rounded-xl pl-8 pr-4 py-3 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900" 
                   placeholder="请输入金额" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">到账支付宝账号</label>
              <input className="w-full bg-zinc-50 rounded-xl px-4 py-3 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900" placeholder="支付宝账号(手机号或邮箱)" />
            </div>
          </div>

          <button 
             onClick={handleWithdraw}
             disabled={loading}
             className="w-full bg-zinc-900 text-white rounded-xl py-3.5 font-bold shadow-lg mt-8 active:scale-95 transition disabled:opacity-50"
          >
            {loading ? '提交中...' : '确认提现'}
          </button>
          <div className="text-center text-[10px] text-zinc-400 mt-4">最小提现金额 ¥100.00，平台免收提现手续费</div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('buyer@demo.com');
  const [password, setPassword] = useState('123');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        login(data.token, data.user);
        if (data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('登录失败，请检查网络');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F8F8] px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-[#1A1A1A]">登录</h1>
          <p className="text-[#666666]">艺术生原创画作B2C交易平台</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#666666] mb-1">账号 (测试内置)</label>
            <select 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-[#E0E0E0] rounded-lg focus:ring-2 focus:ring-[#1A1A1A] focus:outline-none bg-[#F8F8F8]"
            >
              <option value="buyer@demo.com">普通用户张三 (buyer@demo.com)</option>
              <option value="student@demo.com">艺术生李四 (student@demo.com)</option>
              <option value="admin@demo.com">超级管理员 (admin@demo.com)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#666666] mb-1">密码</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-[#E0E0E0] rounded-lg focus:ring-2 focus:ring-[#1A1A1A] focus:outline-none bg-[#F8F8F8]"
              readOnly
            />
          </div>

          {error && <div className="text-[#D32F2F] text-sm font-medium text-center">{error}</div>}

          <button 
            type="submit" 
            className="w-full bg-[#1A1A1A] text-white rounded-lg py-3 font-medium hover:bg-[#1A1A1A] transition flex items-center justify-center gap-2"
          >
            <LogIn size={18} />
            进入系统
          </button>
        </form>
      </div>
    </div>
  );
}

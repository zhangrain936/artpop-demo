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
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">登录</h1>
          <p className="text-zinc-500">艺术生原创画作B2C交易平台</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">账号 (测试内置)</label>
            <select 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:outline-none bg-zinc-50"
            >
              <option value="buyer@demo.com">普通用户张三 (buyer@demo.com)</option>
              <option value="student@demo.com">艺术生李四 (student@demo.com)</option>
              <option value="admin@demo.com">超级管理员 (admin@demo.com)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">密码</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:outline-none bg-zinc-50"
              readOnly
            />
          </div>

          {error && <div className="text-red-500 text-sm font-medium text-center">{error}</div>}

          <button 
            type="submit" 
            className="w-full bg-zinc-900 text-white rounded-lg py-3 font-medium hover:bg-zinc-800 transition flex items-center justify-center gap-2"
          >
            <LogIn size={18} />
            进入系统
          </button>
        </form>
      </div>
    </div>
  );
}

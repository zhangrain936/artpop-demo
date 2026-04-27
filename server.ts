import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';

// Mock DB
const db: any = {
  users: [
    { id: 'u1', email: 'buyer@demo.com', password: '123', role: 'buyer', name: '普通用户 - 张三', verifiedStudent: false },
    { id: 'u2', email: 'student@demo.com', password: '123', role: 'seller', name: '央美学生 - 李四', verifiedStudent: true, balance: 1200 },
    { id: 'u3', email: 'admin@demo.com', password: '123', role: 'admin', name: '超级管理员', verifiedStudent: false },
  ],
  products: [
    { id: 'p1', title: '下雪', desc: '唯美风格的雪人画像', material: '丙烯', size: '50x40cm', year: '2026', price: 3200, imageUrl: 'https://images.unsplash.com/photo-1579762715111-a6ce3eb833dd?w=800&q=80', sellerId: 'u2', status: 'approved', stock: 1, boost: 0, createdAt: Date.now() },
    { id: 'p2', title: '林中居', desc: '中式水墨风的国画', material: '国画', size: '40x20cm', year: '2026', price: 1800, imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80', sellerId: 'u2', status: 'approved', stock: 1, boost: 5, createdAt: Date.now() - 100000 },
    { id: 'p3', title: 'Soundshatter', desc: '科幻风格油画创作', material: '油画', size: '50x60cm', year: '2026', price: 9800, imageUrl: 'https://images.unsplash.com/photo-1533154817757-bb049eebd760?w=800&q=80', sellerId: 'u2', status: 'approved', stock: 1, boost: 0, createdAt: Date.now() - 500000 },
    { id: 'p4', title: '只有你知道', desc: '可爱猴与熊的互动', material: '丙烯', size: '40x80cm', year: '2026', price: 13000, imageUrl: 'https://images.unsplash.com/photo-1580136608260-4eb11f4b24fe?w=800&q=80', sellerId: 'u2', status: 'approved', stock: 1, boost: 0, createdAt: Date.now() - 600000 },
  ],
  orders: [],
  cart: [] // { userId, productId }
};

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // --- API Routes ---

  // Auth
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = db.users.find((u: any) => u.email === email && u.password === password);
    if (!user) {
      return res.status(401).json({ error: '邮箱或密码错误' });
    }
    const { password: _, ...userProfile } = user;
    res.json({ token: user.id, user: userProfile }); // Simple mock token
  });

  app.get('/api/me', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    const user = db.users.find((u: any) => u.id === token);
    if (!user) return res.status(401).json({ error: '未登录' });
    const { password: _, ...userProfile } = user;
    res.json({ user: userProfile });
  });

  // Buyer & Public - Products
  app.get('/api/products', (req, res) => {
    const search = req.query.search?.toString().toLowerCase() || '';
    const categoriesStr = req.query.categories?.toString() || '';
    const categories = categoriesStr ? categoriesStr.split(',').map(c => c.trim()) : [];
    
    // Only return approved products, sort by boost (desc) then createdAt (desc)
    const approved = db.products
        .filter((p: any) => p.status === 'approved')
        .map((p: any) => ({
             ...p,
             sellerName: db.users.find((u: any) => u.id === p.sellerId)?.name?.split('-')[1]?.trim() || '未知'
        }))
        .filter((p: any) => 
            (search ? (p.title.toLowerCase().includes(search) || p.sellerName.toLowerCase().includes(search) || p.material?.toLowerCase().includes(search)) : true)
            &&
            (categories.length > 0 ? categories.some(cat => (p.material && p.material.includes(cat)) || p.title.includes(cat) || p.category === cat) : true)
        )
        .sort((a: any, b: any) => {
            if (b.boost !== a.boost) return b.boost - a.boost;
            return b.createdAt - a.createdAt;
        });
    res.json(approved);
  });

  // Favorites API
  app.get('/api/favorites', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: '未登录' });
    const favorites = db.cart.filter((c: any) => c.userId === token && c.isFavorite).map((c: any) => db.products.find((p: any) => p.id === c.productId));
    res.json(favorites);
  });

  app.post('/api/favorites', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: '未登录' });
    const { productId } = req.body;
    const existing = db.cart.find((c: any) => c.userId === token && c.productId === productId);
    if (existing) {
        existing.isFavorite = !existing.isFavorite;
    } else {
        db.cart.push({ id: 'f' + Date.now(), userId: token, productId, isFavorite: true });
    }
    res.json({ success: true });
  });

  // Author API
  app.get('/api/users/:id', (req, res) => {
      const user = db.users.find((u: any) => u.id === req.params.id);
      if (!user) return res.status(404).json({ error: '作者不存在' });
      const products = db.products.filter((p: any) => p.sellerId === user.id);
      const { password, ...safeUser } = user;
      res.json({ ...safeUser, products });
  });

  app.get('/api/products/:id', (req, res) => {
    const product = db.products.find((p: any) => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: '商品不存在' });
    
    // Attach seller name
    const seller = db.users.find((u: any) => u.id === product.sellerId);
    
    res.json({ ...product, sellerName: seller?.name?.split('-')[1]?.trim() || '未知作者' });
  });

  // Cart API
  app.get('/api/cart', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: '未登录' });

    const userCartItems = db.cart.filter((c: any) => c.userId === token);
    const populatedCart = userCartItems.map((c: any) => {
       const product = db.products.find((p: any) => p.id === c.productId);
       return { ...c, product };
    }).filter((c: any) => c.product); // Ensure product still exists

    res.json(populatedCart);
  });

  app.post('/api/cart', (req, res) => {
     const token = req.headers.authorization?.split(' ')[1];
     if (!token) return res.status(401).json({ error: '未登录' });

     const { productId } = req.body;
     const exists = db.cart.find((c: any) => c.userId === token && c.productId === productId);
     if (!exists) {
        db.cart.push({ id: 'c' + Date.now(), userId: token, productId });
     }
     res.json({ success: true });
  });

  app.delete('/api/cart/:id', (req, res) => {
     const token = req.headers.authorization?.split(' ')[1];
     if (!token) return res.status(401).json({ error: '未登录' });

     db.cart = db.cart.filter((c: any) => c.id !== req.params.id);
     res.json({ success: true });
  });

  // Seller - Workspace
  app.get('/api/seller/products', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    const products = db.products.filter(p => p.sellerId === token).sort((a,b) => b.createdAt - a.createdAt);
    res.json(products);
  });

  app.post('/api/seller/products', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    const { title, desc, price, imageUrl, category, size, year, shipping } = req.body;
    if (!token) return res.status(401).json({ error: '未登录' });
    
    const newProduct = {
        id: 'p' + Date.now(),
        title, desc, price: Number(price), imageUrl,
        category, size, year, material: category, shipping: shipping || 'free',
        sellerId: token, status: 'pending', stock: 1, boost: 0, createdAt: Date.now()
    };
    db.products.push(newProduct as any);
    res.json(newProduct);
  });

  app.put('/api/seller/products/:id', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: '未登录' });
    const product = db.products.find((p: any) => p.id === req.params.id && p.sellerId === token);
    if (!product) return res.status(404).json({ error: '商品不存在或无权限' });

    const { title, desc, price, imageUrl, category, size, year, shipping } = req.body;
    if (title) product.title = title;
    if (desc) product.desc = desc;
    if (price) product.price = Number(price);
    if (imageUrl) product.imageUrl = imageUrl;
    if (category) {
       product.category = category;
       product.material = category;
    }
    if (size) product.size = size;
    if (year) product.year = year;
    if (shipping) product.shipping = shipping;
    // reset status after update
    product.status = 'pending';

    res.json(product);
  });

  // Simulated IAA Boost
  app.post('/api/seller/products/:id/boost', (req, res) => {
    const product = db.products.find(p => p.id === req.params.id);
    if (product) {
       product.boost += 10; // increase recommendation weight
       return res.json({ success: true, newBoost: product.boost });
    }
    res.status(404).json({ error: 'Not found' });
  });

  // Admin Api
  app.get('/api/admin/products', (req, res) => {
    const sorted = [...db.products].sort((a,b) => b.createdAt - a.createdAt);
    // attach seller name
    const withSeller = sorted.map(p => ({
        ...p,
        sellerName: db.users.find(u => u.id === p.sellerId)?.name || '未知'
    }));
    res.json(withSeller);
  });

  app.post('/api/admin/products/:id/review', (req, res) => {
    const { status } = req.body; // 'approved' or 'rejected'
    const product = db.products.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: '商品不存在' });
    product.status = status;
    res.json(product);
  });

  app.get('/api/admin/users', (req, res) => {
    // Only return those who aren't admin, mapped securely
    const u = db.users.filter(u => u.role !== 'admin').map(u => {
        const {password, ...safe} = u;
        return safe;
    });
    res.json(u);
  });
  
  app.post('/api/admin/users/:id/certify', (req, res) => {
      const user = db.users.find(u => u.id === req.params.id);
      if (!user) return res.status(404).json({error: '用户不存在'});
      user.role = 'seller';
      user.verifiedStudent = true;
      user.balance = user.balance || 0;
      res.json({success: true, user: {id: user.id, role: user.role}});
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

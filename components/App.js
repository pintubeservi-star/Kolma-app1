"use client";  
import React, { useState, useEffect, useMemo } from 'react';  
import {   
  Search, ShoppingBag, User, Plus, Minus, X,   
  CheckCircle, Flame, Navigation, Tag, Zap,   
  Phone, MessageSquare, ArrowRight, ShieldCheck, ShoppingBasket   
} from 'lucide-react';  
  
// Iconos SVG Premium  
const Icons = {  
  Lacteos: () => (  
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-8 h-8">  
      <path d="M6 18h12l1-9H5l1 9z" /><path d="M10 6h4l.5 3h-5L10 6z" /><circle cx="12" cy="14" r="2" />  
    </svg>  
  ),  
  Frutas: () => (  
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-8 h-8">  
      <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 3a8 8 0 0 1 8 7.2c0 7.3-8 11.8-8 11.8z" /><circle cx="12" cy="10" r="3" />  
    </svg>  
  ),  
  Carnes: () => (  
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-8 h-8">  
      <path d="M15 5c0 3.5-2.5 4.5-5 4.5s-5-1-5-4.5 2.24-4 5-4 5 .5 5 4z" /><path d="M15 5c0 4-4 15-4 15s-6-11-6-15" /><line x1="10" y1="2" x2="10" y2="8" />  
    </svg>  
  ),  
  Panaderia: () => (  
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-8 h-8">  
      <path d="M3 13c3.5-3 14.5-3 18 0" /><path d="M3 13v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6" /><path d="M12 13v8" /><path d="M8 13v8" /><path d="M16 13v8" />  
    </svg>  
  )  
};  
  
const COTUI_CENTER = [19.0528, -70.1492];  
  
export default function App() {  
  const [view, setView] = useState('home');  
  const [cart, setCart] = useState([]);  
  const [searchTerm, setSearchTerm] = useState('');  
  const [activeCategory, setActiveCategory] = useState('Todos');  
  const [toast, setToast] = useState(null);  
  const [showUpsell, setShowUpsell] = useState(null);  
  
  const products = [  
    { id: '1', name: 'Leche Rica Entera 1L', price: 78, oldPrice: 95, category: 'Lácteos', image: 'https://images.unsplash.com/photo-1563636619-e9107da5a1bb?auto=format&fit=crop&w=300', upsellId: '4' },  
    { id: '2', name: 'Aguacate Hass Cotuí', price: 45, oldPrice: 65, category: 'Frutas y Verduras', image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=300', upsellId: '3' },  
    { id: '3', name: 'Pechuga Pollo Premium', price: 185, oldPrice: 230, category: 'Carnes', image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=300' },  
    { id: '4', name: 'Pan Sobao Caliente', price: 55, oldPrice: 75, category: 'Panadería', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300', upsellId: '1' },  
    { id: '5', name: 'Arroz Kolma Selecto 5lb', price: 160, oldPrice: 195, category: 'Despensa', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300' },  
  ];  
  
  useEffect(() => {  
    const interval = setInterval(() => {  
      const names = ['Ana', 'Rosa', 'Miguel', 'Junior'];  
      setToast({  
        title: `${names[Math.floor(Math.random()*names.length)]} en Cotuí`,  
        desc: "Acaba de realizar un pedido express."  
      });  
      setTimeout(() => setToast(null), 4000);  
    }, 25000);  
    return () => clearInterval(interval);  
  }, []);  
  
  const filteredProducts = useMemo(() => {  
    return products.filter(p =>   
      (activeCategory === 'Todos' || p.category === activeCategory) &&  
      (p.name.toLowerCase().includes(searchTerm.toLowerCase()))  
    );  
  }, [searchTerm, activeCategory]);  
  
  const addToCart = (product, isUpsell = false) => {  
    setCart(prev => {  
      const exists = prev.find(i => i.id === product.id);  
      if (exists) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);  
      return [...prev, { ...product, qty: 1 }];  
    });  
    if (!isUpsell && product.upsellId) {  
      setShowUpsell(products.find(p => p.id === product.upsellId));  
    } else {  
      setShowUpsell(null);  
    }  
  };  
  
  const subtotal = cart.reduce((acc, i) => acc + (i.price * i.qty), 0);  
  
  const MapView = () => {  
    useEffect(() => {  
      if (!window.L || !document.getElementById('live-map')) return;  
      const map = window.L.map('live-map', { zoomControl: false }).setView(COTUI_CENTER, 15);  
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(map);  
      const icon = window.L.divIcon({ html: '<div class="w-10 h-10 marker-pin flex items-center justify-center text-white shadow-xl">🛵</div>', className: '', iconSize: [40, 40] });  
      window.L.marker(COTUI_CENTER, { icon }).addTo(map);  
      return () => map.remove();  
    }, []);  
    return <div id="live-map" className="w-full h-full min-h-[400px]" />;  
  };  
  
  return (  
    <div className="pb-24 md:pb-0 bg-[#FDFDFD] min-h-screen font-sans">  
      {/* Notificación Social */}  
      {toast && (  
        <div className="fixed top-24 left-6 z-[100] bg-white shadow-2xl rounded-3xl p-4 border border-orange-100 flex items-center gap-4 animate-in slide-in-from-left-10">  
          <div className="w-12 h-12 bg-[#FF3D00] rounded-2xl flex items-center justify-center text-white shadow-lg">  
            <ShoppingBasket size={24} />  
          </div>  
          <div>  
            <p className="text-xs font-black leading-none mb-1">{toast.title}</p>  
            <p className="text-[11px] text-gray-500 font-bold">{toast.desc}</p>  
          </div>  
        </div>  
      )}  
  
      {/* Header Premium */}  
      <header className="sticky top-0 z-[60] bg-white/80 backdrop-blur-3xl border-b border-gray-50 px-6 py-4 flex items-center justify-between shadow-sm">  
        <div className="flex items-center gap-4">  
          <div onClick={() => setView('home')} className="bg-gradient-to-br from-[#FF3D00] to-[#FF9100] text-white w-12 h-12 rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl cursor-pointer active:scale-90 transition-all">K</div>  
          <div className="hidden md:block">  
            <h1 className="font-black text-xl tracking-tighter">Kolma<span className="text-[#FF3D00]">RD</span></h1>  
            <p className="text-[10px] font-black text-[#FF9100] uppercase tracking-widest leading-none">Cotuí</p>  
          </div>  
        </div>  
  
        <div className="flex-1 max-w-lg mx-6 relative">  
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />  
          <input   
            type="text"   
            value={searchTerm}  
            onChange={(e) => setSearchTerm(e.target.value)}  
            placeholder="Lo mejor de Cotuí hoy..."   
            className="w-full bg-gray-100 rounded-full py-3 pl-12 pr-4 font-bold outline-none border-2 border-transparent focus:border-[#FF9100] transition-all text-sm"  
          />  
        </div>  
  
        <button onClick={() => setView('cart')} className="bg-[#FF3D00] text-white px-6 py-3 rounded-2xl flex items-center gap-3 shadow-xl hover:scale-105 active:scale-95 transition-all">  
          <ShoppingBag size={20} />  
          <span className="font-black border-l border-white/20 pl-3">RD$ {subtotal}</span>  
        </button>  
      </header>  
  
      <main className="max-w-7xl mx-auto p-6 md:p-10">  
        {view === 'home' && (  
          <div className="space-y-12 animate-in fade-in duration-500">  
            {/* Banner Estilo Uber */}  
            {!searchTerm && (  
              <div className="relative h-64 bg-slate-900 rounded-[40px] overflow-hidden p-10 flex items-center group cursor-pointer shadow-2xl">  
                <div className="z-10 text-white max-w-sm">  
                  <span className="bg-[#FF3D00] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 w-fit inline-block">KolmaRD Express</span>  
                  <h2 className="text-4xl font-black mb-4 tracking-tighter leading-tight">Frescura Local <br/> <span className="text-[#FF9100]">en 20 Minutos.</span></h2>  
                  <button className="bg-white text-black px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 shadow-lg">Comprar ahora <ArrowRight size={18}/></button>  
                </div>  
                <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400" className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-30 group-hover:scale-105 transition-transform duration-1000" />  
              </div>  
            )}  
  
            {/* Categorías SVG */}  
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">  
              {['Todos', 'Lácteos', 'Frutas y Verduras', 'Carnes', 'Panadería'].map(cat => (  
                <button   
                  key={cat}   
                  onClick={() => setActiveCategory(cat)}  
                  className={`flex flex-col items-center gap-3 p-6 min-w-[120px] rounded-[32px] transition-all border-4 ${activeCategory === cat ? 'bg-white border-[#FF3D00] shadow-xl -translate-y-1' : 'bg-white border-transparent opacity-50'}`}  
                >  
                  <div className={activeCategory === cat ? 'text-[#FF3D00]' : 'text-gray-400'}>  
                    {cat === 'Lácteos' ? <Icons.Lacteos /> : cat === 'Frutas y Verduras' ? <Icons.Frutas /> : cat === 'Carnes' ? <Icons.Carnes /> : <Icons.Panaderia />}  
                  </div>  
                  <span className="text-[10px] font-black uppercase tracking-widest">{cat}</span>  
                </button>  
              ))}  
            </div>  
  
            {/* Grid de Productos */}  
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">  
              {filteredProducts.map(p => (  
                <div key={p.id} className="group relative flex flex-col">  
                  <div className="relative aspect-square rounded-[40px] bg-white border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 mb-4 cursor-pointer">  
                    <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />  
                    <button   
                      onClick={() => addToCart(p)}  
                      className="absolute bottom-4 right-4 bg-black text-white p-4 rounded-2xl opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all shadow-xl hover:bg-[#FF3D00]"  
                    >  
                      <Plus size={24} strokeWidth={3} />  
                    </button>  
                  </div>  
                  <h4 className="font-bold text-base leading-tight truncate mb-2">{p.name}</h4>  
                  <div className="flex items-center gap-3">  
                    <span className="font-black text-xl tracking-tighter">RD$ {p.price}</span>  
                    <span className="text-xs text-gray-300 line-through font-bold">RD$ {p.oldPrice}</span>  
                  </div>  
                </div>  
              ))}  
            </div>  
          </div>  
        )}  
  
        {/* Carrito */}  
        {view === 'cart' && (  
          <div className="max-w-3xl mx-auto bg-white rounded-[50px] p-10 shadow-2xl border border-gray-50 animate-in slide-in-from-bottom-10">  
             <h2 className="text-4xl font-black tracking-tighter mb-10 text-center uppercase">Tu Canasta</h2>  
             {cart.length === 0 ? (  
               <div className="text-center py-20 text-gray-300 font-black text-xl italic">Canasta vacía.</div>  
             ) : (  
               <div className="space-y-6">  
                 {cart.map(item => (  
                   <div key={item.id} className="flex items-center gap-6 p-4 rounded-3xl border border-gray-50 hover:bg-orange-50/50 transition-colors">  
                     <img src={item.image} className="w-20 h-20 rounded-2xl object-cover shadow-md" />  
                     <div className="flex-1">  
                       <h4 className="font-black text-lg leading-tight">{item.name}</h4>  
                       <p className="text-[#FF3D00] font-black">RD$ {item.price}</p>  
                     </div>  
                     <div className="flex items-center gap-4 bg-gray-100 p-2 rounded-2xl">  
                        <button onClick={() => setCart(prev => prev.map(i => i.id === item.id ? {...i, qty: Math.max(0, i.qty - 1)} : i).filter(i => i.qty > 0))} className="w-8 h-8 flex items-center justify-center bg-white rounded-xl shadow-sm"><Minus size={16}/></button>  
                        <span className="font-black w-4 text-center">{item.qty}</span>  
                        <button onClick={() => addToCart(item, true)} className="w-8 h-8 flex items-center justify-center bg-white rounded-xl shadow-sm"><Plus size={16}/></button>  
                     </div>  
                   </div>  
                 ))}  
                 <div className="pt-10 border-t-8 border-gray-50 flex justify-between items-center">  
                    <h3 className="text-5xl font-black tracking-tighter">RD$ {subtotal}</h3>  
                    <button onClick={() => setView('tracking')} className="bg-[#FF3D00] text-white px-16 py-6 rounded-[32px] font-black text-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all">Pagar Ahora</button>  
                 </div>  
               </div>  
             )}  
          </div>  
        )}  
  
        {/* Tracking */}  
        {view === 'tracking' && (  
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in zoom-in-95">  
            <div className="bg-white rounded-[50px] p-12 shadow-2xl border border-gray-50">  
               <h2 className="text-4xl font-black mb-12 tracking-tighter">Orden Segura</h2>  
               <div className="space-y-10 relative">  
                  {['Validado', 'Preparado', 'En Camino', 'Entregado'].map((s, i) => (  
                    <div key={i} className="flex gap-8 items-center">  
                       <div className={`w-6 h-6 rounded-full border-4 border-white shadow-xl ${i <= 2 ? 'bg-[#FF3D00] ring-[12px] ring-orange-50 animate-pulse' : 'bg-gray-100'}`} />  
                       <span className={`text-xl font-black ${i <= 2 ? 'text-black' : 'text-gray-200'}`}>{s}</span>  
                    </div>  
                  ))}  
               </div>  
               <div className="mt-20 p-8 bg-slate-900 text-white rounded-[40px] flex flex-col sm:flex-row items-center justify-between gap-8 border border-white/5">  
                  <div className="flex items-center gap-6">  
                     <div className="w-16 h-16 bg-gradient-to-tr from-[#FF3D00] to-[#FF9100] rounded-2xl flex items-center justify-center text-4xl shadow-xl">🛵</div>  
                     <div>  
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-2">Socio KolmaRD</p>  
                        <p className="font-black text-2xl tracking-tighter leading-none">José Martínez</p>  
                     </div>  
                  </div>  
                  <div className="flex gap-4">  
                    <button className="p-5 bg-white/10 rounded-3xl"><Phone size={24}/></button>  
                    <button className="p-5 bg-[#FF3D00] rounded-3xl shadow-lg shadow-red-500/20"><MessageSquare size={24}/></button>  
                  </div>  
               </div>  
            </div>  
            <div className="h-[600px] overflow-hidden rounded-[50px] shadow-2xl sticky top-32">  
               <MapView />  
            </div>  
          </div>  
        )}  
      </main>  
  
      {/* Upsell Modal */}  
      {showUpsell && (  
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6">  
          <div className="bg-white w-full max-w-sm rounded-[50px] p-10 shadow-2xl border-t-8 border-[#FF3D00] text-center">  
            <h3 className="text-2xl font-black mb-6 italic tracking-tight">"¿Lo olvidaste, socio?"</h3>  
            <div className="bg-gray-50 p-6 rounded-[32px] flex items-center gap-4 mb-8 border border-gray-100 shadow-sm">  
               <img src={showUpsell.image} className="w-20 h-20 rounded-2xl object-cover shadow-lg" />  
               <div className="flex-1 text-left">  
                  <h4 className="font-black text-base leading-tight">{showUpsell.name}</h4>  
                  <p className="font-black text-xl text-[#FF3D00]">RD$ {showUpsell.price}</p>  
               </div>  
               <button onClick={() => addToCart(showUpsell, true)} className="bg-black text-white p-4 rounded-2xl hover:bg-[#FF3D00] transition-all shadow-xl"><Plus size={20}/></button>  
            </div>  
            <button onClick={() => setShowUpsell(null)} className="w-full text-gray-400 font-black text-xs uppercase tracking-[5px] py-2">Seguir a Pagar</button>  
          </div>  
        </div>  
      )}  
  
      {/* Nav Móvil */}  
      <nav className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-3xl border-t border-gray-50 px-10 py-6 flex justify-around md:hidden z-50 rounded-t-[50px] shadow-2xl">  
        <button onClick={() => {setView('home'); setSearchTerm('');}} className={`p-4 rounded-2xl transition-all ${view === 'home' ? 'bg-black text-white shadow-xl -translate-y-4 rotate-3 scale-110' : 'text-gray-300'}`}><Search size={28}/></button>  
        <button onClick={() => setView('cart')} className={`relative p-5 rounded-3xl transition-all ${view === 'cart' ? 'bg-[#FF3D00] text-white shadow-xl -translate-y-6 scale-125' : 'text-gray-300 bg-gray-50'}`}>  
          <ShoppingBag size={28} />  
          {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-black text-white w-7 h-7 rounded-full text-[10px] flex items-center justify-center font-black border-4 border-white">{cart.length}</span>}  
        </button>  
        <button className="p-4 rounded-2xl text-gray-300"><User size={28}/></button>  
      </nav>  
  
      <style jsx global>{`  
        .no-scrollbar::-webkit-scrollbar { display: none; }  
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }  
        .marker-pin { background: #FF3D00; border: 4px solid white; border-radius: 50%; box-shadow: 0 10px 20px rgba(255, 61, 0, 0.4); }  
        .custom-icon { background: transparent !important; border: none !important; }  
      `}</style>  
    </div>  
  );  
}

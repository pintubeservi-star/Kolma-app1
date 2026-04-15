"use client";
import { useState, useMemo } from "react";
import { ShoppingCart, Plus, Minus, Trash2, Search, ChevronRight } from "lucide-react";

export default function SuperApp() {
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");

  const categories = ["Todos", "Lácteos", "Carnes", "Despensa", "Frutas"];

  const products = [
    { id: 1, name: "Leche Rica Entera 1L", price: 85, cat: "Lácteos", img: "https://images.unsplash.com/photo-1563636619-e9107da5a1bb?w=400" },
    { id: 2, name: "Pan de Molde Integral", price: 145, cat: "Despensa", img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400" },
    { id: 3, name: "Pechuga de Pollo Fresca", price: 210, cat: "Carnes", img: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400" },
    { id: 4, name: "Arroz Selecto 10lb", price: 380, cat: "Despensa", img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400" },
    { id: 5, name: "Manzanas Galas (Paquete)", price: 195, cat: "Frutas", img: "https://images.unsplash.com/photo-1560806887-1e4cd0b6bcd6?w=400" },
    { id: 6, name: "Yogurt Natural 900g", price: 160, cat: "Lácteos", img: "https://images.unsplash.com/photo-1571212247432-8915b299b681?w=400" }
  ];

  const filtered = useMemo(() => {
    return products.filter(p => 
      (category === "Todos" || p.cat === category) &&
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, category]);

  const addToCart = (product) => {
    setCart(prev => {
      const exist = prev.find(i => i.id === product.id);
      if (exist) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const decrease = (id) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i).filter(i => i.qty > 0));
  };

  const total = cart.reduce((acc, i) => acc + i.price * i.qty, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* NAVEGACIÓN SUPERIOR */}
      <header className="bg-white sticky top-0 z-40 border-b border-gray-200">
        <div className="max-w-md mx-auto p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-extrabold text-green-700 tracking-tight">SuperMercado RD</h1>
            <div className="relative">
              <ShoppingCart className="text-gray-700" size={24} />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white font-bold">
                  {cart.length}
                </span>
              )}
            </div>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar productos y marcas..."
              className="w-full bg-gray-100 py-3 pl-10 pr-4 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-green-500 transition-all outline-none"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* CATEGORÍAS */}
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  category === c ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* GRID DE PRODUCTOS */}
      <main className="max-w-md mx-auto p-4 grid grid-cols-2 gap-4 pb-48">
        {filtered.map(p => (
          <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
            <div className="relative">
              <img src={p.img} className="w-full h-36 object-cover rounded-t-2xl" alt={p.name} />
              <span className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                {p.cat}
              </span>
            </div>
            <div className="p-3 flex-1 flex flex-col">
              <h2 className="text-sm font-semibold text-gray-800 leading-tight mb-1">{p.name}</h2>
              <p className="text-lg font-black text-green-700 mb-3">RD$ {p.price}</p>
              <button
                onClick={() => addToCart(p)}
                className="w-full mt-auto bg-green-50 text-green-700 border border-green-200 py-2 rounded-xl font-bold flex items-center justify-center gap-1 active:scale-95 transition-all hover:bg-green-600 hover:text-white"
              >
                <Plus size={16}/> Añadir
              </button>
            </div>
          </div>
        ))}
      </main>

      {/* CHECKOUT RESUMEN */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.12)] border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Subtotal</p>
                <p className="text-2xl font-black text-gray-900 font-mono">RD$ {total.toLocaleString()}</p>
              </div>
              <div className="flex -space-x-3 overflow-hidden">
                {cart.slice(0, 3).map(i => (
                  <img key={i.id} src={i.img} className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover" />
                ))}
                {cart.length > 3 && (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-xs font-bold ring-2 ring-white text-gray-500">
                    +{cart.length - 3}
                  </div>
                )}
              </div>
            </div>

            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-lg shadow-lg shadow-green-200 transition-all active:scale-[0.98]">
              Revisar Carrito <ChevronRight size={20}/>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

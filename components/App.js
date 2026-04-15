"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Search, ShoppingBag, User, Plus, Minus,
  Phone, MessageSquare, ArrowRight, ShoppingBasket
} from "lucide-react";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Iconos
const Icons = {
  Lacteos: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-8 h-8">
      <path d="M6 18h12l1-9H5l1 9z" />
      <path d="M10 6h4l.5 3h-5L10 6z" />
      <circle cx="12" cy="14" r="2" />
    </svg>
  ),
  Frutas: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-8 h-8">
      <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 3a8 8 0 0 1 8 7.2c0 7.3-8 11.8-8 11.8z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Carnes: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-8 h-8">
      <path d="M15 5c0 3.5-2.5 4.5-5 4.5s-5-1-5-4.5 2.24-4 5-4 5 .5 5 4z" />
      <path d="M15 5c0 4-4 15-4 15s-6-11-6-15" />
    </svg>
  ),
  Panaderia: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-8 h-8">
      <path d="M3 13c3.5-3 14.5-3 18 0" />
      <path d="M3 13v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6" />
    </svg>
  )
};

const COTUI_CENTER = [19.0528, -70.1492];

export default function App() {
  const [view, setView] = useState("home");
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [toast, setToast] = useState(null);

  const products = [
    { id: "1", name: "Leche Rica Entera 1L", price: 78, category: "Lácteos", image: "https://images.unsplash.com/photo-1563636619-e9107da5a1bb?auto=format&fit=crop&w=300" },
    { id: "2", name: "Aguacate Hass Cotuí", price: 45, category: "Frutas y Verduras", image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=300" },
    { id: "3", name: "Pechuga Pollo Premium", price: 185, category: "Carnes", image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=300" },
    { id: "4", name: "Pan Sobao Caliente", price: 55, category: "Panadería", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setToast({
        title: "Pedido en Cotuí",
        desc: "Nuevo pedido recibido"
      });
      setTimeout(() => setToast(null), 3000);
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p =>
      (activeCategory === "Todos" || p.category === activeCategory) &&
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, activeCategory]);

  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const subtotal = cart.reduce((acc, i) => acc + i.price * i.qty, 0);

  const MapView = () => {
    useEffect(() => {
      const map = L.map("map").setView(COTUI_CENTER, 15);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
      L.marker(COTUI_CENTER).addTo(map);
      return () => map.remove();
    }, []);
    return <div id="map" className="w-full h-[400px]" />;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">KolmaRD</h1>

      <input
        placeholder="Buscar..."
        className="border p-2 w-full mb-4"
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="grid grid-cols-2 gap-4">
        {filteredProducts.map(p => (
          <div key={p.id} className="border p-2">
            <img src={p.image} />
            <h2>{p.name}</h2>
            <p>RD$ {p.price}</p>
            <button onClick={() => addToCart(p)}>Agregar</button>
          </div>
        ))}
      </div>

      <h2 className="mt-6">Carrito: RD$ {subtotal}</h2>

      <MapView />
    </div>
  );
    }

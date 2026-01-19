// === ADMIN LOGIN + PROTECTED ADMIN PANEL + DARK PREMIUM THEME ===

import React from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://cyuqpiginylojahoytxx.supabase.co";
const supabaseKey = "sb_publishable_CiXdCgdXrbfXi2nZfc-Ywg_MGsB57DQ";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function RitualCrossesSite() {
  const isAdminRoute = typeof window !== "undefined" && window.location.search.includes("admin");
  const ALLOWED_ADMIN_EMAIL = "dgontara@mail.ru"; // <-- ЗАМЕНИ НА СВОЙ EMAIL
  const [session, setSession] = React.useState(null);
  const isAllowedAdmin = session?.user?.email === ALLOWED_ADMIN_EMAIL;
  const [authLoading, setAuthLoading] = React.useState(true);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const GlobalStyles = () => (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
      .vinzel:before,.vinzel:after{content:"";position:absolute;top:0;bottom:0;width:120px;background:radial-gradient(circle at center,rgba(214,181,110,.15),transparent 70%);pointer-events:none}
      .vinzel:before{left:0}
      .vinzel:after{right:0}
      html,body,#root{
  margin:0;
  min-height:100%;
  background:#050505;
}

body{
  background:#050505;
  color:#eee;
  font-family:Inter,sans-serif;
}

      h1,h2,h3,strong{font-family:'Playfair Display',serif}
      button{background:#141414;color:#eee;border:1px solid #333;border-radius:14px;padding:12px 18px;cursor:pointer}
      button:hover{background:#000}
      input{background:#111;border:1px solid #333;border-radius:12px;padding:10px;color:#eee}
      .grid{display:grid;grid-template-columns:repeat(4,minmax(260px,1fr));gap:32px}
      @media(max-width:1100px){.grid{grid-template-columns:repeat(3,1fr)}}
      @media(max-width:700px){.grid{grid-template-columns:repeat(2,1fr);gap:18px}}@media(max-width:480px){
  .header-address{
    position:static!important;
    margin:0 auto 12px;
    text-align:center;
  }
}
@media(max-width:480px){
  header div[style*="ст. Ленинградская"]{
    position:static!important;
    margin:0 auto 12px;
    text-align:center;
  }
}
      @media(max-width:500px){.grid{grid-template-columns:1fr}}
      .card{background:#0e0e0e;border:1px solid #2a2a2a;border-radius:22px;display:flex;flex-direction:column;height:100%;overflow:hidden}
      .imgWrap{height:300px;overflow:hidden;position:relative;cursor:zoom-in}@media(max-width:600px){.imgWrap{height:220px}}
      .imgWrap img{width:100%;height:100%;object-fit:contain;filter:brightness(.8);transition:transform .4s ease, filter .3s}.imgWrap:hover img{transform:scale(1.15);filter:brightness(1)}
      .card:hover img{filter:brightness(1)}
      .cardBody{padding:18px;display:flex;flex-direction:column;flex:1;gap:12px}
      .overlay{position:fixed;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(6px);z-index:1000;animation:fadeIn .25s ease}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
      .cartPanel{background:#0b0b0b;max-width:520px;margin:40px auto;padding:24px;border-radius:26px;display:flex;flex-direction:column;gap:18px;animation:slideUp .35s cubic-bezier(.2,.8,.2,1);max-height:calc(100vh - 80px);overflow-y:auto}
      .cartHeader{display:flex;align-items:center;justify-content:space-between}
      .cartItem{display:grid;grid-template-columns:64px 1fr auto;gap:14px;align-items:center;border:1px solid #222;border-radius:18px;padding:14px;background:#111}
      .cartItem img{width:64px;height:64px;border-radius:12px;object-fit:cover}
      .cartFooter{margin-top:auto;display:flex;flex-direction:column;gap:14px}
@media(max-width:600px){.cartPanel{max-width:none;margin:0;height:100%;border-radius:0;max-height:100vh;overflow-y:auto}}
      .qtyControls{display:flex;align-items:center;gap:10px}
      .qtyBtn{display:flex;align-items:center;justify-content:center}
      .qtyBtn{width:32px;height:32px;border-radius:50%;font-size:18px;line-height:1}
      .removeBtn{background:none;border:none;color:#a55;font-size:18px}
    `}</style>
  );

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const login = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
  };

  const logout = async () => supabase.auth.signOut();

  const [products, setProducts] = React.useState([]);
  const [editingProduct, setEditingProduct] = React.useState(null);
  const [addingProduct, setAddingProduct] = React.useState(false);
  const [category, setCategory] = React.useState("all");

  React.useEffect(() => {
    supabase.from("products").select("*").then(({ data }) => setProducts(data || []));
  }, []);

  const categories = ["all", ...new Set(products.map(p => p.category))];

  const filledProducts = [...products];
  while (filledProducts.length < 30 && products.length) {
    const base = products[filledProducts.length % products.length];
    filledProducts.push({ ...base, id: `fake-${filledProducts.length}` });
  }

  const filtered = filledProducts.filter(p => p.active && (category === "all" || p.category === category));

  const [cartOpen, setCartOpen] = React.useState(false);
  const [previewProduct, setPreviewProduct] = React.useState(null);
  const [previewIndex, setPreviewIndex] = React.useState(0);
  const [cart, setCart] = React.useState({});

  const addToCart = (p) => {
    setCart(c => ({
      ...c,
      [p.id]: c[p.id] ? { ...c[p.id], qty: c[p.id].qty + 1 } : { ...p, qty: 1 }
    }));
  };

  const total = Object.values(cart).reduce((s, i) => s + i.price * i.qty, 0);
  const totalQty = Object.values(cart).reduce((s, i) => s + i.qty, 0);

  if (authLoading) return null;

  const saveOrder = async () => {
    if (!Object.values(cart).length) return;
    await supabase.from("orders").insert([
      {
        items: Object.values(cart),
        total,
        created_at: new Date().toISOString(),
      },
    ]);
  };

  const orderText = encodeURIComponent(
    `🕯️ Заказ из магазина «Вечность»\n\n${Object.values(cart)
      .map(i => `${i.name} × ${i.qty} = ${i.price * i.qty} ₽`)
      .join("\n")}\n\nИтого: ${total} ₽`
  );

  return (
    <>
      <GlobalStyles />

      <header
  style={{
    padding: "48px 32px",
    borderBottom: "1px solid #1c1c1c",
    position: "relative",
    overflow: "hidden",
    backgroundImage: `
      linear-gradient(to bottom, rgba(0,0,0,.75), rgba(0,0,0,.95)),
      url("https://images.unsplash.com/photo-1482192596544-9eb780fc7f66")
    `,
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>

        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 260, background: "linear-gradient(180deg, rgba(20,20,20,.95), rgba(5,5,5,.95)), url('https://images.unsplash.com/photo-1519681393784-d120267933ba') center/cover", filter: "grayscale(1) brightness(.7)", maskImage: "linear-gradient(to right, black 60%, transparent)", WebkitMaskImage: "linear-gradient(to right, black 60%, transparent)" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div className="header-address" style={{ position: "absolute", top: 16, left: 64, zIndex: 5, color: "#e6e6e6", fontSize: 12, lineHeight: 1.4, maxWidth: 260 }}>
  <div style={{ fontWeight: 600 }}>📍 Краснодарский край</div>
  <div>ст. Ленинградская</div>
  <div style={{ marginTop: 6, opacity: .85 }}>ИП Гонтарь Максим Сергеевич</div>
</div>
          <div style={{ width: 120 }} />

          <div style={{ textAlign: "center" }}>
            <strong style={{ fontSize: 28, display: "block", color: "#fff" }}>Ритуальный магазин «Вечность»</strong>
            <div style={{ fontSize: 13, opacity: .8, color: "#fff" }}>Производство ритуальных принадлежностей</div>
            <div style={{ fontSize: 13, opacity: 1, marginTop: 4, color: "#fff" }}>📞 +7‑918‑977‑45‑79 — Максим</div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div onClick={() => setCartOpen(true)} style={{ cursor: "pointer", position: "relative", fontSize: 22 }}>
              🛒
              {totalQty > 0 && (
                <span style={{ position: "absolute", top: -6, right: -10, background: "#d6b56e", color: "#000", borderRadius: 999, padding: "2px 7px", fontSize: 12, fontWeight: 700 }}>
                  {totalQty}
                </span>
              )}
            </div>
            {isAllowedAdmin && <button onClick={logout}>Выйти</button>}
          </div>
        </div>

        
      </header>

      {(!session || !isAllowedAdmin) && isAdminRoute && (
        <div style={{ maxWidth: 360, margin: "60px auto" }}>
          {/* ТУМАН */}
<div style={{
  position: "absolute",
  inset: 0,
  background: `
    radial-gradient(circle at 30% 50%, rgba(255,255,255,.08), transparent 60%),
    linear-gradient(to right, rgba(255,255,255,.06), transparent 70%)
  `,
  pointerEvents: "none"
}} />

          <h3>Вход</h3>
          <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} />
          <button onClick={login}>Войти</button>
        </div>
      )}

      <main style={{ maxWidth: 1600, margin: "24px auto", padding: "24px 16px", background: "linear-gradient(180deg,#0b0b0b,#050505)", borderRadius: 24, position: "relative", overflow: "hidden", display: "flex", gap: 32 }}>
        <aside style={{ width: 220 }}><style>{`@media(max-width:768px){aside{width:100%!important;position:static!important;margin-bottom:20px}}`}</style>
          <div style={{ border: "1px solid #ddd", borderRadius: 18, padding: 18, position: "sticky", top: 40 }}>
            <strong style={{ display: "block", marginBottom: 12 }}>Каталог</strong>
            <div style={{ cursor: "pointer", fontWeight: 700 }}>Кресты</div>
          </div>
        </aside>
        <div style={{ flex: 1 }}>
          {isAllowedAdmin && isAdminRoute && (
            <button style={{ marginBottom: 24 }} onClick={() => setAddingProduct(true)}>➕ Добавить товар</button>
          )}
        <div className="grid">
          {filtered.map(p => (
            <div key={p.id} className="card" onClick={() => setPreviewProduct(p)} style={{cursor:"pointer"}}>
              <div className="imgWrap"><img src={p.image_url} alt={p.name} /></div>
              <div className="cardBody">
                <h3 style={{ color: "#fff", fontWeight: 700 }}>{p.name}</h3>
                <p style={{ flex: 1, color: "#eaeaea", fontWeight: 500, opacity: 1 }}>{p.description}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ color: "#fff", fontWeight: 800, fontSize: 20, fontFamily: "Playfair Display, serif" }}>{p.price} ₽</strong>
                  <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={(e) => { e.stopPropagation(); addToCart(p); }}>В корзину</button>
                  {isAllowedAdmin && isAdminRoute && (
                    <button style={{ background: "#222" }} onClick={() => setEditingProduct(p)}>✏️</button>
                  )}
                </div>
                </div>
              </div>
            </div>
          ))}
        </div>
              </div>
      </main>

      {previewProduct && (
        <div className="overlay" onClick={() => setPreviewProduct(null)}>
          <div className="cartPanel" onClick={e => e.stopPropagation()} style={{maxWidth:1000, padding:32}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr",gap:20}}>
              <img src={(previewProduct.images || [previewProduct.image_url])[previewIndex]} alt={previewProduct.name} style={{width:"100%",maxHeight:"75vh",borderRadius:28,objectFit:"contain"}} />
              <div style={{display:"flex",gap:12,marginTop:12}}>
                {(previewProduct.images || [previewProduct.image_url]).map((img,idx)=>(
                  <img key={idx} src={img} onClick={()=>setPreviewIndex(idx)} style={{width:80,height:80,borderRadius:12,objectFit:"cover",cursor:"pointer",opacity:idx===previewIndex?1:.5,border:idx===previewIndex?"2px solid #d6b56e":"1px solid #333"}} />
                ))}
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:16}}>
                <h2 style={{color:"#fff"}}>{previewProduct.name}</h2>
                <p style={{color:"#ddd",fontSize:16,lineHeight:1.6}}>{previewProduct.description}</p>
                <div style={{fontSize:28,fontWeight:800,color:"#fff",fontFamily:"Playfair Display, serif"}}>{previewProduct.price} ₽</div>
                <button onClick={() => addToCart(previewProduct)} style={{marginTop:"auto"}}>Добавить в корзину</button>
              </div>
            </div>
          </div>
        </div>
      )}


      {addingProduct && (
        <div className="overlay" onClick={() => setAddingProduct(false)}>
          <div className="cartPanel" onClick={e => e.stopPropagation()}>
            <h2 style={{ color: "#fff" }}>Добавить товар</h2>
            <input placeholder="Название" onChange={e => setEditingProduct({ ...(editingProduct || {}), name: e.target.value })} />
            <textarea placeholder="Описание" style={{ background: "#111", color: "#fff", borderRadius: 12, padding: 10 }} onChange={e => setEditingProduct({ ...(editingProduct || {}), description: e.target.value })} />
            <input type="number" placeholder="Цена" onChange={e => setEditingProduct({ ...(editingProduct || {}), price: Number(e.target.value) })} />
            <input type="file" accept="image/*" onChange={async e => {
  const file = e.target.files?.[0];
  if (!file) return;
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const { error } = await supabase.storage.from('products').upload(fileName, file);
  if (error) { alert('Ошибка загрузки'); return; }
  const { data } = supabase.storage.from('products').getPublicUrl(fileName);
  setEditingProduct({ ...editingProduct, image_url: data.publicUrl });
}} />
            <label style={{ color: "#fff" }}><input type="checkbox" checked={editingProduct.active} onChange={e => setEditingProduct({ ...editingProduct, active: e.target.checked })} /> Активен</label>
            <button onClick={async () => {
              await supabase.from("products").update({
                name: editingProduct.name,
                description: editingProduct.description,
                price: editingProduct.price,
                image_url: editingProduct.image_url,
                active: editingProduct.active,
              }).eq("id", editingProduct.id);
              const { data } = await supabase.from("products").select("*");
              setProducts(data || []);
              setEditingProduct(null);
            }}>💾 Сохранить</button>
          </div>
        </div>
      )}

      {cartOpen && (
        <div className="overlay" onClick={() => setCartOpen(false)}>
          <div className="cartPanel" onClick={e => e.stopPropagation()}>
            <h2 style={{ textAlign: "center", color: "#fff", fontWeight: 700 }}>🛒 Корзина</h2>

            {Object.values(cart).length === 0 && <p style={{ color: "#fff", fontWeight: 600 }}>Пусто</p>}

            {Object.values(cart).map(i => (
              <div key={i.id} style={{ display: "flex", gap: 14, alignItems: "center", border: "1px solid #222", borderRadius: 16, padding: 12 }}>
                <img src={i.image_url} alt={i.name} style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 12 }} />
                <div style={{ flex: 1 }}>
                  <strong style={{ color: "#fff", fontWeight: 700 }}>{i.name}</strong>
                  <div style={{ fontSize: 12, opacity: .85, color: "#fff", fontWeight: 600 }}>{i.price} ₽ / шт</div>
                </div>
                <div className="qtyControls">
  <button className="qtyBtn" onClick={() => setCart(c => ({ ...c, [i.id]: { ...i, qty: Math.max(1, i.qty - 1) } }))}>−</button>
  <input
    type="number"
    min={1}
    value={i.qty}
    onChange={e => {
      const val = Math.max(1, Number(e.target.value) || 1);
      setCart(c => ({ ...c, [i.id]: { ...i, qty: val } }));
    }}
    style={{ width: 64, textAlign: "center", background: "#000", color: "#fff", border: "1px solid #333", borderRadius: 10, fontWeight: 700, fontSize: 16 }}
  />
  <button className="qtyBtn" onClick={() => setCart(c => ({ ...c, [i.id]: { ...i, qty: i.qty + 1 } }))}>+</button>
  <button className="removeBtn" onClick={() => setCart(c => { const copy = { ...c }; delete copy[i.id]; return copy; })}>✕</button>
</div>
              </div>
            ))}

            <div style={{ marginTop: 8, padding: 16, borderRadius: 18, background: "linear-gradient(135deg,#1a1a1a,#0e0e0e)", border: "1px solid #d6b56e", boxShadow: "0 0 0 1px rgba(214,181,110,.15), 0 10px 30px rgba(0,0,0,.6)", textAlign: "center" }}>
              <div style={{ fontSize: 13, letterSpacing: 1, opacity: .8, color: "#d6b56e", marginBottom: 6 }}>ИТОГО К ОПЛАТЕ</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", fontFamily: "Playfair Display, serif" }}>{total} ₽</div>
            </div>

            {/* ОФОРМЛЕНИЕ ЗАКАЗА */}
            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ border: "1px solid #222", borderRadius: 18, padding: 16, color: "#fff" }}>
                <strong style={{ color: "#fff", fontWeight: 700 }}>Регион доставки</strong>
                <input style={{ width: "100%", marginTop: 8 }} placeholder="Город" />
                <input style={{ width: "100%", marginTop: 8 }} placeholder="Адрес" />
              </div>

              <div style={{ border: "1px solid #222", borderRadius: 18, padding: 16, color: "#fff" }}>
                <strong style={{ color: "#fff", fontWeight: 700 }}>Способ получения</strong>
                <label style={{ display: "block", marginTop: 8, color: "#fff", fontWeight: 500 }}><input type="radio" defaultChecked /> Доставка курьером</label>
                <label style={{ display: "block", marginTop: 6 }}><input type="radio" /> Самовывоз — 0 ₽</label>
              </div>

              <div style={{ border: "1px solid #222", borderRadius: 18, padding: 16, color: "#fff" }}>
                <strong style={{ color: "#fff", fontWeight: 700 }}>Покупатель</strong>
                <input style={{ width: "100%", marginTop: 8 }} placeholder="ФИО" />
                <input style={{ width: "100%", marginTop: 8 }} placeholder="E-mail" />
                <input style={{ width: "100%", marginTop: 8 }} placeholder="Телефон" />
                <textarea style={{ width: "100%", marginTop: 8, background: "#111", border: "1px solid #333", borderRadius: 12, padding: 10, color: "#eee" }} placeholder="Комментарий к заказу" />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
              <a onClick={saveOrder} href={`https://t.me/+79189774579?text=${orderText}`} target="_blank" style={{ textAlign: "center", textDecoration: "none", padding: 14, borderRadius: 14, background: "#1b1b1b", border: "1px solid #333", color: "#eee" }}>📨 Оформить в Telegram</a>
              <a onClick={saveOrder} href={`https://wa.me/79189774579?text=${orderText}`} target="_blank" style={{ textAlign: "center", textDecoration: "none", padding: 14, borderRadius: 14, background: "#0f2e1c", border: "1px solid #2f6", color: "#bfffdc" }}>💬 Оформить в WhatsApp</a>
              <a onClick={saveOrder} href={`https://vk.com/gontarmaksim?msg=${orderText}`} target="_blank" style={{ textAlign: "center", textDecoration: "none", padding: 14, borderRadius: 14, background: "#1b3a6b", border: "1px solid #4a76a8", color: "#fff", fontWeight: 700 }}>💬 Оформить во ВКонтакте</a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

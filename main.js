// --- 1. KHỞI TẠO & AN TOÀN ---
const appStore = new Store();
const appRouter = new Router();

const SafeToast = {
    success: (msg) => { if(typeof Toast!=='undefined') Toast.success(msg); else alert("✅ "+msg); },
    error: (msg) => { if(typeof Toast!=='undefined') Toast.error(msg); else alert("❌ "+msg); },
    info: (msg) => { if(typeof Toast!=='undefined') Toast.info(msg); else console.log(msg); }
};

// Guard: Yêu cầu đăng nhập
function requireAuth() {
    if (!appStore.isLoggedIn()) {
        SafeToast.error("Bạn cần đăng nhập!");
        appRouter.navigate("login");
        return false;
    }
    return true;
}

// Guard: Yêu cầu quyền Admin (MỚI)
function requireAdmin() {
    if (!appStore.isLoggedIn()) {
        appRouter.navigate("login");
        return false;
    }
    if (!appStore.isAdmin()) {
        SafeToast.error("Bạn không có quyền truy cập trang quản trị!");
        appRouter.navigate("home");
        return false;
    }
    return true;
}

// --- 2. CẤU HÌNH ROUTES ---

// Login
appRouter.addRoute("login", () => {
    return new LoginPage(
        () => {
            // Login xong, nếu là admin thì vào thẳng dashboard, không thì về home
            if (appStore.isAdmin()) appRouter.navigate("admin-dashboard");
            else appRouter.navigate("home");
        },
        () => appRouter.navigate("register")
    );
});

// Register
appRouter.addRoute("register", () => {
    return new RegisterPage(
        () => appRouter.navigate("login"),
        () => appRouter.navigate("login")
    );
});

// Trang Chủ
appRouter.addRoute("home", () => createHomeView());

// --- ROUTE ADMIN (PLACEHOLDER - ĐỂ CHUẨN BỊ CHO BƯỚC SAU) ---
appRouter.addRoute("admin-dashboard", () => {
    // 1. Kiểm tra quyền Admin (Security)
    if (!requireAdmin()) return null;
    
    // 2. Render giao diện Dashboard thật
    return new AdminDashboard();
});

// Trang Đơn Hàng
appRouter.addRoute("orders", () => {
  if (!requireAuth()) return null;
  return new OrderHistoryPage(
    appStore.getOrders(),
    () => appRouter.navigate("home"),
    (id) => { appStore.cancelOrder(id); SafeToast.info("Đã hủy đơn hàng."); },
    (id) => appRouter.navigate("order-detail", id)
  );
});

// Chi tiết đơn hàng
appRouter.addRoute("order-detail", (orderId) => {
    if (!requireAuth()) return null;
    const order = appStore.getOrderById(orderId);
    if (!order) {
        SafeToast.error("Không tìm thấy đơn hàng!");
        setTimeout(() => appRouter.navigate("orders"), 100);
        return new Component("div", { class: "container" }, [ new Component("p", {}, ["Loading..."]) ]);
    }
    return new OrderDetailPage(order, () => appRouter.navigate("orders"));
});

// Profile
appRouter.addRoute("profile", () => {
    if (!requireAuth()) return null;
    return new ProfilePage(
        appStore.getCurrentUser(),
        (newInfo) => {
            const res = appStore.updateProfile(newInfo);
            res.success ? SafeToast.success(res.message) : SafeToast.error(res.message);
        },
        (oldPass, newPass) => {
            const res = appStore.changePassword(oldPass, newPass);
            res.success ? SafeToast.success(res.message) : SafeToast.error(res.message);
        },
        () => appRouter.navigate("home")
    );
});

// Chi tiết sản phẩm (Lấy từ Store thay vì biến cục bộ)
appRouter.addRoute("detail", (product) => {
  return new ProductDetailPage(
    product,
    () => appRouter.navigate("home"),
    (p) => { 
        if (requireAuth()) {
            appStore.addToCart(p);
            SafeToast.success(`Đã thêm <b>${p.name}</b> vào giỏ!`);
        }
    },
    (p) => { 
        if (requireAuth()) {
            appStore.addToCart(p);
            appRouter.navigate("checkout");
        }
    }
  );
});

// Giỏ hàng
appRouter.addRoute("cart", () => {
  if (!requireAuth()) return null;
  return new CartPage(
    appStore.cart,
    () => appRouter.navigate("home"),
    () => { if (confirm("Xóa hết giỏ hàng?")) { appStore.clearCart(); SafeToast.info("Đã xóa sạch giỏ hàng."); } },
    (id) => appStore.increaseQuantity(id),
    (id) => appStore.decreaseQuantity(id),
    () => appRouter.navigate("checkout")
  );
});

// Thanh toán
appRouter.addRoute("checkout", () => {
  if (!requireAuth()) return null;
  if (appStore.cart.length === 0) {
    return new Component("div", { class: "container", style: "text-align:center; padding-top:50px" }, [
        new Component("h2", {}, ["Giỏ hàng trống"]),
        new Component("p", { style: "margin: 15px 0; color: #666;" }, ["Hãy chọn sản phẩm trước."]),
        new Button("Quay lại mua sắm", () => appRouter.navigate("home"), "primary")
    ]);
  }
  return new CheckoutPage(
    appStore.cart,
    (orderData) => {
      appStore.placeOrder(orderData);
      SafeToast.success(`Đặt hàng thành công!`);
      setTimeout(() => appRouter.navigate("orders"), 1500);
    },
    () => appRouter.navigate("cart"),
    (id) => { appStore.removeItem(id); SafeToast.info("Đã xóa sản phẩm."); }, 
    (id) => appStore.increaseQuantity(id),
    (id) => appStore.decreaseQuantity(id)
  );
});

// --- 3. LAYOUT & RENDER ---
appRouter.subscribe((pageComponent) => {
  const root = document.getElementById("root");
  if (!pageComponent) return; 

  root.innerHTML = "";
  const appContainer = new Component(
    "div",
    { style: "display: flex; flex-direction: column; min-height: 100vh;" },
    [
      new Header(),
      new Component("div", { style: "flex: 1; padding-bottom: 20px;" }, [pageComponent]),
      new Footer(),
    ]
  );
  root.appendChild(appContainer.render());
  updateHeaderState();
});

appStore.subscribe(() => appRouter.render());

// --- 4. DATA LOGIC (ĐÃ BỎ BIẾN PRODUCTS CỨNG - LẤY TỪ STORE) ---

// Logic Trang Chủ
function createHomeView() {
  const filterSection = new Component("div", { class: "filter-bar" }, [
      new Component("input", { 
          id: "search-input", class: "search-input", placeholder: "🔍 Tìm sản phẩm...", 
          oninput: () => filterProducts() 
      }),
      new Component("select", { 
          id: "category-select", class: "category-select", onchange: () => filterProducts() 
      }, [
          new Component("option", { value: "all" }, ["Tất cả danh mục"]),
          new Component("option", { value: "nike" }, ["Nike"]),
          new Component("option", { value: "adidas" }, ["Adidas"]),
          new Component("option", { value: "puma" }, ["Puma"]),
          new Component("option", { value: "converse" }, ["Converse"]),
          new Component("option", { value: "vans" }, ["Vans"]),
          new Component("option", { value: "dep" }, ["Dép"]),
      ])
  ]);

  const productGrid = new Component("div", { id: "product-grid", class: "grid" }, []);

  // Lấy dữ liệu từ Store (Quan trọng)
  const allProducts = appStore.getProducts();

  const filterProducts = () => {
      const searchEl = document.getElementById("search-input");
      const catEl = document.getElementById("category-select");
      if (!searchEl || !catEl) return;

      const keyword = searchEl.value.toLowerCase().trim();
      const category = catEl.value;

      const filtered = allProducts.filter(p => {
          const matchName = p.name.toLowerCase().includes(keyword);
          const matchCat = category === "all" || p.category === category;
          return matchName && matchCat;
      });

      const gridEl = document.getElementById("product-grid");
      if(gridEl) {
          gridEl.innerHTML = "";
          if(filtered.length === 0) {
              gridEl.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #666;"><h3>Không tìm thấy sản phẩm nào!</h3></div>`;
              return;
          }
          filtered.forEach(item => {
              const card = new ProductCard(
                  item,
                  (p) => { 
                      if (requireAuth()) { 
                          appStore.addToCart(p); 
                          SafeToast.success(`Đã thêm <b>${p.name}</b>!`); 
                      }
                  },
                  (p) => appRouter.navigate("detail", p)
              );
              gridEl.appendChild(card.render());
          });
      }
  };

  const homeContainer = new Component("div", { class: "container" }, [
      new Component("h1", { class: "title-main" }, ["SẢN PHẨM MỚI"]),
      filterSection,
      productGrid
  ]);

  setTimeout(() => filterProducts(), 0);
  return homeContainer;
}

function updateHeaderState() {
  const countEl = document.getElementById("cart-count");
  if (countEl) {
    const count = appStore.getCount();
    countEl.textContent = count;
    countEl.style.display = count > 0 ? "flex" : "none";
    if (count > 0) {
         countEl.parentElement.animate(
            [{ transform: "scale(1)" }, { transform: "scale(1.2)" }, { transform: "scale(1)" }],
            { duration: 200 }
         );
    }
  }
  const cartBtn = document.getElementById("cart-btn");
  if (cartBtn) cartBtn.onclick = () => appRouter.navigate("cart");
}

window.app = { navigate: (p) => appRouter.navigate(p) };
appRouter.navigate("home");
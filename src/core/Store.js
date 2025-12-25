class Store {
    constructor() {
        // 1. DATA CŨ
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.orders = JSON.parse(localStorage.getItem('orders')) || [];
        this.userBalance = parseFloat(localStorage.getItem('user_balance')) || 2000;

        // 2. AUTH DATA
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

        // --- ĐOẠN MỚI: TỰ ĐỘNG TẠO ADMIN NẾU CHƯA CÓ ---
        const adminEmail = "admin@shop.com";
        const hasAdmin = this.users.find(u => u.email === adminEmail);
        
        if (!hasAdmin) {
            const adminUser = {
                id: 9999, 
                name: "Admin Boss", 
                email: adminEmail, 
                password: "123", // Mật khẩu mặc định
                role: "admin",   // <--- QUYỀN ADMIN
                phone: "0999999999",
                address: "Trụ sở chính"
            };
            this.users.push(adminUser);
            localStorage.setItem('users', JSON.stringify(this.users));
            console.log("✅ Đã tự động tạo tài khoản Admin: admin@shop.com / 123");
        }
        // ------------------------------------------------

        // 3. DATA SẢN PHẨM
        let storedProducts = JSON.parse(localStorage.getItem('products'));
        if (!storedProducts || storedProducts.length === 0) {
            storedProducts = [
                { id: 1, category: "nike", name: "Nike Air Jordan", price: 500, description: "Huyền thoại bóng rổ.", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500" },
                { id: 2, category: "adidas", name: "Adidas UltraBoost", price: 300, description: "Công nghệ Boost.", image: "https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?w=500" },
                { id: 3, category: "dep", name: "Dép Tổ Ong", price: 10, description: "Huyền thoại Việt Nam.", image: "https://down-vn.img.susercontent.com/file/49339e7284725028d0972b260f890506" },
                { id: 4, category: "puma", name: "Puma Running", price: 200, description: "Thiết kế khí động học.", image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500" },
                { id: 5, category: "converse", name: "Converse Chuck 70", price: 150, description: "Cổ điển.", image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500" },
                { id: 6, category: "vans", name: "Vans Old Skool", price: 120, description: "Dành cho Skater.", image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500" },
            ];
            localStorage.setItem('products', JSON.stringify(storedProducts));
        }
        this.products = storedProducts;

        this.observers = [];
    }

    subscribe(callback) { this.observers.push(callback); }
    notify() { this.observers.forEach(cb => cb()); }
    
    save() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
        localStorage.setItem('orders', JSON.stringify(this.orders));
        localStorage.setItem('user_balance', this.userBalance);
        localStorage.setItem('users', JSON.stringify(this.users));
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        // MỚI: Lưu sản phẩm
        localStorage.setItem('products', JSON.stringify(this.products));
    }

    // --- PRODUCT MANAGEMENT (MỚI CHO ADMIN) ---
    getProducts() {
        return this.products;
    }

    getProductById(id) {
        return this.products.find(p => p.id === Number(id));
    }

    // Thêm sản phẩm
    addProduct(product) {
        const newProduct = { ...product, id: Date.now() }; // Tự sinh ID
        this.products.push(newProduct);
        this.save();
        this.notify();
        return { success: true, message: "Thêm sản phẩm thành công!" };
    }

    // Sửa sản phẩm
    updateProduct(id, newInfo) {
        const index = this.products.findIndex(p => p.id === Number(id));
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...newInfo };
            this.save();
            this.notify();
            return { success: true, message: "Cập nhật thành công!" };
        }
        return { success: false, message: "Không tìm thấy sản phẩm!" };
    }

    // Xóa sản phẩm
    deleteProduct(id) {
        this.products = this.products.filter(p => p.id !== Number(id));
        this.save();
        this.notify(); // Giao diện trang chủ sẽ tự biến mất sản phẩm này
        return { success: true, message: "Đã xóa sản phẩm!" };
    }

    // --- AUTH METHODS (CẬP NHẬT ROLE) ---
    isLoggedIn() { return this.currentUser !== null; }
    
    // Kiểm tra có phải Admin không?
    isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    }

    getCurrentUser() { return this.currentUser; }

    register(name, email, password) {
        const exist = this.users.find(u => u.email === email);
        if (exist) return { success: false, message: "Email đã tồn tại!" };
        
        // Mặc định đăng ký mới là 'customer'
        const newUser = { id: Date.now(), name, email, password, role: 'customer', phone: '', address: '' };
        this.users.push(newUser);
        this.save();
        return { success: true, message: "Đăng ký thành công!" };
    }

    login(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        if (user) {
            this.currentUser = user;
            this.save();
            this.notify();
            return { success: true, message: `Chào mừng ${user.name}!` };
        }
        return { success: false, message: "Sai email hoặc mật khẩu!" };
    }

    logout() {
        this.currentUser = null;
        this.cart = []; 
        this.save();
        this.notify();
    }

    updateProfile(updatedInfo) {
        if (!this.currentUser) return { success: false, message: "Chưa đăng nhập!" };
        this.currentUser = { ...this.currentUser, ...updatedInfo };
        const index = this.users.findIndex(u => u.id === this.currentUser.id);
        if (index !== -1) this.users[index] = this.currentUser;
        this.save();
        this.notify();
        return { success: true, message: "Cập nhật hồ sơ thành công!" };
    }

    changePassword(oldPass, newPass) {
        if (!this.currentUser) return { success: false, message: "Chưa đăng nhập!" };
        if (this.currentUser.password !== oldPass) return { success: false, message: "Mật khẩu cũ không đúng!" };
        this.currentUser.password = newPass;
        const index = this.users.findIndex(u => u.id === this.currentUser.id);
        if (index !== -1) this.users[index] = this.currentUser;
        this.save();
        return { success: true, message: "Đổi mật khẩu thành công!" };
    }

    // --- LOGIC CŨ GIỮ NGUYÊN ---
    getCount() { return this.cart.reduce((total, item) => total + item.quantity, 0); }
    addToCart(product) { 
        const existItem = this.cart.find(i => i.id === product.id);
        if (existItem) existItem.quantity++; else this.cart.push({ ...product, quantity: 1 });
        this.save(); this.notify();
    }
    increaseQuantity(id) { const i = this.cart.find(item => item.id === id); if(i) i.quantity++; this.save(); this.notify(); }
    decreaseQuantity(id) { const i = this.cart.find(item => item.id === id); if(i && i.quantity > 1) i.quantity--; else this.cart = this.cart.filter(item => item.id !== id); this.save(); this.notify(); }
    removeItem(id) { this.cart = this.cart.filter(i => i.id !== id); this.save(); this.notify(); }
    clearCart() { this.cart = []; this.save(); this.notify(); }
    getOrders() { return this.orders.sort((a,b) => new Date(b.date) - new Date(a.date)); }
    getOrderById(id) { return this.orders.find(o => o.id === Number(id)); }
    placeOrder(data) {
        this.orders.push({ id: Date.now(), date: new Date().toISOString(), status: 'Đang xử lý', ...data });
        const boughtIds = data.items.map(i => i.id);
        this.cart = this.cart.filter(item => !boughtIds.includes(item.id));
        this.save(); this.notify();
    }
    cancelOrder(id) { const o = this.orders.find(i => i.id === id); if(o){o.status='Đã hủy';this.save();this.notify();} }
    getBalance() { return this.userBalance; }
    topUpWallet(amt) { this.userBalance += amt; this.save(); this.notify(); }
    payOrder(amt, method) {
        if(method === 'cod') return { success: true };
        if(method === 'momo') {
            if(this.userBalance >= amt) { this.userBalance -= amt; this.save(); this.notify(); return { success: true }; }
            return { success: false, message: "Số dư không đủ!" };
        }
        return { success: false };
    }
}
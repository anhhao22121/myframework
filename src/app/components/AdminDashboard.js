class AdminDashboard extends Component {
    constructor() {
        const store = appStore;
        
        // State quản lý giao diện
        // mode: 'list' (xem ds), 'add' (thêm mới), 'edit' (sửa)
        let state = {
            mode: 'list',
            editingId: null
        };

        // --- 1. SIDEBAR (MENU TRÁI) ---
        const sidebar = new Component("div", { class: "admin-sidebar" }, [
            new Component("div", { class: "admin-logo" }, ["ADMIN PANEL"]),
            new Component("ul", { class: "admin-menu" }, [
                new Component("li", { class: "active" }, ["📦 Quản lý sản phẩm"]),
                new Component("li", { style:"opacity:0.5; cursor:not-allowed" }, ["📄 Đơn hàng (Coming soon)"]),
                new Component("li", { style:"opacity:0.5; cursor:not-allowed" }, ["👥 Khách hàng (Coming soon)"]),
            ]),
            new Button("Đăng xuất", () => {
                if(confirm("Đăng xuất khỏi Admin?")) {
                    store.logout();
                    window.app.navigate("home");
                }
            }, "btn-danger", { style: "margin-top:auto; width:100%" })
        ]);

        // --- 2. HÀM RENDER FORM (THÊM / SỬA) ---
        const renderForm = () => {
            const isEdit = state.mode === 'edit';
            const product = isEdit ? store.getProductById(state.editingId) : {};

            return new Component("div", { class: "admin-card" }, [
                new Component("h3", {}, [isEdit ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"]),
                
                // Các ô input
                new Component("div", { class: "form-group" }, [
                    new Component("label", {}, ["Tên sản phẩm"]),
                    new Component("input", { id: "p-name", class: "form-input", value: product.name || "" })
                ]),
                new Component("div", { class: "form-grid-2" }, [
                    new Component("div", { class: "form-group" }, [
                        new Component("label", {}, ["Giá ($)"]),
                        new Component("input", { id: "p-price", type: "number", class: "form-input", value: product.price || "" })
                    ]),
                    new Component("div", { class: "form-group" }, [
                        new Component("label", {}, ["Danh mục"]),
                        new Component("select", { id: "p-cat", class: "form-input" }, [
                            new Component("option", { value: "nike", selected: product.category === 'nike' }, ["Nike"]),
                            new Component("option", { value: "adidas", selected: product.category === 'adidas' }, ["Adidas"]),
                            new Component("option", { value: "puma", selected: product.category === 'puma' }, ["Puma"]),
                            new Component("option", { value: "converse", selected: product.category === 'converse' }, ["Converse"]),
                            new Component("option", { value: "vans", selected: product.category === 'vans' }, ["Vans"]),
                            new Component("option", { value: "dep", selected: product.category === 'dep' }, ["Dép"]),
                        ])
                    ])
                ]),
                new Component("div", { class: "form-group" }, [
                    new Component("label", {}, ["Link ảnh"]),
                    new Component("input", { id: "p-img", class: "form-input", value: product.image || "", placeholder: "https://..." })
                ]),
                new Component("div", { class: "form-group" }, [
                    new Component("label", {}, ["Mô tả"]),
                    new Component("input", { id: "p-desc", class: "form-input", value: product.description || "" })
                ]),

                // Nút bấm
                new Component("div", { style: "display:flex; gap:10px; margin-top:20px" }, [
                    new Button("Lưu lại", () => {
                        const name = document.getElementById("p-name").value;
                        const price = Number(document.getElementById("p-price").value);
                        const category = document.getElementById("p-cat").value;
                        const image = document.getElementById("p-img").value;
                        const description = document.getElementById("p-desc").value;

                        if (!name || !price) return alert("Vui lòng nhập tên và giá!");

                        const data = { name, price, category, image, description };
                        
                        if (isEdit) {
                            store.updateProduct(state.editingId, data);
                            alert("Đã cập nhật!");
                        } else {
                            store.addProduct(data);
                            alert("Đã thêm mới!");
                        }
                        // Reset về list
                        state.mode = 'list';
                        refresh();
                    }, "primary"),
                    
                    new Button("Hủy", () => {
                        state.mode = 'list';
                        refresh();
                    }, "secondary")
                ])
            ]);
        };

        // --- 3. HÀM RENDER DANH SÁCH (TABLE) ---
        const renderList = () => {
            const products = store.getProducts();

            // Header bảng
            const headerRow = new Component("div", { class: "table-row header" }, [
                new Component("div", { style: "width:60px" }, ["Ảnh"]),
                new Component("div", { style: "flex:1" }, ["Tên sản phẩm"]),
                new Component("div", { style: "width:100px" }, ["Giá"]),
                new Component("div", { style: "width:100px" }, ["Danh mục"]),
                new Component("div", { style: "width:150px; text-align:right" }, ["Hành động"])
            ]);

            // Dòng dữ liệu
            const rows = products.map(p => 
                new Component("div", { class: "table-row" }, [
                    new Component("img", { src: p.image, style: "width:40px; height:40px; object-fit:cover; border-radius:4px" }),
                    new Component("div", { style: "flex:1; font-weight:500" }, [p.name]),
                    new Component("div", { style: "width:100px; color:green; font-weight:bold" }, [`$${p.price}`]),
                    new Component("div", { style: "width:100px; text-transform:capitalize" }, [p.category]),
                    new Component("div", { style: "width:150px; text-align:right; display:flex; justify-content:flex-end; gap:5px" }, [
                        new Button("Sửa", () => {
                            state.mode = 'edit';
                            state.editingId = p.id;
                            refresh();
                        }, "sm btn-secondary"),
                        new Button("Xóa", () => {
                            if(confirm(`Xóa "${p.name}"?`)) {
                                store.deleteProduct(p.id);
                                refresh();
                            }
                        }, "sm btn-danger")
                    ])
                ])
            );

            return new Component("div", { class: "admin-card" }, [
                new Component("div", { style: "display:flex; justify-content:space-between; margin-bottom:20px" }, [
                    new Component("h3", {}, [`Danh sách sản phẩm (${products.length})`]),
                    new Button("+ Thêm mới", () => {
                        state.mode = 'add';
                        refresh();
                    }, "primary")
                ]),
                new Component("div", { class: "table-container" }, [headerRow, ...rows])
            ]);
        };

        // --- 4. LAYOUT CHÍNH ---
        const contentArea = new Component("div", { id: "admin-content", class: "admin-content" }, []);

        // Hàm vẽ lại nội dung bên phải
        const refresh = () => {
            const dom = document.getElementById("admin-content");
            if (!dom) return;
            dom.innerHTML = "";
            
            const view = state.mode === 'list' ? renderList() : renderForm();
            dom.appendChild(view.render());
        };

        super("div", { class: "admin-layout" }, [sidebar, contentArea]);
        
        // Trick: Đợi render xong khung thì mới vẽ nội dung
        setTimeout(refresh, 0);
    }
}
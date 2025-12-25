class Header extends Component {
  constructor() {
    const user = appStore.getCurrentUser();
    const isLoggedIn = user !== null;

    const logo = new Component("div", { class: "logo", onclick: () => window.app.navigate("home"), style: "cursor: pointer;" }, ["MyShop"]);

    const rightElements = [];

    if (isLoggedIn) {
        // Nút Giỏ hàng
        const cartBtn = new Component("button", { id: "cart-btn", class: "cart-btn" }, [
            "Giỏ hàng ", new Component("span", { id: "cart-count", class: "badge" }, ["0"])
        ]);

        // Nút Đơn mua
        const orderBtn = new Component("button", { 
            style: "margin-right:10px; padding:5px 10px; cursor:pointer; background:none; border:1px solid #eee; border-radius:4px",
            onclick: () => window.app.navigate("orders")
        }, ["Đơn mua"]);

        // --- CẬP NHẬT: Tên User bấm vào được ---
        const userInfo = new Component("button", { 
            style: "margin-right:10px; font-weight:bold; color:#667eea; background:none; border:none; cursor:pointer; font-size:15px",
            onclick: () => window.app.navigate("profile") // Chuyển sang Profile
        }, [`Hi, ${user.name}`]);
        
        // Nút Thoát
        const logoutBtn = new Button("Thoát", () => {
            if(confirm("Bạn có chắc muốn đăng xuất?")) {
                appStore.logout();
                window.app.navigate("home");
                if(typeof Toast !== 'undefined') Toast.info("Đã đăng xuất.");
            }
        }, "sm btn-danger");

        rightElements.push(orderBtn, cartBtn, userInfo, logoutBtn);
    } else {
        const loginBtn = new Button("Đăng nhập", () => window.app.navigate("login"), "primary");
        const regBtn = new Button("Đăng ký", () => window.app.navigate("register"), "secondary", { style: "margin-left:5px" });
        rightElements.push(loginBtn, regBtn);
    }

    const nav = new Component("nav", { class: "nav-links" }, rightElements);
    super("header", { class: "header" }, [logo, nav]);
  }
}
class LoginPage extends Component {
    constructor(onLoginSuccess, onGoRegister) {
        super("div", { class: "container", style: "max-width:400px; margin-top:50px; padding:20px; border:1px solid #ddd; border-radius:8px; background:#fff" }, [
            new Component("h2", { style: "text-align:center; margin-bottom:20px; color:#333" }, ["Đăng Nhập"]),
            
            new Component("div", { class: "form-group" }, [
                new Component("label", {}, ["Email"]),
                new Component("input", { id: "login-email", class: "form-input", type: "email", placeholder: "admin@gmail.com", style:"width:100%" })
            ]),
            new Component("div", { class: "form-group" }, [
                new Component("label", {}, ["Mật khẩu"]),
                new Component("input", { id: "login-pass", class: "form-input", type: "password", placeholder: "******", style:"width:100%" })
            ]),

            new Button("ĐĂNG NHẬP", () => {
                const email = document.getElementById("login-email").value.trim();
                const pass = document.getElementById("login-pass").value.trim();
                
                if (!email || !pass) {
                    if(typeof Toast !== 'undefined') Toast.error("Vui lòng nhập đủ thông tin!");
                    else alert("Vui lòng nhập đủ thông tin!");
                    return;
                }

                // Gọi Store
                const result = appStore.login(email, pass);
                if (result.success) {
                    if(typeof Toast !== 'undefined') Toast.success(result.message);
                    onLoginSuccess(); // Callback chuyển trang
                } else {
                    if(typeof Toast !== 'undefined') Toast.error(result.message);
                    else alert(result.message);
                }
            }, "primary", { style: "width:100%; margin-top:20px; padding:12px; font-weight:bold" }),

            new Component("div", { style: "margin-top:15px; text-align:center; font-size:14px" }, [
                new Component("span", { style: "color:#666" }, ["Chưa có tài khoản? "]),
                new Button("Đăng ký ngay", onGoRegister, "btn-link", { style: "text-decoration:underline; color:var(--primary-color); background:none; border:none; cursor:pointer" })
            ])
        ]);
    }
}
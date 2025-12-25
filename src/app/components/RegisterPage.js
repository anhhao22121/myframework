class RegisterPage extends Component {
    constructor(onRegisterSuccess, onGoLogin) {
        super("div", { class: "container", style: "max-width:400px; margin-top:50px; padding:20px; border:1px solid #ddd; border-radius:8px; background:#fff" }, [
            new Component("h2", { style: "text-align:center; margin-bottom:20px; color:#333" }, ["Đăng Ký Tài Khoản"]),
            
            new Component("div", { class: "form-group" }, [
                new Component("label", {}, ["Họ tên"]),
                new Component("input", { id: "reg-name", class: "form-input", placeholder: "Nguyễn Văn A", style:"width:100%" })
            ]),
            new Component("div", { class: "form-group" }, [
                new Component("label", {}, ["Email"]),
                new Component("input", { id: "reg-email", class: "form-input", type: "email", style:"width:100%" })
            ]),
            new Component("div", { class: "form-group" }, [
                new Component("label", {}, ["Mật khẩu"]),
                new Component("input", { id: "reg-pass", class: "form-input", type: "password", style:"width:100%" })
            ]),

            new Button("ĐĂNG KÝ", () => {
                const name = document.getElementById("reg-name").value.trim();
                const email = document.getElementById("reg-email").value.trim();
                const pass = document.getElementById("reg-pass").value.trim();

                if (!name || !email || !pass) {
                     if(typeof Toast !== 'undefined') Toast.error("Nhập thiếu thông tin!");
                     else alert("Nhập thiếu thông tin!");
                     return;
                }

                const result = appStore.register(name, email, pass);
                if (result.success) {
                    if(typeof Toast !== 'undefined') Toast.success(result.message);
                    else alert(result.message);
                    onRegisterSuccess(); // Chuyển sang Login
                } else {
                    if(typeof Toast !== 'undefined') Toast.error(result.message);
                    else alert(result.message);
                }
            }, "primary", { style: "width:100%; margin-top:20px; padding:12px; font-weight:bold" }),

            new Button("← Quay lại Đăng nhập", onGoLogin, "secondary", { style: "width:100%; margin-top:10px; background:none; color:#666; border:none" })
        ]);
    }
}
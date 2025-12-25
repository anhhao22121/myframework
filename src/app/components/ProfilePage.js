class ProfilePage extends Component {
    constructor(user, onUpdateInfo, onChangePass, onBack) {
        const SafeToast = (msg, type) => { if(typeof Toast!=='undefined') type==='success'?Toast.success(msg):Toast.error(msg); else alert(msg); };

        // 1. FORM THÔNG TIN CÁ NHÂN
        const infoSection = new Component("div", { class: "profile-section" }, [
            new Component("h3", {}, ["Thông tin cá nhân"]),
            
            // Email (Readonly)
            new Component("div", { class: "form-group" }, [
                new Component("label", {}, ["Email (Không thể thay đổi)"]),
                new Component("input", { class: "form-input", value: user.email, disabled: true, style: "background:#f9f9f9; color:#666" })
            ]),
            
            // Tên
            new Component("div", { class: "form-group" }, [
                new Component("label", {}, ["Họ tên"]),
                new Component("input", { id: "p-name", class: "form-input", value: user.name })
            ]),

            // SĐT (Mới)
            new Component("div", { class: "form-group" }, [
                new Component("label", {}, ["Số điện thoại"]),
                new Component("input", { id: "p-phone", class: "form-input", value: user.phone || "", placeholder: "Thêm số điện thoại..." })
            ]),

            // Địa chỉ (Mới)
            new Component("div", { class: "form-group" }, [
                new Component("label", {}, ["Địa chỉ giao hàng mặc định"]),
                new Component("input", { id: "p-address", class: "form-input", value: user.address || "", placeholder: "Thêm địa chỉ..." })
            ]),

            // Nút Lưu Thông Tin
            new Button("Lưu thay đổi", () => {
                const name = document.getElementById("p-name").value.trim();
                const phone = document.getElementById("p-phone").value.trim();
                const address = document.getElementById("p-address").value.trim();

                if(!name) return SafeToast("Tên không được để trống!", "error");

                onUpdateInfo({ name, phone, address });
            }, "primary", { style: "margin-top:10px" })
        ]);

        // 2. FORM ĐỔI MẬT KHẨU
        const securitySection = new Component("div", { class: "profile-section", style: "margin-top:20px" }, [
            new Component("h3", {}, ["Bảo mật"]),
            
            new Component("div", { class: "form-group" }, [
                new Component("label", {}, ["Mật khẩu cũ"]),
                new Component("input", { id: "p-old-pass", class: "form-input", type: "password" })
            ]),
            new Component("div", { class: "form-group" }, [
                new Component("label", {}, ["Mật khẩu mới"]),
                new Component("input", { id: "p-new-pass", class: "form-input", type: "password" })
            ]),

            // Nút Đổi Mật Khẩu
            new Button("Đổi mật khẩu", () => {
                const oldPass = document.getElementById("p-old-pass").value.trim();
                const newPass = document.getElementById("p-new-pass").value.trim();

                if(!oldPass || !newPass) return SafeToast("Vui lòng nhập đầy đủ mật khẩu!", "error");
                
                onChangePass(oldPass, newPass);
                
                // Reset ô nhập
                document.getElementById("p-old-pass").value = "";
                document.getElementById("p-new-pass").value = "";
            }, "secondary", { style: "margin-top:10px; background:#fce4ec; color:#d82d8b; border:1px solid #d82d8b" })
        ]);

        // Layout chính
        super("div", { class: "container", style: "max-width:600px" }, [
            new Component("div", { style: "display:flex; justify-content:space-between; align-items:center; margin-bottom:20px" }, [
                new Component("h2", { class: "title-page" }, ["Hồ sơ của bạn"]),
                new Button("← Quay lại", onBack, "secondary")
            ]),
            infoSection,
            securitySection
        ]);
    }
}
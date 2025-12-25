class CheckoutPage extends Component {
  constructor(items, onPlaceOrder, onBack, onRemove, onInc, onDec) {
    // 1. Lấy Store và User hiện tại để điền form
    const storeInstance = appStore; 
    const currentUser = storeInstance.getCurrentUser() || {}; // Lấy user, nếu null thì là object rỗng

    let checkoutItems = items.map((i) => ({ ...i, checked: true }));
    const ship = 30;

    // --- HÀM THÔNG BÁO AN TOÀN (GIỮ NGUYÊN) ---
    const safeNotify = (msg, type = 'error') => {
        if (typeof Toast !== 'undefined') {
            type === 'error' ? Toast.error(msg) : Toast.success(msg);
        } else {
            alert((type === 'error' ? "LỖI: " : "THÀNH CÔNG: ") + msg);
        }
    };

    const updateUI = () => {
      const selected = checkoutItems.filter((i) => i.checked);
      const sub = selected.reduce((s, i) => s + i.price * i.quantity, 0);
      
      const subUi = document.getElementById("sub-ui");
      const totalUi = document.getElementById("total-ui");
      const walletUi = document.getElementById("wallet-balance");

      if(walletUi) walletUi.innerText = `$${storeInstance.getBalance()}`;
      if (subUi) subUi.innerText = `$${sub}`;
      if (totalUi) totalUi.innerText = `$${sub > 0 ? sub + ship : 0}`;
    };

    const listItems = checkoutItems.map((i) =>
        new Component("div", { id: `item-${i.id}`, class: "checkout-item-mini", style: "display:flex; gap:10px; margin-bottom:10px; padding-bottom:10px; border-bottom:1px solid #eee" }, [
            new Component("input", { type: "checkbox", checked: i.checked, onchange: (e) => { i.checked = e.target.checked; updateUI(); } }),
            new Component("img", { src: i.image, style: "width:50px; height:50px; object-fit:cover; border-radius:4px" }),
            new Component("div", { style: "flex:1" }, [
                new Component("div", { style: "font-weight:bold" }, [i.name]),
                new Component("div", { style: "display:flex; align-items:center; gap:5px; margin-top:5px" }, [
                    new Button("-", () => onDec(i.id), "sm btn-secondary"), 
                    new Component("span", { style: "min-width:20px; text-align:center; font-size:13px" }, [`${i.quantity}`]),
                    new Button("+", () => onInc(i.id), "sm btn-secondary")
                ])
            ]),
            new Component("div", { style: "display:flex; flex-direction:column; align-items:flex-end; gap:5px" }, [
                new Component("div", { style: "font-weight:bold" }, [`$${i.price * i.quantity}`]),
                new Button("✕", () => { if(confirm("Xóa sản phẩm này?")) onRemove(i.id); }, "btn-icon text-danger")
            ])
        ])
    );

    super("div", { class: "container" }, [
      new Component("div", { class: "checkout-box", style: "display:flex; gap:20px; flex-wrap:wrap" }, [
        
        // --- CỘT TRÁI: FORM ĐIỀN THÔNG TIN ---
        new Component("div", { class: "checkout-form", style: "flex:1; min-width:300px" }, [
          new Component("h3", { style: "margin-bottom:20px" }, ["Thông tin giao hàng"]),
          
          // GỢI Ý NHỎ CHO NGƯỜI DÙNG
          new Component("p", { style: "font-size:13px; color:#666; margin-bottom:15px; font-style:italic" }, 
            ["* Thông tin được lấy tự động từ hồ sơ của bạn."]),

          // 1. HỌ TÊN (Auto-fill: currentUser.name)
          new Component("div", { class: "form-group" }, [ 
              new Component("label", {}, ["Họ tên"]), 
              new Component("input", { 
                  id: "checkout-name", 
                  class: "form-input", 
                  value: currentUser.name || "", // <--- ĐIỀN TỰ ĐỘNG
                  placeholder: "Nguyễn Văn A", 
                  style:"width:100%; padding:10px; margin-bottom:10px" 
              }) 
          ]),

          // 2. SỐ ĐIỆN THOẠI (Auto-fill: currentUser.phone)
          new Component("div", { class: "form-group" }, [ 
              new Component("label", {}, ["SĐT"]), 
              new Component("input", { 
                  id: "checkout-phone", 
                  class: "form-input", 
                  value: currentUser.phone || "", // <--- ĐIỀN TỰ ĐỘNG
                  placeholder: "09...", 
                  style:"width:100%; padding:10px; margin-bottom:10px" 
              }) 
          ]),

          // 3. ĐỊA CHỈ (Auto-fill: currentUser.address)
          new Component("div", { class: "form-group" }, [ 
              new Component("label", {}, ["Địa chỉ"]), 
              new Component("input", { 
                  id: "checkout-addr", 
                  class: "form-input", 
                  value: currentUser.address || "", // <--- ĐIỀN TỰ ĐỘNG
                  placeholder: "Số nhà, Đường, Quận...", 
                  style:"width:100%; padding:10px; margin-bottom:10px" 
              }) 
          ]),

          // --- PHẦN THANH TOÁN (GIỮ NGUYÊN) ---
          new Component("h3", { style: "margin:20px 0 10px 0" }, ["Hình thức thanh toán"]),
          
          new Component("div", { style: "background:#fce4ec; padding:10px; border-radius:6px; margin-bottom:10px; border:1px dashed #d82d8b; display:flex; justify-content:space-between; align-items:center" }, [
              new Component("div", {}, [
                  new Component("span", { style: "color:#d82d8b; font-weight:bold" }, ["Ví MoMo: "]),
                  new Component("span", { id: "wallet-balance", style: "font-weight:bold; font-size:16px" }, ["..."])
              ]),
              new Button("Nạp +$500", () => {
                  storeInstance.topUpWallet(500);
                  safeNotify("Đã nạp thành công $500!", "success");
                  updateUI();
              }, "sm", { style: "background:#d82d8b; color:white; border:none; cursor:pointer" })
          ]),

          new Component("div", { class: "payment-methods" }, [
            new Component("label", { class: "radio-label" }, [
                new Component("input", { type: "radio", name: "payment", value: "cod", checked: true }),
                new Component("span", {}, ["Thanh toán khi nhận hàng (COD)"])
            ]),
            new Component("label", { class: "radio-label" }, [
                new Component("input", { type: "radio", name: "payment", value: "momo" }),
                new Component("span", { style: "color:#d82d8b; font-weight:bold" }, ["Ví MoMo"])
            ])
          ]),

          new Button("← Quay lại", onBack, "secondary", { style: "margin-top:20px" })
        ]),

        // --- CỘT PHẢI: TỔNG KẾT (GIỮ NGUYÊN) ---
        new Component("div", { class: "checkout-summary", style: "flex:1; min-width:300px; background:#f9f9f9; padding:20px; border-radius:8px" }, [
          new Component("h3", {}, ["Đơn hàng của bạn"]),
          new Component("div", { style: "margin: 15px 0" }, listItems),
          new Component("div", { style: "display:flex; justify-content:space-between" }, ["Tạm tính:", new Component("span", { id: "sub-ui" }, ["..."])]),
          new Component("div", { style: "display:flex; justify-content:space-between" }, ["Phí ship:", new Component("span", {}, [`$${ship}`])]),
          new Component("hr", { style: "margin:10px 0" }),
          new Component("div", { style: "display:flex; justify-content:space-between; font-weight:bold; font-size:18px" }, ["TỔNG CỘNG:", new Component("span", { id: "total-ui", style:"color:red" }, ["..."])]),
          
          // --- NÚT ĐẶT HÀNG (LOGIC BẢO VỆ CRASH) ---
          new Button("XÁC NHẬN ĐẶT HÀNG", (e) => {
              try {
                  const nameEl = document.getElementById("checkout-name");
                  const phoneEl = document.getElementById("checkout-phone");
                  const addressEl = document.getElementById("checkout-addr");
                  const payEl = document.querySelector('input[name="payment"]:checked');

                  if (!nameEl || !phoneEl || !addressEl) throw new Error("Lỗi DOM: Không tìm thấy ô nhập!");

                  const name = nameEl.value.trim();
                  const phone = phoneEl.value.trim();
                  const address = addressEl.value.trim();
                  const paymentOption = payEl ? payEl.value : 'cod';

                  // VALIDATE
                  if (!name) { safeNotify("Vui lòng nhập họ tên!", "error"); nameEl.focus(); return; }
                  if (!phone || !/^[0-9]{9,11}$/.test(phone)) { safeNotify("Số điện thoại không hợp lệ!", "error"); phoneEl.focus(); return; }
                  if (!address) { safeNotify("Vui lòng nhập địa chỉ!", "error"); addressEl.focus(); return; }

                  const buyingItems = checkoutItems.filter((i) => i.checked);
                  if (buyingItems.length === 0) { safeNotify("Chưa chọn sản phẩm nào!", "error"); return; }

                  const subTotal = buyingItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
                  const finalTotal = subTotal + ship;

                  // CHECK VÍ
                  if (paymentOption === 'momo') {
                      const currentBalance = storeInstance.getBalance();
                      if (currentBalance < finalTotal) {
                          safeNotify(`Số dư không đủ! Cần $${finalTotal}, ví có $${currentBalance}`, "error");
                          return;
                      }
                  }

                  // UI LOADING
                  const btn = e.target;
                  const originalText = btn.innerText;
                  if (paymentOption === 'momo') {
                      btn.innerText = "ĐANG TRỪ TIỀN VÍ...";
                      btn.style.backgroundColor = "#d82d8b";
                  } else {
                      btn.innerText = "ĐANG XỬ LÝ...";
                  }
                  btn.disabled = true;
                  btn.style.opacity = "0.7";

                  // XỬ LÝ
                  setTimeout(() => {
                    try {
                        const paymentResult = storeInstance.payOrder(finalTotal, paymentOption);

                        if (paymentResult.success) {
                            let methodText = "Tiền mặt (COD)";
                            if (paymentOption === 'momo') methodText = "Ví MoMo";

                            onPlaceOrder({
                                customer: { name, phone, address },
                                items: buyingItems,
                                total: finalTotal,
                                paymentMethod: methodText
                            });
                        } else {
                            throw new Error(paymentResult.message);
                        }
                    } catch (innerErr) {
                        console.error(innerErr);
                        safeNotify("Lỗi: " + innerErr.message, "error");
                        btn.innerText = originalText;
                        btn.disabled = false;
                        btn.style.opacity = "1";
                        btn.style.backgroundColor = "";
                    }
                  }, 2000);

              } catch (err) {
                  console.error("CRASH:", err);
                  alert("Có lỗi xảy ra: " + err.message); 
              }
          }, "primary", { style: "width:100%; margin-top:20px; padding:15px; font-weight:bold" })
        ])
      ])
    ]);
    setTimeout(updateUI, 0);
  }
}
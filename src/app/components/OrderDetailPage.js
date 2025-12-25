class OrderDetailPage extends Component {
    constructor(order, onBack) {
        // 1. Header
        const header = new Component("div", { class: "page-header" }, [
            new Button("← Quay lại", onBack, "btn-secondary"),
            new Component("h2", { class: "title-page" }, [`Chi tiết đơn #${order.id}`])
        ]);

        // 2. Thông tin khách hàng & Trạng thái
        const infoSection = new Component("div", { class: "detail-section" }, [
            new Component("h3", {}, ["Thông tin chung"]),
            new Component("p", {}, [`Ngày đặt: ${new Date(order.date).toLocaleString()}`]),
            new Component("p", {}, [`Trạng thái: ${order.status}`]),
            new Component("p", {}, [`Thanh toán: ${order.paymentMethod || 'Tiền mặt'}`]),
            new Component("hr", { style: "margin:10px 0" }),
            new Component("p", { style: "font-weight:bold" }, [`Người nhận: ${order.customer.name}`]),
            new Component("p", {}, [`SĐT: ${order.customer.phone}`]),
            new Component("p", {}, [`Địa chỉ: ${order.customer.address}`]),
        ]);

        // 3. Danh sách sản phẩm (Tái sử dụng style của checkout nhưng bỏ nút xóa/sửa)
        const itemsList = order.items.map(i => 
            new Component("div", { class: "detail-item" }, [
                new Component("img", { src: i.image, class: "detail-thumb" }),
                new Component("div", { style: "flex:1" }, [
                    new Component("div", { style: "font-weight:bold" }, [i.name]),
                    new Component("div", { style: "color:#666" }, [`$${i.price} x ${i.quantity}`])
                ]),
                new Component("div", { style: "font-weight:bold" }, [`$${i.price * i.quantity}`])
            ])
        );

        const productSection = new Component("div", { class: "detail-section" }, [
            new Component("h3", {}, ["Sản phẩm"]),
            new Component("div", {}, itemsList),
            new Component("hr", { style: "margin:15px 0" }),
            new Component("div", { style: "text-align:right; font-size:18px; font-weight:bold; color:var(--primary-color)" }, [
                `Tổng cộng: $${order.total}`
            ])
        ]);

        super("div", { class: "container" }, [
            header,
            infoSection,
            productSection
        ]);
    }
}
class OrderHistoryPage extends Component {
    // Thêm tham số onViewDetail
    constructor(orders, onHome, onCancelOrder, onViewDetail) {
        
        const headerSection = new Component("div", { class: "page-header" }, [
            new Button("← Quay lại", onHome, "btn-secondary"),
            new Component("h2", { class: "title-page" }, ["Lịch sử đơn hàng"])
        ]);

        const children = [headerSection];

        if (orders.length === 0) {
            children.push(new Component("div", { class: "empty-state" }, [
                new Component("p", {}, ["Bạn chưa có đơn hàng nào."])
            ]));
        } else {
            const list = orders.map(order => {
                const isCancelled = order.status === 'Đã hủy';
                const statusClass = isCancelled ? "status-cancelled" : "status-pending";

                // Nút Hủy (Giữ nguyên logic cũ)
                const cancelButton = !isCancelled
                    ? new Button("Hủy đơn", () => {
                        if(confirm("Bạn muốn hủy đơn hàng này?")) onCancelOrder(order.id);
                      }, "btn-danger btn-sm") 
                    : new Component("span", { class: "status-text-closed" }, ["Đã đóng"]);

                // MỚI: Nút Xem chi tiết
                const viewButton = new Button("Chi tiết", () => onViewDetail(order.id), "btn-secondary btn-sm", { style: "margin-right: 5px;" });

                return new Component("div", { class: "order-card" }, [
                    new Component("div", { class: "order-header" }, [
                        new Component("span", { class: "order-id" }, [`#${order.id}`]),
                        new Component("span", { class: `order-status ${statusClass}` }, [order.status]),
                    ]),
                    
                    new Component("div", { class: "order-info" }, [
                        new Component("span", {}, [`Ngày: ${new Date(order.date).toLocaleDateString()}`]),
                        new Component("span", { class: "order-total" }, [`$${order.total}`]),
                    ]),

                    new Component("div", { style: "font-size: 13px; margin-bottom: 8px;" }, [
                        "Thanh toán: ",
                        new Component("span", { style: order.paymentMethod === 'Ví MoMo' ? "color:#d82d8b;font-weight:bold" : "" }, [order.paymentMethod || 'Tiền mặt'])
                    ]),

                    new Component("div", { class: "order-items" }, [
                        order.items.map(i => `${i.name} (x${i.quantity})`).join(", ")
                    ]),

                    // Footer chứa 2 nút: Chi tiết & Hủy
                    new Component("div", { class: "order-actions" }, [
                        viewButton, 
                        cancelButton
                    ])
                ]);
            });
            
            children.push(new Component("div", { class: "order-list" }, list));
        }

        super("div", { class: "container" }, children);
    }
}
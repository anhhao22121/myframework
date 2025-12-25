// src/core/Router.js

class Router {
    constructor() {
        this.routes = {};           // Lưu danh sách các trang (Map: tên trang -> hàm vẽ)
        this.currentPage = null;    // Tên trang hiện tại
        this.params = null;         // Dữ liệu đi kèm (ví dụ: sản phẩm đang xem)
        this.appContainerId = 'root'; // ID của thẻ div chính
    }

    // 1. Đăng ký trang mới (Giống như khai báo đường đi)
    // viewFunction: Hàm trả về Component (ví dụ: createHomeView)
    addRoute(pageName, viewFunction) {
        this.routes[pageName] = viewFunction;
    }

    // 2. Chuyển trang
    navigate(pageName, params = null) {
        console.log(`Router: Chuyển đến [${pageName}]`, params);
        
        if (this.routes[pageName]) {
            this.currentPage = pageName;
            this.params = params;
            this.render(); // Vẽ lại giao diện ngay
            window.scrollTo(0, 0);
        } else {
            console.error(`Lỗi: Không tìm thấy trang nào tên là "${pageName}"`);
        }
    }

    // 3. Vẽ trang hiện tại ra màn hình
    render() {
        const viewFunction = this.routes[this.currentPage];
        
        if (viewFunction) {
            // Gọi hàm vẽ, truyền params vào (để trang Detail nhận được dữ liệu)
            // Nhận lại là một Component
            const pageComponent = viewFunction(this.params);
            
            // Xử lý logic Header/Footer và render ra HTML (giống main.js cũ)
            // Nhưng để Router linh hoạt, ta sẽ để việc ghép Layout cho main.js lo
            // Router chỉ có nhiệm vụ: "Báo cho main.js biết là tao đổi trang rồi, mày vẽ lại đi"
            
            // => CÁCH HAY HƠN: Router sẽ kích hoạt sự kiện "change"
            if (this.onRouteChanged) {
                this.onRouteChanged(pageComponent);
            }
        }
    }

    // Đăng ký hàm sẽ chạy khi Router đổi trang
    subscribe(callback) {
        this.onRouteChanged = callback;
    }
}
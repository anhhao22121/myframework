// src/app/components/Footer.js

class Footer extends Component {
    constructor() {
        super('footer', { class: 'footer-container' }, [
            new Component('div', { class: 'container' }, [
                new Component('div', { class: 'footer-content' }, [
                    
                    // CỘT 1: Thông tin
                    new Component('div', { class: 'footer-col' }, [
                        new Component('h3', {}, ['MY SHOP']),
                        new Component('p', {}, ['Địa chỉ: 123 Đường Code Dạo, TP.HCM']),
                        new Component('p', {}, ['Hotline: 0909 123 456']),
                        new Component('p', {}, ['Email: contact@myshop.com'])
                    ]),

                    // CỘT 2: Liên kết
                    new Component('div', { class: 'footer-col' }, [
                        new Component('h3', {}, ['HỖ TRỢ']),
                        new Component('a', { href: '#', class: 'footer-link' }, ['Hướng dẫn mua hàng']),
                        new Component('a', { href: '#', class: 'footer-link' }, ['Chính sách bảo hành']),
                        new Component('a', { href: '#', class: 'footer-link' }, ['Vận chuyển & Giao nhận'])
                    ]),

                    // CỘT 3: Mạng xã hội
                    new Component('div', { class: 'footer-col' }, [
                        new Component('h3', {}, ['KẾT NỐI']),
                        new Component('div', { style: 'display: flex; gap: 10px;' }, [
                            new Button('Facebook', () => alert('Đang mở Facebook...'), 'sm btn-primary'),
                            new Button('Youtube', () => alert('Đang mở Youtube...'), 'sm btn-danger')
                        ])
                    ])
                ]),

                // Dòng bản quyền
                new Component('div', { class: 'copyright' }, [
                    '© 2025 Bản quyền thuộc về My Shop Framework.'
                ])
            ])
        ]);
    }
}
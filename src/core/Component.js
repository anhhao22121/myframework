// src/core/Component.js

class Component {
    /**
     * @param {string} tagName - Tên thẻ (ví dụ: 'div', 'h1', 'button')
     * @param {object} props - Các thuộc tính (ví dụ: { class: 'btn', onclick: ... })
     * @param {array} children - Danh sách con bên trong (text hoặc Component khác)
     */
    constructor(tagName, props = {}, children = []) {
        this.tagName = tagName;
        this.props = props;
        this.children = children;
    }

    // Hàm quan trọng nhất: Biến Class thành HTML Element thật
    render() {
        // 1. Tạo thẻ HTML
        const $element = document.createElement(this.tagName);

        // 2. Gán thuộc tính (class, id, style...) và Sự kiện (click, hover...)
        for (const key in this.props) {
            if (key.startsWith('on')) {
                // Nếu là sự kiện (vd: onclick, onmouseover) -> Bỏ chữ 'on' đi và lắng nghe
                const eventType = key.toLowerCase().substring(2);
                $element.addEventListener(eventType, this.props[key]);
            } 
            else if (key === 'innerHTML') { // <-- THÊM MỚI ĐOẠN NÀY
                $element.innerHTML = this.props[key];
            }
            else {
                // Nếu là thuộc tính thường (class, src, href, style...)
                $element.setAttribute(key, this.props[key]);
            }
        }

        // 3. Xử lý các con bên trong (Children)
        this.children.forEach(child => {
            if (typeof child === 'string' || typeof child === 'number') {
                // Nếu con là Chữ hoặc Số -> Tạo TextNode
                const textNode = document.createTextNode(child);
                $element.appendChild(textNode);
            } else if (child instanceof Component) {
                // Nếu con là một Component khác -> Gọi đệ quy render() của nó
                $element.appendChild(child.render());
            }
        });

        // 4. Trả về thẻ HTML hoàn chỉnh
        return $element;
    }
}
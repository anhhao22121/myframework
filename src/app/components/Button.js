class Button extends Component {
    /**
     * @param {string} text - Chữ trên nút
     * @param {function} onClick - Hàm chạy khi bấm nút
     * @param {string} type - Loại nút (primary, danger, success)
     */
    constructor(text, onClick, type = 'primary') {
        // 1. Tự động chọn class CSS dựa trên loại nút
        const className = `btn btn-${type}`; 

        // 2. Gọi hàm khởi tạo của cha (Component)
        // Cha cần: tagName, props, children
        super('button', { class: className, onclick: onClick }, [text]);
    }
}
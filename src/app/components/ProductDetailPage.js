class ProductDetailPage extends Component {
    constructor(product, onBack, onAdd, onBuyNow) {
        if (!product) return super('div', { class: 'container text-center' }, [
            new Component('h2', {}, ['Sản phẩm không tồn tại']), 
            new Button('Quay lại', onBack, 'secondary')
        ]);

        super('div', { class: 'container' }, [
            new Component('div', { style: 'margin-bottom: 20px' }, [ new Button('← Quay lại', onBack, 'secondary') ]),
            new Component('div', { class: 'detail-box' }, [
                new Component('img', { class: 'detail-img', src: product.image }),
                new Component('div', { class: 'detail-info' }, [
                    new Component('h1', { style: 'font-size: 2rem' }, [product.name]),
                    new Component('p', { class: 'text-price', style: 'font-size: 24px' }, [`$${product.price}`]),
                    new Component('div', { class: 'detail-desc' }, [product.description || "Đang cập nhật..."]),
                    new Component('div', { class: 'detail-actions' }, [
                        new Button('THÊM VÀO GIỎ', () => onAdd(product), 'primary'),
                        new Button('MUA NGAY', () => onBuyNow(product), 'danger')
                    ])
                ])
            ])
        ]);
    }
}
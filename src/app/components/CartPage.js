class CartPage extends Component {
    constructor(items, onBack, onClear, onInc, onDec, onCheckout) {
        const total = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);

        // Header Bảng
        const header = new Component('div', { class: 'cart-header' }, [
            new Component('div', { style: 'flex: 4' }, ['Sản phẩm']),
            new Component('div', { style: 'flex: 1.5; text-align: center' }, ['Giá']),
            new Component('div', { style: 'flex: 2; text-align: center' }, ['Số lượng']),
            new Component('div', { style: 'flex: 1.5; text-align: right' }, ['Tổng'])
        ]);

        // List Sản phẩm
        const list = items.length === 0 
            ? [new Component('p', { class: 'text-center', style: 'padding: 30px' }, ['Giỏ hàng trống'])] 
            : items.map(i => new Component('div', { class: 'cart-item' }, [
                new Component('div', { class: 'col-prod' }, [
                    new Component('img', { class: 'cart-thumb', src: i.image }),
                    new Component('div', {}, [
                        new Component('div', { class: 'text-bold' }, [i.name]),
                        new Component('div', { style: 'font-size: 12px; color:#888' }, [`ID: #${i.id}`])
                    ])
                ]),
                new Component('div', { class: 'col-price' }, [`$${i.price}`]),
                new Component('div', { class: 'col-qty' }, [
                    new Button('-', () => onDec(i.id), 'sm btn-secondary'),
                    new Component('span', { class: 'qty-num' }, [`${i.quantity}`]),
                    new Button('+', () => onInc(i.id), 'sm btn-secondary')
                ]),
                new Component('div', { class: 'col-total' }, [`$${i.price * i.quantity}`])
            ]));

        super('div', { class: 'container' }, [
            new Component('h2', { class: 'title-main' }, ['Giỏ hàng']),
            new Component('div', { class: 'cart-box' }, [ header, ...list ]),
            new Component('div', { class: 'text-right', style: 'font-size: 20px; margin-bottom: 20px' }, [
                'Tổng tiền: ', new Component('span', { class: 'text-price' }, [`$${total}`])
            ]),
            new Component('div', { class: 'cart-actions' }, [
                new Button('← Mua tiếp', onBack, 'secondary'),
                new Component('div', { class: 'flex-row', style: 'gap:10px' }, [
                    new Button('Xóa hết', onClear, 'danger'),
                    new Button('THANH TOÁN →', onCheckout, 'success')
                ])
            ])
        ]);
    }
}
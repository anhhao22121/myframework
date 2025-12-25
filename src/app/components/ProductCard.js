class ProductCard extends Component {
    constructor(product, onBuy, onView) {
        super('div', { class: 'card' }, [
            new Component('img', { 
                class: 'card-img', 
                src: product.image, 
                onclick: () => onView(product) 
            }),
            new Component('div', { class: 'card-body' }, [
                new Component('h3', { class: 'card-title', onclick: () => onView(product) }, [product.name]),
                new Component('div', { class: 'flex-between' }, [
                    new Component('span', { class: 'card-price' }, [`$${product.price}`]),
                    new Button('Thêm vào giỏ', (e) => { e.stopPropagation(); onBuy(product); }, 'sm btn-primary')
                ])
            ])
        ]);
    }
}
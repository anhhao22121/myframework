const Toast = {
    container: null,
    init() {
        if (!this.container) {
            this.container = document.createElement("div");
            this.container.id = "toast-container";
            this.container.style.cssText = "position: fixed; top: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px;";
            document.body.appendChild(this.container);
        }
    },
    show(message, type = "info") {
        this.init();
        const toast = document.createElement("div");
        toast.style.cssText = "background: #fff; padding: 12px 20px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.2); display: flex; align-items: center; gap: 10px; animation: slideIn 0.3s ease; min-width: 250px; border-left: 5px solid #ccc;";
        
        let color = "#3498db";
        if(type === 'success') { color = "#2ecc71"; toast.style.borderLeftColor = color; }
        if(type === 'error') { color = "#e74c3c"; toast.style.borderLeftColor = color; }
        
        toast.innerHTML = `<span style="color:${color}; font-weight:bold; font-size:18px;">●</span> <span>${message}</span>`;
        this.container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = "0";
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },
    success(msg) { this.show(msg, "success"); },
    error(msg) { this.show(msg, "error"); },
    info(msg) { this.show(msg, "info"); }
};
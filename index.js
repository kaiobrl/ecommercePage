document.addEventListener('DOMContentLoaded', () => {

    // --- BANCO DE DADOS (Simulado) ---
    const productsData = [
        { id: 'maca-fuji', name: 'Maçã Fuji', price: 8.99, image: 'https://images.unsplash.com/photo-1579613832125-5d34a13ffe2a?w=500&q=80', unit: 'kg' },
        { id: 'banana-prata', name: 'Banana Prata', price: 6.50, image: 'https://images.unsplash.com/photo-1571771894824-de09f1577a4e?w=500&q=80', unit: 'kg' },
        { id: 'alface-crespa', name: 'Alface Crespa', price: 3.80, image: 'https://images.unsplash.com/photo-1557844352-761f2565b576?w=500&q=80', unit: 'un' },
        { id: 'tomate-italiano', name: 'Tomate Italiano', price: 9.90, image: 'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?w=500&q=80', unit: 'kg' },
        { id: 'cenoura', name: 'Cenoura', price: 4.50, image: 'https://images.unsplash.com/photo-1590431306482-f700ee050c59?w=500&q=80', unit: 'kg' },
        { id: 'brocolis', name: 'Brócolis', price: 7.00, image: 'https://images.unsplash.com/photo-1587351177733-a06945a5de0a?w=500&q=80', unit: 'un' },
        { id: 'laranja-pera', name: 'Laranja Pera', price: 5.20, image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=500&q=80', unit: 'kg' },
        { id: 'batata-inglesa', name: 'Batata Inglesa', price: 5.80, image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba657?w=500&q=80', unit: 'kg' },
    ];

    // --- SELEÇÃO DE ELEMENTOS ---
    const get = (selector) => document.querySelector(selector);
    const dom = {
        productGrid: get('#product-grid'),
        cartBtn: get('#cart-btn'),
        cartModal: get('#cart-modal'),
        closeModalBtn: get('.close-button'),
        cartItemsContainer: get('#cart-items-container'),
        cartTotalPrice: get('#cart-total-price'),
        cartCount: get('#cart-count'),
        themeToggleBtn: get('#theme-toggle-btn'),
        checkoutBtn: get('.checkout-button'),
    };

    // --- ESTADO DA APLICAÇÃO ---
    let state = {
        cart: [],
        theme: localStorage.getItem('theme') || 'light'
    };

    // --- APIs ---
    const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

    // --- RENDERIZAÇÃO ---
    
    /** Renderiza os produtos na grade principal */
    const renderProducts = () => {
        dom.productGrid.innerHTML = productsData.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" class="product-card__image">
                <div class="product-card__content">
                    <h3 class="product-card__name">${product.name}</h3>
                    <p class="product-card__price">
                        ${currencyFormatter.format(product.price)} 
                        <span class="unit">/ ${product.unit}</span>
                    </p>
                    <button class="product-card__button" data-id="${product.id}">Adicionar</button>
                </div>
            </div>
        `).join('');
    };

    /** Renderiza os itens na cesta (modal) */
    const renderCart = () => {
        if (state.cart.length === 0) {
            dom.cartItemsContainer.innerHTML = '<p>Sua cesta está vazia.</p>';
            return;
        }
        dom.cartItemsContainer.innerHTML = state.cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-info">
                    <p>${item.name}</p>
                </div>
                <div class="cart-item-controls">
                    <button class="icon-button decrease-qty-btn" aria-label="Diminuir quantidade de ${item.name}">−</button>
                    <span class="cart-item-qty">${item.quantity}</span>
                    <button class="icon-button increase-qty-btn" aria-label="Aumentar quantidade de ${item.name}">+</button>
                </div>
                <p>${currencyFormatter.format(item.price * item.quantity)}</p>
                <button class="icon-button remove-item-btn" aria-label="Remover ${item.name}">&times;</button>
            </div>
        `).join('');
    };

    // --- LÓGICA ---

    const updateCartState = () => {
        const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        dom.cartCount.textContent = totalItems;
        dom.cartTotalPrice.textContent = currencyFormatter.format(totalPrice);
        renderCart();
    };

    const handleAddToCart = (productId) => {
        const product = productsData.find(p => p.id === productId);
        if (!product) return;

        const existingItem = state.cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            state.cart.push({ ...product, quantity: 1 });
        }
        updateCartState();
    };

    const handleRemoveFromCart = (productId) => {
        state.cart = state.cart.filter(item => item.id !== productId);
        updateCartState();
    };
    
    // NOVO: Manipulação de quantidade
    const handleChangeCartQty = (productId, delta) => {
        const item = state.cart.find(item => item.id === productId);
        if (!item) return;
        item.quantity += delta;
        if (item.quantity < 1) {
            state.cart = state.cart.filter(i => i.id !== productId);
        }
        updateCartState();
    };
    
    const applyTheme = () => {
        document.body.classList.toggle('dark-mode', state.theme === 'dark');
        localStorage.setItem('theme', state.theme);
        dom.themeToggleBtn.setAttribute('aria-label', 
            state.theme === 'dark' ? 'Alternar para modo claro' : 'Alternar para modo escuro'
        );
    };
    
    const toggleTheme = () => {
        state.theme = state.theme === 'light' ? 'dark' : 'light';
        applyTheme();
    };
    
    const openModal = () => dom.cartModal.style.display = 'block';
    const closeModal = () => dom.cartModal.style.display = 'none';

    // --- EVENT LISTENERS ---
    
    dom.themeToggleBtn.addEventListener('click', toggleTheme);
    dom.cartBtn.addEventListener('click', openModal);
    dom.closeModalBtn.addEventListener('click', closeModal);
    
    // Delegação de eventos para a grade de produtos
    dom.productGrid.addEventListener('click', (event) => {
        const addButton = event.target.closest('.product-card__button');
        if (addButton) {
            handleAddToCart(addButton.dataset.id);
        }
    });

    // Delegação de eventos para a cesta
    dom.cartItemsContainer.addEventListener('click', (event) => {
        const cartItem = event.target.closest('.cart-item');
        if (!cartItem) return;
        const productId = cartItem.dataset.id;

        if (event.target.closest('.remove-item-btn')) {
            handleRemoveFromCart(productId);
        } else if (event.target.closest('.increase-qty-btn')) {
            handleChangeCartQty(productId, 1);
        } else if (event.target.closest('.decrease-qty-btn')) {
            handleChangeCartQty(productId, -1);
        }
    });

    // Adicione campos para nome e endereço no modal do carrinho
    // (Você deve adicionar os inputs no HTML também, veja instrução abaixo)

    // Horário de funcionamento (exemplo: 8h às 18h, segunda a sábado)
    const horarioFuncionamento = {
        inicio: 8, // 8h
        fim: 18,   // 18h
        dias: [1,2,3,4,5,6] // 1=segunda, ..., 6=sábado (domingo=0)
    };

    function estaAbertoAgora() {
        const agora = new Date();
        const hora = agora.getHours();
        const dia = agora.getDay();
        return horarioFuncionamento.dias.includes(dia) && hora >= horarioFuncionamento.inicio && hora < horarioFuncionamento.fim;
    }

    dom.checkoutBtn.addEventListener('click', () => {
        // Pegue os valores dos campos de nome e endereço
        const nomeInput = document.getElementById('checkout-nome');
        const enderecoInput = document.getElementById('checkout-endereco');
        const nome = nomeInput ? nomeInput.value.trim() : '';
        const endereco = enderecoInput ? enderecoInput.value.trim() : '';

        if (state.cart.length === 0) {
            alert('Sua cesta está vazia.');
            return;
        }
        if (!nome || !endereco) {
            alert('Por favor, preencha seu nome e endereço para finalizar a compra.');
            if (nomeInput) nomeInput.focus();
            return;
        }

        if (!estaAbertoAgora()) {
            alert('O atendimento está disponível apenas de segunda a sábado, das 8h às 18h.');
            return;
        }

        // Monta mensagem para o WhatsApp
        const numeroWhatsapp = '5583981374944'; // Coloque o número desejado com DDI e DDD, só números
        let mensagem = `*Pedido Hortifruti Sacolão*\n`;
        mensagem += `*Nome:* ${nome}\n`;
        mensagem += `*Endereço:* ${endereco}\n`;
        mensagem += 'Itens:\n';
        state.cart.forEach(item => {
            mensagem += `- ${item.name} (x${item.quantity}): ${currencyFormatter.format(item.price * item.quantity)}\n`;
        });
        const total = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        mensagem += `\n*Total:* ${currencyFormatter.format(total)}\n`;

        const url = `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(mensagem)}`;
        window.open(url, '_blank');

        // Limpa o carrinho e fecha o modal
        state.cart = [];
        updateCartState();
        closeModal();
    });
    
    window.addEventListener('click', (event) => { if (event.target === dom.cartModal) closeModal(); });
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && dom.cartModal.style.display === 'block') closeModal(); });

    // --- INICIALIZAÇÃO ---
    const init = () => {
        applyTheme();
        renderProducts();
        updateCartState();
    };
    
    init();
});
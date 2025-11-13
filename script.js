// ==================== VARIABLES GLOBALES ====================
let cart = [];
let products = [];

// ==================== INICIALIZACIÓN ====================
document.addEventListener("DOMContentLoaded", () => {
  initializeApp();
});

/**
 * Inicializa la aplicación
 */
function initializeApp() {
  loadCartFromStorage();
  updateCartUI();
  initializeBannerSlider();
  fetchProducts();
  initializeContactForm();
  initializeCartModal();
  attachCartButtonEvents();
  initializeCheckout();
}

// ==================== BANNER SLIDER ====================
/**
 * Inicializa el carrusel del banner principal
 */
function initializeBannerSlider() {
  let currentSlide = 0;
  const slides = document.querySelectorAll(".banner-slide");
  const indicators = document.querySelectorAll(".banner-indicators button");
  const totalSlides = slides.length;

  // Función para mostrar un slide específico
  function showSlide(index) {
    slides.forEach((slide) => slide.classList.remove("active"));
    indicators.forEach((indicator) => indicator.classList.remove("active"));

    slides[index].classList.add("active");
    indicators[index].classList.add("active");
  }

  // Función para avanzar al siguiente slide
  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
  }

  // Función para ir a un slide específico
  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => {
      currentSlide = index;
      showSlide(currentSlide);
    });
  });

  // Auto-avance cada 5 segundos
  setInterval(nextSlide, 5000);
}

// ==================== PRODUCTOS API ====================
/**
 * Obtiene productos desde la API y los renderiza
 */
async function fetchProducts() {
  try {
    const response = await fetch("https://fakestoreapi.com/products");

    if (!response.ok) {
      throw new Error("Error al cargar los productos");
    }

    const allProducts = await response.json();

    // Filtrar solo productos de categoría 'electronics' que son más relacionados con tecnología
    products = allProducts.filter(
      (product) => product.category === "electronics"
    );

    // Limitar a 12 productos
    products = products.slice(0, 12);

    renderProducts(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    showErrorMessage(
      "No se pudieron cargar los productos. Por favor, intenta más tarde."
    );
  }
}

/**
 * Renderiza los productos en el DOM
 * @param {Array} productsToRender - Array de productos a renderizar
 */
function renderProducts(productsToRender) {
  const productsGrid = document.querySelector(
    ".featured-products .products-grid"
  );

  if (!productsGrid) return;

  // Limpiar productos existentes (mantener solo los primeros 8 productos estáticos)
  const staticProducts = productsGrid.querySelectorAll(".product-card");

  // Agregar nuevos productos de la API
  productsToRender.forEach((product) => {
    const productCard = createProductCard(product);
    productsGrid.appendChild(productCard);
  });
}

/**
 * Crea una tarjeta de producto
 * @param {Object} product - Objeto con datos del producto
 * @returns {HTMLElement} - Elemento DOM de la tarjeta
 */
function createProductCard(product) {
  const article = document.createElement("article");
  article.className = "product-card";

  // Convertir precio a formato argentino
  const priceARS = Math.round(product.price * 1000);
  const formattedPrice = priceARS.toLocaleString("es-AR");

  // Calcular rating en estrellas
  const stars = generateStars(product.rating?.rate || 4);
  const reviews = product.rating?.count || 0;

  article.innerHTML = `
    <a href="#producto-${product.id}">
      <div class="product-image">
        <img src="${product.image}" alt="${product.title}" loading="lazy" />
      </div>
      <div class="product-info">
        <h3>${truncateText(product.title, 60)}</h3>
        <p class="product-specs">${truncateText(product.description, 80)}</p>
        <div class="product-rating">
          <span class="stars" aria-label="Calificación: ${
            product.rating?.rate || 4
          } de 5 estrellas">${stars}</span>
          <span class="reviews">(${reviews} reviews)</span>
        </div>
        <div class="product-price">
          <span class="price-current">$${formattedPrice}</span>
        </div>
        <p class="product-installments">Hasta 12 cuotas sin interés</p>
        <p class="product-stock">En stock</p>
      </div>
    </a>
    <button type="button" class="btn-add-cart" data-product-id="${
      product.id
    }" aria-label="Agregar ${product.title} al carrito">
      Agregar al carrito
    </button>
  `;

  // Agregar event listener al botón
  const addButton = article.querySelector(".btn-add-cart");
  addButton.addEventListener("click", () => addToCart(product));

  return article;
}

/**
 * Genera estrellas de rating
 * @param {number} rating - Rating del 1 al 5
 * @returns {string} - String con estrellas
 */
function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  let stars = "";

  for (let i = 0; i < fullStars; i++) {
    stars += "★";
  }

  if (hasHalfStar) {
    stars += "★";
  }

  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars += "☆";
  }

  return stars;
}

/**
 * Trunca un texto a un número específico de caracteres
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @returns {string} - Texto truncado
 */
function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

/**
 * Muestra mensaje de error
 * @param {string} message - Mensaje a mostrar
 */
function showErrorMessage(message) {
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background-color: #dc2626;
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;
  errorDiv.textContent = message;

  document.body.appendChild(errorDiv);

  setTimeout(() => {
    errorDiv.style.animation = "slideOut 0.3s ease";
    setTimeout(() => errorDiv.remove(), 300);
  }, 3000);
}

// ==================== CARRITO DE COMPRAS ====================
/**
 * Agrega un producto al carrito
 * @param {Object} product - Producto a agregar
 */
function addToCart(product) {
  const existingProduct = cart.find((item) => item.id === product.id);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: Math.round(product.price * 1000),
      image: product.image,
      quantity: 1,
    });
  }

  saveCartToStorage();
  updateCartUI();
  showCartNotification("Producto agregado al carrito");
}

/**
 * Elimina un producto del carrito
 * @param {number} productId - ID del producto a eliminar
 */
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCartToStorage();
  updateCartUI();
  renderCartItems();
}

/**
 * Actualiza la cantidad de un producto en el carrito
 * @param {number} productId - ID del producto
 * @param {number} newQuantity - Nueva cantidad
 */
function updateCartQuantity(productId, newQuantity) {
  const product = cart.find((item) => item.id === productId);

  if (product) {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      product.quantity = newQuantity;
      saveCartToStorage();
      updateCartUI();
      renderCartItems();
    }
  }
}

/**
 * Guarda el carrito en localStorage
 */
function saveCartToStorage() {
  localStorage.setItem("redbuilds_cart", JSON.stringify(cart));
}

/**
 * Carga el carrito desde localStorage
 */
function loadCartFromStorage() {
  const savedCart = localStorage.getItem("redbuilds_cart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
}

/**
 * Actualiza el contador del carrito en el header
 */
function updateCartUI() {
  const cartCount = document.querySelector(".cart-count");
  if (cartCount) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
  }
}

/**
 * Muestra notificación de carrito
 * @param {string} message - Mensaje a mostrar
 */
function showCartNotification(message) {
  const notification = document.createElement("div");
  notification.className = "cart-notification";
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background-color: #10b981;
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;
  notification.innerHTML = `
    <i class="fa-solid fa-check-circle"></i> ${message}
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease";
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

/**
 * Calcula el total del carrito
 * @returns {number} - Total en pesos
 */
function calculateCartTotal() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

// ==================== MODAL DEL CARRITO ====================
/**
 * Inicializa el modal del carrito
 */
function initializeCartModal() {
  // Crear modal si no existe
  if (!document.getElementById("cart-modal")) {
    const modal = document.createElement("div");
    modal.id = "cart-modal";
    modal.className = "cart-modal";
    modal.innerHTML = `
      <div class="cart-modal-overlay"></div>
      <div class="cart-modal-content">
        <div class="cart-modal-header">
          <h2><i class="fa-solid fa-shopping-cart"></i> Mi Carrito</h2>
          <button class="cart-modal-close" aria-label="Cerrar carrito">
            <i class="fa-solid fa-times"></i>
          </button>
        </div>
        <div class="cart-modal-body">
          <div id="cart-items-container"></div>
        </div>
        <div class="cart-modal-footer">
          <div class="cart-total">
            <span>Total:</span>
            <span id="cart-total-amount">$0</span>
          </div>
          <button class="btn-checkout">
            <i class="fa-solid fa-credit-card"></i> Finalizar Compra
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // Event listeners del modal
    const overlay = modal.querySelector(".cart-modal-overlay");
    const closeBtn = modal.querySelector(".cart-modal-close");

    overlay.addEventListener("click", closeCartModal);
    closeBtn.addEventListener("click", closeCartModal);

    // Cerrar con ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("active")) {
        closeCartModal();
      }
    });
  }
}

/**
 * Abre el modal del carrito
 */
function openCartModal() {
  const modal = document.getElementById("cart-modal");
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
  renderCartItems();
}

/**
 * Cierra el modal del carrito
 */
function closeCartModal() {
  const modal = document.getElementById("cart-modal");
  modal.classList.remove("active");
  document.body.style.overflow = "";
}

/**
 * Renderiza los items del carrito en el modal
 */
function renderCartItems() {
  const container = document.getElementById("cart-items-container");
  const totalAmount = document.getElementById("cart-total-amount");

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <i class="fa-solid fa-cart-shopping"></i>
        <p>Tu carrito está vacío</p>
        <button class="btn-continue-shopping" onclick="closeCartModal()">
          Continuar comprando
        </button>
      </div>
    `;
    totalAmount.textContent = "$0";
    return;
  }

  container.innerHTML = cart
    .map(
      (item) => `
    <div class="cart-item" data-product-id="${item.id}">
      <img src="${item.image}" alt="${item.title}" />
      <div class="cart-item-info">
        <h4>${item.title}</h4>
        <p class="cart-item-price">$${item.price.toLocaleString("es-AR")}</p>
      </div>
      <div class="cart-item-controls">
        <button class="btn-quantity" onclick="updateCartQuantity(${item.id}, ${
        item.quantity - 1
      })" aria-label="Disminuir cantidad">
          <i class="fa-solid fa-minus"></i>
        </button>
        <input type="number" value="${
          item.quantity
        }" min="1" class="cart-item-quantity" 
               onchange="updateCartQuantity(${
                 item.id
               }, parseInt(this.value))" />
        <button class="btn-quantity" onclick="updateCartQuantity(${item.id}, ${
        item.quantity + 1
      })" aria-label="Aumentar cantidad">
          <i class="fa-solid fa-plus"></i>
        </button>
      </div>
      <div class="cart-item-subtotal">
        <p>$${(item.price * item.quantity).toLocaleString("es-AR")}</p>
      </div>
      <button class="btn-remove-item" onclick="removeFromCart(${
        item.id
      })" aria-label="Eliminar producto">
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>
  `
    )
    .join("");

  const total = calculateCartTotal();
  totalAmount.textContent = `$${total.toLocaleString("es-AR")}`;
}

/**
 * Adjunta eventos a los botones del carrito
 */
function attachCartButtonEvents() {
  // Botón del carrito en el header
  const cartButton = document.querySelector('a[href="/carrito"]');
  if (cartButton) {
    cartButton.addEventListener("click", (e) => {
      e.preventDefault();
      openCartModal();
    });
  }

  // Botones "Agregar al carrito" estáticos
  const staticCartButtons = document.querySelectorAll(
    ".btn-add-cart:not([data-product-id])"
  );
  staticCartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      showCartNotification("Producto agregado al carrito");

      // Simular agregar producto estático
      const productCard = button.closest(".product-card");
      const title = productCard.querySelector("h3").textContent;
      const priceText = productCard.querySelector(".price-current").textContent;
      const price = parseInt(priceText.replace(/\D/g, ""));
      const image = productCard.querySelector("img").src;

      const staticProduct = {
        id: Date.now(), // ID único temporal
        title: title,
        price: price,
        image: image,
        quantity: 1,
      };

      cart.push(staticProduct);
      saveCartToStorage();
      updateCartUI();
    });
  });
}

// ==================== FORMULARIO DE CONTACTO ====================
/**
 * Inicializa el formulario de contacto con validación
 */
function initializeContactForm() {
  const form = document.querySelector(".contact-form");

  if (!form) return;

  const nameInput = document.getElementById("contact-name");
  const emailInput = document.getElementById("contact-email");
  const phoneInput = document.getElementById("contact-phone");
  const subjectSelect = document.getElementById("contact-subject");
  const messageTextarea = document.getElementById("contact-message");
  const acceptCheckbox = document.getElementById("contact-accept");

  // Validación en tiempo real
  nameInput.addEventListener("blur", () => validateName(nameInput));
  emailInput.addEventListener("blur", () => validateEmail(emailInput));
  phoneInput.addEventListener("blur", () => validatePhone(phoneInput));
  messageTextarea.addEventListener("blur", () =>
    validateMessage(messageTextarea)
  );

  // Validación al enviar
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Validar todos los campos
    const isNameValid = validateName(nameInput);
    const isEmailValid = validateEmail(emailInput);
    const isSubjectValid = validateSubject(subjectSelect);
    const isMessageValid = validateMessage(messageTextarea);
    const isAcceptValid = validateAccept(acceptCheckbox);

    if (
      isNameValid &&
      isEmailValid &&
      isSubjectValid &&
      isMessageValid &&
      isAcceptValid
    ) {
      // Si todo es válido, enviar el formulario
      submitContactForm(form);
    } else {
      showErrorMessage(
        "Por favor, completa todos los campos obligatorios correctamente."
      );
    }
  });
}

/**
 * Valida el campo nombre
 * @param {HTMLInputElement} input - Input a validar
 * @returns {boolean} - True si es válido
 */
function validateName(input) {
  const value = input.value.trim();

  if (value.length === 0) {
    showFieldError(input, "El nombre es obligatorio");
    return false;
  }

  if (value.length < 3) {
    showFieldError(input, "El nombre debe tener al menos 3 caracteres");
    return false;
  }

  clearFieldError(input);
  return true;
}

/**
 * Valida el campo email
 * @param {HTMLInputElement} input - Input a validar
 * @returns {boolean} - True si es válido
 */
function validateEmail(input) {
  const value = input.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (value.length === 0) {
    showFieldError(input, "El email es obligatorio");
    return false;
  }

  if (!emailRegex.test(value)) {
    showFieldError(input, "Por favor, ingresa un email válido");
    return false;
  }

  clearFieldError(input);
  return true;
}

/**
 * Valida el campo teléfono (opcional)
 * @param {HTMLInputElement} input - Input a validar
 * @returns {boolean} - True si es válido
 */
function validatePhone(input) {
  const value = input.value.trim();

  // El teléfono es opcional, pero si se ingresa debe tener formato válido
  if (value.length > 0) {
    const phoneRegex = /^[+]?[\d\s\-()]{8,20}$/;
    if (!phoneRegex.test(value)) {
      showFieldError(input, "Por favor, ingresa un teléfono válido");
      return false;
    }
  }

  clearFieldError(input);
  return true;
}

/**
 * Valida el campo asunto
 * @param {HTMLSelectElement} select - Select a validar
 * @returns {boolean} - True si es válido
 */
function validateSubject(select) {
  if (select.value === "") {
    showFieldError(select, "Por favor, selecciona un asunto");
    return false;
  }

  clearFieldError(select);
  return true;
}

/**
 * Valida el campo mensaje
 * @param {HTMLTextAreaElement} textarea - Textarea a validar
 * @returns {boolean} - True si es válido
 */
function validateMessage(textarea) {
  const value = textarea.value.trim();

  if (value.length === 0) {
    showFieldError(textarea, "El mensaje es obligatorio");
    return false;
  }

  if (value.length < 10) {
    showFieldError(textarea, "El mensaje debe tener al menos 10 caracteres");
    return false;
  }

  clearFieldError(textarea);
  return true;
}

/**
 * Valida el checkbox de aceptación
 * @param {HTMLInputElement} checkbox - Checkbox a validar
 * @returns {boolean} - True si es válido
 */
function validateAccept(checkbox) {
  if (!checkbox.checked) {
    showFieldError(checkbox, "Debes aceptar la política de privacidad");
    return false;
  }

  clearFieldError(checkbox);
  return true;
}

/**
 * Muestra error en un campo
 * @param {HTMLElement} field - Campo con error
 * @param {string} message - Mensaje de error
 */
function showFieldError(field, message) {
  clearFieldError(field);

  field.classList.add("field-error");

  const errorDiv = document.createElement("div");
  errorDiv.className = "field-error-message";
  errorDiv.textContent = message;
  errorDiv.style.cssText = `
    color: #dc2626;
    font-size: 0.875rem;
    margin-top: 0.25rem;
  `;

  field.parentElement.appendChild(errorDiv);
}

/**
 * Limpia el error de un campo
 * @param {HTMLElement} field - Campo a limpiar
 */
function clearFieldError(field) {
  field.classList.remove("field-error");
  const errorMessage = field.parentElement.querySelector(
    ".field-error-message"
  );
  if (errorMessage) {
    errorMessage.remove();
  }
}

/**
 * Envía el formulario de contacto
 * @param {HTMLFormElement} form - Formulario a enviar
 */
async function submitContactForm(form) {
  const submitButton = form.querySelector(".btn-submit");
  const originalText = submitButton.innerHTML;

  // Deshabilitar botón y mostrar loading
  submitButton.disabled = true;
  submitButton.innerHTML =
    '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';

  try {
    const formData = new FormData(form);
    const response = await fetch(form.action, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });

    if (response.ok) {
      showSuccessMessage(
        "¡Mensaje enviado correctamente! Te responderemos pronto."
      );
      form.reset();
    } else {
      throw new Error("Error al enviar el formulario");
    }
  } catch (error) {
    console.error("Error:", error);
    showErrorMessage(
      "Hubo un error al enviar el mensaje. Por favor, intenta nuevamente."
    );
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = originalText;
  }
}

/**
 * Muestra mensaje de éxito
 * @param {string} message - Mensaje a mostrar
 */
function showSuccessMessage(message) {
  const notification = document.createElement("div");
  notification.className = "success-notification";
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background-color: #10b981;
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;
  notification.innerHTML = `
    <i class="fa-solid fa-check-circle"></i> ${message}
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease";
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

// ==================== CHECKOUT Y COMPRA ====================
/**
 * Inicializa el proceso de checkout
 */
function initializeCheckout() {
  const checkoutBtn = document.querySelector(".btn-checkout");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", openCheckoutModal);
  }
}

/**
 * Abre el modal de checkout
 */
function openCheckoutModal() {
  if (cart.length === 0) {
    showErrorMessage("Tu carrito está vacío");
    return;
  }

  // Crear modal de checkout si no existe
  if (!document.getElementById("checkout-modal")) {
    createCheckoutModal();
  }

  closeCartModal();

  const modal = document.getElementById("checkout-modal");
  modal.classList.add("active");
  document.body.style.overflow = "hidden";

  renderCheckoutSummary();
}

/**
 * Crea el modal de checkout
 */
function createCheckoutModal() {
  const modal = document.createElement("div");
  modal.id = "checkout-modal";
  modal.className = "checkout-modal";
  modal.innerHTML = `
    <div class="checkout-modal-overlay"></div>
    <div class="checkout-modal-content">
      <div class="checkout-modal-header">
        <h2><i class="fa-solid fa-credit-card"></i> Finalizar Compra</h2>
        <button class="checkout-modal-close" aria-label="Cerrar checkout">
          <i class="fa-solid fa-times"></i>
        </button>
      </div>
      <div class="checkout-modal-body">
        <div class="checkout-container">
          <!-- Formulario de datos -->
          <div class="checkout-form-section">
            <h3><i class="fa-solid fa-user"></i> Datos Personales</h3>
            <form id="checkout-form" class="checkout-form">
              <div class="form-group">
                <label for="checkout-name">Nombre completo *</label>
                <input type="text" id="checkout-name" name="name" required 
                       placeholder="Juan Pérez" />
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="checkout-email">Email *</label>
                  <input type="email" id="checkout-email" name="email" required 
                         placeholder="juan@email.com" />
                </div>
                <div class="form-group">
                  <label for="checkout-phone">Teléfono *</label>
                  <input type="tel" id="checkout-phone" name="phone" required 
                         placeholder="+54 9 11 1234-5678" />
                </div>
              </div>

              <h3><i class="fa-solid fa-location-dot"></i> Dirección de Envío</h3>
              
              <div class="form-group">
                <label for="checkout-address">Dirección *</label>
                <input type="text" id="checkout-address" name="address" required 
                       placeholder="Av. Corrientes 1234" />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="checkout-city">Ciudad *</label>
                  <input type="text" id="checkout-city" name="city" required 
                         placeholder="Buenos Aires" />
                </div>
                <div class="form-group">
                  <label for="checkout-province">Provincia *</label>
                  <input type="text" id="checkout-province" name="province" required 
                         placeholder="CABA" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="checkout-zip">Código Postal *</label>
                  <input type="text" id="checkout-zip" name="zip" required 
                         placeholder="C1043" />
                </div>
                <div class="form-group">
                  <label for="checkout-country">País *</label>
                  <input type="text" id="checkout-country" name="country" value="Argentina" readonly />
                </div>
              </div>

              <h3><i class="fa-solid fa-credit-card"></i> Método de Pago</h3>
              
              <div class="form-group">
                <label for="checkout-payment">Seleccionar método *</label>
                <select id="checkout-payment" name="payment" required>
                  <option value="">Elegí una opción</option>
                  <option value="credit-card">Tarjeta de Crédito</option>
                  <option value="debit-card">Tarjeta de Débito</option>
                  <option value="transfer">Transferencia Bancaria</option>
                  <option value="mercadopago">MercadoPago</option>
                </select>
              </div>

              <!-- Campos dinámicos según el método de pago -->
              <div id="payment-fields-container"></div>

              <div class="form-group checkbox-group">
                <input type="checkbox" id="checkout-terms" name="terms" required />
                <label for="checkout-terms">
                  Acepto los <a href="/terminos-condiciones" target="_blank">términos y condiciones</a> *
                </label>
              </div>
            </form>
          </div>

          <!-- Resumen de compra -->
          <div class="checkout-summary-section">
            <h3><i class="fa-solid fa-file-invoice"></i> Resumen del Pedido</h3>
            <div id="checkout-items-list"></div>
            
            <div class="checkout-totals">
              <div class="checkout-subtotal">
                <span>Subtotal:</span>
                <span id="checkout-subtotal">$0</span>
              </div>
              <div class="checkout-shipping">
                <span>Envío:</span>
                <span id="checkout-shipping">$15.000</span>
              </div>
              <div class="checkout-total">
                <span>Total:</span>
                <span id="checkout-total">$0</span>
              </div>
            </div>

            <button type="button" class="btn-place-order" onclick="processOrder()">
              <i class="fa-solid fa-check-circle"></i>
              Confirmar Pedido
            </button>

            <div class="checkout-security">
              <i class="fa-solid fa-lock"></i>
              <p>Compra 100% segura y encriptada</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Event listeners
  const overlay = modal.querySelector(".checkout-modal-overlay");
  const closeBtn = modal.querySelector(".checkout-modal-close");

  overlay.addEventListener("click", closeCheckoutModal);
  closeBtn.addEventListener("click", closeCheckoutModal);

  // Validación en tiempo real
  const form = document.getElementById("checkout-form");
  const inputs = form.querySelectorAll("input[required], select[required]");

  inputs.forEach((input) => {
    input.addEventListener("blur", () => validateCheckoutField(input));
  });

  // Event listener para cambio de método de pago
  const paymentSelect = document.getElementById("checkout-payment");
  paymentSelect.addEventListener("change", handlePaymentMethodChange);
}

/**
 * Maneja el cambio de método de pago y muestra campos dinámicos
 */
function handlePaymentMethodChange() {
  const paymentMethod = document.getElementById("checkout-payment").value;
  const container = document.getElementById("payment-fields-container");

  // Limpiar campos anteriores
  container.innerHTML = "";

  if (!paymentMethod) return;

  let fieldsHTML = "";

  // Campos según el método de pago seleccionado
  switch (paymentMethod) {
    case "credit-card":
    case "debit-card":
      fieldsHTML = `
        <div class="payment-fields-section">
          <div class="form-group">
            <label for="card-number">Número de tarjeta *</label>
            <input type="text" id="card-number" name="card-number" 
                   placeholder="1234 5678 9012 3456" 
                   maxlength="19" required />
          </div>
          
          <div class="form-group">
            <label for="card-name">Titular de la tarjeta *</label>
            <input type="text" id="card-name" name="card-name" 
                   placeholder="Nombre como aparece en la tarjeta" required />
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="card-expiry">Vencimiento *</label>
              <input type="text" id="card-expiry" name="card-expiry" 
                     placeholder="MM/AA" maxlength="5" required />
            </div>
            <div class="form-group">
              <label for="card-cvv">CVV *</label>
              <input type="text" id="card-cvv" name="card-cvv" 
                     placeholder="123" maxlength="4" required />
            </div>
          </div>
          
          <div class="form-group">
            <label for="installments">Cuotas *</label>
            <select id="installments" name="installments" required>
              <option value="">Seleccionar</option>
              <option value="1">1 cuota (Pago único)</option>
              <option value="3">3 cuotas sin interés</option>
              <option value="6">6 cuotas sin interés</option>
              <option value="12">12 cuotas sin interés</option>
            </select>
          </div>
        </div>
      `;
      break;

    case "transfer":
      fieldsHTML = `
        <div class="payment-fields-section">
          <div class="transfer-info">
            <p><strong>Datos para transferencia bancaria:</strong></p>
            <div class="bank-details">
              <p><strong>Banco:</strong> Banco Nación</p>
              <p><strong>CBU:</strong> 0110599520000012345678</p>
              <p><strong>Alias:</strong> REDBUILDS.STORE</p>
              <p><strong>Titular:</strong> RedBuilds S.A.</p>
              <p><strong>CUIT:</strong> 30-12345678-9</p>
            </div>
          </div>
          
          <div class="form-group">
            <label for="transfer-name">Nombre del titular que realiza la transferencia *</label>
            <input type="text" id="transfer-name" name="transfer-name" 
                   placeholder="Tu nombre completo" required />
          </div>
          
          <div class="form-group">
            <label for="transfer-bank">Banco de origen *</label>
            <input type="text" id="transfer-bank" name="transfer-bank" 
                   placeholder="Nombre de tu banco" required />
          </div>
          
          <div class="form-group">
            <label for="transfer-number">Número de comprobante (opcional)</label>
            <input type="text" id="transfer-number" name="transfer-number" 
                   placeholder="Si ya realizaste la transferencia" />
          </div>
          
          <div class="alert-info">
            <i class="fa-solid fa-info-circle"></i>
            <p>Tu pedido quedará en estado "Pendiente" hasta que confirmemos la recepción del pago.</p>
          </div>
        </div>
      `;
      break;

    case "mercadopago":
      fieldsHTML = `
        <div class="payment-fields-section">
          <div class="mercadopago-info">
            <img src="https://http2.mlstatic.com/storage/logos-api-admin/a5f047d0-9be0-11ec-aad4-c3381f368aaf-m.svg" 
                 alt="MercadoPago" style="width: 150px; margin-bottom: 1rem;" />
            <p>Serás redirigido a MercadoPago para completar el pago de forma segura.</p>
          </div>
          
          <div class="form-group">
            <label for="mp-email">Email de MercadoPago *</label>
            <input type="email" id="mp-email" name="mp-email" 
                   placeholder="tu@email.com" required />
          </div>
          
          <div class="form-group">
            <label for="mp-payment-type">Método de pago en MercadoPago *</label>
            <select id="mp-payment-type" name="mp-payment-type" required>
              <option value="">Seleccionar</option>
              <option value="credit">Tarjeta de Crédito</option>
              <option value="debit">Tarjeta de Débito</option>
              <option value="account-money">Dinero en cuenta</option>
            </select>
          </div>
          
          <div class="alert-info">
            <i class="fa-solid fa-shield-halved"></i>
            <p>Al confirmar, te redirigiremos a MercadoPago para completar el pago de forma segura.</p>
          </div>
        </div>
      `;
      break;
  }

  container.innerHTML = fieldsHTML;

  // Agregar validación a los nuevos campos
  const newInputs = container.querySelectorAll(
    "input[required], select[required]"
  );
  newInputs.forEach((input) => {
    input.addEventListener("blur", () => validateCheckoutField(input));

    // Formateo automático para campos de tarjeta
    if (input.id === "card-number") {
      input.addEventListener("input", formatCardNumber);
    }
    if (input.id === "card-expiry") {
      input.addEventListener("input", formatCardExpiry);
    }
    if (input.id === "card-cvv") {
      input.addEventListener("input", formatCVV);
    }
  });
}

/**
 * Formatea el número de tarjeta
 */
function formatCardNumber(e) {
  let value = e.target.value.replace(/\s/g, "");
  let formattedValue = value.match(/.{1,4}/g)?.join(" ") || value;
  e.target.value = formattedValue;
}

/**
 * Formatea la fecha de vencimiento
 */
function formatCardExpiry(e) {
  let value = e.target.value.replace(/\D/g, "");
  if (value.length >= 2) {
    value = value.slice(0, 2) + "/" + value.slice(2, 4);
  }
  e.target.value = value;
}

/**
 * Formatea el CVV (solo números)
 */
function formatCVV(e) {
  e.target.value = e.target.value.replace(/\D/g, "");
}

/**
 * Cierra el modal de checkout
 */
function closeCheckoutModal() {
  const modal = document.getElementById("checkout-modal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
}

/**
 * Renderiza el resumen de la compra
 */
function renderCheckoutSummary() {
  const itemsList = document.getElementById("checkout-items-list");
  const subtotalEl = document.getElementById("checkout-subtotal");
  const totalEl = document.getElementById("checkout-total");

  if (!itemsList) return;

  // Renderizar items
  itemsList.innerHTML = cart
    .map(
      (item) => `
    <div class="checkout-item">
      <img src="${item.image}" alt="${item.title}" />
      <div class="checkout-item-info">
        <h4>${truncateText(item.title, 40)}</h4>
        <p>Cantidad: ${item.quantity}</p>
      </div>
      <div class="checkout-item-price">
        ${(item.price * item.quantity).toLocaleString("es-AR")}
      </div>
    </div>
  `
    )
    .join("");

  // Calcular totales
  const subtotal = calculateCartTotal();
  const shipping = 15000;
  const total = subtotal + shipping;

  subtotalEl.textContent = `${subtotal.toLocaleString("es-AR")}`;
  totalEl.textContent = `${total.toLocaleString("es-AR")}`;
}

/**
 * Valida un campo del checkout
 * @param {HTMLElement} field - Campo a validar
 * @returns {boolean} - True si es válido
 */
function validateCheckoutField(field) {
  const value = field.value.trim();

  if (field.hasAttribute("required") && value === "") {
    showFieldError(field, "Este campo es obligatorio");
    return false;
  }

  if (field.type === "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      showFieldError(field, "Email inválido");
      return false;
    }
  }

  if (field.type === "tel") {
    const phoneRegex = /^[+]?[\d\s\-()]{8,20}$/;
    if (!phoneRegex.test(value)) {
      showFieldError(field, "Teléfono inválido");
      return false;
    }
  }

  // Validaciones específicas para tarjeta
  if (field.id === "card-number" && value) {
    const cardRegex = /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/;
    if (!cardRegex.test(value)) {
      showFieldError(field, "Número de tarjeta inválido");
      return false;
    }
  }

  if (field.id === "card-expiry" && value) {
    const expiryRegex = /^\d{2}\/\d{2}$/;
    if (!expiryRegex.test(value)) {
      showFieldError(field, "Formato: MM/AA");
      return false;
    }
  }

  if (field.id === "card-cvv" && value) {
    const cvvRegex = /^\d{3,4}$/;
    if (!cvvRegex.test(value)) {
      showFieldError(field, "CVV inválido (3-4 dígitos)");
      return false;
    }
  }

  clearFieldError(field);
  return true;
}

/**
 * Procesa la orden de compra
 */
async function processOrder() {
  const form = document.getElementById("checkout-form");
  const paymentContainer = document.getElementById("payment-fields-container");

  // Validar campos del formulario principal
  const mainInputs = form.querySelectorAll(
    "input[required]:not(#payment-fields-container input), select[required]:not(#payment-fields-container select)"
  );
  let isValid = true;

  mainInputs.forEach((input) => {
    if (!validateCheckoutField(input)) {
      isValid = false;
    }
  });

  // Validar campos del método de pago
  const paymentInputs = paymentContainer.querySelectorAll(
    "input[required], select[required]"
  );
  paymentInputs.forEach((input) => {
    if (!validateCheckoutField(input)) {
      isValid = false;
    }
  });

  if (!isValid) {
    showErrorMessage("Por favor, completa todos los campos correctamente");
    return;
  }

  // Obtener datos del formulario
  const orderData = {
    customer: {
      name: document.getElementById("checkout-name").value,
      email: document.getElementById("checkout-email").value,
      phone: document.getElementById("checkout-phone").value,
    },
    location: {
      address: document.getElementById("checkout-address").value,
      city: document.getElementById("checkout-city").value,
      province: document.getElementById("checkout-province").value,
      zip: document.getElementById("checkout-zip").value,
      country: document.getElementById("checkout-country").value,
    },
    payment: {
      method: document.getElementById("checkout-payment").value,
      details: getPaymentDetails(),
    },
    items: cart,
    subtotal: calculateCartTotal(),
    shipping: 15000,
    total: calculateCartTotal() + 15000,
    orderNumber: generateOrderNumber(),
    date: new Date().toISOString(),
  };

  // Simular procesamiento
  await simulatePaymentProcessing(orderData);
}

/**
 * Obtiene los detalles del método de pago seleccionado
 * @returns {Object} - Detalles del pago
 */
function getPaymentDetails() {
  const paymentMethod = document.getElementById("checkout-payment").value;
  const details = { method: paymentMethod };

  switch (paymentMethod) {
    case "credit-card":
    case "debit-card":
      const cardNumber = document.getElementById("card-number")?.value || "";
      details.cardLast4 = cardNumber.replace(/\s/g, "").slice(-4);
      details.cardHolder = document.getElementById("card-name")?.value || "";
      details.installments =
        document.getElementById("installments")?.value || "1";
      break;

    case "transfer":
      details.transferName =
        document.getElementById("transfer-name")?.value || "";
      details.bank = document.getElementById("transfer-bank")?.value || "";
      details.comprobante =
        document.getElementById("transfer-number")?.value || "";
      break;

    case "mercadopago":
      details.email = document.getElementById("mp-email")?.value || "";
      details.paymentType =
        document.getElementById("mp-payment-type")?.value || "";
      break;
  }

  return details;
}

/**
 * Simula el procesamiento del pago
 * @param {Object} orderData - Datos de la orden
 */
async function simulatePaymentProcessing(orderData) {
  const button = document.querySelector(".btn-place-order");
  const originalText = button.innerHTML;

  // Deshabilitar botón
  button.disabled = true;
  button.innerHTML =
    '<i class="fa-solid fa-spinner fa-spin"></i> Procesando pago...';

  try {
    // Simular delay de procesamiento (2 segundos)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Guardar orden en localStorage (simulación de backend)
    saveOrder(orderData);

    // Limpiar carrito
    cart = [];
    saveCartToStorage();
    updateCartUI();

    // Cerrar modal de checkout
    closeCheckoutModal();

    // Mostrar confirmación
    showOrderConfirmation(orderData);
  } catch (error) {
    console.error("Error:", error);
    showErrorMessage(
      "Hubo un error al procesar tu pedido. Intenta nuevamente."
    );
    button.disabled = false;
    button.innerHTML = originalText;
  }
}

/**
 * Guarda la orden en localStorage
 * @param {Object} orderData - Datos de la orden
 */
function saveOrder(orderData) {
  let orders = localStorage.getItem("redbuilds_orders");
  orders = orders ? JSON.parse(orders) : [];
  orders.push(orderData);
  localStorage.setItem("redbuilds_orders", JSON.stringify(orders));
}

/**
 * Genera un número de orden único
 * @returns {string} - Número de orden
 */
function generateOrderNumber() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `RB${timestamp}${random}`;
}

/**
 * Muestra la confirmación de la orden
 * @param {Object} orderData - Datos de la orden
 */
function showOrderConfirmation(orderData) {
  // Crear modal de confirmación
  const modal = document.createElement("div");
  modal.id = "confirmation-modal";
  modal.className = "confirmation-modal active";
  modal.innerHTML = `
    <div class="confirmation-modal-overlay"></div>
    <div class="confirmation-modal-content">
      <div class="confirmation-success">
        <i class="fa-solid fa-check-circle"></i>
      </div>
      <h2>¡Pedido Confirmado!</h2>
      <p class="confirmation-message">
        Tu pedido ha sido procesado exitosamente
      </p>
      
      <div class="confirmation-details">
        <div class="confirmation-row">
          <span class="label">Número de orden:</span>
          <span class="value"><strong>${orderData.orderNumber}</strong></span>
        </div>
        <div class="confirmation-row">
          <span class="label">Total pagado:</span>
          <span class="value"><strong>${orderData.total.toLocaleString(
            "es-AR"
          )}</strong></span>
        </div>
        <div class="confirmation-row">
          <span class="label">Método de pago:</span>
          <span class="value">${getPaymentMethodName(
            orderData.payment.method
          )}</span>
        </div>
        <div class="confirmation-row">
          <span class="label">Envío a:</span>
          <span class="value">${orderData.location.address}, ${
    orderData.location.city
  }</span>
        </div>
      </div>

      <div class="confirmation-email">
        <i class="fa-solid fa-envelope"></i>
        <p>Te enviamos un email de confirmación a <strong>${
          orderData.customer.email
        }</strong></p>
      </div>

      <div class="confirmation-actions">
        <button class="btn-track-order" onclick="closeConfirmationModal()">
          <i class="fa-solid fa-truck"></i>
          Seguir mi pedido
        </button>
        <button class="btn-continue-shopping" onclick="closeConfirmationModal()">
          Seguir comprando
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  document.body.style.overflow = "hidden";

  // Reproducir sonido de éxito (opcional)
  playSuccessSound();
}

/**
 * Cierra el modal de confirmación
 */
function closeConfirmationModal() {
  const modal = document.getElementById("confirmation-modal");
  if (modal) {
    modal.remove();
    document.body.style.overflow = "";
  }
}

/**
 * Obtiene el nombre del método de pago
 * @param {string} method - Método de pago
 * @returns {string} - Nombre legible
 */
function getPaymentMethodName(method) {
  const methods = {
    "credit-card": "Tarjeta de Crédito",
    "debit-card": "Tarjeta de Débito",
    transfer: "Transferencia Bancaria",
    mercadopago: "MercadoPago",
  };
  return methods[method] || method;
}

/**
 * Reproduce un sonido de éxito (opcional)
 */
function playSuccessSound() {
  // Sonido corto de éxito usando Web Audio API
  try {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.5
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (error) {
    // Silenciar errores si el audio no está disponible
  }
}

// ==================== ANIMACIONES CSS ====================
// Agregar estilos para animaciones y campos de pago
const style = document.createElement("style");
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  .field-error {
    border-color: #dc2626 !important;
  }

  /* Estilos para campos dinámicos de pago */
  .payment-fields-section {
    margin-top: 1.5rem;
    padding: 1.5rem;
    background-color: rgba(220, 38, 38, 0.05);
    border-radius: 8px;
    border: 1px solid rgba(220, 38, 38, 0.2);
  }

  .transfer-info,
  .mercadopago-info {
    background-color: var(--bg-primary);
    padding: 1rem;
    border-radius: 6px;
    margin-bottom: 1rem;
  }

  .bank-details {
    margin-top: 0.75rem;
    padding: 0.75rem;
    background-color: var(--bg-secondary);
    border-radius: 4px;
  }

  .bank-details p {
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
  }

  .alert-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background-color: rgba(59, 130, 246, 0.1);
    padding: 1rem;
    border-radius: 6px;
    margin-top: 1rem;
  }

  .alert-info i {
    color: var(--info-color);
    font-size: 1.25rem;
    flex-shrink: 0;
  }

  .alert-info p {
    margin: 0;
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
`;
document.head.appendChild(style);

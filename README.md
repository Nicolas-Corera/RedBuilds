# RedBuilds - E-Commerce de Hardware y PC Gaming

![RedBuilds Logo](https://i.postimg.cc/633bffF7/icono.png)

## 📋 Descripción

RedBuilds es una tienda online especializada en hardware, componentes para PC, periféricos gaming y armado de PCs personalizadas. Ofrece una experiencia de compra completa con productos de las mejores marcas del mercado, carrito de compras funcional, integración con API REST y formulario de contacto validado.

## ✨ Características Principales

### Frontend

- **Catálogo dinámico** de productos cargados desde API REST (Fake Store API)
- **Carrito de compras funcional** con persistencia en localStorage
- **Banner rotativo** con ofertas destacadas y controles de navegación
- **Sistema de categorías** organizadas por tipo de producto
- **Formulario de contacto** con validación en tiempo real y envío por Formspree
- **Modal de carrito** interactivo con gestión de cantidades y eliminación de productos
- **Diseño responsive** optimizado para desktop, tablet y móvil
- **Contador dinámico** del carrito en el header

### Funcionalidades JavaScript

- Consumo de API REST para productos
- Validación de formularios (nombre, email, mensaje)
- Gestión completa del carrito (agregar, eliminar, modificar cantidades)
- **Simulación de compra completa** con checkout
- **Procesamiento de pedidos** con generación de número de orden
- **Confirmación de compra** con resumen detallado
- Persistencia de datos con localStorage (carrito y órdenes)
- Cálculo automático de totales y envío
- Notificaciones visuales para acciones del usuario
- Slider automático del banner con indicadores
- Efectos de sonido en confirmación de compra

## 🛠️ Tecnologías Utilizadas

### Frontend

- **HTML5** semántico con meta tags para SEO
- **CSS3** con variables personalizadas y Grid/Flexbox
- **JavaScript** puro (ES6+) sin frameworks
- **Font Awesome 7.0.1** para iconografía
- **Unsplash** para imágenes de productos

### APIs y Servicios

- **Fake Store API** - Consumo de productos en formato JSON
- **Formspree** - Envío de formularios de contacto
- **localStorage** - Persistencia del carrito de compras

## 📁 Estructura del Proyecto

```
redbuilds/
│
├── index.html              # Página principal con estructura semántica
├── styles.css              # Estilos globales y responsive
├── cart-modal.css          # Estilos específicos del modal de carrito
├── script.js               # Lógica JavaScript principal
├── README.md               # Documentación del proyecto
├── favicon.png             # Favicon del sitio
└── apple-touch-icon.png    # Icono para dispositivos Apple
```

## 🎨 Paleta de Colores

```css
--primary-color: #dc2626     /* Rojo principal */
--primary-dark: #991b1b      /* Rojo oscuro */
--primary-light: #fca5a5     /* Rojo claro */
--secondary-color: #1f2937   /* Gris oscuro */
--secondary-dark: #111827    /* Gris muy oscuro */
--text-primary: #1f2937      /* Texto principal */
--text-secondary: #6b7280    /* Texto secundario */
--success-color: #10b981     /* Verde success */
--warning-color: #f59e0b     /* Amarillo warning */
```

## 📦 Secciones Principales

### Header

- Barra superior con información de envíos y links de ayuda
- Buscador de productos (funcional en estructura)
- Acceso a cuenta y carrito con contador dinámico
- Navegación principal por categorías

### Hero Banner

- Carrusel automático de ofertas destacadas
- Controles de navegación manual con indicadores
- CTAs para cada promoción
- Rotación automática cada 5 segundos

### Categorías

- Grid responsive con 8 categorías principales
- Imágenes optimizadas con lazy loading
- Hover effects suaves
- Links a páginas de categoría

### Productos (API)

- **Carga dinámica** desde Fake Store API
- Grid responsive de productos
- Información completa: imagen, título, descripción, precio, rating
- Conversión de precios a formato argentino
- Botones "Agregar al carrito" funcionales
- Sistema de valoraciones con estrellas

### Carrito de Compras

- **Modal interactivo** con overlay
- Lista completa de productos agregados
- Controles de cantidad (+/-)
- Botón de eliminar producto
- Cálculo automático de subtotales y total
- Persistencia en localStorage
- Estado vacío con mensaje y CTA
- Botón "Finalizar compra" (preparado para integración)

### Formulario de Contacto

- **Validación en tiempo real** de campos
- Campos obligatorios: nombre, email, asunto, mensaje
- Validación de formato de email con regex
- Checkbox de aceptación de política de privacidad
- **Integración con Formspree** para envío real
- Mensajes de error/éxito visuales
- Estados de loading durante el envío

### Builds Recomendados

- Configuraciones predefinidas para diferentes presupuestos
- Especificaciones detalladas de componentes
- Precios y CTAs de compra

### Beneficios

- 6 beneficios principales con iconos
- Diseño en grid responsive
- Información clara de servicios

### Footer

- Información de la empresa
- Links a redes sociales
- Atención al cliente
- Información legal y de contacto

## 📱 Responsive Design

El sitio está completamente optimizado para:

- **Desktop** (1200px+) - Layout completo
- **Tablet** (768px - 1024px) - Grid adaptado
- **Mobile** (480px - 768px) - Columna única
- **Small Mobile** (< 480px) - Optimización extrema

### Breakpoints Principales

```css
@media (max-width: 1024px) {
  /* Tablet */
}
@media (max-width: 768px) {
  /* Mobile */
}
@media (max-width: 480px) {
  /* Small Mobile */
}
```

## ♿ Accesibilidad y SEO

### Accesibilidad

- ✅ Etiquetas semánticas HTML5 (`header`, `nav`, `main`, `section`, `footer`)
- ✅ Atributos `aria-label` en elementos interactivos
- ✅ Labels apropiados en formularios
- ✅ Textos alternativos (`alt`) en todas las imágenes
- ✅ Contraste de colores AA/AAA
- ✅ Navegación por teclado funcional
- ✅ Atributos `aria-required` en campos obligatorios

### SEO

- ✅ Meta tags completos (description, keywords, author)
- ✅ Open Graph para redes sociales (Facebook, Twitter)
- ✅ Canonical URL
- ✅ Theme color para navegadores móviles
- ✅ Estructura semántica para crawlers
- ✅ Atributos `width` y `height` en imágenes
- ✅ Lazy loading en imágenes no críticas

## 🚀 Cómo Visualizar el Proyecto

### Opción 1: Visualización Local

1. Clona o descarga el repositorio
2. Abre el archivo `index.html` en tu navegador preferido
3. ¡Listo! El sitio funcionará completamente

```bash
git clone https://github.com/tuusuario/redbuilds.git
cd redbuilds
# Abrir index.html en el navegador
```

### Opción 2: Servidor Local (Recomendado)

Para evitar problemas de CORS con la API:

```bash
# Con Python 3
python -m http.server 8000

# Con Node.js (si tienes http-server instalado)
npx http-server

# Luego abrir: http://localhost:8000
```

### Opción 3: Live Server (VS Code)

1. Instala la extensión "Live Server" en VS Code
2. Click derecho en `index.html`
3. Selecciona "Open with Live Server"

## 🌐 Hosting y Despliegue

El proyecto está preparado para ser desplegado en:

### GitHub Pages

```bash
# 1. Crear repositorio en GitHub
# 2. Push del código
git add .
git commit -m "Initial commit"
git push origin main

# 3. En GitHub: Settings > Pages
# 4. Seleccionar rama 'main' y carpeta 'root'
# 5. Guardar y esperar el despliegue
```

### Netlify

1. Arrastra la carpeta del proyecto a [netlify.com/drop](https://app.netlify.com/drop)
2. O conecta tu repositorio de GitHub para despliegues automáticos

### Vercel

```bash
# Con Vercel CLI
npm i -g vercel
vercel
```

## 📝 Funcionalidades JavaScript Implementadas

### 1. Fetch API - Productos

```javascript
// Consumo de Fake Store API
async function fetchProducts() {
  const response = await fetch("https://fakestoreapi.com/products?limit=12");
  const products = await response.json();
  renderProducts(products);
}
```

### 2. Validación de Formularios

```javascript
// Validación de email con regex
function validateEmail(input) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(input.value);
}
```

### 3. Carrito con localStorage

```javascript
// Guardar carrito
function saveCartToStorage() {
  localStorage.setItem("redbuilds_cart", JSON.stringify(cart));
}

// Cargar carrito
function loadCartFromStorage() {
  const savedCart = localStorage.getItem("redbuilds_cart");
  if (savedCart) cart = JSON.parse(savedCart);
}
```

### 4. Gestión del Carrito

- ✅ Agregar productos
- ✅ Eliminar productos
- ✅ Modificar cantidades
- ✅ Calcular totales
- ✅ Actualizar UI en tiempo real
- ✅ Persistencia entre sesiones

### 5. Banner Slider

```javascript
// Slider automático cada 5 segundos
setInterval(() => {
  currentSlide = (currentSlide + 1) % totalSlides;
  showSlide(currentSlide);
}, 5000);
```

## 🔧 Funcionalidades Futuras

Posibles mejoras para próximas versiones:

- [ ] Backend con Node.js y Express
- [ ] Base de datos (MongoDB/PostgreSQL)
- [ ] Autenticación de usuarios
- [ ] Pasarela de pago real (MercadoPago/Stripe)
- [ ] Panel de administración
- [ ] Sistema de filtros avanzados
- [ ] Comparador de productos
- [ ] Wishlist de favoritos
- [ ] Sistema de reviews y comentarios
- [ ] Chat en vivo para soporte
- [ ] Calculadora de compatibilidad de componentes
- [ ] Historial de compras
- [ ] Tracking de envíos

## 📊 APIs Utilizadas

### Fake Store API

- **URL Base**: `https://fakestoreapi.com`
- **Endpoint**: `/products?limit=12`
- **Método**: GET
- **Respuesta**: Array de productos con id, title, price, description, image, rating

### Formspree

- **URL**: `https://formspree.io/f/xpwyynrp`
- **Método**: POST
- **Content-Type**: application/json
- **Campos**: name, email, phone, subject, message, accept

## 🐛 Troubleshooting

### Los productos no se cargan

- **Problema**: CORS o API caída
- **Solución**: Usar servidor local (http-server, Live Server)

### El carrito no persiste

- **Problema**: localStorage deshabilitado
- **Solución**: Verificar configuración del navegador

### El formulario no envía

- **Problema**: Validación fallando o Formspree no configurado
- **Solución**: Verificar consola del navegador para errores

## 👨‍💻 Autor

**Nicolás Corera**

- Email: contacto@redbuilds.com
- GitHub: [@nicolascorera](https://github.com/nicolascorera)

## 📄 Licencia

© 2025 Nicolás Corera. Todos los derechos reservados.
© 2025 RedBuilds. Todos los derechos reservados.

---

**Proyecto Final - JavaScript Frontend**  
Desarrollado como proyecto académico cumpliendo con todas las consignas del curso.

### Consignas Cumplidas ✅

1. ✅ HTML Semántico con etiquetas apropiadas
2. ✅ Formulario de contacto funcional con Formspree
3. ✅ Validación de formularios con JavaScript
4. ✅ CSS Responsive con Flexbox y Grid
5. ✅ Consumo de API REST (Fetch API)
6. ✅ Renderizado dinámico de productos
7. ✅ Carrito de compras con localStorage
8. ✅ Gestión completa del carrito (agregar/eliminar/modificar)
9. ✅ Actualización automática de totales
10. ✅ Contador dinámico en el navbar
11. ✅ Código limpio y comentado
12. ✅ Accesibilidad (ARIA, alt, labels)
13. ✅ SEO (meta tags, Open Graph)
14. ✅ Proyecto preparado para hosting

---

**🚀 ¡Gracias por visitar RedBuilds!**

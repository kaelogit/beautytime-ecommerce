// js/app.js
document.getElementById('year').textContent = new Date().getFullYear();

// sample featured product for now
const featuredGrid = document.getElementById('featured-grid');

const sample = {
  id: 'p001',
  title: 'Silken Body Cream',
  price: '₦3,000',
  image: './images/product-placeholder.jpg'
};

function renderProductCard(p){
  const div = document.createElement('div');
  div.className = 'product-card';
  div.innerHTML = `
    <img src="${p.image}" alt="${p.title}" />
    <div class="product-title">${p.title}</div>
    <div class="price">${p.price}</div>
    <button class="btn btn-primary" onclick="location.href='product.html?id=${p.id}'">View</button>
  `;
  return div;
}

featuredGrid.appendChild(renderProductCard(sample));

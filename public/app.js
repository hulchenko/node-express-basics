const toCurrency = (price) => {
  return new Intl.NumberFormat('en-US', {
    currency: 'cad',
    style: 'currency',
  }).format(price);
};

//turn input number into CAD format
document.querySelectorAll('.price').forEach((node) => {
  node.textContent = toCurrency(node.textContent);
});

const $cart = document.querySelector('#cart');

if ($cart) {
  $cart.addEventListener('click', (event) => {
    if (event.target.classList.contains('js-remove')) {
      const id = event.target.dataset.id;

      fetch('/cart/remove/' + id, {
        method: 'delete',
      })
        .then((res) => res.json())
        .then((cart) => {
          if (cart.courses.length) {
            const html = cart.courses
              .map((i) => {
                return `
              <tr>
                <td>${i.title}</td>
                <td>${i.count}</td>
                <td>
                 <button class='btn btn-small js-remove' data-id='${i.id}'>Delete</button>
               </td>
            </tr>`;
              })
              .join('');
            $cart.querySelector('tbody').innerHTML = html;
            $cart.querySelector('.price').textContent = toCurrency(cart.price);
          } else {
            $cart.innerHTML = '<p>Cart is empty.</p>';
          }
        });
    }
  });
}

//turn input number into CAD format
document.querySelectorAll('.price').forEach((node) => {
  node.textContent = new Intl.NumberFormat('en-EN', {
    currency: 'cad',
    style: 'currency',
  }).format(node.textContent);
});

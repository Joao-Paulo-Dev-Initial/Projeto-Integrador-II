document.addEventListener('DOMContentLoaded', () => {
  const userMenu = document.querySelector('.user-menu');
  const button = userMenu.querySelector('button');

  button.addEventListener('click', (e) => {
    e.stopPropagation(); // evita conflitos
    userMenu.classList.toggle('active');
  });

  document.addEventListener('click', () => {
    userMenu.classList.remove('active');
  });
});
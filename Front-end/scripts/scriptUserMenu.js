document.addEventListener('DOMContentLoaded', () => {
  const userMenus = document.querySelectorAll('.user-menu');
  if (!userMenus.length) return;

  userMenus.forEach((menu) => {
    const button = menu.querySelector('button');
    if (!button) return;

    button.addEventListener('click', (e) => {
      e.stopPropagation();
      userMenus.forEach((other) => {
        if (other !== menu) other.classList.remove('active');
      });
      menu.classList.toggle('active');
    });
  });

  document.addEventListener('click', () => {
    userMenus.forEach((menu) => menu.classList.remove('active'));
  });
});
(() => {
  const nav = document.getElementById('mainNav');
  const logoLight = document.getElementById('logoLight');
  const logoDark = document.getElementById('logoDark');
  const toTop = document.getElementById('toTop');

  const setNavMode = () => {
    const scrolled = window.scrollY > 40;

    if (scrolled) {
      nav.classList.remove('nav-transparent');
      nav.classList.add('nav-solid');

      // Cambia modo Bootstrap: dark -> light
      nav.classList.remove('navbar-dark');
      nav.classList.add('navbar-light');

      // swap logos (si tienes ambos)
      if (logoLight && logoDark) {
        logoLight.classList.add('d-none');
        logoDark.classList.remove('d-none');
      }

      if (toTop) toTop.classList.add('show');
    } else {
      nav.classList.add('nav-transparent');
      nav.classList.remove('nav-solid');

      nav.classList.add('navbar-dark');
      nav.classList.remove('navbar-light');

      if (logoLight && logoDark) {
        logoDark.classList.add('d-none');
        logoLight.classList.remove('d-none');
      }

      if (toTop) toTop.classList.remove('show');
    }
  };

  window.addEventListener('scroll', setNavMode, { passive: true });
  window.addEventListener('load', setNavMode);

  if (toTop) {
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
})();
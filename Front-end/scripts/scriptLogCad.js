// localStorage keys
var LS = { token: 'tanabox_token', tipo: 'tanabox_user_tipo', nome: 'tanabox_user_nome' };

function jwtTipo(token) {
  try {
    var payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload.tipo || null;
  } catch (e) {
    return null;
  }
}

function saveSession(token) {
  localStorage.setItem(LS.token, token);
  var t = jwtTipo(token);
  if (t) localStorage.setItem(LS.tipo, t);
}

function getTipo() {
  var tipo = localStorage.getItem(LS.tipo);
  if (tipo) return tipo;
  var token = localStorage.getItem(LS.token);
  if (!token) return null;
  tipo = jwtTipo(token);
  if (tipo) localStorage.setItem(LS.tipo, tipo);
  return tipo;
}

function validateEmail(email) {
  var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validatePassword(senha) {
  var regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  return regex.test(senha);
}

/** POST JSON — URL completa passada em cada chamada */
async function postJson(url, body) {
  var res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  var data = await res.json().catch(function () {
    return {};
  });
  return { ok: res.ok, data: data };
}

function initLogin() {
  var topBtn = document.querySelector('.login-buttom button');
  if (topBtn) topBtn.addEventListener('click', function (e) { e.preventDefault(); location.href = 'register.html'; });

  var form = document.querySelector('.form form');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    var email = document.getElementById('email').value.trim();
    var senha = document.getElementById('password').value;
    var btn = document.getElementById('login-btn');

    btn.classList.add('loading');
    btn.disabled = true;

    if (!validateEmail(email)){
      btn.classList.remove('loading');
      btn.disabled = false;
      return alert('Email inválido. Exemplo: nome@dominio.com');
    } 

    try {
      var out = await postJson('https://projeto-integrador-ii-u48l.onrender.com/users/login', {
        email: email,
        senha: senha,
      });
      if (!out.ok) return alert(out.data.message || 'Não foi possível entrar.');
      if (!out.data.token) return alert('Servidor não enviou o token.');
      saveSession(out.data.token);
      if (out.data.nome) {
        localStorage.setItem(LS.nome, out.data.nome);
      }
      location.href = 'home.html';
    } catch (err) {
      btn.classList.remove('loading');
      btn.disabled = false;
      alert('Sem conexão. Confira se o back-end está em https://projeto-integrador-ii-u48l.onrender.com');
    }
  });
}

function initRegister() {
  var topBtn = document.querySelector('.login-buttom button');
  if (topBtn) topBtn.addEventListener('click', function (e) { e.preventDefault(); location.href = 'login.html'; });

  var form = document.querySelector('.form form');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    var email = document.getElementById('email').value.trim();
    var senha = document.getElementById('password').value;

    if (!validateEmail(email)) 
      return alert('Email inválido. Exemplo: nome@dominio.com');

    if (!validatePassword(senha)) 
      return alert('A senha deve ter no mínimo 6 caracteres, com letras e números.');

    if (senha !== document.getElementById('confirm-password').value) 
      return alert('As senhas não coincidem.');

    var radio = document.querySelector('input[name="type"]:checked');

    if (!radio) 
      return alert('Escolha Feirante ou Usuário.');

    var tipo = radio.id === 'admin' ? 'feirante' : 'turista';

    var submitBtn = form.querySelector('.continue-button button');
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Carregando...';

    try {
      var reg = await postJson('https://projeto-integrador-ii-u48l.onrender.com/users/register', {
        nome: document.getElementById('name').value.trim(),
        email: email,
        senha: senha,
        tipo: tipo,
      });
      if (!reg.ok) return alert(reg.data.message || 'Cadastro não concluído.');
      if (reg.data.nome) localStorage.setItem(LS.nome, reg.data.nome);
      localStorage.setItem(LS.tipo, tipo);

      var log = await postJson('https://projeto-integrador-ii-u48l.onrender.com/users/login', { email: email, senha: senha });
      if (!log.ok || !log.data.token) {
        alert('Conta criada. Entre manualmente.');
        location.href = 'login.html';
        return;
      }
      saveSession(log.data.token);
      location.href = 'home.html';
    } catch (err) {
      alert('Sem conexão. Confira se o back-end está em https://projeto-integrador-ii-u48l.onrender.com');
    }
  });
}

function formatarNome(nome) {
  if(!nome) return '';

  var parts = nome.split(' ');

  if(parts.length === 1) return parts[0];

  return parts[0] + ' ' + parts[1];
}

function initUserUI() {
  var savedName = localStorage.getItem(LS.nome);

  if (savedName) {
    var userBtn = document.querySelector('.user-menu > button.btn-default');

    if (userBtn) {
      var icon = userBtn.querySelector('i');
      userBtn.innerHTML = '';

      if (icon) userBtn.appendChild(icon);

      var formatedName = formatarNome(savedName);
      userBtn.appendChild(document.createTextNode(' ' + formatedName));
    }
  }

  function onLogout(ev) {
    ev.preventDefault();
    localStorage.removeItem(LS.token);
    localStorage.removeItem(LS.tipo);
    localStorage.removeItem(LS.nome);
    location.href = 'login.html';
  }

  var linkSair = document.querySelector('.user-dropdown a');
  if (linkSair) linkSair.addEventListener('click', onLogout);

  document.querySelectorAll('#mobile_menu button.btn-default').forEach(function (btn) {
    if ((btn.textContent || '').toLowerCase().includes('logout')) {
      btn.addEventListener('click', onLogout);
    }
  });
}

function initHome() {
}

function controlUIByTipo() {
  var tipo = getTipo();

  var myBoxLink = document.querySelector('a[href*="myBox.html"]');
  if (myBoxLink) {
    var li = myBoxLink.closest('.nav-item');
    if (tipo !== 'feirante') {
      li.style.display = 'none';
    }
  }

  var mobileLinks = document.querySelectorAll('#mobile_menu a');
  mobileLinks.forEach(link => {
    if (link.href.includes('myBox.html') && tipo !== 'feirante') {
      link.parentElement.style.display = 'none';
    }
  });

  var addBox = document.getElementById('tanabox-add-box-btn');
  if (addBox) {
    if (tipo === 'feirante') {
      addBox.style.display = 'block';
    } else {
      addBox.style.display = 'none';
    }
  }
}


document.addEventListener('DOMContentLoaded', function () {
  var path = location.pathname;

  // 🔥 RODA EM TODAS AS PÁGINAS
  initUserUI();
  controlUIByTipo();

  // 🔽 LÓGICAS ESPECÍFICAS
  if (path.indexOf('login.html') !== -1) {
    initLogin();
  } 
  else if (path.indexOf('register.html') !== -1) {
    initRegister();
  } 
  else if (path.indexOf('home.html') !== -1) {
    initHome();
  } 
  else if (path.indexOf('createBox.html') !== -1 || path.indexOf('myBox.html') !== -1) {
    if (getTipo() !== 'feirante') {
      alert('Somente usuários feirantes podem acessar essa página.');
      location.href = 'home.html';
    }
  }
});
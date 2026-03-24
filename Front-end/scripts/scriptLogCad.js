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
    try {
      var out = await postJson('http://localhost:8080/users/login', {
        email: document.getElementById('email').value.trim(),
        senha: document.getElementById('password').value,
      });
      if (!out.ok) return alert(out.data.message || 'Não foi possível entrar.');
      if (!out.data.token) return alert('Servidor não enviou o token.');
      saveSession(out.data.token);
      location.href = 'home.html';
    } catch (err) {
      alert('Sem conexão. Confira se o back-end está em http://localhost:8080');
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

    var senha = document.getElementById('password').value;
    if (senha !== document.getElementById('confirm-password').value) return alert('As senhas não coincidem.');

    var radio = document.querySelector('input[name="type"]:checked');
    if (!radio) return alert('Escolha Feirante ou Usuário.');

    var tipo = radio.id === 'admin' ? 'feirante' : 'turista';
    var email = document.getElementById('email').value.trim();

    try {
      var reg = await postJson('http://localhost:8080/users/register', {
        nome: document.getElementById('name').value.trim(),
        email: email,
        senha: senha,
        tipo: tipo,
      });
      if (!reg.ok) return alert(reg.data.message || 'Cadastro não concluído.');
      if (reg.data.nome) localStorage.setItem(LS.nome, reg.data.nome);
      localStorage.setItem(LS.tipo, tipo);

      var log = await postJson('http://localhost:8080/users/login', { email: email, senha: senha });
      if (!log.ok || !log.data.token) {
        alert('Conta criada. Entre manualmente.');
        location.href = 'login.html';
        return;
      }
      saveSession(log.data.token);
      location.href = 'home.html';
    } catch (err) {
      alert('Sem conexão. Confira se o back-end está em http://localhost:8080');
    }
  });
}

function initHome() {
  var addBox = document.getElementById('tanabox-add-box-btn');
  if (addBox && localStorage.getItem(LS.tipo) === 'feirante') addBox.removeAttribute('hidden');

  var savedName = localStorage.getItem(LS.nome);
  if (savedName) {
    var userBtn = document.querySelector('.user-menu > button.btn-default');
    if (userBtn) {
      var icon = userBtn.querySelector('i');
      userBtn.textContent = '';
      if (icon) userBtn.appendChild(icon);
      userBtn.appendChild(document.createTextNode(' ' + savedName));
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
    if ((btn.textContent || '').toLowerCase().indexOf('logout') !== -1) btn.addEventListener('click', onLogout);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  var path = location.pathname;
  if (path.indexOf('login.html') !== -1) initLogin();
  else if (path.indexOf('register.html') !== -1) initRegister();
  else if (path.indexOf('home.html') !== -1) initHome();
});
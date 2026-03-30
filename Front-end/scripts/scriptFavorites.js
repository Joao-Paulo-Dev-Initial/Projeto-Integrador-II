async function getFavorites() {
    const token = localStorage.getItem('tanabox_token');

    if(!token){
    alert('Faça login');
        location.href = '../pages/login.html';
        return;
    }

    let usuarioId;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        usuarioId = payload.id;
    } catch {
        alert('Sessão inválida');
        return;
    }

    const result = await fetch(`http://localhost:8080/favoritos/${usuarioId}`);
    const favoritos = await result.json();

    const container = document.getElementById('boxes');
    container.innerHTML = '';

    favoritos.forEach(fav => {
        const card = document.createElement('div');
        card.classList.add('box');

        card.innerHTML = `
            <div class="box-fav">
                <i class="fa-solid fa-bookmark"></i>
            </div>

            <img src="http://localhost:8080${fav.imagem}" class="box-image">

            <h3 class="box-title">${fav.nome_box}</h3>

            <span class="box-description">Observação: ${fav.observacao}</span>

            <button class="btn-default" onclick="seeInfo(${fav.box_id})">
                Ver informações
            </button>

            <button onclick="deleteFavorite(${fav.id})" class="btn-default">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;

        container.appendChild(card);
    });
}

async function deleteFavorite(id) {
    const confirmDelete = confirm('Remover dos favoritos?');

    if (!confirmDelete) return;

    const result = await fetch(`http://localhost:8080/favoritos/delete/${id}`, {
        method: 'DELETE'
    });

    if (result.ok) {
        alert('Removido dos favoritos');
        getFavorites(); // 🔥 atualiza a tela
    } else {
        alert('Erro ao remover');
    }
}

function seeInfo(id) {
    location.href = `../pages/boxInfo.html?id=${id}`;
}

getFavorites();
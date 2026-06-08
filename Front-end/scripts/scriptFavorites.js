let favoriteIdToDelete = null;

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

    const result = await fetch(`https://projeto-integrador-ii-u48l.onrender.com/favoritos/${usuarioId}`);
    const favoritos = await result.json();

    const container = document.getElementById('boxes');
    container.innerHTML = '';

    favoritos.forEach(fav => {
        const card = document.createElement('div');
        card.classList.add('box');

        card.innerHTML = `
            <div class="box-fav"><i class="fa-solid fa-bookmark"></i></div>
            <img src="https://projeto-integrador-ii-u48l.onrender.com${fav.imagem}" class="box-image">
            <p class="box-number">Box ${fav.numero_box || ''}</p>
            <h3 class="box-title">${fav.nome_box}</h3>
            <span class="box-description">Observação: ${fav.observacao}</span>
            <button class="btn-default" onclick="seeInfo(${fav.box_id})">Ver informações</button>
            <button onclick="deleteFavorite(${fav.id})" class="btn-default"><i class="fa-solid fa-trash"></i></button>
        `;

        container.appendChild(card);
    });
}

async function deleteFavorite(id) {
    favoriteIdToDelete = id;

    document.getElementById('deleteModal').style.display = 'flex';
}

function seeInfo(id) {
    location.href = `../pages/boxInfo.html?id=${id}`;
}

function closeDeleteModal() {
    document.getElementById('deleteModal').style.display = 'none';
    favoriteIdToDelete = null;
}

async function confirmDeleteFavorite() {

    if (!favoriteIdToDelete) return;

    const result = await fetch(
        `https://projeto-integrador-ii-u48l.onrender.com/favoritos/delete/${favoriteIdToDelete}`,
        {
            method: 'DELETE'
        }
    );

    closeDeleteModal();

    if (result.ok) {

        showMessageModal(
            'success',
            'Favorito removido',
            'A box foi removida dos seus favoritos.'
        );

        getFavorites();

    } else {

        showMessageModal(
            'error',
            'Erro',
            'Não foi possível remover o favorito.'
        );
    }
}

function showMessageModal(type, title, text) {

    const modal = document.getElementById('messageModal');
    const icon = document.getElementById('messageIcon');

    document.getElementById('messageTitle').textContent = title;
    document.getElementById('messageText').textContent = text;

    if(type === 'success') {
        icon.innerHTML =
            '<i class="fa-solid fa-circle-check icon-success"></i>';
    } else {
        icon.innerHTML =
            '<i class="fa-solid fa-circle-xmark icon-error"></i>';
    }

    modal.style.display = 'flex';
}

function closeMessageModal() {
    document.getElementById('messageModal').style.display = 'none';
}

window.addEventListener('click', (event) => {

    const deleteModal = document.getElementById('deleteModal');

    if(event.target === deleteModal) {
        closeDeleteModal();
    }

});

getFavorites();
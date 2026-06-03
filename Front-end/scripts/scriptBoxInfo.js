function getIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}


async function getBoxInfo() {
    const params = new URLSearchParams(window.location.search);
    const id = getIdFromUrl();

    const result = await fetch(`http://localhost:8080/boxes/${id}`);
    const box = await result.json();

    document.getElementById('box-title').textContent = box.nome_box;
    document.getElementById('box-descricao').textContent = box.descricao;
    document.getElementById('box-image').src = box.imagem
        ? `http://localhost:8080${box.imagem}` 
        : '../imgs/TáNaBox-logo.svg';
    document.getElementById('box-numero').textContent = box.numero_box;
    document.getElementById('box-categoria').textContent = box.categoria;
    document.getElementById('box-horario').textContent = box.horario_func;
    document.getElementById('box-horario_fech').textContent = box.horario_fech;
    document.getElementById('box-contato').textContent = box.contato;

    const whatsappLink = document.getElementById('whatsapp-link');

    if(box.contato) {
        const numeroLimpo = box.contato.replace(/\D/g, "");
        const numeroWhatsapp = `55${numeroLimpo}`;

        whatsappLink.href = `https://wa.me/${numeroWhatsapp}?text=Olá,%20vi%20sua%20box%20no%20TáNaBox`
    }
}



async function confirmFavorite() {
    const observacao = document.getElementById('favObservacao').value;

    const token = localStorage.getItem('tanabox_token');

    if(!token) {
        showMessageModal(
            'error',
            'Login necessário',
            'Você precisa estar logado para favoritar uma box.'
        );

        setTimeout(() => {
            location.href = '../pages/login.html';
        }, 2000);

        return;
    }

    let userId;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        userId = payload.id;
    } catch {
        showMessageModal(
            'error',
            'Sessão inválida',
            'Faça login novamente.'
        );

return;
    }

    const boxId = getIdFromUrl();

    const result = await fetch('http://localhost:8080/favoritos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            usuario_id: userId,
            box_id: boxId,
            observacao: observacao
        })
    });

    if(result.ok) {
        closeModal();

        showMessageModal(
            'success',
            'Favorito salvo!',
            'A box foi adicionada aos seus favoritos com sucesso.'
        );
    } else {
        showMessageModal(
             'error',
             'Erro',
             'Não foi possível favoritar esta box.'
        );
    }
}

function openModal() {
    document.getElementById('favModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('favModal').style.display = 'none';
    document.getElementById('favObservacao').value = '';
}

window.addEventListener('click', (event) => {
    const modal = document.getElementById('favModal');

    if(event.target === modal) {
        closeModal();
    }
});

function showMessageModal(type, title, text) {

    const modal = document.getElementById('messageModal');
    const icon = document.getElementById('messageIcon');

    document.getElementById('messageTitle').textContent = title;
    document.getElementById('messageText').textContent = text;

    if(type === 'success') {
        icon.innerHTML = '<i class="fa-solid fa-circle-check icon-success"></i>';
    } else {
        icon.innerHTML = '<i class="fa-solid fa-circle-xmark icon-error"></i>';
    }

    modal.style.display = 'flex';
}

function closeMessageModal() {
    document.getElementById('messageModal').style.display = 'none';
}

getBoxInfo();
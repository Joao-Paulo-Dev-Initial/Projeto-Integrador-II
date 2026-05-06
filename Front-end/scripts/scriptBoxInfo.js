function getIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

//Implementar depois

// function openWhatsapp() {
//     let contato = document.getElementById('contato').value;

//     contato = contato.replace(/\D/g, "");

//     if(!contato.startsWith("55")) {
//         contato = "55" + contato;
//     }

//     let url = "https://wa.me/" + contato;

//     window.open(url, "_blank");
// }

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
        alert('Faça login para favoritar.');
        location.href = '../pages/login.html';
        return;
    }

    let userId;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        userId = payload.id;
    } catch {
        alert('Sessão inválida.');
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
        alert('Box favoritada!');
        closeModal();
    } else {
        alert('Erro ao favoritar.');
    }
}

function openModal() {
    document.getElementById('favModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('favModal').style.display = 'none';
}

getBoxInfo();
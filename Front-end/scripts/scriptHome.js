async function getBoxes() {
    try {
        const result = await fetch('http://localhost:8080/boxes/all');
        const boxes = await result.json();

        const container = document.getElementById('boxes');
        if (!container) return;

        container.innerHTML = '';

        boxes.forEach(box => {
            const card = document.createElement('div');
            card.classList.add('box');

            card.innerHTML = `
                <div class="box-fav">
                    <i class="fa-solid fa-box"></i>
                </div>
                <img src="http://localhost:8080${box.imagem}" class="box-image" alt="">
                <h3 class="box-title">${box.nome_box || ''}</h3>
                <span class="box-description">${box.descricao || ''}</span>
                <button class="btn-default" onclick="info(${box.id})">Ver informações</button>
            `;

            container.appendChild(card);
        });
    } catch (error) {
        console.error('Erro ao carregar boxes:', error);
    }
}

getBoxes();

function info(id) {
    location.href = `../pages/boxInfo.html?id=${id}`;
}
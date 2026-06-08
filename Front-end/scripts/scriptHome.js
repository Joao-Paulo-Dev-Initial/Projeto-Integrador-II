let allBoxes = [];

async function getBoxes() {
    try {
        const result = await fetch('https://projeto-integrador-ii-u48l.onrender.com/boxes/all');
        const boxes = await result.json();

        allBoxes = boxes;

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
                <img src="https://projeto-integrador-ii-u48l.onrender.com${box.imagem}" class="box-image" alt="">
                <p class="box-number">Box ${box.numero_box || ''}</p>
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

function filterBoxes() {
    const search = document.getElementById('searchBox').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const container = document.getElementById('boxes');

    container.innerHTML = '';

    const filteredBoxes = allBoxes.filter(box => {
        const matchSearch = String(box.numero_box).includes(search);

        const matchCategory = category === '' || box.categoria === category;

        return matchSearch && matchCategory;
    });

    filteredBoxes.forEach(box => {
        const card = document.createElement('div');

        card.classList.add('box');

        card.innerHTML = `
            <div class="box-fav">
                <i class="fa-solid fa-box"></i>
            </div>
            <img src="https://projeto-integrador-ii-u48l.onrender.com${box.imagem}" class="box-image" alt="">
            <p class="box-number">Box ${box.numero_box || ''}</p>
            <h3 class="box-title">${box.nome_box || ''}</h3>
            <span class="box-description">${box.descricao || ''}</span>
            <button class="btn-default" onclick="info(${box.id})">Ver informações</button>
        `;

        container.appendChild(card);
    })
}

getBoxes();

function info(id) {
    location.href = `../pages/boxInfo.html?id=${id}`;
}

document.getElementById('searchBox').addEventListener('input', filterBoxes);
document.getElementById('categoryFilter').addEventListener('change', filterBoxes);
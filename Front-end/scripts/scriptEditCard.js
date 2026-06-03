const editBtn = document.getElementById("editBtn");
const form = document.getElementById("boxForm");
const inputs = form.querySelectorAll("input, textarea, select");
const saveBtn = document.getElementById("saveBtn");
const imageUpload = document.getElementById("imageUpload");
const preview = document.getElementById("preview");
const editText = document.getElementById("editText");
const editIcon = document.getElementById("editIcon");
const deleteBtn = document.getElementById("deleteBtn");

saveBtn.style.display = "none";
deleteBtn.style.display = "none";

let boxId;
let editing = false;

editBtn.addEventListener("click", () => {
    editing = !editing;

    inputs.forEach(input => {
        input.disabled = !editing;
    });

    saveBtn.style.display = editing ? "block" : "none";
    deleteBtn.style.display = editing ? "block" : "none";
    preview.style.cursor = editing ? "pointer" : "default";

     if(editing){
        editIcon.classList.replace("fa-pen", "fa-xmark");
        editText.textContent = "Cancelar";
    } else {
        editIcon.classList.replace("fa-xmark", "fa-pen");
        editText.textContent = "Editar";
    }

});

preview.addEventListener("click", () => {
    if(editing){
        imageUpload.click();
    }
});

imageUpload.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            preview.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

async function loadMyBox() {
    const token = localStorage.getItem('tanabox_token');

    if (!token) {
        alert('Faça login novamente');
        location.href = '../pages/login.html';
        return;
    }

    let usuarioId;

    try {
        const payload = JSON.parse(
            atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
        );
        usuarioId = payload.id;
    } catch (error) {
        alert('Sessão inválida');
        return;
    }

    try {
        const res = await fetch(`http://localhost:8080/boxes/user/${usuarioId}`);
        const box = await res.json();

        if (!res.ok) {
            alert("Você ainda não possui uma box.");
            window.location.href = "../pages/createBox.html";
            return;
        }
        boxId = box.id;

        const inputs = document.querySelectorAll("#boxForm input, #boxForm textarea, #boxForm select");

        inputs[0].value = box.numero_box || '';
        inputs[1].value = box.nome_box || '';
        inputs[2].value = box.descricao || '';
        inputs[3].value = box.categoria || '';
        inputs[4].value = box.horario_func || '';
        inputs[5].value = box.horario_fech || '';
        inputs[6].value = box.contato || '';

        // imagem (se tiver)
        if (box.imagem) {
            preview.src = `http://localhost:8080${box.imagem}`;
        } else {
            preview.src = '../imgs/TáNaBox-logo.svg';
        }

    } catch (error) {
        console.error("Erro ao carregar box:", error);
    }
}

deleteBtn.addEventListener("click", async () => {
    document.getElementById("deleteBoxModal").style.display = "flex";
});

saveBtn.addEventListener("click", async () => {
    if (!boxId) {
        alert("Erro: box não carregada");
        return;
    }

    const inputs = document.querySelectorAll("#boxForm input, #boxForm textarea, #boxForm select");

    const formData = new FormData();

    formData.append("numero_box", inputs[0].value);
    formData.append("nome_box", inputs[1].value);
    formData.append("descricao", inputs[2].value);
    formData.append("categoria", inputs[3].value);
    formData.append("horario_func", inputs[4].value);
    formData.append("horario_fech", inputs[5].value);
    formData.append("contato", inputs[6].value);

    if (imageUpload.files[0]) {
    formData.append("imagem", imageUpload.files[0]);
    }

    const response = await fetch(`http://localhost:8080/boxes/${boxId}`, {
        method: "PUT",
        body: formData
    });

    const result = await response.json();

    if(response.ok) {
        showMessageModal(
        'success',
        'Box atualizada!',
        'As alterações foram salvas com sucesso.'
    );

    setTimeout(() => {
        location.reload();
    }, 2000);

    } else {
        showMessageModal(
             'error',
             'Erro',
             result.error || 'Não foi possível atualizar a box.'
        );
    }
});

const telefone = document.getElementById("contato");

telefone.addEventListener("input", function (e) {
    let valor = e.target.value;

    valor = valor.replace(/\D/g, ""); // remove tudo que não for número

    valor = valor.slice(0, 11);

    // aplica a máscara
    if (valor.length > 0) {
        valor = "(" + valor;
    }

    if (valor.length > 3) {
        valor = valor.slice(0, 3) + ") " + valor.slice(3);
    }

    if (valor.length > 10) {
        valor = valor.slice(0, 10) + "-" + valor.slice(10);
    }

    e.target.value = valor;
});


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

function closeDeleteBoxModal() {
    document.getElementById("deleteBoxModal").style.display = "none";
}

async function confirmDeleteBox() {

    closeDeleteBoxModal();

    try {

        const response = await fetch(
            `http://localhost:8080/boxes/${boxId}`,
            {
                method: "DELETE"
            }
        );

        const data = await response.json();

        if (response.ok) {

            showMessageModal(
                'success',
                'Box excluída',
                data.message || 'Sua box foi removida com sucesso.'
            );

            setTimeout(() => {
                window.location.href = "../pages/createBox.html";
            }, 2000);

        } else {

            showMessageModal(
                'error',
                'Erro',
                data.error || 'Não foi possível excluir a box.'
            );

        }

    } catch (error) {

        showMessageModal(
            'error',
            'Erro',
            'Ocorreu um erro ao excluir a box.'
        );

        console.error(error);
    }
}

window.addEventListener('click', (event) => {

    const deleteModal =
        document.getElementById('deleteBoxModal');

    if(event.target === deleteModal) {
        closeDeleteBoxModal();
    }

});

loadMyBox();

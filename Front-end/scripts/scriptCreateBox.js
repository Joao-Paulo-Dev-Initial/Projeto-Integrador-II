const form = document.getElementById('createBoxForm');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();


        const token = localStorage.getItem('tanabox_token');

        if (!token) {
            alert("Faça login novamente para criar sua box.");
            location.href = "../pages/login.html";
            return;
        }

        let usuarioId = null;

        try {
            const payload = JSON.parse(
                atob(
                    token.split('.')[1]
                        .replace(/-/g, '+')
                        .replace(/_/g, '/')
                )
            );

            usuarioId = payload.id;

        } catch (err) {
            console.error(err);
            alert("Sessão inválida. Faça login novamente.");
            location.href = '../pages/login.html';
            return;
        }

        const fileInput = document.getElementById('imagem');
        const formData = new FormData();

        if (fileInput.files[0]) {
            formData.append("imagem", fileInput.files[0]);
        }

        formData.append("numero_box", document.getElementById('numero_box').value);
        formData.append("nome_box", document.getElementById('nome_box').value);
        formData.append("descricao", document.getElementById('descricao').value);
        formData.append("categoria", document.getElementById('categoria').value);
        formData.append("horario_func", document.getElementById('horario_func').value);
        formData.append("horario_fech", document.getElementById('horario_fech').value);
        formData.append("contato", document.getElementById('contato').value);
        formData.append("usuario_id", Number(usuarioId));

        try {

            const result = await fetch("https://projeto-integrador-ii-u48l.onrender.com/boxes", {
                method: "POST",
                body: formData
            });

            const response = await result.json().catch(() => ({}));

            console.log("STATUS:", result.status);
            console.log("URL FINAL:", result.url);
            console.log("RESPONSE:", response);

            if (result.ok) {

                console.log("SUCESSO");
                console.log("MOSTRANDO MODAL");

                showMessageModal(
                    'success',
                    'Box criada!',
                    'Sua box foi criada com sucesso.'
                );
                setTimeout(() => {
        window.location.href = "../pages/home.html";
    }, 2000);

            } else {

                console.log("ERRO");

                showMessageModal(
                    'error',
                    'Erro',
                    response.error || response.message || 'Erro ao criar box.'
                );
            }

        } catch (error) {

            console.error("Erro na requisição:", error);

            showMessageModal(
                'error',
                'Erro',
                'Não foi possível conectar ao servidor.'
            );
        }
    });
}
 
async function userAlreadyHasBox() {
    const token = localStorage.getItem('tanabox_token');

    if (!token) return;

    try {
        const payload = JSON.parse(
            atob(
                token.split('.')[1]
                    .replace(/-/g, '+')
                    .replace(/_/g, '/')
            )
        );

        const usuarioId = payload.id;

        const result = await fetch(
            `https://projeto-integrador-ii-u48l.onrender.com/boxes/user/${usuarioId}`
        );

        if (result.status === 200) {
            window.location.href = "../pages/myBox.html";
        } else if (result.status === 400) {
            console.log("O usuário não possui uma box");
        }

    } catch (error) {
        console.error("Erro ao verificar box:", error);
    }
}

userAlreadyHasBox();

// adicionar telefone
const telefone = document.getElementById("contato");

telefone.addEventListener("input", function (e) {
    let valor = e.target.value;

    // remove tudo que não for número
    valor = valor.replace(/\D/g, "");

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

    console.log("MODAL ABERTO");

    const modal = document.getElementById('messageModal');
    const icon = document.getElementById('messageIcon');

    document.getElementById('messageTitle').textContent = title;
    document.getElementById('messageText').textContent = text;

    if (type === 'success') {
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

    window.location.href = "../pages/myBox.html";
}

window.addEventListener('click', (event) => {

    const modal = document.getElementById('messageModal');

    if (event.target === modal) {
        closeMessageModal();
    }

});
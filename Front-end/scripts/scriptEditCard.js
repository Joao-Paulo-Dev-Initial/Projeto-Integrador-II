const editBtn = document.getElementById("editBtn");
const form = document.getElementById("boxForm");
const inputs = form.querySelectorAll("input, textarea, select");
const saveBtn = document.getElementById("saveBtn");
const imageUpload = document.getElementById("imageUpload");
const preview = document.getElementById("preview");

let editing = false;

editBtn.addEventListener("click", () => {
    editing = !editing;

    inputs.forEach(input => {
        input.disabled = !editing;
    });

    saveBtn.style.display = editing ? "block" : "none";
    preview.style.cursor = editing ? "pointer" : "default";

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
const buttonsDelete = document.querySelectorAll('.Contenu button');
const btnAdd = document.querySelector('.btn-add');
const form = document.getElementById('form-ajouter');
const inputTitle     = document.getElementById('input-title');
const inputSousTitle = document.getElementById('input-sousTitle');
const inputParagraph = document.getElementById('input-paragraph');
const inputLinkAbout = document.getElementById('input-link_about');


buttonsDelete.forEach((index)=>{
    index.addEventListener('click', async ()=>{
        const data = {
            id_contenu: index.getAttribute('id')
        }
        console.log(data);
        let response = await fetch('/contenu', {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });

        if(response.ok){
            window.location.reload();
        }else{
            alert('Un probleme est survenu!');
        }
    });
});


form.addEventListener('submit', async (event) => {
    event.preventDefault();

    let data = {
        title: inputTitle.value,
        sousTitle: inputSousTitle.value,
        paragraph: inputParagraph.value,
        link_about: inputLinkAbout.value
    }

    console.log(data)
    
    let response = await fetch('/contenu', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });

    console.log(response)

    if(response.ok) {
        inputTitle.value = "";
        inputSousTitle.value = "";
        inputParagraph.value  = "";
        inputLinkAbout.value = "";
        window.location.reload();
    }
    else {
        // Afficher dans l'inferface graphique
        alert('La soumission a echoué')
    }
});
function main(){
    let form = document.getElementById('form-ajouter');
    let inputSermon = document.getElementById('input-sermon');
    let inputListen = document.getElementById('input-listen');
    let inputDownload = document.getElementById('input-link-download');

    
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
    
        let data = {
            sermon: inputSermon.value,
            link_listen: inputListen.value,
            link_download: inputDownload.value
        }
    
        console.log(data)
        
        let response = await fetch('/suggestion', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });

     
    
        if(response.ok) {
            window.location.replace('/suggestion');
        }
        else {
            // Afficher dans l'inferface graphique
            alert('La soumission a echoué')
        }
    });
}

main();
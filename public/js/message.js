const messages = document.querySelectorAll('.affiche-message');
const boutons =  document.querySelectorAll('.btn-close button')

messages.forEach((item)=>{
   
    item.addEventListener('click', ()=>{
        
       const element = item.parentElement.children[1];
        if(element.getAttribute('class') === 'message hidden'){
            element.setAttribute('class', 'message expose');
            (async ()=>{
                const tableau = element.getAttribute('id').split('-');
                if(tableau[0] === 'non_lue'){
                    const data = {
                        id_message: tableau[1]
                    }

                    let response = await fetch('/lecture', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify(data)
                    });

                    if(response.ok){
                        item.children[0].setAttribute('class', 'status lue');
                    }
                }
               
            })();
        }else{
            element.setAttribute('class', 'message hidden');
        }
    })
});


boutons.forEach((item)=>{
    item.addEventListener('click', ()=>{
        const element = item.parentElement.parentElement.parentElement.children[1];
        if(element.getAttribute('class') === 'message hidden'){
            element.setAttribute('class', 'message expose');
        }else{
            element.setAttribute('class', 'message hidden');
        }
        
    });
})
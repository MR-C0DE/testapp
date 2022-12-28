const select = document.getElementById('interac');
const table =  document.getElementById('res');
select.addEventListener('change', () => {
    if(select.value !== ''){
        (async ()=>{

            const data = {
                action_effectuee: select.value
            }

            let response = await fetch('/interaction_recherche', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });

            if(response.ok){
               const resultat = await response.json();
               document.querySelector('.label-select').innerText = "Nombre d'element trouvé :";
               document.querySelector('.value-select').innerText = resultat.length.toString();

               let tr = document.createElement('tr');
               let td = document.createElement('td');
               table.innerHTML = null;
               let th = document.createElement('th');
      
                th.textContent = 'Element';
                tr.appendChild(th);
                th = document.createElement('th');
                th.textContent = 'Lien';
                tr.appendChild(th);
                th = document.createElement('th');
                th.textContent = 'Ip visiteur';
                tr.appendChild(th);
                th = document.createElement('th');
                th.textContent = 'Date interaction';
                tr.appendChild(th);

                table.appendChild(tr)

               resultat.forEach(item => {
                    tr = document.createElement('tr')
                    td = document.createElement('td');
                    td.textContent = item.element;
                    tr.appendChild(td);
                    td = document.createElement('td');
                    const a = document.createElement('a');
                    a.setAttribute('href', item.lien);
                    a.textContent = 'Ouvrir'
                    td.appendChild(a);
                    tr.appendChild(td);
                    td = document.createElement('td');
                    td.textContent = item.ip_visiteur;
                    tr.appendChild(td);
                    td = document.createElement('td');
                    td.textContent = item.date_interaction;
                    tr.appendChild(td);

                    table.appendChild(tr)

               });


            }
            
           
        })();
    }
});
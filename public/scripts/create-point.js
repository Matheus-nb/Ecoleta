function populateUFs () {
    const ufSelect = document.querySelector("select[name=uf]")

    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    .then( res => res.json() )
    .then( states => { 

        for (const state of states){
            ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`
        }
         
    })
}

populateUFs ()


function getCities(event) {
    const citySelect = document.querySelector("select[name=city]")
    const stateInput = document.querySelector("input[name=state]")

    const ufValue = event.target.value


    const indexOfSelectedState = event.target.selectedIndex
    stateInput.value = event.target.options [indexOfSelectedState].text


    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`

    citySelect.innerHTML = "<option value>Selecione a cidade</option>"
    citySelect.disabled = true

    fetch(url)
    .then( res => res.json() )
    .then( cities => { 
        
        for (const city of cities){
            citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
        }

        citySelect.disabled = false
         
    })

}





document
    .querySelector("select[name=uf]")
    .addEventListener("change", getCities )



   
  
// PARTE DOS ITENS DE COLETA, ADICIONAR O CSS E PASSAR QUAL DOS ITENS FOI SELECIONADO.
const itemsToCollect = document.querySelectorAll(".items-grid li")

for (const item of itemsToCollect) {
    item.addEventListener ("click", handleSelectedItem) // ADICIONAR EVENTO DE "CLICK" NA LISTA (CSS E SELEÇÃO)
}

const collectedItems = document.querySelector("input[name=items]")

let selectedItems = [] // ITENS SELECIONADOS

function handleSelectedItem(event) {
    const itemLi = event.target //CSS

    itemLi.classList.toggle("selected") //CSS

    
    const itemId = itemLi.dataset.id // FUNCIONALIDADE DE SELEÇÃO

    // VERIFICAR SE EXISTEM ITEMS SELECIONADOS, SE SIM PEGAR OS ITENS SELECIONADOS
    const alreadySelected = selectedItems.findIndex ( item => item == itemId)
    
    // SE JÁ ESTIVER SELECIONADO
    if (alreadySelected >= 0) {
        // TIRAR DA SELEÇÃO
        const filteredItems = selectedItems.filter( item => item != itemId )

        selectedItems = filteredItems
    } else {
        // SE NÃO ESTIVER SELECIONADO, ADICIONAR À SELEÇÃO
        selectedItems.push(itemId)
    }

    // ATUALIZAR O CAMPO ESCONDIDO COM OS INTENS SELECIONADOS
    collectedItems.value = selectedItems

}
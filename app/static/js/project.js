const searchBox = document.querySelector('#search-box')
const suggestionList = document.querySelector('#suggestions')
const dataInput = document.querySelector('#data-input')
const suggestionDiv = document.querySelector('#suggestions-div')
const TextDiv = document.querySelector('#text-div')

let tempText;
let currentElement = null

dataInput.addEventListener('keyup', listSuggestions)
dataInput.addEventListener('click', () => {
    toggleListDisplay()
})
function listSuggestions(e) {

    toggleListDisplay()

    if (e.key != 'ArrowDown' & e.key != 'ArrowUp' & e.key != 'ArrowLeft' & e.key != 'ArrowRight' & e.key != 'Enter') {
        fetch("/search", {
            method: "POST",
            body: dataInput.value
        }).then(resp => (resp.json()))
            .then(resp => renderListResult(resp, suggestionList))
        suggestionList.style = "display: block"
        tempText = dataInput.value
    }
    else if (e.key == 'Enter') {
        suggestionDiv.style.display = 'None'
        getDescription()
    }
}

searchBox.addEventListener("keydown", function (e) {
    if (e.key == 'ArrowDown') {  // aşağı
        suggestionList.style = "display:block"
        // if (suggestionList.getElementsByClassName("").length != 0) {
        if ((document.activeElement == dataInput) & (currentElement === null)) {
            currentElement = suggestionList.firstElementChild
            dataInput.value = currentElement.innerText
            currentElement.classList.add("focused")
        }
        else if ((currentElement != null) & (currentElement.nextElementSibling != null)) {
            currentElement.classList.remove("focused")
            currentElement = currentElement.nextElementSibling
            dataInput.value = currentElement.innerText
            currentElement.classList.add("focused")
        }
        else if ((currentElement != null) & (currentElement.nextElementSibling == null)) {
            currentElement.classList.remove("focused")
            currentElement = null
            dataInput.value = tempText
        }
        // }
    }

    if (e.key == 'ArrowUp') {  // yukarı
        e.preventDefault();
        suggestionList.style = "display:block"
        console.log('yukarı')
        // if (document.getElementById("liste").getElementsByClassName("list-group-item").length != 0) {
            if ((document.activeElement == dataInput) & (currentElement === null)) {
                currentElement = suggestionList.lastElementChild
                dataInput.value = currentElement.innerText
                currentElement.classList.add("focused")
            }
            else if ((currentElement != null) & (currentElement.previousElementSibling != null)) {
                currentElement.classList.remove("focused")
                currentElement = currentElement.previousElementSibling
                dataInput.value = currentElement.innerText
                currentElement.classList.add("focused")
            }
            else if ((currentElement != null) & (currentElement.previousElementSibling == null)) {
                currentElement.classList.remove("focused")
                currentElement = null
                dataInput.value = tempText
            }
        // }
    }
})

suggestionDiv.addEventListener("mouseover", function (e) {
    if (e.target.tagName == "LI") {
        if (currentElement == null) {
            currentElement = e.target
            currentElement.classList.add("focused")
        }
        else {
            currentElement.classList.remove("focused")
            currentElement = e.target
            currentElement.classList.add("focused")
        }
    }
})
suggestionDiv.addEventListener("mouseleave", function (e) {
    if (currentElement != null) {
        currentElement.classList.remove("focused")
        currentElement = null
    }

})

suggestionDiv.addEventListener('click', function (e) {
    console.log(e.target.parentNode)

    if (e.target.tagName == "LI") {
           dataInput.value = e.target.innerText;
           tempText = dataInput.value
           suggestionDiv.style.display = 'None'
           getDescription()
        }
    else if (e.target.parentNode.tagName == "LI") {

        dataInput.value = e.target.parentNode.innerText;
        tempText = dataInput.value
        suggestionDiv.style.display = 'None'
        getDescription()
    }
    else {
        suggestionDiv.style.display = 'None'

    }
    
})

function getDescription() {
    fetch("/result", {
        method: "POST",
        body: dataInput.value
    }).then(resp => (resp.json()))
        .then(resp => (renderDescResult(resp[0], resp[1], TextDiv)))
}


let renderListResult = (results, listArea) => {
    listArea.innerHTML = ""
    console.log(tempText)
    for (let i of results) {
        if (i.startsWith(tempText)) {
            listArea.innerHTML += `<li class="suggested">${tempText}<span class='matched'>${i.split(tempText).slice(1).join(tempText)}</span> </li>`
        }
        else {
            listArea.innerHTML += `<li class="suggested"> <span class='matched'>${i}</span> </li>`
        }
    }
}


let renderDescResult = (word, description, resultArea=TextDiv) => {
    resultArea.innerHTML = ""
    resultArea.innerHTML += ` <span class="quotes">“</span><span class="text">${description}</span><span class="quotes">”</span>`

}

function toggleListDisplay() {
    if (dataInput.value == ''){
        suggestionDiv.style.display = 'None'
        // dataInput.style.textDecoration = 'none'
    }
    else {
        suggestionDiv.style.display = 'Flex' 
        // dataInput.style.textDecoration = 'underline'
        // dataInput.style.textDecorationColor = '#CC444B'
    }
}

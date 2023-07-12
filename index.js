import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://playground-6bea0-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")
const pickedListEl = document.getElementById("picked-list")
let isPicked = false

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    
    push(shoppingListInDB, inputValue)
    
    clearInputFieldEl()
})

onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
    
        clearShoppingListEl()
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            
            appendItemToShoppingListEl(currentItem)
        }    
    } else {
        shoppingListEl.innerHTML = "No items here... yet"
    }
})

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
}

function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    
    let newEl = document.createElement("li")
    
    newEl.textContent = itemValue
    
    newEl.addEventListener("click", function() {
        // remove the item
        //let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        //remove(exactLocationOfItemInDB)

        // make the item go down
        if(!isPicked){
            pickedListEl.append(newEl)
            newEl.style.backgroundColor = "#97A7B3"
            newEl.style.color = "black"
            isPicked = true
        }
        else{
            shoppingListEl.append(newEl)
            newEl.style.backgroundColor = "#FFFDF8"
            newEl.style.color = "#432000"
            isPicked = false
        }
    })
    
    shoppingListEl.append(newEl)
}
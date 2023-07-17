import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "hhttps://playground-6bea0-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")
const pickedListInDB = ref(database, "pickedList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")
const pickedListEl = document.getElementById("picked-list")
const clearAllEl = document.getElementById("clear-all")
const searchEl = document.getElementById("search-button")

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    
    push(shoppingListInDB, inputValue)
    
    clearInputFieldEl()
})

searchEl.addEventListener("click", function() {
    location.href = "./search.html";
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

onValue(pickedListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
    
        clearPickedListEl()
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            
            appendItemToPickedListEl(currentItem)
        }    
    } else {
        pickedListEl.innerHTML = ""
    }
})

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

function clearPickedListEl() {
    pickedListEl.innerHTML = ""
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
        // add the item to pickedList
        pickedListEl.append(newEl)
        let inputValue = newEl.textContent
        push(pickedListInDB, inputValue)
        // remove the item from shoppingList
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        remove(exactLocationOfItemInDB)
    })
    
    shoppingListEl.append(newEl)
}

function appendItemToPickedListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    
    let newEl = document.createElement("li")
    
    newEl.textContent = itemValue
    // change the item's color to look picked
    newEl.style.backgroundColor = "#97A7B3"
    newEl.style.color = "black"
    
    newEl.addEventListener("click", function() {
        // add the item to shoppingList
        shoppingListEl.append(newEl)
        let inputValue = newEl.textContent
        push(shoppingListInDB, inputValue)
        // remove the item from pickedList
        let exactLocationOfItemInDB = ref(database, `pickedList/${itemID}`)
        remove(exactLocationOfItemInDB)
    })
    
    pickedListEl.append(newEl)
}

clearAllEl.addEventListener("click", function() {
    // remove all items
    remove(shoppingListInDB)
    remove(pickedListInDB)
})
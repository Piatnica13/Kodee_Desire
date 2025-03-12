let bthProfil = document.querySelector("#ProfilMenuItemProfil");
let profil = document.querySelector("#ProfilLeftProfil");
let bthRechange = document.querySelector("#ProfilEdit");
let rechange = document.querySelector("#ProfilLeftChanchInfo");
let bthPassword = document.querySelector("#ProfilMenuItemPassword");
let password = document.querySelector("#ProfilLeftChanchPass");
let bthAddress = document.querySelector("#ProfilMenuItemAddress");
let address = document.querySelector("#ProfilLeftAddAddress");
let formToAddAddresses = document.querySelector("#ProfilAddSplit")
let bthAddAddresses = document.querySelector("#ProfilBthAddAdd");

setTimeout(() => {
    MainContener.style.transition = `opacity 1s ease-in-out`;
    MainContener.style.opacity = "1";
    setTimeout(()=>{
        MainContener.style.transition = `opacity 0.3s ease-in-out`;
    }, 1001);
}, 300);

bthProfil.addEventListener("click", () => {
    rechange.style.opacity = "0";
    password.style.opacity = "0";
    address.style.opacity = "0";
    profil.style.display = "flex";
    setTimeout(() => {
        address.style.display = "none"
        rechange.style.display = "none";
        password.style.display = "none";
        profil.style.opacity = "1";
    }, 500);
})

bthRechange.addEventListener("click", () => {
    profil.style.opacity = "0";
    password.style.opacity = "0";
    address.style.opacity = "0";
    rechange.style.display = "block";
    setTimeout(() => {
        address.style.display = "none"
        profil.style.display = "none";
        password.style.display = "none";
        rechange.style.opacity = "1";
    }, 500)
})

bthPassword.addEventListener("click", () => {
    profil.style.opacity = "0";
    address.style.opacity = "0";
    rechange.style.opacity = "0";
    password.style.display = "flex";
    setTimeout(() => {
        address.style.display = "none"
        profil.style.display = "none";
        rechange.style.display = "none";
        password.style.opacity = "1";
    }, 500);
})

bthAddress.addEventListener("click", () => {
    profil.style.opacity = "0";
    password.style.opacity = "0";
    rechange.style.opacity = "0";
    address.style.display = "flex";
    setTimeout(() => {
        profil.style.display = "none";
        password.style.display = "none";
        rechange.style.display = "none";
        address.style.opacity = "1";
    }, 500);
})

bthAddAddresses.addEventListener("click", () => {
    bthAddAddresses.style.opacity = "0";
    formToAddAddresses.style.display = "grid";
    setTimeout(() => {
        formToAddAddresses.style.opacity = "1";
        bthAddAddresses.style.display = "none";
    }, 300);
})


function saveAddress(addressId) {
    fetch('/select_address', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'selected_address=' + addressId
    })
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
}

let buttonSave = document.querySelector("#ProfilDivButtonAdd");
let deletedAddresses = [];

function showButton() {
    if (buttonSave) {
        buttonSave.style.display = "flex";
        setTimeout(() => {
            buttonSave.style.opacity = "1";
        }, 1);
    } else {
        console.error("Кнопка сохранения не найдена!");
    }
}

function markForDeletion(addressId) {
    
    let addressElement = document.getElementById(`address-${addressId}`);
    
    if (addressElement) {
        addressElement.remove();

        if (!deletedAddresses.includes(addressId)) {
            deletedAddresses.push(addressId);
        }

        let hiddenInput = document.getElementById("deletedAddresses");
        if (hiddenInput) {
            hiddenInput.value = deletedAddresses.join(",");
        } else {
            console.error("Скрытое поле deletedAddresses не найдено!");
        }

        showButton();
    } else {
        console.error(`Элемент #address-${addressId} не найден!`);
    }
}

// Сделал на Flask 
// class Address{
//     constructor(name, sity, street, home, flat){
//         this.name = name;
//         this.sity = sity;
//         this.street = street;
//         this.home = home;
//         this.flat = flat;
//     }
//     toHTML(){
//         return`
//         <div class="ProfilAddress">
//         <h2 class = "ProfilAddressTitle">${this.name}</h2>
//         <p class = "ProfilAddressText">Доставка г. ${this.sity} ул. ${this.street} д.${this.home} кв.${this.flat}</p>
//         <button class = "ProfilAddressBth">Удалить</button>
//         </div>
//         `;
//     }
//     show(){
//         console.log(`Название: ${this.name}`);
//     }
// }
// const addresses = [];
// const space = document.querySelector("#ProfilAddMain");
// const bthSpace = document.querySelector("#ProfilAddBth");
// const addressForm = document.querySelector("#");

// form.addEventListener("submit", function (event) {
//     event.preventDefault();

//     const name = document.getElementById("name").value;
//     const city = document.getElementById("city").value;
//     const street = document.getElementById("street").value;
//     const home = document.getElementById("home").value;
//     const flat = document.getElementById("flat").value;

//     const newAddress = new Address(name, city, street, home, flat);
//     addresses.push(newAddress);

//     renderAddresses();
// });

// function renderAddresses() {
//     space.innerHTML = ""; // Очищаем перед обновлением
//     addresses.forEach((address, index) => {
//         const div = document.createElement("div");
//         div.innerHTML = address.toHTML();
//         div.querySelector(".delete-btn").addEventListener("click", () => {
//             addresses.splice(index, 1);
//             renderAddresses();
//         });
//         space.appendChild(div);
//     });
//     show();
// }
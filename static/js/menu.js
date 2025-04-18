let px100Height = document.querySelector("#menuHeightPh");
let line1 = document.querySelector(".line1");
let line2 = document.querySelector(".line2");
let line3 = document.querySelector(".line3");

let checkboxMain = document.querySelector("#checkboxMain");
let body = document.querySelector('#Body');
let MainMenu = document.querySelector('#contenerMenu');
let divSrtelkaMenu = document.querySelector("#strelkaMenuOp");
let PodTextPh = document.querySelector('.PodTextPh')
let chetPodMenu = false;
let PodMenuPh = document.querySelector('#PodMenuPh')
let PodMenu = document.querySelector("#PodMenu");
let chet = true;
let checkboxSubmenu1 = document.querySelector("#checkboxx");


checkboxSubmenu1.addEventListener('click', () =>{
    divSrtelkaMenu.classList.toggle('open');
    if(chet == true){
        divSrtelkaMenu.style.height = "135px";
        chet = false;
    }
    else{
        interval2 = setInterval(()=>{
            divSrtelkaMenu.style.height = "0px";
            clearInterval(interval2)
        }, 300);
        chet = true;
    }
});
PodMenuPh.classList.toggle('open');

let Favorite = document.querySelector("#izbranoe").addEventListener("click",() => {
    sessionStorage.setItem("needFavoriteCheck", "true");
    inShowPage()
    
    setTimeout(() => {
        MainContener.style.transition = `opacity 0.3s linear`;
        window.location.href = "/profil";
    }, 600);
})

checkboxMain.addEventListener('click', checkboxmainn) 
function checkboxmainn(){
    if(chetPodMenu == false){
        chetPodMenu = true;
        if (window.innerWidth <= 767){
            body.style.opacity =  "0";
            interval5 = setTimeout(()=>{
                PodMenuPh.classList.toggle('open');
                PodMenuPh.style.opacity = "1";
            }, 200)
            PodMenuPh.style.pointerEvents = "auto";
        }
        else{
            PodMenu.style.height = `360px`; 
        }
        line1.style.transform = "rotate(45deg)";
        line2.style.transform = "scaleY(0)";
        line3.style.transform = "rotate(-45deg)";
    }
    else{
        chetPodMenu = false;
        PodMenu.style.height = `0px`;
        if (window.innerWidth <= 767){
            body.style.opacity =  "1";
            PodMenuPh.classList.toggle('open');
            PodMenuPh.style.opacity = "0";
        }
        else{
            PodMenu.style.height = `0px`; 
        }
        line1.style.transform = "rotate(0deg)";
        line2.style.transform = "scaleY(1)";
        line3.style.transform = "rotate(0deg)";
        PodMenuPh.style.pointerEvents = "none";

        checkboxMain.checked = false;
    }
}


let DivPoisk = document.querySelector("#menuPlaseForPoisk");
let DivResult = document.querySelector("#menuPlaseForResult");

let DivPoiskk = document.querySelector("#menuPlaseForPoiskk");
let DivResultt = document.querySelector("#menuPlaseForResultt");
function checkWidth() {
    if(checkboxMain.checked == true && window.innerWidth < 767){
        checkboxMain.cheked = false;
        checkboxmainn()
        chetPodMenu = false;
    }

    let docHeight = window.innerHeight;
    if(docHeight >= 800){
        px100Height.style.height = '50px';
    }
    else if(docHeight > 500 && docHeight < 800){
        px100Height.style.height = '100px';
    }
    else if (docHeight <=500){
        px100Height.style.height = '125px';
    }

    WidthPoisk();
}
function WidthPoisk(){
    Width = window.innerWidth;
    PodMenu.style.width = `${Width}px`;
    DivPoisk.style.width = `${Width - 430}px`;
    DivPoiskk.style.width = `${Width}px`;
    DivResultt.style.maxWidth = `${Width - 50}px`;


    if(Width <= 2100){
        DivResult.style.maxWidth = `${Width - 530}px`;
    }
    else{
        DivResult.style.maxWidth = `1450px`;
    }
}
WidthPoisk();

let HoverMenu1 = document.querySelector('#DivNovinki');
let HoverMenu2 = document.querySelector('#DivBraslets')
let HoverMenu3 = document.querySelector('#DivIndividual')
let HoverMenu4 = document.querySelector('#DivPresent')
let HoverMenu5 = document.querySelector('#DivInstagram')
let MenuDiv1 = document.querySelector('#PodRNovinki');
let MenuDiv2 = document.querySelector('#PodRBraslets');
let MenuDiv3 = document.querySelector('#PodRIndiv');
let MenuDiv4 = document.querySelector('#PodRPresent');
let MenuDiv5 = document.querySelector('#PodRInstagram');

HoverMenu1.addEventListener('mouseover', () =>{
    let query = menuInp.value.trim();
    if (query.length == 0) {
        MenuDiv1.style.opacity = "1";
    }
})
HoverMenu1.addEventListener('mouseout', () =>{
    MenuDiv1.style.opacity = "0";
})
HoverMenu2.addEventListener('mouseover', () =>{
    let query = menuInp.value.trim();
    if (query.length == 0) {
        MenuDiv2.style.opacity = "1";
    }
})
HoverMenu2.addEventListener('mouseout', () =>{
    MenuDiv2.style.opacity = "0";
})
HoverMenu3.addEventListener('mouseover', () =>{
    let query = menuInp.value.trim();
    if (query.length == 0) {
        MenuDiv3.style.opacity = "1";
    }
})
HoverMenu3.addEventListener('mouseout', () =>{
    MenuDiv3.style.opacity = "0";
})
HoverMenu4.addEventListener('mouseover', () =>{
    let query = menuInp.value.trim();
    if (query.length == 0) {
        MenuDiv4.style.opacity = "1";
    }
})
HoverMenu4.addEventListener('mouseout', () =>{
    MenuDiv4.style.opacity = "0";
})
HoverMenu5.addEventListener('mouseover', () =>{
    let query = menuInp.value.trim();
    if (query.length == 0) {
        MenuDiv5.style.opacity = "1";
    }
})
HoverMenu5.addEventListener('mouseout', () =>{
    MenuDiv5.style.opacity = "0";
})

checkboxMain.addEventListener('mouseover', () => {
    if (checkboxMain.checked == false){
        line1.style.transform = "translateY(-3px)";
        line3.style.transform = "translateY(3px)";
    }
})
checkboxMain.addEventListener('mouseout', () => {
    if(checkboxMain.checked == false){
        line1.style.transform = "translateY(0px)";
        line3.style.transform = "translateY(0px)";
    }
})


let menuInp = document.querySelector("#menuPoisk");
let searchTimeout; // Переменная для задержки запроса

menuInp.addEventListener("input", () => {
    clearTimeout(searchTimeout);
    
    searchTimeout = setTimeout(() => {
        let menuDiv = document.querySelector("#menuPlaseForResult");
        let query = menuInp.value.trim();
        
        if (query.length == 0) {
            menuDiv.innerHTML = "";
            return;
        }

        fetch(`/search?query=${query}`)
            .then(response => response.json())
            .then(data => {
                menuDiv.innerHTML = "";

                if (data.length == 0) {
                    menuDiv.innerHTML = "<p>Ничего не найдено</p>";
                    return;
                }

                console.log("Ответ сервера:", data); // Логируем один раз!

                data.forEach(product => {
                    let productDiv = document.createElement("div");
                    productDiv.classList.add("menuProductDiv");
                    productDiv.innerHTML = `
                      <div class="product-card">
                        <img src="${product.image}" alt="${product.name}" class="product-imagee">
                        <p class="product-title">${product.name}</p>
                        <div class="test">
                          <p class="product-price">${product.price}тг</p>
                          <a href="/product/${product.slug}" style="color: var(--black)">
                          <div class="DivInfo">
                            <img src="/static/image/menu/sumka.png" class="Con2Icon" alt="Сумка">
                            <p class="BthInfo"><ins>Подробнее</ins></p>
                          </div>
                          </a>
                        </div>
                      </div>
                    `;
                    menuDiv.appendChild(productDiv);
                });
            })
            .catch(error => console.error("Ошибка запроса:", error));
    }, 300); // Задержка в 300 мс
});

let menuInpp = document.querySelector("#menuPoiskk");
let searchTimeoutt; // Переменная для задержки запроса

menuInpp.addEventListener("input", () => {
    clearTimeout(searchTimeoutt);
    
    searchTimeoutt = setTimeout(() => {
        let menuDivv = document.querySelector("#menuPlaseForResultt");
        let queryy = menuInpp.value.trim();
        
        if (queryy.length == 0) {
            menuDivv.innerHTML = "";
            return;
        }

        fetch(`/search?query=${queryy}`)
            .then(response => response.json())
            .then(data => {
                menuDivv.innerHTML = "";

                if (data.length == 0) {
                    menuDivv.innerHTML = "<p>Ничего не найдено</p>";
                    return;
                }

                console.log("Ответ сервера:", data); // Логируем один раз!

                data.forEach(product => {
                    let productDiv = document.createElement("div");
                    productDiv.classList.add("menuProductDiv");
                    productDiv.innerHTML = `
                      <div class="product-card">
                        <img src="${product.image}" alt="${product.name}" class="product-imagee">
                        <p class="product-title">${product.name}</p>
                        <div class="test">
                          <p class="product-price">${product.price}тг</p>
                          <a href="/product/${product.slug}" style="color: var(--black)">
                          <div class="DivInfo">
                            <img src="/static/image/menu/sumka.png" class="Con2Icon" alt="Сумка">
                            <p class="BthInfo"><ins>Подробнее</ins></p>
                          </div>
                          </a>
                        </div>
                      </div>
                    `;
                    menuDivv.appendChild(productDiv);
                });
            })
            .catch(error => console.error("Ошибка запроса:", error));
    }, 300); // Задержка в 300 мс
});

// Проверка при изменении размера окна
window.addEventListener('resize', checkWidth);



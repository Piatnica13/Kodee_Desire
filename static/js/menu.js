const links = document.querySelectorAll("a");
links.forEach(link => {
    link.addEventListener("click", (e) => {
        if (checkboxMain.checked == true){
            e.preventDefault(); // Отключаем мгновенный переход
            const href = link.getAttribute("href");
        // Прячем меню
                checkboxMain.cheked = false;
                checkboxmainn()
                chetPodMenu = false;
        // Ждем окончания анимации и затем переходим
            setTimeout(() => {
                window.location.href = href; // Переход на новую страницу
            }, 600);
        }
    });
});

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
        divSrtelkaMenu.style.height = "110px";
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

function checkWidth() {
    if(checkboxMain.checked == true && window.innerWidth < 767){
        checkboxMain.cheked = false;
        checkboxmainn()
        chetPodMenu = false;
    }
}

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
    MenuDiv1.style.opacity = "1";
})
HoverMenu1.addEventListener('mouseout', () =>{
    MenuDiv1.style.opacity = "0";
})
HoverMenu2.addEventListener('mouseover', () =>{
    MenuDiv2.style.opacity = "1";
})
HoverMenu2.addEventListener('mouseout', () =>{
    MenuDiv2.style.opacity = "0";
})
HoverMenu3.addEventListener('mouseover', () =>{
    MenuDiv3.style.opacity = "1";
})
HoverMenu3.addEventListener('mouseout', () =>{
    MenuDiv3.style.opacity = "0";
})
HoverMenu4.addEventListener('mouseover', () =>{
    MenuDiv4.style.opacity = "1";
})
HoverMenu4.addEventListener('mouseout', () =>{
    MenuDiv4.style.opacity = "0";
})
HoverMenu5.addEventListener('mouseover', () =>{
    MenuDiv5.style.opacity = "1";
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


// Проверка при изменении размера окна
window.addEventListener('resize', checkWidth);
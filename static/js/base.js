// Объявление всех элементов
let MainContener = document.querySelector('#Body');
let darkMod = document.querySelector("#bthDark");
let lightMod = document.querySelector("#bthLight");
let menu = document.querySelector("#MenuFixed");
let Logo = document.querySelector("#logo");
let checkBox = document.querySelector("#checkboxMain");
let poiskImgOnMenu = document.querySelector("#poisk");
let PlaseForPoisk = document.querySelector("#menuPlaseForPoiskk");
let chetchik = true;
let Theme = localStorage.getItem("theme") || "light";
const icons = document.querySelectorAll('img[data-icon]'); // Все img с параметром data-icon
const footerBlock = document.querySelector('.ContenerLast');



// То что делается сразу при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
    // Плавное появление меню и боди
    showMainContainer(menu);
    // Цвет иконок
    firstColor()
    // Чек на прозрачность меню
    handleScroll();

    // Стили для кнопок смены темы
    lightMod.style.transition = "opacity 0.4s ease";
    darkMod.style.transition = "opacity 0.4s ease";
    
    // Устанавливаем тему для страницы и добавляем в localStorage
    document.body.dataset.theme = Theme;

    // функция updateSecondBlockPosition срабатывает при некоторых тригерах
    const observer = new MutationObserver(updateSecondBlockPosition); // Отслеживания 
    observer.observe(MainContener, { attributes: true, childList: true, subtree: true }); // Тригеры 

    // Меням цвет иконок через 0.1сек, что бы они успели отобразиться
    setTimeout(() => {
        updateIconsByTheme();
    }, 100);
    
    // ВСЕ EVENTS
    checkBox.addEventListener('click', handleScroll)
    poiskImgOnMenu.addEventListener("click", PoiskImgOn)
    window.addEventListener('scroll', handleScroll);
    lightMod.addEventListener("click", SwitchDark)
    darkMod.addEventListener("click", SwitchLight);


    window.addEventListener('load', updateSecondBlockPosition);
    window.addEventListener('resize', updateSecondBlockPosition);

    // При переходе на другую страницу срабатывает функция
    window.addEventListener('beforeunload', () => {
        inShowPage()
    });

    // При переходе на страницу, переход происходит не сразу
    document.addEventListener("click", function(e){
        let link = e.target.closest("a");
        if(link && link.href && link.target !== "_blank" && link.href.indexOf("javascript:") !== 0){
            e.preventDefault();
            inShowPage();
            setTimeout(() => {
                window.location.href = link.href;
            }, 500);
        }
    });
    
    AOS.init();
});

// Выводим либо солнце либо месяц
function firstColor(){
    // Отображаем нужную кнопку
    if (Theme === "dark") {
        darkMod.style.display = "flex";
        lightMod.style.display = "none";
        lightMod.style.opacity = "0";
        setTimeout(() => {
            darkMod.style.opacity = "1";
        }, 10);
    } else {
        lightMod.style.display = "flex";
        darkMod.style.opacity = "0";
        darkMod.style.display = "none";
        setTimeout(() => {
            lightMod.style.opacity = "1";
        }, 10);
    }
}

// Отслеживаем прозрачность меню
function handleScroll(){
    if (checkBox.checked && window.scrollY === 0 || !checkBox.checked && window.scrollY != 0){
        menu.style.backgroundColor = 'var(--main-bg)';
    }
    else if(!checkBox.checked && window.scrollY === 0 && chetchik == true){
        
        menu.style.backgroundColor = 'transparent';
        Logo.style.backgroundColor = 'transparent';
    }
    if(window.innerWidth < 767 && chetchik == false){
        chetchik = false;
        PoiskImgOn()
    }
}
    
// Показываем меню боди
function showMainContainer(menu) {
    setTimeout(() => {
        menu.classList.remove("hidden");
        menu.classList.add("visible");
        MainContener.style.opacity = "1";
        MainContener.style.transition = "opacity 1s ease-in-out";
        setTimeout(() => {
            MainContener.style.transition = "opacity 0.3s ease-in-out";
        }, 1001);
    }, 100);
}

// Скрыть меню, основной контейнер и футер
function inShowPage(){
    let menu = document.querySelector("#MenuFixed");    
    MainContener.style.transition = `opacity 0.3s ease-in-out`;
    MainContener.style.opacity = "0";
    menu.classList.remove("visible");
    menu.classList.add("hidden");
}

// Меняются иконки чб и белые
function updateIconsByTheme() {    
    icons.forEach(img => {
        const filename = img.dataset.icon;
        img.style.transition = "opacity 0.5s ease-in-out";
        img.style.opacity = `0`;
        setTimeout(() => {
            img.src = `/static/icon/${document.body.dataset.theme === 'light' ? 'black' : 'white'}/${filename}`; 
            img.style.opacity = `1`;
        }, 500);
    });
}


// Цепляется футер к экрану или нет, смотря на высоту экрана
function updateSecondBlockPosition() {
    const firstBlockHeight = MainContener.offsetHeight; // Высота контейнера
    const windowHeight = window.innerHeight; // Высота окна

    if (windowHeight - 230 > firstBlockHeight) {
        footerBlock.style.position = 'fixed';
        footerBlock.style.bottom = '0';
        footerBlock.style.left = '0';
        footerBlock.style.right = '0';
    } else {
        footerBlock.style.position = 'relative';
        footerBlock.style.bottom = 'auto';
    }
}

// Открытие меню поиска
function PoiskImgOn(){
    if(window.innerWidth > 767){
        if (checkboxMain.checked == false){
            checkboxMain.checked = true;
            checkboxmainn()
            handleScroll()
        }
    }
    else if(window.innerWidth <= 767){
        if (chetchik == true && !checkBox.checked){   
            PlaseForPoisk.style.display = "flex";
            setTimeout(() => {
                PlaseForPoisk.style.opacity = "1";
            }, 1);
            chetchik = false;
            menu.style.backgroundColor = 'var(--main-bg)';
        }
        else if(chetchik == false){
            PlaseForPoisk.style.opacity = "0";
            setTimeout(() => {
                PlaseForPoisk.style.display = "none";
            }, 300);
            if (chetchik ==false){
                chetchik = true;
                menu.style.backgroundColor = 'transparent';
                Logo.style.backgroundColor = 'transparent';
            }   
        }
    }
}

// УВЕДОМЛЕНИЯ
const toast = document.getElementById('divMessegeBox');
let messageQueue = [];
let isMessageShowing = false;
// Создание и добавление в очередь уведомлений
function showToast(text, timeForLoad = 10, timeForLook=2500) {
    messageQueue.push({text, timeForLoad, timeForLook});
    if (!isMessageShowing) { // Если сейчас не показывается, то функция 
        processQueue();
    }
}
// Показ уведомления
function processQueue() {
    if (messageQueue.length === 0) { // если очереди нет, то отмена функции 
        isMessageShowing = false;
        return;
    }
    
    isMessageShowing = true;
    const {text, timeForLoad, timeForLook} = messageQueue.shift();
    toast.style.position = `fixed`;
    toast.style.display = `block`;
    
    message = document.createElement('div')
    message.style.opacity = "0";
    message.style.transform = `translateX(400px)`;
    message.style.transition = `opacity 0.5s ease-in-out, transform 0.5s ease-in-out`;
    message.innerHTML = `
    <div class="message">
    <h3>${text}</h3>
    </div>`;
    
    toast.appendChild(message)
    setTimeout(() => {
        message.style.opacity = `1`;
        message.style.transform = `translateX(0px)`;
    }, timeForLoad);
    
    // Прячем и удаляем сообщение
    
    setTimeout(() => {
        message.style.opacity = '0';
        message.style.transform = `translateX(400px)`;
        
        setTimeout(() => {
            toast.style.display = `none`;
            message.remove();
            processQueue();
        }, 500);
    }, timeForLook + timeForLoad);
}
// 

function SwitchLight() {
    lightMod.style.pointerEvents = `none`;
    darkMod.style.pointerEvents = `none`;
    setTimeout(() => {
        lightMod.style.pointerEvents = `all`;
        darkMod.style.pointerEvents = `all`;
    }, 600);
    updateIconsByTheme();
    
    Theme = {
        "--main-bg": "#fffaf5",
        "--add-bg": "#e5d7cc",
        "--black": "#3a3a3a", // мягкий тёплый чёрный
        "--white": "#000",
        "--grey": "#b8ada6", // теплый пепельно-бежевый
        "--border": "#decabc", // карамельный крем
        "--shadow": "#f2e0d5", // светлая пудра
        "--gradient": "linear-gradient(145deg, #f7eee7, #fffaf5, #f1e8dd)",
        "--main-footer": "#e5d7cc", // утончённый кофе с молоком
        "--add-footer": "#d2c2b5",  // светлая карамель
    }
    for (let key in Theme) {
        if (key.startsWith("--")) {
            document.documentElement.style.setProperty(key, Theme[key]);
        }
    }
    
    const current = document.body.dataset.theme;
    const nextTheme = current === "light" ? "dark" : "light";
    
    document.body.dataset.theme = nextTheme;
    localStorage.setItem("theme", nextTheme); // ← сохраняем в браузер
    
    darkMod.style.opacity = "0";
    setTimeout(() => {
        darkMod.style.display = "none";
        lightMod.style.display = "flex";
        setTimeout(() => {
            lightMod.style.opacity = "1";
        }, 10);
    }, 200);
}

function SwitchDark() {
    darkMod.style.pointerEvents = `none`;
    lightMod.style.pointerEvents = "none";
    setTimeout(() => {
        darkMod.style.pointerEvents = `all`;
        lightMod.style.pointerEvents = "all";
    }, 600);
    updateIconsByTheme();
    
    Theme = {
        "--main-bg": "#2e2e2e",       // основной фон — глубокий тёмно-серый
        "--add-bg": "#3e3e3e",        // дополнительный фон — чуть светлее, для карточек и блоков
        "--black": "#ffffff",         // текст белый
        "--white": "#ffffff",         // белый где надо
        "--grey": "#999999",          // для второстепенного текста и иконок
        "--border": "#5a5a5a",        // границы — матовый серый
        "--shadow": "#1a1a1a",        // тень — еле заметная, почти чёрная
        "--gradient": "linear-gradient(145deg, #383838, #2e2e2e)", // скромный объемный эффект
        "--main-footer": "#1c1c1c",   // подвал — почти черный
        "--add-footer": "#292929",    // подвал 2 — глубокий графит
    }
    for (let key in Theme) {
        if (key.startsWith("--")) {
            document.documentElement.style.setProperty(key, Theme[key]);
        }
    }
    
    const current = document.body.dataset.theme;
    const nextTheme = current === "light" ? "dark" : "light";
    
    document.body.dataset.theme = nextTheme;
    localStorage.setItem("theme", nextTheme); // ← сохраняем в браузер
    
    lightMod.style.opacity = "0";
    setTimeout(() => {
        lightMod.style.display = "none";
        darkMod.style.display = "flex";
        setTimeout(() => {
            darkMod.style.opacity = "1";
        }, 10);
    }, 200);
}
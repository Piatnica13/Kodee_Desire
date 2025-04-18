let MainContener = document.querySelector('#Body');
const footerBlock = document.querySelector('#futer-block');
const toast = document.getElementById('divMessegeBox');
let messageQueue = [];
let isMessageShowing = false;


function showMainContainer() {
    setTimeout(() => {
        let menu = document.querySelector("#MenuFixed");
        menu.classList.remove("hidden");
        menu.classList.add("visible");
        MainContener.style.opacity = "1";
        MainContener.style.transition = `opacity 1s ease-in-out`;
        footerBlock.style.opacity = "1";
        setTimeout(() => {
            MainContener.style.transition = `opacity 0.3s ease-in-out`;
        }, 1001);
    }, 600);
}

function inShowPage(){
    let menu = document.querySelector("#MenuFixed");    
    MainContener.style.transition = `opacity 0.3s ease-in-out`;
    MainContener.style.opacity = "0";
    menu.classList.remove("visible");
    menu.classList.add("hidden");
    footerBlock.style.opacity = "0";
}

window.addEventListener('beforeunload', () => {
    inShowPage()
});

window.addEventListener('pageshow', (event) => {
    if (event.persisted) { 
        showMainContainer();
    }
});

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

document.addEventListener("DOMContentLoaded", () => {   
    showMainContainer();

    fetch('/static/html/footer.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('futer-block').innerHTML = html;
        const script = document.createElement('script');
        script.src = '/static/js/footer.js';
        document.body.appendChild(script);
    })
    .catch(error => console.error('Ошибка загрузки futer:', error));
    
    fetch('/static/html/menu.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('menu-placeholder').innerHTML = html;
        // После загрузки меню подключаем script.js
        const script = document.createElement('script');
        script.src = '/static/js/menu.js';
        document.body.appendChild(script);
        
        script.onload = () => {
            // Этот код выполнится после загрузки script.js
            let ContenerMenu = document.querySelector("#MenuFixed");
            let Logo = document.querySelector("#logo");
            let checkBox = document.querySelector("#checkboxMain");
            let poiskImgOnMenu = document.querySelector("#poisk");
            let PlaseForPoisk = document.querySelector("#menuPlaseForPoiskk");
            let chetchik = true;
            poiskImgOnMenu.addEventListener("click", PoiskImgOn)
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
                        ContenerMenu.style.backgroundColor = 'var(--main-bg)';
                    }
                    else if(chetchik == false){
                        PlaseForPoisk.style.opacity = "0";
                        setTimeout(() => {
                            PlaseForPoisk.style.display = "none";
                        }, 300);
                        if (chetchik ==false){
                            chetchik = true;
                            ContenerMenu.style.backgroundColor = 'transparent';
                            Logo.style.backgroundColor = 'transparent';
                        }   
                    }
                }
            }

            checkBox.addEventListener('click', handleScroll)
            function handleScroll(){
                
                if (checkBox.checked && window.scrollY === 0 || !checkBox.checked && window.scrollY != 0){
                    ContenerMenu.style.backgroundColor = 'var(--main-bg)';
                }
                else if(!checkBox.checked && window.scrollY === 0 && chetchik == true){
                    
                    ContenerMenu.style.backgroundColor = 'transparent';
                    Logo.style.backgroundColor = 'transparent';
                }
                if(window.innerWidth < 767 && chetchik == false){
                    chetchik = false;
                    PoiskImgOn()
                }
            }
            // Отслеживаем скролл
            window.addEventListener('scroll', handleScroll);
            
            // Выполняем функцию сразу, чтобы проверить состояние при загрузке
            handleScroll();
        };
        AOS.init();
    })
    .catch(error => console.error('Ошибка загрузки меню:', error));

});



function updateSecondBlockPosition() {
    const firstBlockHeight = MainContener.offsetHeight;
    const windowHeight = window.innerHeight;
    
    if (windowHeight - 280 > firstBlockHeight) {
        footerBlock.style.position = 'fixed';
        footerBlock.style.bottom = '0';
        footerBlock.style.left = '0';
        footerBlock.style.right = '0';
    } else {
        footerBlock.style.position = 'relative';
        footerBlock.style.bottom = 'auto';
    }
}


function showToast(text, timeForLoad = 10, timeForLook=2500) {

    messageQueue.push({text, timeForLoad, timeForLook});
    if (!isMessageShowing) {
        processQueue();
    }
}

function processQueue() {
    if (messageQueue.length === 0) {
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


window.addEventListener('load', updateSecondBlockPosition);
window.addEventListener('resize', updateSecondBlockPosition);

const observer = new MutationObserver(updateSecondBlockPosition);
observer.observe(MainContener, { attributes: true, childList: true, subtree: true });

const allProducts = [
    { id: 1, name: "Кулон «Бесконечность»",  price:28500, concept: "Мир и свобода", category: "Кулон", image: "/static/image/productImgs/beskonechnost/img1.jpg", slug: "beskonechnost" },
    { id: 2, name: "Кулон «Голубь»", price: 30500, concept: "Мир и свобода", category: "Кулон", image: "/static/image/productImgs/golub/img1.jpg", slug: "golub" },
    { id: 3, name: "Кулон «Бесконечность love»", price: 31500, concept: "Любовь и романтика", category: "Кулон", image: "/static/image/productImgs/beskonechnost-love/img1.jpg", slug: "beskonechnost-love" },
    { id: 4, name: "Кулон «Бриллиант»", price: 33000, concept: "Сила и успех", category: "Кулон", image: "/static/image/productImgs/brilliant/img1.jpg", slug: "brilliant" },
    { id: 5, name: "Кулон «Пульс»", price: 33000, concept: "Любовь и романтика", category: "Кулон", image: "/static/image/productImgs/puls/img1.jpg", slug: "puls" },
    { id: 6, name: "Кулон «Пацифик»", price: 33000, concept: "Мир и свобода", category: "Кулон", image: "/static/image/productImgs/patsifik/img1.jpg", slug: "patsifik" },
    { id: 7, name: "Кулон «Клевер»", price: 33000, concept: "Жизнь и процветание", category: "Кулон", image: "/static/image/productImgs/klever/img1.jpg", slug: "klever" },
    { id: 8, name: "Кулон «Горы»", price: 33500, concept: "Путешествия и приключения", category: "Кулон", image: "/static/image/productImgs/gory/img1.jpg", slug: "gory" },
    { id: 9, name: "Кулон «Дерево»", price: 33500, concept: "Жизнь и процветание", category: "Кулон", image: "/static/image/productImgs/derevo/img1.jpg", slug: "derevo" },
    { id: 10, name: "Кулон «Крестик»", price: 34000, concept: "Духовность и вера", category: "Кулон", image: "/static/image/productImgs/krestik/img1.jpg", slug: "krestik" },
    { id: 11, name: "Кулон «Звезда Давида»", price: 34000, concept: "Духовность и вера", category: "Кулон", image: "/static/image/productImgs/zvezda-davida/img1.jpg", slug: "zvezda-davida" },
    { id: 12, name: "Кулон «Корона»", price: 34500, concept: "Сила и успех", category: "Кулон", image: "/static/image/productImgs/korona/img1.jpg", slug: "korona" },
    { id: 13, name: "Кулон «Сердце контур»", price: 35000, concept: "Любовь и романтика", category: "Кулон", image: "/static/image/productImgs/serdtse-kontur/img1.jpg", slug: "serdtse-kontur" },
    { id: 14, name: "Кулон «Сердце пульс»", price: 35500, concept: "Любовь и романтика", category: "Кулон", image: "/static/image/productImgs/serdtse-puls/img1.jpg", slug: "serdtse-puls" },
    { id: 15, name: "Кулон «Пустышка»", price: 35500, concept: "Любовь и семья", category: "Кулон", image: "/static/image/productImgs/pustyshka/img1.jpg", slug: "pustyshka" },
    { id: 16, name: "Кулон «Мальчик»", price: 36000, concept: "Любовь и семья", category: "Кулон", image: "/static/image/productImgs/malchik/img1.jpg", slug: "malchik" },
    { id: 17, name: "Кулон «Девочка»", price: 36000, concept: "Любовь и семья", category: "Кулон", image: "/static/image/productImgs/devochka/img1.jpg", slug: "devochka" },
    { id: 18, name: "Кулон «Солнце»", price: 36000, concept: "Природа", category: "Кулон", image: "/static/image/productImgs/solntse/img1.jpg", slug: "solntse" },
    { id: 19, name: "Кулон «Крыло»", price: 37000, concept: "Мир и свобода", category: "Кулон", image: "/static/image/productImgs/krylo/img1.jpg", slug: "krylo" },
    { id: 20, name: "Кулон «Роза ветров»", price: 37500, concept: "Путешествия и приключения", category: "Кулон", image: "/static/image/productImgs/roza-vetrov/img1.jpg", slug: "roza-vetrov" },
    { id: 21, name: "Кулон «Ангел»", price: 37500, concept: "Духовность и вера", category: "Кулон", image: "/static/image/productImgs/angel/img1.jpg", slug: "angel" },
    { id: 22, name: "Кулон «Ракетка»", price: 37500, concept: "Спорт", category: "Кулон", image: "/static/image/productImgs/raketka/img1.jpg", slug: "raketka" },
    { id: 23, name: "Кулон «Лапка»", price: 38000, concept: "Любовь к животным", category: "Кулон", image: "/static/image/productImgs/lapka/img1.jpg", slug: "lapka" },
    { id: 24, name: "Кулон «Полумесяц»", price: 39000, concept: "Духовность и вера", category: "Кулон", image: "/static/image/productImgs/polumesiats/img1.jpg", slug: "polumesiats" },
    { id: 25, name: "Кулон «Сердце на пульсе»", price: 39000, concept: "Любовь и романтика", category: "Кулон", image: "/static/image/productImgs/serdtse-na-pulse/img1.jpg", slug: "serdtse-na-pulse" },
    { id: 26, name: "Кулон «Снежинка»", price: 39500, concept: "Природа", category: "Кулон", image: "/static/image/productImgs/snezhinka/img1.jpg", slug: "snezhinka" },
    { id: 27, name: "Кулон «Скрипичный ключ»", price: 39500, concept: "Музыка и искусство", category: "Кулон", image: "/static/image/productImgs/skripichnyi-kliuch/img1.jpg", slug: "skripichnyi-kliuch" },
    { id: 28, name: "Кулон «Якорь»", price: 41000, concept: "Путешествия и приключения", category: "Кулон", image: "/static/image/productImgs/iakor/img1.jpg", slug: "iakor" },
    { id: 29, name: "Кулон «Олимпийские кольца»", price: 42500, concept: "Спорт", category: "Кулон", image: "/static/image/productImgs/olimpiiskie-koltsa/img1.jpg", slug: "olimpiiskie-koltsa" },
    { id: 30, name: "Кулон «Рука Фатимы»", price: 45500, concept: "Духовность и вера", category: "Кулон", image: "/static/image/productImgs/ruka-fatimy/img1.jpg", slug: "ruka-fatimy" },
    { id: 31, name: "Кулон «Самолёт»", price: 46500, concept: "Путешествия и приключения", category: "Кулон", image: "/static/image/productImgs/samolet/img1.jpg", slug: "samolet" },
    { id: 32, name: "Кулон «Штурвал»", price: 48000, concept: "Путешествия и приключения", category: "Кулон", image: "/static/image/productImgs/shturval/img1.jpg", slug: "shturval" },
    { id: 33, name: "Кулон «Планета»", price: 48000, concept: "Путешествия и приключения", category: "Кулон", image: "/static/image/productImgs/planeta/img1.jpg", slug: "planeta" },
    { id: 34, name: "Бегунок мини", price: 28500, concept: "Минимализм и красота", category: "Бегунок", image: "/static/image/productImgs/begunok-mini/img1.jpg", slug: "begunok-mini" },
    { id: 35, name: "Бегунок", price: 55000, concept: "Минимализм и красота", category: "Бегунок", image: "/static/image/productImgs/begunok/img1.jpg", slug: "begunok" },
    { id: 36, name: "Колье-невидимка без кулона", price: 28500, concept: "Минимализм и красота", category: "Колье", image: "/static/image/productImgs/kole-nevidimka-bez-kulona/img1.jpg", slug: "kole-nevidimka-bez-kulona" },
    { id: 37, name: "Колье-неведимка с мини сердечком", price: 45000, concept: "Любовь и романтика", category: "Колье", image: "/static/image/productImgs/kole-nevidimka-s-mini-serdechkom/img1.jpg", slug: "kole-nevidimka-s-mini-serdechkoк" },
    { id: 38, name: "Колье-неведимка с бегунком мини", price: 44000, concept: "Минимализм и красота", category: "Колье", image: "/static/image/productImgs/kole-nevidimka-s-begunkom-mini/img1.jpg", slug: "kole-nevidimka-s-begunkom-mini" },
    { id: 39, name: "Колье-неведимка с бегунком", price: 64000, concept: "Минимализм и красота", category: "Колье", image: "/static/image/productImgs/kole-nevidimka-s-begunkom/img1.jpg", slug: "kole-nevidimka-s-begunkom" },
    { id: 40, name: 'Кулон Знак зодиака «Овен»', price: 36000, concept: "Знаки зодиака", category: "Кулон", image: "/static/image/productImgs/oven/img1.jpg", slug: "oven" },
    { id: 41, name: 'Кулон Знак зодиака «Телец»', price: 36000, concept: "Знаки зодиака", category: "Кулон", image: "/static/image/productImgs/telets/img1.jpg", slug: "telets" },
    { id: 42, name: 'Кулон Знак зодиака «Близнецы»', price: 36000, concept: "Знаки зодиака", category: "Кулон", image: "/static/image/productImgs/bliznetsy/img1.jpg", slug: "bliznetsy" },
    { id: 43, name: 'Кулон Знак зодиака «Рак»', price: 36000, concept: "Знаки зодиака", category: "Кулон", image: "/static/image/productImgs/rak/img1.jpg", slug: "rak" },
    { id: 44, name: 'Кулон Знак зодиака «Лев»', price: 36000, concept: "Знаки зодиака", category: "Кулон", image: "/static/image/productImgs/lev/img1.jpg", slug: "lev" },
    { id: 45, name: 'Кулон Знак зодиака «Дева»', price: 36000, concept: "Знаки зодиака", category: "Кулон", image: "/static/image/productImgs/deva/img1.jpg", slug: "deva" },
    { id: 46, name: 'Кулон Знак зодиака «Весы»', price: 36000, concept: "Знаки зодиака", category: "Кулон", image: "/static/image/productImgs/vesy/img1.jpg", slug: "vesy" },
    { id: 47, name: 'Кулон Знак зодиака «Скорпион»', price: 36000, concept: "Знаки зодиака", category: "Кулон", image: "/static/image/productImgs/skorpion/img1.jpg", slug: "skorpion" },
    { id: 48, name: 'Кулон Знак зодиака «Стрелец»', price: 36000, concept: "Знаки зодиака", category: "Кулон", image: "/static/image/productImgs/strelets/img1.jpg", slug: "strelets" },
    { id: 49, name: 'Кулон Знак зодиака «Козерог»', price: 36000, concept: "Знаки зодиака", category: "Кулон", image: "/static/image/productImgs/kozerog/img1.jpg", slug: "kozerog" },
    { id: 50, name: 'Кулон Знак зодиака «Водолей»', price: 36000, concept: "Знаки зодиака", category: "Кулон", image: "/static/image/productImgs/vodolei/img1.jpg", slug: "vodolei" },
    { id: 51, name: 'Кулон Знак зодиака «Рыбы»', price: 36000, concept: "Знаки зодиака", category: "Кулон", image: "/static/image/productImgs/ryby/img1.jpg", slug: "ryby" },
    { id: 52, name: "Монеточка", price: 173000, concept: "Минимализм и красота", category: "Монеточка", image: "/static/image/productImgs/monetochka/img1.jpg", slug: "monetochka" },
    { id: 53, name: "Гравировка монетки 0.7г", price: 47000, concept: "Минимализм и красота", category: "Монеточка", image: "/static/image/productImgs/gravirovka-monetki-0-7g/img1.jpg", slug: "gravirovka-monetki-0-7g" },
    { id: 54, name: "Гравировка монетки 1.1г", price: 68000, concept: "Минимализм и красота", category: "Монеточка", image: "/static/image/productImgs/gravirovka-monetki-1-1g/img1.jpg", slug: "gravirovka-monetki-1-1g" },
    { id: 55, name: "Кулон из серебра", price: 10000, concept: "Минимализм и красота", category: "Кулон", image: "/static/image/productImgs/kulon-iz-serebra/img1.jpg", slug: "kulon-iz-serebra" },
    { id: 56, name: "Гравировка в серебре", price: 15000, concept: "Минимализм и красота", category: "Монеточка", image: "/static/image/productImgs/gravirovka-v-serebre/img1.jpg", slug: "gravirovka-v-serebre" }
];
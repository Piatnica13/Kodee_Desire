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
                        ContenerMenu.style.backgroundColor = '#ffe4e9';
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
                    ContenerMenu.style.backgroundColor = '#ffe4e9';
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
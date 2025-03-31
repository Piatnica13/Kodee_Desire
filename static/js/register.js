let body = document.querySelector("#Contener"); 
const toast = document.getElementById('divMessegeBox');
let messageQueue = [];
let isMessageShowing = false;
document.addEventListener("DOMContentLoaded", () =>{


    setTimeout(() => {
        body.style.transition = `opacity 0.6s linear, background 2s linear`;
        body.style.opacity = "1";
        body.style.background = `linear-gradient(130deg, #ffd6dd, #ffe4e9, #ffd1da)`;
    }, 300);

    const links = document.querySelectorAll("a");
    links.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault(); // Отключаем мгновенный переход
            const href = link.getAttribute("href");
            // Прячем меню
            body.style.transition = `opacity 0.6s linear`;
            body.style.opacity = "0";
            // Ждем окончания анимации и затем переходим
            setTimeout(() => {
                window.location.href = href; // Переход на новую страницу
            }, 600);
        });
    });

    const emailInput = document.querySelector("#email");
      // Проверяем, есть ли сохранённый email в Local Storage
    const savedEmail = localStorage.getItem("savedEmail");
    if (savedEmail) {
        emailInput.value = savedEmail; // Предзаполняем поле email
    }
    
      // Сохраняем email при каждом изменении
    emailInput.addEventListener("input", () => {
        localStorage.setItem("savedEmail", emailInput.value);
    });
});

form = document.querySelector("#regForm")

form.addEventListener("submit", (e) => {
    e.preventDefault(); // Останавливаем обычную отправку
    body.style.transition = "opacity 0.5s ease"; 
    body.style.opacity = "0"; // например, плавно исчезает

    setTimeout(() => {
        form.submit(); // теперь форма реально отправится после анимации
    }, 500); // дожидаемся окончания анимации
});

let InpPass = document.querySelector('#password');
let hide = document.querySelector('#Hide');
let show = document.querySelector('#Show');
let isPasswordVisible = false;
InpPass.addEventListener('focus', () =>{
    hide.style.opacity = `0.5`;
    show.style.opacity = `0`;
});
show.addEventListener('click', () =>{
    const start = InpPass.selectionStart;
    const end = InpPass.selectionEnd;
    InpPass.type = isPasswordVisible ? 'password' : 'text';
    isPasswordVisible = !isPasswordVisible;
    if(isPasswordVisible){
        hide.style.opacity = `0`;
        show.style.opacity = `0.5`;
    }
    else{
        hide.style.opacity = `0.5`;
        show.style.opacity = `0`;
    }
    InpPass.setSelectionRange(start, end);
})
show.addEventListener('mousedown', (event) => {
    event.preventDefault();
});

let Button = document.querySelector('#ButtonSignIn');

if (document.querySelector("#messageForErrorLen")){
    showToast("Ошибка авторизации, длинна пароля меньше 6 символов", 2000)
}
if (document.querySelector("#messageForErrorHave")){
    
    showToast("Ошибка авторизации, аккаунт с данным Email уже зарегестрирован", 2000)
}
if (document.querySelector("#messageForNoReg")){
    showToast("Ошибка авторизации, повторите позже!", 2000)
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

function removeMessage(message) {
    message.style.opacity = '0';
    message.style.transform = `translateX(400px)`;
    
    setTimeout(() => {
        message.remove();
        processQueue(); // Показываем следующее сообщение
        toast.style.display = `none`;
    }, 500);
}

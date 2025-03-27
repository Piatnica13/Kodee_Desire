let body = document.querySelector("#Contener");
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
        });     // Тайминг должен совпадать с CSS transition
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

form = document.querySelector("#loginForm")

form.addEventListener("submit", (e) => {
    e.preventDefault(); // Останавливаем обычную отправку
    body.style.transition = "opacity 0.5s ease"; 
    body.style.opacity = "0"; // например, плавно исчезает

    setTimeout(() => {
        form.submit(); // теперь форма реально отправится после анимации
    }, 500); // дожидаемся окончания анимации
});

let InpPass = document.querySelector('#InpPass');
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

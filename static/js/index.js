let MainContener = document.querySelector('#Body');



document.addEventListener("DOMContentLoaded", () => {
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
        //меню
        let menu = document.querySelector("#MenuFixed");
        
        setTimeout(() => {
            menu.classList.add("visible");
            MainContener.style.transition = `opacity 1s linear`;
            MainContener.style.opacity = "1";
            setTimeout(()=>{
                MainContener.style.transition = `opacity 0.3s linear`;
            }, 1000);
        }, 300);

        const links = document.querySelectorAll("a");
        links.forEach(link => {
            link.addEventListener("click", (e) => {
                e.preventDefault(); // Отключаем мгновенный переход
                const href = link.getAttribute("href");
                
                // Прячем меню
                MainContener.style.transition = `opacity 0.6s linear`;
                MainContener.style.opacity = "0";
                menu.classList.remove("visible");
                menu.classList.add("hidden");
                // Ждем окончания анимации и затем переходим
                setTimeout(() => {
                    MainContener.style.transition = `opacity 0.3s linear`;
                    window.location.href = href; // Переход на новую страницу
                }, 600);
            });
        });

        script.onload = () => {
            // Этот код выполнится после загрузки script.js
            let ContenerMenu = document.querySelector("#MenuFixed");
            let Logo = document.querySelector("#logo");
            let checkBox = document.querySelector("#checkboxMain");
            checkBox.addEventListener('click', ()=>{
                if (checkBox.checked && window.scrollY === 0){
                    ContenerMenu.style.backgroundColor = ' #ffe4e9';
                }
                else if(!checkBox.checked && window.scrollY === 0){
                    ContenerMenu.style.backgroundColor = 'transparent';
                    Logo.style.backgroundColor = 'transparent';
                }
            });
            const handleScroll = () => {
                if (window.scrollY === 0) {
                    // Если в начале страницы
                    ContenerMenu.style.backgroundColor = 'transparent';
                    Logo.style.backgroundColor = 'transparent';
                    
                } else {
                    // Если страница прокручена
                    ContenerMenu.style.backgroundColor = ' #ffe4e9';
                }
            };
            // Отслеживаем скролл
            window.addEventListener('scroll', handleScroll);
            
            // Выполняем функцию сразу, чтобы проверить состояние при загрузке
            handleScroll();
        };
        AOS.init();
    })
    .catch(error => console.error('Ошибка загрузки меню:', error));
});

function slider() {
    let Img1 = document.querySelector('#Con2Imgs1');
    let Img2 = document.querySelector('#Con2Imgs2');
    let Img3 = document.querySelector('#Con2Imgs3');
    let Img4 = document.querySelector('#Con2Imgs5');
    let Text1 = document.querySelector('#Con2Img1');
    let Text2 = document.querySelector('#Con2Img2');
    let Text3 = document.querySelector('#Con2Img3');
    let Text4 = document.querySelector('#Con2Img4');
    let chet = 0;
    Img1.style.opacity = `1`;
    Text1.style.opacity = `1`;
    Img3.style.opacity = `0`;
    Text3.style.opacity = `0`;
    Text1.style.transform = `translateY(-20px) translateX(-50%)`;
    
    let interval = setInterval(changeSlid, 5000);

    function changeSlid() {
        chet++;
        switch (chet) {
            case 1:
                Img2.style.opacity = `1`
                Img1.style.opacity = `0`
                Text1.style.opacity = `0`;
                Text2.style.opacity = `1`;
                Text2.style.transform = `translateY(-20px) translateX(-50%)`;
                Text1.style.transform = `translateY(20px) translateX(-50%)`;

                break;
            case 2:
                Img2.style.opacity = `0`
                Img3.style.opacity = `1`
                Text2.style.opacity = `0`;
                Text3.style.opacity = `1`;
                Text3.style.transform = `translateY(-20px) translateX(-50%)`;
                Text2.style.transform = `translateY(20px) translateX(-50%)`;
                break;
            case 3:
                Img3.style.opacity = `0`;
                Img4.style.opacity = `1`;
                Text3.style.opacity = `0`;
                Text4.style.opacity = `1`;
                Text3.style.transform = `translateY(20px) translateX(-50%)`;
                Text4.style.transform = `translateY(-20px) translateX(-50%)`;

                break;
            case 4:
                Img4.style.opacity = `0`
                Img1.style.opacity = `1`
                Text1.style.opacity = `1`;
                Text4.style.opacity = `0`;
                Text4.style.transform = `translateY(20px) translateX(-50%)`;
                Text1.style.transform = `translateY(-20px) translateX(-50%)`;
                chet = 0;
                break;
        }
    }
}
slider();
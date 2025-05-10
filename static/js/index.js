const images = document.querySelectorAll("img");
let loader = document.querySelector('#loader');
let loadedImages = 0;
const totalImages = images.length;
loader.style.opacity = "1";
loader.style.backgroundColor = "var(--add-bg)";
function checkImagesLoaded() {
    loadedImages++;
    if (loadedImages == totalImages) {
        setTimeout(()=>{
            loader.style.opacity = "0";
            setTimeout(()=>{ 
                loader.style.display = "none";
                loader.style.zIndex = "0";
            }, 600);
        }, 1000)
    }
}
images.forEach((img) => {
    if (img.complete) {
        checkImagesLoaded(); // Already loaded
    } else {
        img.onload = checkImagesLoaded; // Wait for load
    }
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

if (document.querySelector('#messageForReg')){
    showToast("Вы успешно зарегистрировались!", 2000)
}
if (document.querySelector('#messageForLog')){
    showToast("Вы успешно вошли в аккаунт!", 2000)
}
if (document.querySelector('#messageForNoReg')){
    showToast("Ошибка авторизации, повторите позже!", 2000)
}

let back = document.querySelector("#con4galochkaBack"); 
let lets = document.querySelector("#con4galochkaLet");

let con4part = document.querySelector("#Con4Part1");

lets.addEventListener("click", () => {
    let con4Width = con4part.offsetWidth;
    con4part.scrollLeft += con4Width - 14.45;
    back.style.pointerEvents= `none`;
    lets.style.pointerEvents= `none`;
    setTimeout(() => {
        back.style.pointerEvents= `all`;
        lets.style.pointerEvents= `all`;
    }, 400);
})
back.addEventListener("click", () => {
    let con4Width = con4part.offsetWidth;
    con4part.scrollLeft -= con4Width - 14.45;
    back.style.pointerEvents= `none`;
    lets.style.pointerEvents= `none`;
    setTimeout(() => {
        back.style.pointerEvents= `all`;
        lets.style.pointerEvents= `all`;
    }, 400);
})

let masFromCon4 = [
    {title: "Комфорт", info: "Лёгкий и удобный, он не ощущается на запястье"},
    {title: "Долговечность", info: "Мы используем качественные материалы"},
    {title: "Минимализм", info: "Лаконичный дизайн, который подходит к любому образу"},
    {title: "Символика", info: "Браслет — это больше, чем украшение"},
    {title: "Надежность", info: "Каждый браслет создан с заботой"},
];

function con4func(mas){
    con4part.innerHTML += 
    `
    <div class="Con4Divs" data-aos="fade-up" data-aos-delay="0">
      <img src="/static/image/auth/show.png" class="con3ImgShow" alt="Посмотреть" style="right: 5%; top: 5%;">
      <img src="static/image/con4/33784.jpg" alt="" class="Con4Imgs" />
      <p class="Con4Text Con4TextGl">${mas.title}</p>
      <p class="Con4Text Con4TextVt">
        ${mas.info}
      </p>
    </div>
    `;
};

masFromCon4.forEach((e)=>{
    con4func(e);
})

let masFromCon5 = [
    {title: "Родных", a_filter: "/shop?filter=Жизнь и процветание,Любовь и семья,Природа,Минимализм и красота", a_img: "/static/image/productImgs/klever/img1.jpg"},
    {title: "Любимых", a_filter: "/shop?filter=Любовь и романтика,Сила и успех,Жизнь и процветание", a_img: "/static/image/productImgs/serdtse-kontur/img3.jpg"},
    {title: "Творческих", a_filter: "/shop?filter=Природа,Музыка и искусство,Минимализм и красота", a_img: "/static/image/productImgs/skripichnyi-kliuch/img3.jpg"},
    {title: "Пу&shy;те&shy;шест&shy;ву&shy;ющих", a_filter: "/shop?filter=Мир и свобода,Путешествия и приключения,Сила и успех", a_img: "/static/image/productImgs/shturval/img1.jpg"},
    {title: "Спортивных", a_filter: "/shop?filter=Спорт,Сила и успех,Минимализм и красота", a_img: "/static/image/productImgs/raketka/img2.jpg"},
    {title: "Пушистых", a_filter: "/shop?filter=Любовь к животным,Природа,Мир и свобода", a_img: "/static/image/productImgs/lapka/img1.jpg"}
]

function con5func(mas){
    let con5 = document.querySelector("#con5grid");
    con5.innerHTML += `
    <div class="con5Divs" data-aos="fade-up" data-aos-delay="100">
      <a href="${mas.a_filter}" style="color:var(--black); text-decoration: none; display: flex; align-items: center; flex-direction: column">
        <p class="con5Text">${mas.title}</p>
        <img src="${mas.a_img}" class="con5Imgs">
      </a>
    </div>
    `
}

masFromCon5.forEach((e)=>{
    con5func(e);
})

let con6 = document.querySelector("#Contener6");

let masFromCon6 = [
    { name: "Мария", icon: "", text: "Очень стильный браслет! Заказала брату — носит не снимая. Спасибо!" },
    { name: "Алексей", icon: "", text: "Качество просто супер, доставка быстрая. Закажу ещё!" },
    { name: "Ольга", icon: "", text: "Брала на подарок мужу — он в восторге. Идея с надписями — огонь!" },
    { name: "Владимир", icon: "", text: "Носим всей семьёй! У каждого свой браслет с личной фразой, это круто." },
    { name: "Айнур", icon: "", text: "Дизайн шикарный, особенно понравилось, что можно выбрать шнур по цвету." },
    { name: "Диана", icon: "", text: "Сомневалась, но вживую браслет выглядит ещё круче. Рекомендую!" },
    { name: "Максим", icon: "", text: "Люблю минимализм — ваш браслет стал любимым аксессуаром. Спасибо!" },
    { name: "Настя", icon: "", text: "Подарила подруге на день рождения — она плакала от счастья. Очень душевный подарок." }
];

function con6func(mas){
    con6.innerHTML += `
    <div class="con6Divs">
        <div class="con6head">
            <img src="${mas.icon}" class="con6imgs alt="Иконка профиля">
            <p class="con6name">${mas.name}</p>
            <label style="color: yellow">★★★★★</label>
        </div>
        <div class="con6main">
            <p class="con6text">${mas.text}</p>
        </div>
    </div>
    `
}

masFromCon6.forEach((e)=>{
    con6func(e);
})

// Дублируем содержимое
con6.innerHTML += con6.innerHTML;

function autoScroll() {
    con6.scrollLeft += 0.728;

    if (con6.scrollLeft >= (con6.scrollWidth) / 1.988) {
        con6.scrollLeft = 0; // сбрасываем плавно, без скачков
    }
    setTimeout(() => {
        autoScroll()
        
    }, 20);
}

autoScroll();

// Contener 7
function con4resize() {
    let Y = window.innerWidth;

    if (Y <= 500){
        con8text1.innerText = "Гравировка на монетке";
        con8text2.innerText = "Объединение браслетов";
    }
    else{
        con8text1.innerText = `Мы можем нанести на монетку любую фразу, дату или имя`;
        con8text2.innerText = `Объединяем браслеты по первой прозбе`;
    }

    // Удаляем все старые ScrollTrigger'ы
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    gsap.registerPlugin(ScrollTrigger);

    let tl = gsap.timeline({
        scrollTrigger: {
            trigger: "#Contener7",
            start: "top 100px",
            end: "+=150%",
            scrub: true,
            pin: ".con7wrapper",
        }
    });

    if (Y <= 767) {
        tl.to("#image1", {
            y: 100,
            opacity: 0,
            duration: 1,
            ease: "power1.out"
        })
        .to("#image2", {
            y: 100,
            opacity: 1,
            duration: 1,
            ease: "power1.out"
        }, "-=0.6")
        .to("#image2", {
            opacity: 0,
            duration: 0.5
        })
        .to("#image3", {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power1.out"
        }, "-=0.6");
        
    } else {


        tl.to("#image1", {
            y: 0,
            x: 50,
            opacity: 0,
            duration: 1,
            ease: "power1.out"
        })
        .to("#image2", {
            y: 0,
            x: 50,
            opacity: 1,
            duration: 1,
            ease: "power1.out"
        }, "-=0.8")
        .to("#image2", {
            opacity: 0,
            duration: 0.5
        })
        .to("#image3", {
            y: 0,
            x: 50,
            opacity: 1,
            duration: 1,
            ease: "power1.out"
        }, "-=0.8");
    }
}

let con8text1 = document.querySelector("#con8text1");
let con8text2 = document.querySelector("#con8text2");

con4resize();
window.addEventListener("resize", () => {
    con4resize();
});
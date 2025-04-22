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
    {title: "Комфорт", info: "Лёгкий и удобный, он не ощущается на запястье, но всегда с тобой"},
    {title: "Долговечность", info: "Мы используем качественные материалы, чтобы браслет радовал вас долгие годы"},
    {title: "Минимализм", info: "Лаконичный дизайн, который подходит к любому образу — от повседневного до вечернего"},
    {title: "Символика", info: "Браслет — это больше, чем украшение. Это история твоих мечтаний и стремлений"},
    {title: "Надежность", info: "Каждый браслет создан с заботой, чтобы стать твоим верным спутником в любой ситуации"},
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
    {title: "Родных", a_filter: "", a_img: ""},
    {title: "Любимых", a_filter: "", a_img: ""},
    {title: "Творческих", a_filter: "", a_img: ""},
    {title: "Пушистых", a_filter: "", a_img: ""},
    {title: "Спортивных", a_filter: "", a_img: ""},
    {title: "Миролюбивых", a_filter: "", a_img: ""}
]

function con5func(mas){
    let con5 = document.querySelector("#con5grid");
    con5.innerHTML += `
    <div class="">
      <a href="${mas.a_filter}">
        <p>${mas.title}</p>
        <img src="${mas.a_img}" alt="">
      </a>
    </div>
    `
}

masFromCon5.forEach((e)=>{
    con5func(e);
})
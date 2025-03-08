const images = document.querySelectorAll("img");
let loader = document.querySelector('#loader');
let loadedImages = 0;
const totalImages = images.length;

loader.style.opacity = "1";

function checkImagesLoaded() {
    loadedImages++;
    if (loadedImages == totalImages) {
        setTimeout(()=>{
            loader.style.opacity = "0";
            setTimeout(()=>{ 
                loader.style.display = "none";
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


setTimeout(() => {
    MainContener.style.transition = `opacity 1s ease-in-out`;
    setTimeout(()=>{
        MainContener.style.opacity = "1";
        MainContener.style.transition = `opacity 0.8s ease-in-out`;
    }, 1001);
}, 300);

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
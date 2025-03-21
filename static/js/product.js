setTimeout(() => {
  MainContener.style.transition = `opacity 1s ease-in-out`;
  MainContener.style.opacity = "1";
  setTimeout(()=>{
    MainContener.style.transition = `opacity 0.3s ease-in-out`;
  }, 1001);
}, 300);

let user_size = 1;

let size1 = document.querySelector("#productChoose1")
size1.addEventListener("click", () => {
  size1.style.color = "#ff889e";
  size2.style.color = "black";
  size3.style.color = "black";
  user_size = 1;
})
let size2 = document.querySelector("#productChoose2")
size2.addEventListener("click", () => {
  size2.style.color = "#ff889e";
  size1.style.color = "black";
  size3.style.color = "black";
  user_size = 2;
})
let size3 = document.querySelector("#productChoose3")
size3.addEventListener("click", () => {
  size3.style.color = "#ff889e";
  size2.style.color = "black";
  size1.style.color = "black";
  user_size = 3;
})


function urlBth(product, user_name, city, street, home) {
  let user_color = document.querySelector("#productColor").value.toLowerCase();
  const phoneNumber = "77003360024";  
  const message = `Здравствуйте! Меня зовут ${user_name}. Интересуюсь позицией - ${product}, цвет нити - ${user_color}, размер - ${user_size}. Доставка на адрес: г.${city}, ул.${street}, д.${home}. Спасибо!`;  
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}


let left = document.querySelector("#profilGalochka1");
let right = document.querySelector("#profilGalochka2");

let img1 = document.querySelector("#productImg1");
let img2 = document.querySelector("#productImg2");
let img3 = document.querySelector("#productImg3");
let img4 = document.querySelector("#productImg4");

img2.style.opacity = "0";
img3.style.opacity = "0";
img4.style.opacity = "0";

let chett = 0;

right.addEventListener('click', sizeRight)
function sizeRight() {
  switch (chett) {
    case 0: 
      chett++;
      img1.style.opacity = "0";
      img2.style.opacity = "1";
      img3.style.opacity = "0";
      img4.style.opacity = "0";
      break;
    case 1:
      chett++;
      img1.style.opacity = "0";
      img2.style.opacity = "0";
      img3.style.opacity = "1";
      img4.style.opacity = "0";
      break
    case 2:
      chett++;
      img1.style.opacity = "0";
      img2.style.opacity = "0";
      img3.style.opacity = "0";
      img4.style.opacity = "1";
      break
    case 3:
      chett = 0;
      img1.style.opacity = "1";
      img2.style.opacity = "0";
      img3.style.opacity = "0";
      img4.style.opacity = "0";
      break
    default:
      break;
  }
}

left.addEventListener('click', () => {
  
  switch (chett) {
    case 1: 
      chett--;
      img1.style.opacity = "1";
      img2.style.opacity = "0";
      img3.style.opacity = "0";
      img4.style.opacity = "0";
      break;
    case 2:
      chett--;
      img1.style.opacity = "0";
      img2.style.opacity = "1";
      img3.style.opacity = "0";
      img4.style.opacity = "0";
      break
    case 3:
      chett--;
      img1.style.opacity = "0";
      img2.style.opacity = "0";
      img3.style.opacity = "1";
      img4.style.opacity = "0";
      break
    case 0:
      chett = 3;
      img1.style.opacity = "0";
      img2.style.opacity = "0";
      img3.style.opacity = "0";
      img4.style.opacity = "1";
      break
    default:
      break;
  }
})

window.addEventListener("resize", resize);
cheked = false;
function resize() {
  console.log(34);
  
    width = window.innerWidth;
    if (width <= 1000){
      if(cheked == false){
        img1.style.opacity = "1";
        img2.style.opacity = "0";
        img3.style.opacity = "0";
        img4.style.opacity = "0";
        cheked = true;
      }
    }
    else{
      cheked = false;
      img1.style.opacity = "1";
      img2.style.opacity = "1";
      img3.style.opacity = "1";
      img4.style.opacity = "1";
    }
};
resize();
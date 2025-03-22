let OpacityBth = document.querySelector("#shopBthMore")
let DivOpacityBth = document.querySelector("#shopDivBthMore")
let DivFilter = document.querySelector("#Divfiltr");
let BockMenu = document.querySelector("#BockMenu");
let CloseBth = document.querySelector("#BockMenuTitleImg")
let SbrosBth = document.querySelector("#BockMenuBthSbros")
let Darker = document.querySelector("#Darker")

setTimeout(() => {
  MainContener.style.transition = `opacity 1s ease-in-out`;
  MainContener.style.opacity = "1";
  setTimeout(()=>{
    MainContener.style.transition = `opacity 0.3s ease-in-out`;
  }, 1001);
}, 300);

const allProducts = [
  { name: "Кулон «Бес&shy;конеч&shy;ность»",  price:28500, concept: "Мир и свобода", category: "Кулон", image: "/static/image/productImgs/beskonechonst-love/img1.jpeg", slug: "beskonechnost" },
  { name: "Кулон «Голубь»", price: 30500, concept: "Мир и свобода", category: "Кулон", image: "/static/image/productImgs/beskonechonst-love/img1.jpeg", slug: "golub" },
  { name: "Кулон «Бес&shy;конеч&shy;ность love»", price: 31500, concept: "Любовь и романтика", category: "Кулон", image: "/static/image/productImgs/beskonechonst-love/img1.jpeg", slug: "beskonechnost-love" },
  { name: "Кулон «Бриллиант»", price: 33000, concept: "Сила и успех", category: "Кулон", image: "/static/image/productImgs/beskonechonst-love/img1.jpeg", slug: "brilliant" },
  { name: "Кулон «Пульс»", price: 33000, concept: "Любовь и романтика", category: "Кулон", image: "/static/image/productImgs/beskonechonst-love/img1.jpeg", slug: "puls" },
  { name: "Кулон «Пацифик»", price: 33000, concept: "Мир и свобода", category: "Кулон", image: "/static/image/productImgs/beskonechonst-love/img1.jpeg", slug: "patsifik" },
  { name: "Кулон «Клевер»", price: 33000, concept: "Жизнь и процветание", category: "Кулон", image: "/static/image/productImgs/beskonechonst-love/img1.jpeg", slug: "klever" },
  { name: "Кулон «Горы»", price: 33500, concept: "Путешествия и приключения", category: "Кулон", image: "/static/image/productImgs/beskonechonst-love/img1.jpeg", slug: "gory" },
  { name: "Кулон «Дерево»", price: 33500, concept: "Жизнь и процветание", category: "Кулон", image: "/static/image/productImgs/beskonechonst-love/img1.jpeg", slug: "derevo" },
  { name: "Кулон «Крестик»", price: 34000, concept: "Духовность и вера", category: "Кулон", image: "/static/image/productImgs/beskonechonst-love/img1.jpeg", slug: "krestik" },
  { name: "Кулон «Звезда Давида»", price: 34000, concept: "Духовность и вера", category: "Кулон", image: "/static/image/productImgs/beskonechonst-love/img1.jpeg", slug: "zvezda-davida" },
  { name: "Кулон «Корона»", price: 34500, concept: "Сила и успех", category: "Кулон", image: "/static/image/productImgs/beskonechonst-love/img1.jpeg", slug: "korona" },
  { name: "Кулон «Сердце контур»", price: 35000, concept: "Любовь и романтика", category: "Кулон", image: "/static/image/productImgs/beskonechonst-love/img1.jpeg", slug: "serdtse-kontur" },
  { name: "Кулон «Сердце пульс»", price: 35500, concept: "Любовь и романтика", category: "Кулон", image: "/static/image/productImgs/beskonechonst-love/img1.jpeg", slug: "serdtse-puls" },
  { name: "Кулон «Мальчик»", price: 36000, concept: "Любовь и семья", category: "Кулон", image: "/static/image/productImgs/beskonechonst-love/img1.jpeg", slug: "malchik" },
  { name: "Кулон «Девочка»", price: 36000, concept: "Любовь и семья", category: "Кулон", image: "/static/image/productImgs/beskonechonst-love/img1.jpeg", slug: "devochka" },
  { name: "Кулон «Солнце»", price: 36000, concept: "Природа", category: "Кулон", image: "/static/image/productImgs/beskonechonst-love/img1.jpeg", slug: "solntse" },
  { name: "Кулон «Крыло»", price: 37000, concept: "Мир и свобода", category: "Кулон", image: "/static/image/productImgs/beskonechonst-love/img1.jpeg", slug: "krylo" },
  { name: "Кулон «Роза ветров»", price: 37500, concept: "Путешествия и приключения", category: "Кулон", image: "/static/image/productImgs/beskonechonst-love/img1.jpeg", slug: "roza-vetrov" },
  { name: "Кулон «Ангел»", price: 37500, concept: "Духовность и вера", category: "Кулон", image: "/static/image/productImgs/beskonechonst-love/img1.jpeg", slug: "angel" },
  { name: "Кулон «Ракетка»", price: 37500, concept: "Спорт", category: "Кулон", image: "/static/image/productImgs/beskonechonst-love/img1.jpeg", slug: "raketka" },
  { name: "Кулон «Лапка»", price: 38000, concept: "Любовь к животным", category: "Кулон", image: "/static/image/productImgs/beskonechonst-love/img1.jpeg", slug: "lapka" },
  { name: "Кулон «Полумесяц»", price: 39000, concept: "Духовность и вера", category: "Кулон", image: "/static/image/productImgs/beskonechonst-love/img1.jpeg", slug: "polumesiats" },
  { name: "Кулон «Сердце на пульсе»", price: 39000, concept: "Любовь и романтика", category: "Кулон", image: "/static/image/productImgs/beskonechonst-love/img1.jpeg", slug: "serdtse-na-pulse" },
  { name: "Кулон «Снежинка»", price: 39500, concept: "Природа", category: "Кулон", image: "/static/image/productImgs/beskonechonst-love/img1.jpeg", slug: "snezhinka" },
  { name: "Кулон «Скрипичный ключ»", price: 39500, concept: "Музыка и искусство", category: "Кулон", image: "/static/image/productImgs/beskonechonst-love/img1.jpeg", slug: "skripichnyi-kliuch" },
  { name: "Кулон «Якорь»", price: 41000, concept: "Путешествия и приключения", category: "Кулон", image: "/static/image/productImgs/beskonechonst-love/img1.jpeg", slug: "iakor" },
  { name: "Кулон «Олимпийские кольца»", price: 42500, concept: "Спорт", category: "Кулон", image: "/static/image/productImgs/beskonechonst-love/img1.jpeg", slug: "olimpiiskie-koltsa" },
  { name: "Кулон «Рука Фатимы»", price: 45500, concept: "Духовность и вера", category: "Кулон", image: "/static/image/productImgs/beskonechonst-love/img1.jpeg", slug: "ruka-fatimy" },
  { name: "Кулон «Самолёт»", price: 46500, concept: "Путешествия и приключения", category: "Кулон", image: "/static/image/productImgs/beskonechonst-love/img1.jpeg", slug: "samolet" },
  { name: "Кулон «Штурвал»", price: 48000, concept: "Путешествия и приключения", category: "Кулон", image: "/static/image/productImgs/beskonechonst-love/img1.jpeg", slug: "shturval" },
  { name: "Кулон «Планета»", price: 48000, concept: "Путешествия и приключения", category: "Кулон", image: "/static/image/productImgs/beskonechonst-love/img1.jpeg", slug: "planeta" },
  { name: "Бегунок мини", price: 28500, concept: "Минимализм и красота", category: "Бегунок", image: "/static/image/productImgs/beskonechonst-love/img1.jpeg", slug: "begunok-mini" },
  { name: "Бегунок", price: 55000, concept: "Минимализм и красота", category: "Бегунок", image: "/static/image/productImgs/beskonechonst-love/img1.jpeg", slug: "begunok" },
  { name: "Колье-невидимка без кулона", price: 28500, concept: "Минимализм и красота", category: "Колье", image: "/static/image/productImgs/beskonechonst-love/img1.jpeg", slug: "kole-nevidimka-bez-kulona" },
  { name: "Колье-неведимка с мини сердечком", price: 45000, concept: "Любовь и романтика", category: "Колье", image: "/static/image/productImgs/beskonechonst-love/img1.jpeg", slug: "kole-nevidimka-s-mini-serdechkom" },
  { name: "Колье-неведимка с бегунком мини", price: 44000, concept: "Минимализм и красота", category: "Колье", image: "/static/image/productImgs/beskonechonst-love/img1.jpeg", slug: "kole-nevidimka-s-begunkom-mini" },
  { name: "Колье-неведимка с бегунком", price: 64000, concept: "Минимализм и красота", category: "Колье", image: "/static/image/productImgs/beskonechonst-love/img1.jpeg", slug: "kole-nevidimka-s-begunkom" },
  { name: 'Кулон Знак зодиака «Овен»', price: 36000, concept: "Знаки зодиака", category: "Кулон", image: "/static/image/productImgs/beskonechonst-love/img1.jpeg", slug: "oven" },
  { name: 'Кулон Знак зодиака «Телец»', price: 36000, concept: "Знаки зодиака", category: "Кулон", image: "/static/image/productImgs/beskonechonst-love/img1.jpeg", slug: "telets" },
  { name: 'Кулон Знак зодиака «Близнецы»', price: 36000, concept: "Знаки зодиака", category: "Кулон", image: "/static/image/productImgs/beskonechonst-love/img1.jpeg", slug: "bliznetsy" },
  { name: 'Кулон Знак зодиака «Рак»', price: 36000, concept: "Знаки зодиака", category: "Кулон", image: "/static/image/productImgs/beskonechonst-love/img1.jpeg", slug: "rak" },
  { name: 'Кулон Знак зодиака «Лев»', price: 36000, concept: "Знаки зодиака", category: "Кулон", image: "/static/image/productImgs/beskonechonst-love/img1.jpeg", slug: "lev" },
  { name: 'Кулон Знак зодиака «Дева»', price: 36000, concept: "Знаки зодиака", category: "Кулон", image: "/static/image/productImgs/beskonechonst-love/img1.jpeg", slug: "deva" },
  { name: 'Кулон Знак зодиака «Весы»', price: 36000, concept: "Знаки зодиака", category: "Кулон", image: "/static/image/productImgs/beskonechonst-love/img1.jpeg", slug: "vesy" },
  { name: 'Кулон Знак зодиака «Скорпион»', price: 36000, concept: "Знаки зодиака", category: "Кулон", image: "/static/image/productImgs/beskonechonst-love/img1.jpeg", slug: "skorpion" },
  { name: 'Кулон Знак зодиака «Стрелец»', price: 36000, concept: "Знаки зодиака", category: "Кулон", image: "/static/image/productImgs/beskonechonst-love/img1.jpeg", slug: "strelets" },
  { name: 'Кулон Знак зодиака «Козерог»', price: 36000, concept: "Знаки зодиака", category: "Кулон", image: "/static/image/productImgs/beskonechonst-love/img1.jpeg", slug: "kozerog" },
  { name: 'Кулон Знак зодиака «Водолей»', price: 36000, concept: "Знаки зодиака", category: "Кулон", image: "/static/image/productImgs/beskonechonst-love/img1.jpeg", slug: "vodolei" },
  { name: 'Кулон Знак зодиака «Рыбы»', price: 36000, concept: "Знаки зодиака", category: "Кулон", image: "/static/image/productImgs/beskonechonst-love/img1.jpeg", slug: "ryby" },
  { name: "Монеточка", price: 173000, concept: "Минимализм и красота", category: "Монеточка", image: "/static/image/productImgs/beskonechonst-love/img1.jpeg", slug: "monetochka" },
  { name: "Гравировка монетки 0.7г", price: 47000, concept: "Минимализм и красота", category: "Монеточка", image: "/static/image/productImgs/beskonechonst-love/img1.jpeg", slug: "gravirovka-monetki-0-7g" },
  { name: "Гравировка монетки 1.1г", price: 68000, concept: "Минимализм и красота", category: "Монеточка", image: "/static/image/productImgs/beskonechonst-love/img1.jpeg", slug: "gravirovka-monetki-1-1g" },
  { name: "Кулон из серебра", price: 10000, concept: "Минимализм и красота", category: "Кулон", image: "/static/image/productImgs/beskonechonst-love/img1.jpeg", slug: "kulon-iz-serebra" },
  { name: "Гравировка в серебре", price: 15000, concept: "Минимализм и красота", category: "Монеточка", image: "/static/image/productImgs/beskonechonst-love/img1.jpeg", slug: "gravirovka-v-serebre" }
];

let filteredProducts = allProducts;

let KnopkaShow = document.querySelector("#BockMenuDivBthShow");
KnopkaShow.addEventListener("click", () => {
  FuncFilters(true);       
});
function FuncFilters(bool){
  
  BockMenu.style.transform = "translateX(-1000px)";
  BockMenu.style.opacity = "0";
  Darker.style.background = "rgba(0, 0, 0, 0)";

  const selectedFilters = {};
  
  document.querySelectorAll(".ShopFiltersRadio:checked").forEach((checkbox) => {
    const category = checkbox.dataset.category;
    const value = checkbox.dataset.value;

    if (!selectedFilters[category]) {
      selectedFilters[category] = [];
    }
    selectedFilters[category].push(value);
  });
  
  filterProducts(selectedFilters, bool);
};

function filterProducts(filters, bool) {
  let filteredProducts = allProducts;

  if (filters["Концепция"]) {
    filteredProducts = filteredProducts.filter(product =>
      filters["Концепция"].includes(product.concept)
    );
  }
  if (filters["Категория"]) {
    filteredProducts = filteredProducts.filter(product =>
      filters["Категория"].includes(product.category)
    );
  }
  if (filters["Цена"]){
    if (filters["Цена"] == "Больше 64000тг") {
      filteredProducts = filteredProducts.filter(product => product.price >= 64000);
    } 
    else if (filters["Цена"] == "40000тг - 64000тг") {
      filteredProducts = filteredProducts.filter(product => product.price >= 40000 && product.price <= 64000);
    } 
    else if (filters["Цена"] == "10000тг - 40000тг") {
      filteredProducts = filteredProducts.filter(product => product.price >= 10000 && product.price <= 40000);
    } 
    else if (filters["Цена"].includes("10000тг - 40000тг") && filters["Цена"].includes("40000тг - 64000тг") && filters["Цена"].includes("Больше 64000тг")) {
      filteredProducts = filteredProducts.filter(product => product.price >= 10000);
    }     
    else if (filters["Цена"].includes("10000тг - 40000тг") && filters["Цена"].includes("40000тг - 64000тг")) {
        filteredProducts = filteredProducts.filter(product => product.price >= 10000 && product.price <= 64000);
      } 
      else if (filters["Цена"].includes("10000тг - 40000тг") && filters["Цена"].includes("Больше 64000тг")) {
        filteredProducts = filteredProducts.filter(product => product.price >= 10000 && product.price <= 40000 || product.price >= 64000);
      } 
      else if (filters["Цена"].includes("40000тг - 64000тг") && filters["Цена"].includes("Больше 64000тг")) {
        filteredProducts = filteredProducts.filter(product => product.price >= 40000);
      }
  }
  if (filteredProducts.length <= 12){
    renderProducts(filteredProducts, bool);
    bthOpacity(false);
  }
  else{
    renderProducts(filteredProducts, bool);
    bthOpacity(true);
  }
}

function renderProducts(products, bool) {
  const productContainer = document.querySelector("#productGrid");
  productContainer.innerHTML = ""; // Очистка контейнера перед рендерингом
  if (bool == true){
    for (let i = 0; i < products.length && i < 12; i++){
      
      const productCard = `
      <div class="product-card">
        <img src="${products[i].image}" alt="${products[i].name}" class="product-image">
        <p class="product-title">${products[i].name}</p>
        <div class="test">
          <p class="product-price">${products[i].price}тг</p>
          <a href="/product/${products[i].slug}" style="color: black">
          <div class="DivInfo">
            <img src = "/static/image/menu/sumka.png" class = "Con2Icon" alt = "Сумка">
            <p class="BthInfo"><ins>Подробнее</ins></p>
          </div>
          </a>
        </div>
      </div>
      `;
      productContainer.innerHTML += productCard;
    }
  }
  else{
    for (let i = 0; i < products.length; i++){
      
      const productCard = `
      <div class="product-card">
        <img src="${products[i].image}" alt="${products[i].name}" class="product-image">
        <p class="product-title">${products[i].name}</p>
        <div class="test">
          <p class="product-price">${products[i].price}тг</p>
          <a href="/product/${products[i].slug}" style="color: black">
          <div class="DivInfo">
            <img src = "/static/image/menu/sumka.png" class = "Con2Icon" alt = "Сумка">
            <p class="BthInfo"><ins>Подробнее</ins></p>
          </div>
          </a>
        </div>
      </div>
      `;
      productContainer.innerHTML += productCard;
    }
  }
}

class BockMenuTabs {
  constructor(MainTabsName, PodTabsName, Fid) {
    this.MainTabsName = MainTabsName;
    this.PodTabsName = PodTabsName;
    this.Fid = Fid;
  }
  
  MenuHtml() {
    let html = `
    <div class="ShopDivFilters">
    <div id="ShopDivId${this.MainTabsName}">
    <p class="ShopFiltersTitle">${this.MainTabsName}</p>
    </div>
    <ul class="ShopFiltersDivSpisok" id="ShopPodId${this.MainTabsName}">`;
    
    this.PodTabsName.forEach((PodName, index) => {
      const PodId = this.Fid[index] || index;
      html += `
      <li class="ShopFiltersPodSpisok">
      <label class="customCheckbox">
      <input class="ShopFiltersRadio" type="checkbox" data-category="${this.MainTabsName}" data-value="${PodName}" id="FiltersCheckBox${PodId}">
      <span></span>
      </label>
      <label for="FiltersCheckBox${PodId}" class="ShopFiltersItems">${PodName}</label>
      </li>`;
    });
    
    html += `</ul></div>`;
    return html;
  }
  
  renderTabs() {
    const BockMenuMain = document.querySelector("#BockMenuMain");
    if (BockMenuMain) {
      BockMenuMain.innerHTML += this.MenuHtml();
    } else {
      console.error("Элемент #BockMenuMain не найден на странице.");
    }
  }
}

// Пример использования
const myMenus = [
  new BockMenuTabs("Концепция", ["Путешествия и приключения", "Любовь и романтика", "Мир и свобода", "Сила и успех",  "Жизнь и процветание", "Духовность и вера", "Знаки зодиака", "Любовь и семья", "Спорт", "Любовь к животным", "Природа", "Музыка и искусство", "Минимализм и красота"], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]),
  new BockMenuTabs("Категория", ["Кулон", "Колье", "Бегунок", "Монеточка"], [14, 15, 16, 17]),
  new BockMenuTabs("Цена", ["10000тг - 40000тг", "40000тг - 64000тг", "Больше 64000тг"], [18, 19, 20]),
];

// Рендеринг вкладок
myMenus.forEach((menu) => {
  menu.renderTabs();
});


let MainKon = document.querySelector("#ShopDivIdКонцепция")
let PodKon = document.querySelector("#ShopPodIdКонцепция")
let ChetKon = false;

MainKon.addEventListener('click', ()=>{
  ChetKon = !ChetKon;
  
  OpenDoors(PodKon, ChetKon);
});

let MainKat = document.querySelector("#ShopDivIdКатегория")
let PodKat = document.querySelector("#ShopPodIdКатегория")
let ChetKat = false;

MainKat.addEventListener('click', () => {
  ChetKat = !ChetKat;
  OpenDoors(PodKat, ChetKat);
})

let MainCena = document.querySelector("#ShopDivIdЦена")
let PodCena = document.querySelector("#ShopPodIdЦена")
let ChetCena = false;

MainCena.addEventListener('click', () => {
  ChetCena = !ChetCena;
  OpenDoors(PodCena, ChetCena);
})


function OpenDoors(PodName, Chet){
  PodName.style.height = Chet? PodName.scrollHeight + "px" : "0";
}


DivFilter.addEventListener('click', () => {
  BockMenu.style.transform = "translateX(0px)";
  BockMenu.style.opacity = "1";
  Darker.style.background = "rgba(0, 0, 0, 0.5)";
});

CloseBth.addEventListener('click', () => {
  BockMenu.style.transform = "translateX(-1000px)";
  BockMenu.style.opacity = "0";
  Darker.style.background = "rgba(0, 0, 0, 0)";
})

SbrosBth.addEventListener('click', () => {
  BockMenu.style.transform = "translateX(-1000px)";
  BockMenu.style.opacity = "0";
  Darker.style.background = "rgba(0, 0, 0, 0)";

  document.querySelectorAll(".ShopFiltersRadio:checked").forEach((checkbox) => {
    checkbox.checked = false;
  });

  FuncFilters(true);
})

let FiltersHeight = document.querySelector('#FilterHeight');
FiltersHeight.addEventListener('resize', ReHeight);

function ReHeight() {
  if(window.innerHeight <= 1000){
    let Height = window.innerHeight;
    FiltersHeight.style.height = `${Height}px`;
  }
}

OpacityBth.addEventListener('click', () => {
  FuncFilters(false);
  bthOpacity(false)
})

function bthOpacity(bool) {
  if (bool == true){
    OpacityBth.style.opacity = "1";
    OpacityBth.style.display = "flex";
    DivOpacityBth.style.opacity = "1";
    DivOpacityBth.style.display = "flex";
    
  }
  else{
    if (filteredProducts.length >= 12){
      OpacityBth.style.opacity = "0";
      OpacityBth.style.display = "none";
      DivOpacityBth.style.opacity = "0";
      DivOpacityBth.style.display = "none";
    }
    else{
      OpacityBth.style.opacity = "1";
      OpacityBth.style.display = "flex";
      DivOpacityBth.style.opacity = "1";
      DivOpacityBth.style.display = "flex";
    }
  }
}

FuncFilters(true);
ReHeight()

window.addEventListener('resize', ReHeight);
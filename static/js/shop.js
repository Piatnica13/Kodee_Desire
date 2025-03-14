setTimeout(() => {
  MainContener.style.transition = `opacity 1s ease-in-out`;
  MainContener.style.opacity = "1";
  setTimeout(()=>{
      MainContener.style.transition = `opacity 0.3s ease-in-out`;
  }, 1001);
}, 300);

class Product {
  constructor(id, name, price) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.image = "/static/image/imgShop/Product/Golub.png";
  }
  
  // Метод для генерации HTML карточки
  render() {
    return `
    <div class="product-card">
      <img src="${this.image}" alt="${this.name}" class="product-image">
      <p class="product-title">${this.name}</p>
      <div class="test">
        <p class="product-price">${this.price}тг</p>
        <a href="" style = "color: black">
        <div class="DivInfo">
          <img src = "/static/image/menu/sumka.png" class = "Con2Icon" alt = "Сумка">
          <p class="BthInfo"><ins>Подробнее</ins></p>
        </div>
        </a>
      </div>
    </div>
    `;
  }
}

// Массив товаров
const products = [
  new Product(1, "Кулон «Бес&shy;конеч&shy;ность»", 28500),
  new Product(2, "Кулон «Голубь»", 30500),
  new Product(3, "Кулон «Бес&shy;конеч&shy;ность love»", 31500),
  new Product(4, "Кулон «Бриллиант»", 33000),
  new Product(5, "Кулон «Пульс»", 33000),
  new Product(6, "Кулон «Пацифик»", 33000),
  new Product(7, "Кулон «Клевер»", 33000),
  new Product(8, "Кулон «Горы»", 33500),
  new Product(9, "Кулон «Дерево»", 33500),
  new Product(10, "Кулон «Крестик»", 34000),
  new Product(11, "Кулон Звезда Давида»", 34000),
  new Product(12, "Кулон «Корона»", 34500),
  new Product(13, "Кулон «Сердце контур»", 35000),
  new Product(14, "Кулон «Сердце пульс»", 35500),
  new Product(15, "Кулон «Мальчик»", 36000),
  new Product(16, "Кулон «Девочка»", 36000),
  new Product(17, "Кулон «Солнце»", 36000),
  new Product(18, "Кулон «Крыло»", 37000),
  new Product(19, "Кулон «Роза ветров»", 37500),
  new Product(20, "Кулон «Ангел»", 37500),
  new Product(21, "Кулон «Ракетка»", 37500),
  new Product(22, "Кулон «Лапка»", 38000),
  new Product(23, "Кулон «Полумесяц»", 39000),
  new Product(24, "Кулон «Сердце на пульсе»", 39000),
  new Product(25, "Кулон «Снежинка»", 39500),
  new Product(26, "Кулон «Скрипичный ключ»", 39500),
  new Product(27, "Кулон «Якорь»", 41000),
  new Product(28, "Кулон «Олимпийские кольца»", 42500),
  new Product(29, "Кулон «Рука Фатимы»", 45500),
  new Product(30, "Кулон «Самолёт»", 46500),
  new Product(31, "Кулон «Штурвал»", 48000),
  new Product(32, "Кулон «Планета»", 48000),
  new Product(33, "Бегунок мини", 28500),
  new Product(34, "Бегунок", 55000),
  new Product(35, "Колье-невидимка без кулона", 28500),
  new Product(36, "Колье-неведимка с мини сердечком", 45000),
  new Product(37, "Колье-неведимка с бегунком мини", 44000),
  new Product(38, "Колье-неведимка с бегунком", 64000),
  new Product(39, "Знаки зодиака", 36000),
  new Product(40, "Монеточка", 173000),
  new Product(41, "Гравировка монетки 0.7г", 47000),
  new Product(42, "Гравировка монетки 1.1г", 68000),
  new Product(43, "Кулон из серебра", 10000),
  new Product(44, "Гравировка в серебре", 15000),
];

// Генерация карточек товаров
const productGrid = document.querySelector('#productGrid');
products.forEach(product => {
  productGrid.innerHTML += product.render();
});

class BockMenuTabs {
  constructor(MainTabsName, PodTabsName, Fid) {
    this.MainTabsName = MainTabsName; // Название главной вкладки
    this.PodTabsName = PodTabsName;  // Массив подназваний
    this.Fid = Fid;                  // Массив ID
  }

  MenuHtml() {
    let html = `
      <div class="ShopDivFilters" >
        <div id="ShopDivId${this.MainTabsName}">
          <p class="ShopFiltersTitle">${this.MainTabsName}</p>
        </div>
        <ul class="ShopFiltersDivSpisok" id = "ShopPodId${this.MainTabsName}">`;

    // Генерация подменю
    this.PodTabsName.forEach((PodName, index) => {
      const PodId = this.Fid[index] || index; // Если ID нет, используем индекс
      html += `
        <li class="ShopFiltersPodSpisok">
          <label class = "customCheckbox">
            <input class = "ShopFiltersRadio" type="checkbox" id="FiltersCheckBox${PodId}">
            <span></span>
          </label>
          <label for="FiltersCheckBox${PodId}" class="ShopFiltersItems">${PodName}</label>
        </li>`;
    });

    html += `
        </ul>
      </div>`;
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
  new BockMenuTabs("Концепция", ["Знаки зодиака", "Новый год", "Путешествия"], [1, 2, 3]),
  new BockMenuTabs("Категория", ["Кулон", "Колье", "Бегунок", "Монеточка"], [4, 5, 6, 7]),
  new BockMenuTabs("Цена", ["28500тг - 40000тг", "40000тг - 64000тг", "64000тг - 173000тг"], [8, 9, 10]),
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




let DivFilter = document.querySelector("#Divfiltr");
let BockMenu = document.querySelector("#BockMenu");
let CloseBth = document.querySelector("#BockMenuTitleImg")
let Darker = document.querySelector("#Darker")

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

let FiltersHeight = document.querySelector('#FilterHeight');
FiltersHeight.addEventListener('resize', ReHeight);

function ReHeight() {
  if(window.innerHeight <= 1000){
    let Height = window.innerHeight;
    FiltersHeight.style.height = `${Height}px`;
  }
}
ReHeight()

window.addEventListener('resize', ReHeight);
// Переменные для отслеживания состояния
let chetForBlockNavig = false;
let chetForBlockInfo = false;
let chetForBlockHelps = false;

// Элементы DOM
const blockWithNavig = document.querySelector("#FuterPodNavig");
const blockWithInfo = document.querySelector("#FuterPodInfo");
const blockWithHelps = document.querySelector("#FuterPodHelps");

const listWithNavig = document.querySelector("#FuterPodListBlockNavig");
const listWithInfo = document.querySelector("#FuterPodListBlockInfo");
const listWithHelps = document.querySelector("#FuterPodListBlockHelps");

function Time(){
    interval = setInterval(()=>{
        return "none";
    }, 500)
}

// Функции для управления состоянием блоков
function toggleNavig() {
    chetForBlockNavig = !chetForBlockNavig;
    listWithNavig.style.display = chetForBlockNavig ? "flex" : Time();
    // Устанавливаем высоту равной полной высоте контента
    listWithNavig.style.height = chetForBlockNavig ? listWithNavig.scrollHeight + "px" : "0";
}

function toggleInfo() {
    chetForBlockInfo = !chetForBlockInfo;
    listWithInfo.style.display = chetForBlockInfo ? "flex" : Time();
    listWithInfo.style.height = chetForBlockInfo ? listWithInfo.scrollHeight + "px" : "0";
}

function toggleHelps() {
    chetForBlockHelps = !chetForBlockHelps;
    listWithHelps.style.display = chetForBlockHelps ? "flex" : Time();
    listWithHelps.style.height = chetForBlockHelps ? listWithHelps.scrollHeight + "px" : "0";
}

// Функция для управления обработчиками событий в зависимости от ширины экрана
function manageEventListeners() {
    if (window.innerWidth <= 767) {
        // Меньше или равно 767px — добавляем обработчики событий
        blockWithNavig.addEventListener("click", toggleNavig);
        blockWithInfo.addEventListener("click", toggleInfo);
        blockWithHelps.addEventListener("click", toggleHelps);

        // Скрываем блоки в зависимости от состояния
        listWithNavig.style.display = chetForBlockNavig ? "flex" : "none";
        listWithInfo.style.display = chetForBlockInfo ? "flex" : "none";
        listWithHelps.style.display = chetForBlockHelps ? "flex" : "none";

    } else {
        // Больше 767px — удаляем обработчики событий
        blockWithNavig.removeEventListener("click", toggleNavig);
        blockWithInfo.removeEventListener("click", toggleInfo);
        blockWithHelps.removeEventListener("click", toggleHelps);

        // Всегда отображаем блоки
        listWithNavig.style.display = "flex";
        listWithInfo.style.display = "flex";
        listWithHelps.style.display = "flex";

        // Сбрасываем состояния
        chetForBlockNavig = false;
        chetForBlockInfo = false;
        chetForBlockHelps = false;
    }
}
// Инициализация
manageEventListeners();
window.addEventListener("resize", manageEventListeners);

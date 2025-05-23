const allProducts = [
    { id: 1, name: "Кулон «Бесконечность»",  price:28500, concept: "Мир и свобода", category: "Кулон", image: "/static/image/productImgs/beskonechnost/img1.webp", slug: "beskonechnost" },
    { id: 2, name: "Кулон «Голубь»", price: 30500, concept: "Мир и свобода", category: "Кулон", image: "/static/image/productImgs/golub/img1.webp", slug: "golub" },
    { id: 3, name: "Кулон «Бесконечность love»", price: 31500, concept: "Любовь и романтика", category: "Кулон", image: "/static/image/productImgs/beskonechnost-love/img1.webp", slug: "beskonechnost-love" },
    { id: 4, name: "Кулон «Бриллиант»", price: 33000, concept: "Сила и успех", category: "Кулон", image: "/static/image/productImgs/brilliant/img1.webp", slug: "brilliant" },
    { id: 5, name: "Кулон «Пульс»", price: 33000, concept: "Любовь и романтика", category: "Кулон", image: "/static/image/productImgs/puls/img1.webp", slug: "puls" },
    { id: 6, name: "Кулон «Пацифик»", price: 33000, concept: "Мир и свобода", category: "Кулон", image: "/static/image/productImgs/patsifik/img1.webp", slug: "patsifik" },
    { id: 7, name: "Кулон «Клевер»", price: 33000, concept: "Жизнь и процветание", category: "Кулон", image: "/static/image/productImgs/klever/img1.webp", slug: "klever" },
    { id: 8, name: "Кулон «Горы»", price: 33500, concept: "Путешествия и приключения", category: "Кулон", image: "/static/image/productImgs/gory/img1.webp", slug: "gory" },
    { id: 9, name: "Кулон «Дерево»", price: 33500, concept: "Жизнь и процветание", category: "Кулон", image: "/static/image/productImgs/derevo/img1.webp", slug: "derevo" },
    { id: 10, name: "Кулон «Крестик»", price: 34000, concept: "Духовность и вера", category: "Кулон", image: "/static/image/productImgs/krestik/img1.webp", slug: "krestik" },
    { id: 11, name: "Кулон «Звезда Давида»", price: 34000, concept: "Духовность и вера", category: "Кулон", image: "/static/image/productImgs/zvezda-davida/img1.webp", slug: "zvezda-davida" },
    { id: 12, name: "Кулон «Корона»", price: 34500, concept: "Сила и успех", category: "Кулон", image: "/static/image/productImgs/korona/img1.webp", slug: "korona" },
    { id: 13, name: "Кулон «Сердце контур»", price: 35000, concept: "Любовь и романтика", category: "Кулон", image: "/static/image/productImgs/serdtse-kontur/img1.webp", slug: "serdtse-kontur" },
    { id: 14, name: "Кулон «Сердце пульс»", price: 35500, concept: "Любовь и романтика", category: "Кулон", image: "/static/image/productImgs/serdtse-puls/img1.webp", slug: "serdtse-puls" },
    { id: 15, name: "Кулон «Пустышка»", price: 35500, concept: "Любовь и семья", category: "Кулон", image: "/static/image/productImgs/pustyshka/img1.webp", slug: "pustyshka" },
    { id: 16, name: "Кулон «Мальчик»", price: 36000, concept: "Любовь и семья", category: "Кулон", image: "/static/image/productImgs/malchik/img1.webp", slug: "malchik" },
    { id: 17, name: "Кулон «Девочка»", price: 36000, concept: "Любовь и семья", category: "Кулон", image: "/static/image/productImgs/devochka/img1.webp", slug: "devochka" },
    { id: 18, name: "Кулон «Солнце»", price: 36000, concept: "Природа", category: "Кулон", image: "/static/image/productImgs/solntse/img1.webp", slug:  "solntse" },
    { id: 19, name: "Кулон «Крыло»", price: 37000, concept: "Мир и свобода", category: "Кулон", image: "/static/image/productImgs/krylo/img1.webp", slug: "krylo" },
    { id: 20, name: "Кулон «Роза ветров»", price: 37500, concept: "Путешествия и приключения", category: "Кулон", image: "/static/image/productImgs/roza-vetrov/img1.webp", slug: "roza-vetrov" },
    { id: 21, name: "Кулон «Ангел»", price: 37500, concept: "Духовность и вера", category: "Кулон", image: "/static/image/productImgs/angel/img1.webp", slug: "angel" },
    { id: 22, name: "Кулон «Ракетка»", price: 37500, concept: "Спорт", category: "Кулон", image: "/static/image/productImgs/raketka/img1.webp", slug: "raketka" },
    { id: 23, name: "Кулон «Лапка»", price: 38000, concept: "Любовь к животным", category: "Кулон", image: "/static/image/productImgs/lapka/img1.webp", slug: "lapka" },
    { id: 24, name: "Кулон «Полумесяц»", price: 39000, concept: "Духовность и вера", category: "Кулон", image: "/static/image/productImgs/polumesiats/img1.webp", slug: "polumesiats" },
    { id: 25, name: "Кулон «Сердце на пульсе»", price: 39000, concept: "Любовь и романтика", category: "Кулон", image: "/static/image/productImgs/serdtse-na-pulse/img1.webp", slug: "serdtse-na-pulse" },
    { id: 26, name: "Кулон «Снежинка»", price: 39500, concept: "Природа", category: "Кулон", image: "/static/image/productImgs/snezhinka/img1.webp", slug: "snezhinka" },
    { id: 27, name: "Кулон «Скрипичный ключ»", price: 39500, concept: "Музыка и искусство", category: "Кулон", image: "/static/image/productImgs/skripichnyi-kliuch/img1.webp", slug: "skripichnyi-kliuch" },
    { id: 28, name: "Кулон «Якорь»", price: 41000, concept: "Путешествия и приключения", category: "Кулон", image: "/static/image/productImgs/iakor/img1.webp", slug: "iakor" },
    { id: 29, name: "Кулон «Олимпийские кольца»", price: 42500, concept: "Спорт", category: "Кулон", image: "/static/image/productImgs/olimpiiskie-koltsa/img1.webp", slug: "olimpiiskie-koltsa" },
    { id: 30, name: "Кулон «Рука Фатимы»", price: 45500, concept: "Духовность и вера", category: "Кулон", image: "/static/image/productImgs/ruka-fatimy/img1.webp", slug: "ruka-fatimy" },
    { id: 31, name: "Кулон «Самолёт»", price: 46500, concept: "Путешествия и приключения", category: "Кулон", image: "/static/image/productImgs/samolet/img1.webp", slug: "samolet" },
    { id: 32, name: "Кулон «Штурвал»", price: 48000, concept: "Путешествия и приключения", category: "Кулон", image: "/static/image/productImgs/shturval/img1.webp", slug: "shturval" },
    { id: 33, name: "Кулон «Планета»", price: 48000, concept: "Путешествия и приключения", category: "Кулон", image: "/static/image/productImgs/planeta/img1.webp", slug: "planeta" },
    { id: 34, name: "Бегунок мини", price: 28500, concept: "Минимализм и красота", category: "Бегунок", image: "/static/image/productImgs/begunok-mini/img1.webp", slug: "begunok-mini" },
    { id: 35, name: "Бегунок", price: 55000, concept: "Минимализм и красота", category: "Бегунок", image: "/static/image/productImgs/begunok/img1.webp", slug: "begunok" },
    { id: 36, name: "Колье-невидимка без кулона", price: 28500, concept: "Минимализм и красота", category: "Колье", image: "/static/image/productImgs/kole-nevidimka-bez-kulona/img1.webp", slug: "kole-nevidimka-bez-kulona" },
    { id: 37, name: "Колье-неведимка с мини сердечком", price: 45000, concept: "Любовь и романтика", category: "Колье", image: "/static/image/productImgs/kole-nevidimka-s-mini-serdechkom/img1.webp", slug: "kole-nevidimka-s-mini-serdechkoк" },
    { id: 38, name: "Колье-неведимка с бегунком мини", price: 44000, concept: "Минимализм и красота", category: "Колье", image: "/static/image/productImgs/kole-nevidimka-s-begunkom-mini/img1.webp", slug: "kole-nevidimka-s-begunkom-mini" },
    { id: 39, name: "Колье-неведимка с бегунком", price: 64000, concept: "Минимализм и красота", category: "Колье", image: "/static/image/productImgs/kole-nevidimka-s-begunkom/img1.webp", slug: "kole-nevidimka-s-begunkom" },
    { id: 40, name: 'Кулон Знак зодиака «Овен»', price: 36000, concept: "Знаки зодиака", category: "Кулон", image: "/static/image/productImgs/oven/img1.webp", slug: "oven" },
    { id: 41, name: 'Кулон Знак зодиака «Телец»', price: 36000, concept: "Знаки зодиака", category: "Кулон", image: "/static/image/productImgs/telets/img1.webp", slug: "telets" },
    { id: 42, name: 'Кулон Знак зодиака «Близнецы»', price: 36000, concept: "Знаки зодиака", category: "Кулон", image: "/static/image/productImgs/bliznetsy/img1.webp", slug: "bliznetsy" },
    { id: 43, name: 'Кулон Знак зодиака «Рак»', price: 36000, concept: "Знаки зодиака", category: "Кулон", image: "/static/image/productImgs/rak/img1.webp", slug: "rak" },
    { id: 44, name: 'Кулон Знак зодиака «Лев»', price: 36000, concept: "Знаки зодиака", category: "Кулон", image: "/static/image/productImgs/lev/img1.webp", slug: "lev" },
    { id: 45, name: 'Кулон Знак зодиака «Дева»', price: 36000, concept: "Знаки зодиака", category: "Кулон", image: "/static/image/productImgs/deva/img1.webp", slug: "deva" },
    { id: 46, name: 'Кулон Знак зодиака «Весы»', price: 36000, concept: "Знаки зодиака", category: "Кулон", image: "/static/image/productImgs/vesy/img1.webp", slug: "vesy" },
    { id: 47, name: 'Кулон Знак зодиака «Скорпион»', price: 36000, concept: "Знаки зодиака", category: "Кулон", image: "/static/image/productImgs/skorpion/img1.webp", slug: "skorpion" },
    { id: 48, name: 'Кулон Знак зодиака «Стрелец»', price: 36000, concept: "Знаки зодиака", category: "Кулон", image: "/static/image/productImgs/strelets/img1.webp", slug: "strelets" },
    { id: 49, name: 'Кулон Знак зодиака «Козерог»', price: 36000, concept: "Знаки зодиака", category: "Кулон", image: "/static/image/productImgs/kozerog/img1.webp", slug: "kozerog" },
    { id: 50, name: 'Кулон Знак зодиака «Водолей»', price: 36000, concept: "Знаки зодиака", category: "Кулон", image: "/static/image/productImgs/vodolei/img1.webp", slug: "vodolei" },
    { id: 51, name: 'Кулон Знак зодиака «Рыбы»', price: 36000, concept: "Знаки зодиака", category: "Кулон", image: "/static/image/productImgs/ryby/img1.webp", slug: "ryby" },
    { id: 52, name: "Монеточка", price: 173000, concept: "Минимализм и красота", category: "Монеточка", image: "/static/image/productImgs/monetochka/img1.webp", slug: "monetochka" },
    { id: 53, name: "Гравировка монетки 0.7г", price: 47000, concept: "Минимализм и красота", category: "Монеточка", image: "/static/image/productImgs/gravirovka-monetki-0-7g/img1.webp", slug: "gravirovka-monetki-0-7g" },
    { id: 54, name: "Гравировка монетки 1.1г", price: 68000, concept: "Минимализм и красота", category: "Монеточка", image: "/static/image/productImgs/gravirovka-monetki-1-1g/img1.webp", slug: "gravirovka-monetki-1-1g" },
    { id: 55, name: "Кулон из серебра", price: 10000, concept: "Минимализм и красота", category: "Кулон", image: "/static/image/productImgs/kulon-iz-serebra/img1.webp", slug: "kulon-iz-serebra" },
    { id: 56, name: "Гравировка в серебре", price: 15000, concept: "Минимализм и красота", category: "Монеточка", image: "/static/image/productImgs/gravirovka-v-serebre/img1.webp", slug: "gravirovka-v-serebre" }
];
document.addEventListener("DOMContentLoaded", () => {

    


    let checkboxs = document.querySelectorAll(".basketcheckboxItem");
    let selected = JSON.parse(localStorage.getItem("selectedItems"));
    
    if(!selected){
        selected = Array.from(checkboxs).map(box => box.dataset.id);
        localStorage.setItem("selectedItems", JSON.stringify(selected));
    }
    
    checkboxs.forEach(box => {
        const id = box.dataset.id;
        box.checked = selected.includes(id);
        
        box.addEventListener("click", () => {
            let update = JSON.parse(localStorage.getItem("selectedItems")) || [];
            
            if (box.checked){
                update.push(id);
                rightProduct();
            }
            else{
                update = update.filter(item => item !== id);
                rightProduct();
            }
            localStorage.setItem("selectedItems", JSON.stringify(update));
        })
    })
    rightProduct();
})


let like = document.querySelectorAll(".basketLike")
let nolike = document.querySelectorAll(".basketNoLike")

like.forEach(element => {
    element.style.opacity = "0";
});

function LikeorNo(){
    for(let i = 0; i < like.length; i++){
        id = like[i].dataset.id;
        favorites = document.querySelector("#basketFavoriteProduct").value.slice(1).slice(0, -1).split(', ');
        for(let j = 0; j < favorites.length; j++){
            if(favorites[j] == id){
                Red(favorites[j])
            }
        }
    }
}
function Red(element){
    id = document.querySelector(`#basketLike${element}`)
    noId = document.querySelector(`#basketNoLike${element}`)
    id.style.opacity = `1`;
    id.style.display = `flex`;
    noId.style.opacity = `0`;
    noId.style.display = `none`;
}
LikeorNo()
function Like(event){
    let element = event.currentTarget;
    let Id = element.dataset.id; 
    let productLike = document.querySelector(`#basketLike${Id}`)
    let productNoLike = document.querySelector(`#basketNoLike${Id}`)
    productLike.style.transition = `opacity 0.3s ease-in-out`;
    productNoLike.style.transition = `opacity 0.3s ease-in-out`;
    

    if (productLike.style.display == 'flex') {
        productLike.style.opacity = '0';
        productNoLike.style.display = 'flex';
        setTimeout(() => {
            productNoLike.style.opacity = '1';
        }, 1);
        setTimeout(() => {
            productLike.style.display = 'none';
        }, 300);
    }
    else{
        productNoLike.style.opacity = '0';
        productLike.style.display = 'flex';
        setTimeout(() => {
            productLike.style.opacity = '1';
        }, 1);
        setTimeout(() => {
            productNoLike.style.display = 'none';
        }, 300);
    } 

    fetch('/add_favorite', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({product_id: parseInt(Id)})
    })
    .then(response => response.json())
    .then(data => {
        if (data.success){
            showToast(data.message)
        }
        else{
            showToast(data.error)
        }
    })
}

like.forEach(element => {
    element.addEventListener("click", Like)
});
nolike.forEach(element => {
    element.addEventListener("click", Like)
});

let delete_product= document.querySelectorAll(".basketDelete");
let checkboxs = document.querySelectorAll(".basketcheckboxItem");
function deleteFunc(){
    let element = event.currentTarget;
    let Id = element.dataset.id; 

    checkboxs.forEach((el) => {
        if (el.dataset.id == Id){
            el.checked = false;
        }
    });

    rightProduct();
    

    fetch("/delete_basket", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({product_id: parseInt(Id)})
    })
    .then(response => response.json())
    .then(data => {
        if (data.success){
            removeDiv = document.querySelector(`#card-${Id}`)
            removeDiv.remove();

            let update = JSON.parse(localStorage.getItem("selectedItems")) || [];
            update = update.filter(item => item !== Id);
            localStorage.setItem("selectedItems", JSON.stringify(update));
            showToast(data.message)
        }
        else{
            showToast(data.error)
        }
    })
}
delete_product.forEach(element => {
    element.addEventListener("click", deleteFunc)
});

let divForProduct = document.querySelector("#basketProductsPay");
function rightProduct() {
    let basketPay = document.querySelector("#basketPay");
    let num = 1;
    let sum = 0;
    checkboxs.forEach(box => {
        const productId = box.dataset.id
        const product = allProducts.find(item => item.id == productId);
        
        try {
            let productDiv = document.querySelector(`#basketRightProductId${box.dataset.id}`)
            productDiv.remove();
        } catch (error) {}
        if (box.checked == true){
            let productShow = document.createElement("div");
            productShow.innerHTML += `<p style = "font-size: 1.2rem">${num}. ${product.name} — ${product.price}тг</p>`;
            productShow.classList.add("basketRightProducts");
            productShow.id = `basketRightProductId${productId}`;

            divForProduct.appendChild(productShow)
            num++;
            sum += product.price;
        }
    });
    basketPay.innerHTML = `<h3 style = "font-size: 1.5rem">К оплате — ${sum}тг</h3>`;
}

let messageBth = document.querySelector("#basketWhatsAppBth");
messageBth.addEventListener("click", messageBthFunc)

function messageBthFunc(){
    if (document.querySelector("#basketAddress").value != ``) {
        
        let checkedProductF = document.querySelectorAll(".basketRightProducts");
    
        let checkedProductS = [];
    
        checkedProductF.forEach((e)=>{
            checkedProductS.push(e.innerText.split(" — ")[0].split(". ")[1]);
        })
    
        let allName = document.querySelectorAll(".productName");
        let allColor = document.querySelectorAll(".basketColor");
        let allSize = document.querySelectorAll(".basketSize");
        let allMat = document.querySelectorAll(".basketmaterial");
        
    
        let chet = 1;
        let name = document.querySelector("#basketNamehidden").value;
        let num = 77003360024;
        let text = `Здраствуйте! Меня зовут ${name}. Хочу оформить заказ.%0a`;
        
    
        for(let i = 0; i < allName.length; i++){
            for(let j = 0; j < checkedProductS.length; j++){
                if(allName[i].innerText == checkedProductS[j]){
                    text += `
${chet}) ${allName[i].innerText},%0a
Цвет нити: ${allColor[i].innerText.split(`Цвет нити`)[1]},%0a
Размер: ${allSize[i].innerText.split(`Размер`)[1]},%0a
Материал: ${allMat[i].innerText.split(`Материал`)[1]}%0a
`
                    chet++;
                }
            }
        }
        text += `Удобна доставка на адрес ${document.querySelector("#basketAddress").value}`
    
        window.open(`https://wa.me/${num}?text=${text}`, '_blank');
    }
    else{
        formAddress.style.display=`block`;
        setTimeout(() => {
            formAddress.style.opacity = `1`;
            showToast("Адрес не указан");
        }, 1);
    }
}

let bthAdd = document.querySelector("#ProfilAddBth");
bthAdd.addEventListener('click', ()=>{
    formAddress.style.opacity = `0`;
    setTimeout(() => {
        formAddress.style.display = `none`;
    }, 300);


    let name = document.querySelector("#basketName");
    let city = document.querySelector("#basketCity");
    let street = document.querySelector("#basketStreet");
    let home = document.querySelector("#basketHome");
    let flat = document.querySelector("#basketFlat");

    fetch('/add_address', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({name: name.value, city: city.value, street: street.value, home: home.value, flat: flat.value})
      })
        .then(response =>response.json())
        .then(data => {
          if(data.success){
            document.querySelector("#basketAddress").value = data.address;
            showToast(data.message);
          }
          else{
            showToast(data.error)
          }
    })
})

let formAddress = document.querySelector("#ProfilAddSplit");
formAddress.style.opacity = `0`;
formAddress.style.display = `none`;
formAddress.style.transition = `opacity 0.3s ease-in-out`
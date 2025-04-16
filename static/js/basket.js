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
function deleteFunc(){
    let element = event.currentTarget;
    let Id = element.dataset.id; 

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
    let checkboxs = document.querySelectorAll(".basketcheckboxItem");
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
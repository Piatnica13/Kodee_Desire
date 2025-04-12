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
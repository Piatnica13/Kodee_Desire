setTimeout(() => {
    MainContener.style.transition = `opacity 1s ease-in-out`;
    MainContener.style.opacity = "1";
    setTimeout(()=>{
        MainContener.style.transition = `opacity 0.3s ease-in-out`;
    }, 1001);
}, 300);

let slider = document.querySelector('#slider')
let sliderWCtr = slider.querySelector(".slider-with-ctr")
let listSlide = slider.querySelector(".list-slide")
let navigator = slider.querySelector('.option-list')
let currentWidth = listSlide.clientWidth
let totalItem = navigator.querySelectorAll('.option').length
let totalWidth = totalItem *currentWidth
let nextBtn = sliderWCtr.querySelector('.next')
let prevBtn = sliderWCtr.querySelector('.prev')
let left = 0
let index = 0
nextBtn.onclick = function(){
    left = left - currentWidth
    if(-left >= totalWidth){
        left = 0
    }
    listSlide.style.left = left +'px'

    index = -(left / currentWidth)
    updateNav(navigator, index)
}
  
prevBtn.onclick = function() {
    left = left + currentWidth
    if(left > 0 ){
        left = -(totalWidth- currentWidth)
    }
    listSlide.style.left = left +'px'

    index = -(left / currentWidth)
    updateNav(navigator, index)
}

let autolook = setInterval(function(){
    nextBtn.click()
},3000)
sliderWCtr.addEventListener('mouseenter', function(){
    clearInterval(autolook)
})
sliderWCtr.addEventListener('mouseleave', function(){
    autolook = setInterval(function(){
        nextBtn.click()
    },3000)
})
navigator.addEventListener('mouseenter', function(){
    clearInterval(autolook)
})
navigator.addEventListener('mouseleave', function(){
    autolook = setInterval(function(){
        nextBtn.click()
    },3000)
})
window.onresize = updateWidthSlide

   
// define function
function updateNav(navigator, index) {
    navigator.querySelector('.selected').setAttribute('class', 'option')
    navigator.querySelectorAll('li')[index].setAttribute('class', 'option selected')
}
function changeSlide(event) {
    
    let currentWidth = slider.querySelector('.slide').clientWidth
    let index = event.target.getAttribute('data-id')
    index = Number(index)
    left = -(index) * currentWidth
    listSlide.style.left = left +'px'
    updateNav(navigator, index)
}
function updateWidthSlide() {
    const nextWidth = slider.querySelector('.slide').clientWidth// trong function dinh nghia thi ko lo ve select
    currentWidth = nextWidth//screen change -> slideWidth change
    totalWidth = totalItem*currentWidth // thay doi tong width de so sanh 
    left = -index*currentWidth  // width thay doi -> left phai thay doi , lien tương người béo
    listSlide.style.left = left +'px' // thay đổi  ngay khi cap nhật khung hình
}
//1. nếu đặt nhiều onLoad sẽ bị replace

//2. file js đặt cuối html thì sẽ select dom được vì nó load lần lượt

//3. nếu 1 biến nào đó lưu gt select mà phần tử select được load -> khai báo ở ngoài và select ở trong

//4. trong 1 function định nghĩa(tính cả th function th1 và function trong hàm addEvent ở th 2) có thể select dom đến mọi thẻ kể cả thẻ chưa kịp load vì function chỉ ở dạng định nghĩa chỉ khởi chạy khi bắt sự kiện




//1. sử dụng onClick = 'fn(event)' thì bắt buộc phải đặt ở ngoài onLoad nếu ko html đọc đến sẽ báo fn undefined
//sử dụng trong th nhiều nút chung 1 sự kiện và nếu btn đó là thẻ được render bởi filejs khác ta ko phải lo về việc để trong onload 

//2. btn.addEvent.. sử dụng ở ngoài onLoad khi btn là thẻ được render sẵn 
//  khi btn là thẻ được render bởi file phải sd trong onload khai báo biến ở ngoài(để sd rộng), select ở trong 
// let btn 
// window.onload = function() {
//     btn = document.querySelector('#home .products-content .feature-products__btn')
//     btn.addEventListener('click',function() {
//         console.log('123')
//     })
// }




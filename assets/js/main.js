let products = []
const api = 'http://localhost:8000/api'
const apiJ = 'http://localhost:3000'

const homeCategory = document.querySelector('#home .main .category__list')
const allProducts = document.querySelector('#home .main .feature-products .products-content')
const hotProducts = document.querySelector('#home .main .hot-products .products-content')
async function getSlider() {
    const slides = document.querySelector('#slider .list-slide')
    const data = await axios.get(`${apiJ}/slider`)
    let x=''
    data.data.some(d => {
        x+=`
        <div class="slide">
            <div class="row slide-content">
                <div class="col l-6 m-6 c-12">
                    <div class="slide__info">
                        <h1 class="slide__title">${d.title}</h1>
                        <h2 class="slide__name">${d.name}</h2>
                        <a href=${d.link} class="slide__btn">Xem chi tiet</a>
                    </div>
                </div>
                <div class="col l-6 m-6 c-12">
                    <img class="slide__img--default" src="./assets/img/home/girl1.jpg" alt="">
                    <img class="slide__img" src=${d.image} alt="">
                </div>
            </div>
        </div>
        `
        slides.innerHTML = x
    });
}
async function getHomeCategory() {
    let x = ''
    let data = await axios.get(`${apiJ}/category`)
    data.data.forEach(d => {
        x+= `
        <li class="category__item"  onclick='filter(event, {filterBy: "category",val: ${d.id}})'>
            <a class="category__link">${d.name}</a>
        </li>
        `
        homeCategory.innerHTML = x
    });
}
async function getAllProduct() {
    let x = ''

    const cateArr = await axios.get(`${api}/category`)
    const idCateArr = await cateArr.data.map(c => c.id)
    //lay theo id
    const requests = await idCateArr.map(id => axios.get(`${api}/category/${id}/product`))
    const res = await Promise.all(requests)
    const data = await res.map(r => r.data)
    
    data.forEach(d => {
        products = [...products,...d]
    })
    products.forEach(d => {
        x+= `
            <div class="col l-4 m-12 c-12">
                <div class="feature-product__item">
                    <img onclick="getDetailProduct(${d.id},${d.category})" class="feature-product__img" src=${d.image} alt="">
                    <div class="feature-products__info">
                        <h1 onclick="getDetailProduct(${d.id},${d.category})" class="feature-products__name">${d.name}</h1>
                        <span class="feature-products__price">${d.price}</span>
                        <button class="feature-products__btn btn">
                            <i class="fas fa-shopping-cart"></i>
                            Add to cart
                        </button>
                    </div>
                </div>
            </div>` 
        allProducts.innerHTML = x  
    })
}
async function getAllProduct_json() {
    const data = await axios.get(`${apiJ}/newProduct`)
    
    products = data.data
    console.log(products)
    render(products, allProducts)
}
// async function postProduct() {
//     let x  = {
//         name: "Btuart Grady IIpp",
//         image: "https://upload.wikimedia.org/wikipedia/vi/1/1d/N%C6%A1i_n%C3%A0y_c%C3%B3_anh_-_Single_Cover.jpg",
//         createAt: "2020-05-06T18:48:45.884Z",
//         price: "$45",
//         sale: "45",
//         category: "2"
//       }// K CAN ID
//     // const cate3 = await axios.post(`${apiJ}/productAll`,x)
//     // const cate3 = await axios.delete(`${apiJ}/productAll/3`)
//     // const cate3 = await axios.put(`${apiJ}/productAll/1`,x)


      
//     console.log(cate3.data)
// }
async function getHotProduct() {
    let x = ''
    const data = await axios.get(`${apiJ}/ban_chay`)
    console.log(data.data)
    render(data.data,hotProducts)
}
function render(data,element) {//3 kieu render, 1:renderForm 2: render(data,element) 3:render(data1,data2,element)
    let x = ''
    data.forEach(d => {
        x+= `
        <div class="col l-4 m-12 c-12">
            <div class="feature-product__item">
                <div class="feature-product__img-wrap" onmouseenter="showDetail(event)" onmouseleave="closeDetail(event)">
                <div class="feature-product__detail">
                    <div class="feature-product__overlay">
                    </div>
                    <div class="feature-product__detail-ctr">
                        <p onclick="getDetailProduct('${d.id}','${d.category}')">Xem chi tiết</p>
                        <i onclick="toggle(event)" class="far fa-heart"></i>
                    </div>
                </div>
                <img onclick="getDetailProduct('${d.id}','${d.category}')" class="feature-product__img" src=${d.image} alt="">
                </div>
                <div class="feature-products__info">
                    <h1 class="feature-products__name" onclick="getDetailProduct('${d.id}','${d.category}')">${d.name}</h1>
                    <span class="feature-products__price">${d.price}</span>
                    <button class="feature-products__btn btn">
                        <i class="fas fa-shopping-cart"></i>
                        Add to cart
                    </button>
                </div>
            </div>
        </div>
        `
        element.innerHTML = x
    })
}

async function searchProduct(event) {
    let btn = event.target
    let search = btn.parentNode.querySelector('.feature-products__input')
    inputVal = search.value
    if(inputVal) {// co gia tri nhap
        if(inputVal.trim()) {// chuoi hop le
            let filterProducts = products.filter(p => p.name.toLowerCase().indexOf(inputVal.toLowerCase()) > -1 )
            render(filterProducts,allProducts)
            allProducts.innerHTML = filterProducts.length ? x : '<div>Not found</div>'
        } else {//string toan dau cach
            render(products,allProducts)
        }
    } else {//khong nhap
        render(products,allProducts)
    }
}
async function sort(event,sort) {
    let productsSorted = []
    if(sort) {
        if(sort.sortBy === 'name') {
            if(sort.sortVal === 1) {
                productsSorted = products.sort((a,b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0)
                
            } 
        } else if(sort.sortBy === 'price') {
                if(sort.sortVal === 1) {
                    productsSorted = products.sort((a,b) => a.price.slice(1) - b.price.slice(1))
                }
            }
        }
    render(productsSorted,allProducts)
}
async function filter(event, filter) {
    let productsFiltered = []
    if(filter) {
        if(filter.filterBy == 'category') {
            if(filter.val === 1) {
                productsFiltered = products.filter(p => Number(p.category)===1)
                
            } else if(filter.val === 2) {
                productsFiltered = products.filter(p => Number(p.category)===2)
            } else if(filter.val === 3) {
                productsFiltered = products.filter(p => Number(p.category)===3)
            } 
        }
    }
    console.log(productsFiltered)
    render(productsFiltered,allProducts)
}
function getDetailProduct(id, idCate) {
    console.log(id, idCate)
    localStorage.setItem('id', id)//object moi dung JSON.STRING..
    localStorage.setItem('id_cate', idCate)
    window.location.href = './page/detail.html'//thay href lam mat event
}
function toggle(event) {
    if(event.target.getAttribute("class")==="far fa-heart") {
        event.target.setAttribute("class","fas fa-heartbeat")
    } else {
        event.target.setAttribute("class","far fa-heart")
    }
    
}
function showDetail(event) {
    event.target.querySelector(".feature-product__detail").style.animation = "coverImgIn ease-in-out 0.4s forwards"
    event.target.querySelector(".feature-product__img").style.animation = "roomImgIn ease-in-out 0.4s forwards"
}
function closeDetail(event) {
    event.target.querySelector(".feature-product__detail").style.animation = "coverImgOut ease-in-out 0.4s"
    event.target.querySelector(".feature-product__img").style.animation = "roomImgOut ease-in-out 0.4s forwards"
}
getHomeCategory()
getSlider()
// getAllProduct()
getAllProduct_json()
getHotProduct()

const items = [
	{
		id: 1,
		title:'Калифорния хит',
		price: 300,
		weight: 180,
		itemsInBox: 6,
		img: 'california-hit.jpg',
		counter: 1
	},
	{
		id:2,
		title:'Калифорния темпура',
		price: 250,
		weight: 205,
		itemsInBox: 6,
		img: 'california-tempura.jpg',
		counter: 1
	},
	{
		id: 3,
		title:'Запеченый ролл «Калифорния»',
		price: 230,
		weight: 182,
		itemsInBox: 6,
		img: 'zapech-california.jpg',
		counter: 1
	},
	{
		id: 4,
		title:'Филадельфия',
		price: 320,
		weight: 230,
		itemsInBox: 6,
		img: 'philadelphia.jpg',
		counter: 1
	}
]

const state = {
	items: items,
	cart: []
}

const productsContainer = document.querySelector('#productsMainContainer');
const cartItemsContainer = document.querySelector('#cardItemsHolder');
const cartEmptyNotification = document.querySelector('#cartEmpty');
const cartTotal = document.querySelector('#cartTotal');
const makeOrder = document.querySelector('#makeOrder');
const cart = document.querySelector('#cart');
const cartTotalPrice = document.querySelector('#cartTotalPrice');
const deliveryPriceContainer = document.querySelector('#deliveryPriceContainer');
const deliveryMinimalFree = 600
const deliveryCost = 300

const renderItem = function(item) {
	const markup = `
	<div class="col-md-6">
		<div class="card mb-4" data-productid="${item.id}">
			<img class="product-img" src="img/roll/${item.img}" alt="${item.title}">
			<div class="card-body text-center">
				<h4 class="item-title">${item.title}</h5>
				<p><small class="text-muted">${item.itemsInBox} шт.</small></p>

				<div class="details-wrapper">
					<div class="items">
						<div class="items__control" data-click="minus">-</div>
						<div class="items__current" data-count>${item.counter}</div>
						<div class="items__control" data-click="plus">+</div>
					</div>

					<div class="price">
						<div class="price__weight">${item.weight}г.</div>
						<div class="price__currency">${item.price} ₽</div>
					</div>
				</div>

				<button data-click="addToCart" type="button" class="btn btn-block btn-outline-warning">+ в корзину</button>
				
			</div>
		</div>
	</div>`;

	productsContainer.insertAdjacentHTML('beforeend', markup);
}

const renderItemInCart = function(item) {
	const markup = `
	<div class="cart-item" data-productid="${item.id}">
		<div class="cart-item__top">
			<div class="cart-item__img">
				<img src="img/roll/${item.img}" alt="${item.title}">
			</div>
			<div class="cart-item__desc">
				<div class="cart-item__title">${item.title}</div>
				<div class="cart-item__weight">${item.itemsInBox} шт. / ${item.weight}г.</div>

				<div class="cart-item__details">

					<div class="items items--small">
						<div class="items__control" data-click="minus">-</div>
						<div class="items__current" data-count>${item.items}</div>
						<div class="items__control" data-click="plus">+</div>
					</div>

					<div class="price">
						<div class="price__currency">${item.price} ₽</div>
					</div>

				</div>

			</div>
		</div>
	</div>`;

	cartItemsContainer.insertAdjacentHTML('beforeend', markup);
}
state.items.forEach(renderItem);

const itemUpdateCounter = function(id, type){
	const itemIndex = state.items.findIndex(function(element){
		if (element.id == id) {
			return true;
		}
	})
	let count = state.items[itemIndex].counter;
	
	if (type == 'minus') {
		if (count > 1) {
			count--;
			state.items[itemIndex].counter = count;
		}
	}
	if (type == 'plus') {
		count++;
		state.items[itemIndex].counter = count;
	}
}

const itemUpdateCounterInCart = function(id, type){
	const itemIndex = state.cart.findIndex(function(element){
		if (element.id == id) {
			return true;
		}
	})
	let count = state.cart[itemIndex].items;
	
	if (type == 'minus') {
		if (count > 0) {
			count--;
			state.cart[itemIndex].items = count;
		}
		if (count == 0) {
			//удаляем из корзины
			state.cart.splice(itemIndex, 1)
			cartItemsContainer.innerHTML = "";
			state.cart.forEach(renderItemInCart);
			
			checkCart()
			calculatetotalPrice();
		}
	}
	if (type == 'plus') {
		count++;
		state.cart[itemIndex].items = count;
	}
}
const itemUpddateViewCounter = function(id){
	const itemIndex = state.items.findIndex(function(element){
		if (element.id == id) {
			return true;
		}
	})
	//блок с карточками . нужная карточка по id . счётчик карточки . меняем текст = обновляем значение счётчика из состояния state
	productsContainer.querySelector('[data-productid="' + id + '"]')
					 .querySelector('[data-count]').innerText = state.items[itemIndex].counter;
}

const itemUpddateViewCounterInCart = function(id){
	const itemIndex = state.cart.findIndex(function(element){
		if (element.id == id) {
			return true;
		}
	})
	//если карточка удаляется, то значение счётчика не считываем
	if (itemIndex != -1) {
		//блок с карточками . нужная карточка по id . счётчик карточки . меняем текст = обновляем значение счётчика из состояния state
		cartItemsContainer.querySelector('[data-productid="' + id + '"]')
						  .querySelector('[data-count]').innerText = state.cart[itemIndex].items;
	}
}

const checkCart = function (){
	if (state.cart.length > 0) {
		// console.log(state.cart.length);
		cartEmptyNotification.style.display = 'none';
		cartTotal.style.display = 'block';
		makeOrder.style.display = 'block';
	} else {
		cartEmptyNotification.style.display = 'block';
		cartTotal.style.display = 'none';
		makeOrder.style.display = 'none';
	}
}

const addToCart = function (id){
	const itemIndex = state.items.findIndex(function(element){
		if (element.id == id) {
			return true;
		}
	})

	const itemIndexInCart = state.cart.findIndex(function(element){
		if (element.id == id) {
			return true;
		}
	})
	//если такого товара ещё нет в корзине
	if (itemIndexInCart == -1) {
		const newItem = {
			id: state.items[itemIndex].id,
			title:state.items[itemIndex].title,
			price: state.items[itemIndex].price,
			weight: state.items[itemIndex].weight,
			itemsInBox: state.items[itemIndex].itemsInBox,
			img: state.items[itemIndex].img,
			items: state.items[itemIndex].counter
		}
		state.cart.push( newItem );
		
	} else {
		//если товар уже есть
		state.cart[itemIndexInCart].items += state.items[itemIndex].counter; 
	}
	state.items[itemIndex].counter = 1;
	itemUpddateViewCounter(id);

	cartItemsContainer.innerHTML = "";
	state.cart.forEach(renderItemInCart);
	checkCart()
	calculatetotalPrice();
}



const calculatetotalPrice = function(){
	let totalPrice = 0;
	state.cart.forEach(function(element){
		const thisPrice = element.items * element.price;
		totalPrice+= thisPrice;
	});
	state.totalPrice = totalPrice;
	cartTotalPrice.innerText = totalPrice;
	calculateDelivery();
}

const calculateDelivery = function(){
	if (state.totalPrice >= deliveryMinimalFree) {
		deliveryPriceContainer.innerText = 'бесплатно';
		deliveryPriceContainer.classList.add('free');
	} else {
		deliveryPriceContainer.innerText = deliveryCost + ' ₽';
		deliveryPriceContainer.classList.remove('free');
	}
}

productsContainer.addEventListener('click', function(e){
	if (e.target.matches('[data-click="minus"]')) {
		const id = e.target.closest('[data-productid]').dataset.productid;
		itemUpdateCounter(id, 'minus');
		itemUpddateViewCounter(id);
	} else if (e.target.matches('[data-click="plus"]')){
		const id = e.target.closest('[data-productid]').dataset.productid;
		itemUpdateCounter(id, 'plus');
		itemUpddateViewCounter(id);
	} else if (e.target.matches('[data-click="addToCart"]')){
		const id = e.target.closest('[data-productid]').dataset.productid;
		addToCart(id);
	}
});

cart.addEventListener('click', function(e){
	if (e.target.matches('[data-click="minus"]')) {
		const id = e.target.closest('[data-productid]').dataset.productid;
		itemUpdateCounterInCart(id, 'minus');
		itemUpddateViewCounterInCart(id);
		calculatetotalPrice();
	} else if (e.target.matches('[data-click="plus"]')){
		const id = e.target.closest('[data-productid]').dataset.productid;
		itemUpdateCounterInCart(id, 'plus');
		itemUpddateViewCounterInCart(id);
		calculatetotalPrice();
	} 
});

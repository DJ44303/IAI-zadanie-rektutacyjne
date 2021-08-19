'use strict';

var data = {};
window.addEventListener('load', async function(){
	let button = $('button#open');
	let box = $('div#box');
	let closebtn = $('span.closebtn');
	let maxamount = 1;
	let variants = [];
	let defaultprice = 0;

	await $.getJSON("https://store1.gofile.io/download/e42317c3-360b-4a84-82bc-8c8c9582bea2/xbox.json", function(json){
		console.log(json);
		data = json;
	});

	button.click(() => {
		box.css("display", "block")
	})

	closebtn.click(() => {
		box.css("display", "none")
	})

	$('.toast button').click(() => {
		$('.toast').toast('hide');
	})

	$('.count #sub').click(() => {
		$('.count input').val((i, val) => {
			if(maxamount == 0)
				return 0;
			if(val - 1 < 1)
				return 1;
			return val - 1;
		})
	})

	$('.count #add').click(() => {
		$('.count input').val((i, val) => {
			if(parseInt(val, 10) + 1 > maxamount)
				return maxamount;
			return parseInt(val, 10) + 1;
		})
	})

	$('.toast').toast();
	$('#submitbtn').click(() => {
		$('#amount').html($('.count input').val());
		$('.toast').toast('show');
	})

	$(window).click((e) => {
		if( $(e.target).is(box) )
			box.css("display", "none");
	})

	$('.rw4 select').change(() => {
		let val = parseFloat($('.rw4 select').val());
		let diff = variants[val];
		let price = parseFloat(defaultprice) + parseFloat(diff)
		$('.rw2 .price').html(price % 1 === 0 ? price + ",00 zł" : price.toString().replace(".", ",") + " zł");
		if(diff > 0)
			$('.rw2 .price').append(`<span style='color: red'> +${diff % 1 === 0 ? diff.replace(".", ",") + " zł" : diff.toString().replace(".", ",") + " zł"}</span>`)
		if(diff < 0)
			$('.rw2 .price').append(`<span style='color: green'> ${diff % 1 === 0 ? diff.replace(".", ",") + " zł" : diff.toString().replace(".", ",") + " zł"}</span>`)
		if(val == 61){
			$('.carousel-item img')[0].src = "img/xbox-silver-1.png";
			$('.carousel-item img')[1].src = "img/xbox-silver-2.png";
		}
		if(val == 60){
			$('.carousel-item img')[0].src = "img/xbox-black-1.png";
			$('.carousel-item img')[1].src = "img/xbox-black-2.png";
		}
		if(val == 59){
			$('.carousel-item img')[0].src = "img/xbox-white-1.png";
			$('.carousel-item img')[1].src = "img/xbox-white-2.png";
		}
	})

	$('.carousel-control-prev').click(function(){
		$('#carouselSimple').carousel('prev');
		$('#carouselSimple').carousel('pause');
	})

	$('.carousel-control-next').click(function(){
		$('#carouselSimple').carousel('next');
		$('#carouselSimple').carousel('pause');
	})

	$('.title').html(data.product.name);
	$('#toastph').html(data.product.name);

	$('.price').html(data.sizes.items.U.price % 1 === 0 ? data.sizes.items.U.price + ",00 zł" : data.sizes.items.U.price.toString().replace(".", ",") + " zł");
	defaultprice = data.sizes.items.U.price;

	let i = 0;
	for(const [key, value] of Object.entries(data.sizes.items)) {
		if(i === 0){
			if(value.amount > 0)
				$('.rw5 .available').html(`<span style="color: green;font-size: 2.5vh">&check;</span> ${value.status}<br /> ${value.amount} ${value.amount == 1 ? data.sizes.unit_single : data.sizes.unit_plural} w magazynie`);
			else{
				$('.rw5 .available').html(`<span style="color: red;font-size: 2.5vh">&times;</span> ${value.status}`);
				$('.count input').val(0);
				$('.count input')[0].disabled = true;
				$('#submitbtn')[0].disabled = true;
			}
			maxamount = value.amount;
			i++;
		}
		$('.rw3-1').append(`<button id="${value.type}">${value.name}</button>\n`);
		$('.rw3-1 button:last-child').click(function() {
			$('.rw3-1 button.active').removeClass('active');
			$(this).addClass('active');
			if(value.amount > 0){
				$('.rw5 .available').html(`<span style="color: green;font-size: 2.5vh">&check;</span> ${value.status}<br /> ${value.amount} ${value.amount == 1 ? data.sizes.unit_single : data.sizes.unit_plural} w magazynie`);
				$('.count input').val(1);
				$('.count input')[0].disabled = false;
				$('#submitbtn')[0].disabled = false;
			}
			else{
				$('.rw5 .available').html(`<span style="color: red;font-size: 2.5vh">&times;</span> ${value.status}`);
				$('.count input').val(0);
				$('.count input')[0].disabled = true;
				$('#submitbtn')[0].disabled = true;
			}
			maxamount = value.amount;
		})
	}
	$('.rw3-1 button:first-child').addClass('active');

	for(const [key, value] of Object.entries(data.multiversions[0].items)) {
		for(const [key2, value2] of Object.entries(value.values)){
			$('select.version').append(`<option value="${value2.id}">${value2.name}</option>\n`);
			variants[value2.id] = value.products[0].price_difference;
		}
	}
	$('select.version option:first-child')[0].selected = true;

})


	//"localhost:5500/js/xbox.json",
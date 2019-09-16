<template>
	<div id=frame>
		<div id=preload>
			<div class="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
		</div>
		<div class=vidwrap>
			<video id="home-hero-video" width="100%" height="auto" preload autoplay muted playsinline loop>
				<source src="/homemob.mp4" type="video/mp4" media="all and(max-width:600px)">
				<source src="/home.mp4" type="video/mp4">
			</video>
			<div class=vidshader></div>
		</div>
		<div id=viewer :data-count=$store.state.slides.length v-touch:swipe=swiper :data-current=$store.state.id :data-currentsub=$store.state.currentSub :data-postopen="$store.state.modal">
		
			<div :class="'slide '+slide.id" v-for="slide in $store.state.slides" :id="slide.id" :data-slide="slide.img" v-html="slide.mark" :data-dex="$store.state.pages[slide.id].dex">
			</div>
		</div>
		<div id=back @click=novert($event,false) :data-postopen="$store.state.modal" :data-current=$store.state.id><img src=back.svg />{{settings.backText}}</div>
		<div id=next @click=novert($event,true) :data-postopen="$store.state.modal" :data-current=$store.state.id><img src=next.svg />{{settings.nextText}}</div>
		<div id=ex :data-postopen="$store.state.modal">
			<div id=flags>
				<a href=/><img src=flag_us.jpg /></a>
				<a href=/fr><img src=flag_fr.jpg /></a>
				<a href=/cr><img src=flag_cr.jpg /></a>
			</div>
			<h4 @click="mob" :data-current="$store.state.id" :class="'sub_'+$store.state.currentSub">{{settings.exploreText}}</h4>
			<a id="burger" @click="mob" :data-current="$store.state.id" :class="'sub_'+$store.state.currentSub"></a>
		</div>
		<a href=/ :data-current="$store.state.id" :data-currentsub="$store.state.currentSub" id=logo :data-postopen="$store.state.modal"></a>
		<nav :data-id="$store.state.id" :data-open="$store.state.vert" :data-cursub="$store.state.subdex" :data-currentsub="$store.state.currentSub" :data-postopen="$store.state.modal">
			<!-- {{$store.state.currentSub}}
			{{$store.state.subdex}} -->
			<!-- {{$store.state.sliceTemp}} -->
			<ul id=dots>
				<!-- {{$store.state.id}} -->
				<li v-for="(slide,index) in $store.state.allslides" :class="{'active':index===$store.state.current,'subnav':slide.subs && slide.subs.length > 0}" class=tab :data-slide="slide.id">
				<template v-if="slide.name!=='Activities'">
					<div class=wrap>
						<a @click=tab($event,false) :href="(settings.basePush === '/' ? '/' : settings.basePush+'/')+slide.id+'/'" :data-dex="index"><span class=slidename :data-dex="index">{{ slide.name }}</span><span class=dot :data-dex="index"></span></a>
					</div>
					<ul v-if="slide.subs && slide.subs.length > 0" class=subdots>
						<li v-for="(sub,index) in slide.subs" :data-slide="slide.id" >
							<a @click=tab($event,true) :data-subdex="index" :data-subid=sub.id><span class=subname :data-subdex=index :data-subid=sub.id>{{ sub.name }}</span><span class=subdot :data-subdex=index :data-subid=sub.id></span></a>
						</li>
					</ul>
					</template>
					<template v-else>
					<div class=wrap>
						<a @click=tab($event,false) :href="(settings.basePush === '/' ? '/' : settings.basePush+'/')+slide.id+'/'" :data-dex="index"><span class=slidename :data-dex="index">{{ slide.name }}</span><span class=dot :data-dex="index"></span></a>
					</div>
					<ul v-if="slide.subs && slide.subs.length > 0" class=subdots>
						<li v-for="(sub,index) in slide.subs.slice(0,1).concat(slide.subs.slice($store.state.satu,$store.state.dua))" :data-slide="slide.id" >
							<a @click=tab($event,true) :data-subdex="index" :data-subid=sub.id><span class=subname :data-subdex=index :data-subid=sub.id>{{ sub.name }}</span><span class=subdot :data-subdex=index :data-subid=sub.id></span></a>
						</li>
					</ul>
					</template>	
				</li>
			</ul>
		</nav>
		<div id=explore>
			<ul id=menu>
				<li v-for="(slide,index) in $store.state.allslides"><a :class="{'active':index===$store.state.current}" @click=tab($event,false) :data-slide="slide.id" class=tab>{{ slide.name }}</a></li>
			</ul>
			<div id="menu_footer">© 2019 Haiti Takes Root™ | All Rights Reserved | <a href="https://www.starmenusa.com">Making Brands Work™</a></div>
			<img id=flower src=/flower.svg />
			<img id=close src=/close.svg @click="nomob" />
		</div>
		<div id=modal>
		</div>
	</div>
</template>
<script>
const imagesloaded = require('imagesloaded')
const serialize = require('form-serialize')
const axios = require('axios')
const moment = require('moment')
let nomode = false
//change this to set staging vs production
// let baseURL = 'https://staging2.haititakesroot.org'
let baseURL = 'http://localhost:3000'

//this gets set by the config files under pages/
let basePush = '/'

//this appears to use css rules to re-order the slides. very odd
function cleanOrder(store) {
	let viewer = document.querySelector('#viewer').childNodes
	let slides = store.state.slides
	slides.sort((a,b)=>{
		let keyA = a.order
		if(keyA=='undefined')
			keyA=0
		let keyB = b.order
		if(keyB=='undefined')
			keyB=0
		return keyA - keyB
	})
}

//jump directly to a specific parent slide & reset subs 
async function goto(id,vuestance) {
	let store = vuestance.$store
	let settings = vuestance.settings
	let view = document.querySelector('#viewer')
	let targ = null
	for(var i=0; i<view.childNodes.length; i++) {
		if(view.childNodes[i].id==id) {
			targ = i
		}
	}
	//store.commit('setCur',dex)
	let first = document.querySelector('.slide')
	let newMarg = targ * -100
	first.style.marginLeft = newMarg + '%'
	// reset positioning on subs to fix nav issues
	$('.subs').css('transform','')
	$('.subs').css('margin-top','')
	$('.sub').css('margin-top','')
	$('.sub').css('transform','')
	// $('.projmode').css('transform','')
	// $('.projmode').css('margin-top','')
	//reset open projects

	let proj = document.querySelector('.openproj')
	if (proj) {
		proj.style.opacity = '0'
		proj.style.pointerEvents = 'none'
		proj.classList.remove('openproj')
		store.commit('proj',false)
	}

	// let query = ''
	// let urlParams = new URLSearchParams(window.location.search)
	// if (urlParams.has('sub')) {
	// 	query += '?sub='+urlParams.get('sub')
	// 	if (urlParams.has('postid')) {
	// 		query += '&postid='+urlParams.get('postid')
	// 	}
	// }
	if(id=='home') {
		document.querySelector('.vidwrap').style.display = 'block'
		// let endslash = ''
		// if (basePush !== '/') {
		// 	endslash = '/'
		// }
		// window.history.pushState(null,settings.title,settings.baseURL+settings.basePush+endslash+query)
	} else {
		document.querySelector('.vidwrap').style.display = 'none'
		// let base = (settings.basePush === '/' ? '' : settings.basePush)
		// window.history.pushState(null,settings.title+" | "+id,settings.baseURL+base+'/'+id+"/"+query)
	}
}

//helps scrolling
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) {
			func.apply(context, args) 
		}
	};
}

//helps scrolling
const throttle = (func, limit) => {
  let inThrottle
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}
const activitiesScroll=()=>{


}
//navigate between sub sections
const up = (vuestance) => {
	
	let store = vuestance.$store
	let settings = vuestance.settings
	let sub = document.querySelector('.open')
	if(store.state.proj) {
		sub = sub.querySelector('.openproj')
	}
	
	
	
	if (sub) {
		//set hamburger menu class
		let subName = $('.open .sub').filter(':first').attr('id')
		// console.log(store.state.currentSub)
	
	// coalition_board
		if(subName==="impact_stories"||subName==="impact_map"
		||subName==="coalition_board"
		||subName==="coalition_testimonials"
		||subName==="news_calendar"
		||subName==="news_blog"){
				setTimeout(()=>{
		store.commit('choke',false)
	},1100)
			return;
		}
		
		let parentSlide = $('.open').parents('.slide').attr('id')
		// console.log("subName:",subName)
		// console.log(parentSlide)
		var curMarg = Number(sub.style.marginTop.replace(/\D/g,'')) * -1
	
		if (curMarg < 0) {
		// if(curMarg < 0 || window.outerWidth < 770) {
		// console.log(curMarg)		
		// if(parentSlide==='activities'){
		// var curMarg = Number(sub.style.marginTop.replace(/\D/g,'')) * -1
// 		if(store.state.subdex!==1&&store.state.subdex>0&&store.state.satu!==1
// 		&&store.state.dua!==4){
// 	const arraySub=store.state.allslides.filter(a=>a.id==='activities')[0].subs.length
// 				const jumlah=store.state.allslides.filter(a=>a.id==='activities')[0].subs
// 				.slice(store.state.satu,store.state.dua)
// 				.length
							
// store.commit("satu",store.state.satu-1)
// store.commit("dua",store.state.dua-1)

				
// 		}else{
// curMarg += 100;
// 		}
// 	}else{
// 	curMarg += 100;
// 	}
const arraySub=store.state.allslides.filter(a=>a.id==='activities')[0].subs
				// console.log(arraySub)
				const siapa=arraySub[1].id
					const dimana=store.state.allslides.filter(a=>a.id==='activities')[0].subs.slice(store.state.satu,store.state.dua)
					const apa=dimana[0].id
if(parentSlide==='activities'){
	

					if(store.state.subdex===1&&siapa!=apa){
store.commit("satu",store.state.satu-1)
store.commit("dua",store.state.dua-1)
subName = $(`li[data-slide=activities] > a[data-subdex=${store.state.subdex}]`).attr("data-subid")
					}else{
						
store.commit('lowDex')
subName = $(`li[data-slide=activities] > a[data-subdex=${store.state.subdex}]`).attr("data-subid")
					}
				}else{
store.commit('lowDex')
				}
			curMarg += 100;
			sub.style.marginTop = curMarg + 'vh'
			//do not touch the history if we are in a project
			if (!store.state.proj) {
				//reset open projects
				let proj = document.querySelector('.openproj')
				if (proj) {
					proj.style.opacity = '0'
					proj.style.pointerEvents = 'none'
					proj.classList.remove('openproj')
					store.commit('proj',false)
				}
				//fix sub scroll position
				document.querySelector("#"+parentSlide).scrollTop = 0
				let endslash = ''
				if (basePush !== '/') {
					endslash = '/'
				}
				// console.log(store.state.subdex)
				

				
					 
				window.history.pushState(null,settings.title,settings.baseURL+settings.basePush+endslash+parentSlide+'/?sub='+subName)
				
				// store.commit('lowDex')
				store.commit('setCurSub',subName)
				store.commit('setID',parentSlide)
			} else {
				let projslides = document.querySelectorAll('.projslide')
				projslides.forEach(function(item){item.scrollTop = 0})
			}
		} else {
			store.commit('setCurSub','')
			store.commit('setID',parentSlide)
			let endslash = ''
			if (basePush !== '/') {
				endslash = '/'
			}
			
			window.history.pushState(null,settings.title,settings.baseURL+settings.basePush+endslash+parentSlide)
			sub.style.transform="translateY(100%)"
			// console.log(sub.firstElementChild)
			sub.firstElementChild.style.marginTop = '0'
			sub.parentNode.classList.remove('scroller')
			// if(sub.classList.contains('openproj')) {
				
				//reset open projects
				let proj = document.querySelector('.openproj')
				if (proj) {
					proj.style.opacity = '0'
					proj.style.pointerEvents = 'none'
					proj.classList.remove('openproj')
					store.commit('proj',false)
				}
			// } else {
				sub.classList.remove('open')
				store.commit('vert',false)
				// document.querySelector('#back').style.opacity='0'
				// document.querySelector('#back').style.pointerEvents='none'
				// document.querySelector('#next').style.opacity='0'
				// document.querySelector('#next').style.pointerEvents='none'
			// }
		}
		// document.querySelector('#next').style.opacity='0'
		// document.querySelector('#next').style.pointerEvents='none'
	}
	setTimeout(()=>{
		store.commit('choke',false)
	},1100)
}

//navigate between sub sections
const down = (vuestance) => {
	let sub = document.querySelector('.open')
	let store = vuestance.$store
	let settings = vuestance.settings
	// console.log(store.state)
	if(store.state.proj) {
		sub = sub.querySelector('.openproj')
	}
	if (sub) {
		//set hamburger menu class
		let subName = $('#'+store.state.currentSub+'+.sub').attr('id')
		let parentSlide = $('.open').parents('.slide').attr('id')
		if(subName==="impact_stories"||subName==="impact_map"
		||subName==="coalition_board"
		||subName==="coalition_testimonials"
		||subName==="news_calendar"
		||subName==="news_blog"){
			setTimeout(()=>{
		store.commit('choke',false)
	},1100)
			return;
		}
		// console.log("subName:",subName)
		var curMarg = Number(sub.style.marginTop.replace(/\D/g,'')) * -1
		// console.log(sub.style)
		if(curMarg > ((sub.children.length - 1) * -100)) {
			console.log("normal down scroll")
// 				if(parentSlide==='activities'){
// 		var curMarg = Number(sub.style.marginTop.replace(/\D/g,'')) * -1
// 	const arraySub=store.state.allslides.filter(a=>a.id==='activities')[0].subs.length
// console.log(store.state.subdex)
// if(store.state.subdex>2&&store.state.subdex!==arraySub-1&&store.state.satu!==1
// 		&&store.state.dua!==4){
	
// 				// const jumlah=store.state.allslides.filter(a=>a.id==='activities')[0].subs
// 				// .slice(store.state.satu,store.state.dua)
// 				// .length
							
// store.commit("satu",store.state.satu+1)
// store.commit("dua",store.state.dua+1)

				
// 		}else{
// curMarg -= 100;
// 		}
// 	}else{
// 	curMarg -= 100;
// 	}
				curMarg -= 100;			
			sub.style.marginTop = curMarg + 'vh'
			if(parentSlide==='activities'){
				
				
				const arraySub=store.state.allslides.filter(a=>a.id==='activities')[0].subs
				// console.log(arraySub)
				const siapa=arraySub[arraySub.length-1].id
					const dimana=store.state.allslides.filter(a=>a.id==='activities')[0].subs.slice(store.state.satu,store.state.dua)
					const apa=dimana[dimana.length-1].id
					if(store.state.subdex>=3
					&&siapa!==apa
					){
						
store.commit("satu",store.state.satu+1)
store.commit("dua",store.state.dua+1)
	subName = $(`li[data-slide=activities] > a[data-subdex=${store.state.subdex}]`).attr("data-subid")
					}else{
store.commit('hiDex')
	subName = $(`li[data-slide=activities] > a[data-subdex=${store.state.subdex}]`).attr("data-subid")
					}
				}else{
store.commit('hiDex')
				}
				// console.log(store.state.subdex)
			// store.commit('hiDex')
			//do not update the history if we are navigating within a project
			if (!store.state.proj) {
				//reset open projects
				let proj = document.querySelector('.openproj')
				
				if (proj) {
					console.log("po")
					proj.style.opacity = '0'
					proj.style.pointerEvents = 'none'
					proj.classList.remove('openproj')
					store.commit('proj',false)
				}
				// console.log(parentSlide)
				document.querySelector("#"+parentSlide).scrollTop = 0
				store.commit('setCurSub',subName)
				store.commit('setID',parentSlide)
				let endslash = ''
				if (basePush !== '/') {
					endslash = '/'
				}
				console.log(store.state.subdex)
			
				window.history.pushState(null,settings.title,settings.baseURL+settings.basePush+endslash+parentSlide+"/?sub="+subName)
			} else {
				let projslides = document.querySelectorAll('.projslide')
				projslides.forEach(function(item){item.scrollTop = 0})
			}
		}
		if(curMarg == ((sub.children.length - 1) * -100)) {
			console.log("down scroll margin limit")
			
			// document.querySelector('#next').style.opacity='1'
			// document.querySelector('#next').style.pointerEvents='auto'
		}
	}
	setTimeout(()=>{
		store.commit('choke',false)
	},1100)
}

//navigate from one slide or sub to the previous parent slide
const prev = (store,settings) => {
	var view = document.querySelector('#viewer');
	var slide = view.firstElementChild;
	var count = view.dataset.count;
	var curMarg = Number(slide.style.marginLeft.slice(0,-1));
	if(store.state.current!=0) {
		if(curMarg < 0) {
			curMarg += 100;
			slide.style.marginLeft = curMarg+'%';
		}
		store.commit('prev')
		let prevdex = Number(store.state.current)
		let prevID = store.state.allslides[prevdex].id
		let title = store.state.allslides[prevdex].name
		store.commit('setID',prevID)
		//reset current sub counter since this is a main slide navigation)
		store.commit('setCurSub','')
		// reset positioning on subs to fix nav issues
		$('.subs').css('transform','')
		$('.subs').css('margin-top','')
		$('.sub').css('margin-top','')
		$('.sub').css('transform','')
		// $('.projmode').css('transform','')
		// $('.projmode').css('margin-top','')
		//reset open projects
		let proj = document.querySelector('.openproj')
		if (proj) {
			proj.style.opacity = '0'
			proj.style.pointerEvents = 'none'
			proj.classList.remove('openproj')
			store.commit('proj',false)
		}
		if(prevID=='home') {
			document.querySelector('.vidwrap').style.display = 'block'
			let endslash = ''
			if (basePush !== '/') {
				endslash = '/'
			}
			window.history.pushState(null,settings.title,settings.baseURL+settings.basePush+endslash)
			document.title = settings.title
		} else {
			let base = (settings.basePush === '/' ? '' : settings.basePush)
			window.history.pushState(null,settings.title+" | "+title,settings.baseURL+base+'/'+prevID+'/')
			document.title = settings.title+" | "+title
		}
	}
	setTimeout(()=>{
		store.commit('choke',false)
	},800)
}

//navigate from one slide or sub to the next parent slide
const next = async (store,settings) => {
	cleanOrder(store)
	var view = document.querySelector('#viewer');
	var slide = view.firstElementChild;
	var count = view.dataset.count;
	if(store.state.current < store.state.allslides.length - 1) {
		var curMarg = Number(slide.style.marginLeft.slice(0,-1));
		curMarg -= 100;
		slide.style.marginLeft = curMarg+'%';
		store.commit('next')
		//reset current sub counter since this is a main slide navigation
		store.commit('setCurSub','')
		// reset positioning on subs to fix nav issues
		$('.subs').css('transform','')
		$('.subs').css('margin-top','')
		$('.sub').css('margin-top','')
		$('.sub').css('transform','')
		// $('.projmode').css('transform','')
		// $('.projmode').css('margin-top','')
		//reset open projects
		let proj = document.querySelector('.openproj')
		if (proj) {
			proj.style.opacity = '0'
			proj.style.pointerEvents = 'none'
			proj.classList.remove('openproj')
			store.commit('proj',false)
		}
		let nextdex = Number(store.state.current)
		let nextID = store.state.allslides[nextdex].id
		let title = store.state.allslides[nextdex].name
		document.title = settings.title+" | "+title
		store.commit('setID',nextID)
		let base = (settings.basePush === '/' ? '' : settings.basePush)
		window.history.pushState(null,settings.title+" | "+title,settings.baseURL+base+'/'+nextID+'/')
	}
	setTimeout(()=>{
		store.commit('choke',false)
	},800)
}

//helper function to make calls to WP REST API
const loadWPData = async function(type,store,baseurl, callback) {
	let wordpress_api = 'https://wordpress.haititakesroot.org/wp-json/wp/v2/'
	let url = ''
	let lang_dict = {
		'/fr': 7,
		'/cr': 8,
		'/': 6
	}
	if (type == "events") {
		url = 'event'
	} else if (type == "blogposts") {
		url = `posts?categories=${lang_dict[baseurl]}`
	}
	let result = await axios([wordpress_api,url].join(""))
	callback(result.data)
}

//fetch images separately since it takes a while
async function fetchImages(url,id,type) {
	let imageData = await axios(url)
	imageData = imageData.data
	if (type == "blogpost") {
		$('#'+type+'-'+id).find('.'+type+'_image').css('background-image','url('+imageData.media_details.sizes.large.source_url+')')
		$('#'+type+'-'+id).css('background-image','url('+imageData.media_details.sizes.large.source_url+')')
		$('.related_blogpost-'+id).css('background-image','url('+imageData.media_details.sizes.large.source_url+')')
	} else {
		$('.'+type+'-'+id).find('.'+type+'_image').css('background-image','url('+imageData.media_details.sizes.medium.source_url+')')
	}
}

//build the html elements for news+events sections using data from wordpress
async function prepareNews(vuestance) {
	let store = vuestance.$store
	//prevent this script from being run more than once
	store.commit('newsLoaded')
	console.log("preparing news section")
	let $eventsCarousels = $('.events_calendar_carousel')
	let $postsGrid = $('#news_blogposts')
	//loop through events, appending cards as LIs
	for (var ix = 0; ix < store.state.events.length; ix++) {
		let event = store.state.events[ix]
		fetchImages('https://wordpress.haititakesroot.org/wp-json/wp/v2/media/'+event.featured_media,event.id,"event")
		let eventContent = '<li class=event-'+event.id+'><div class=event_image></div><div class=event_content><h4>'+moment(event.event_date).format('MMMM Do, YYYY')+'</h4><h3>'+event.title.rendered+'</h3><h5>'+event.event_location+'</h5><div class=event_excerpt>'+event.excerpt.rendered+'</div></div></li>'
		//special. the "event card" in the blog section only gets the last card, and it's not a carousel. fun stuff
		$eventsCarousels.not('#solo_card').append(eventContent)
		if (ix == store.state.events.length - 1) {
			$('#solo_card').append(eventContent)
		}
	}
	//bind slick classes now that the content is injected
	$eventsCarousels.not('.full_size').not('#solo_card').addClass('sli')
	$('.events_calendar_carousel.full_size').addClass('slicent')
	//this will start the slick initialization process
	vuestance.$forceUpdate()
	for (var ih = 0; ih < store.state.blogposts.length; ih++) {
		let blogpost = store.state.blogposts[ih]
		fetchImages('https://wordpress.haititakesroot.org/wp-json/wp/v2/media/'+blogpost.featured_media,blogpost.id,"blogpost")
		let postclass = ''
		if (ih==0) {
			postclass += ' shorter '
		}
		if (ih > 1 && ih%3 != 0 && ih != 6) {
			postclass += ' smaller '
		}
		if (ih == 5) {
			postclass += ' wider shorter '
		}
		if (ih < 6) {
			postclass += ' visible '
		}
		postclass += ' filtered '
		let categories = ''
		for (var iz = 0; iz < blogpost.categories.length; iz++) {
			categories += blogpost.categories[iz]
			if (iz < blogpost.categories.length - 1) {
				categories += ','
			}
		}
		let related_posts = store.state.blogposts.filter(bp=>{
			if (bp.id == blogpost.id) {
				return false;
			} else {
				let bpcategories = ''
				for (var bpiz = 0; bpiz < bp.categories.length; bpiz++) {
					bpcategories += bp.categories[bpiz]
					if (bpiz < bp.categories.length - 1) {
						bpcategories += ','
					}
				}
				return bpcategories == categories
			}
		})
		let related_posts_content = ''
		for (var ig = 0; ig < 3; ig++) {
			related_posts_content += '<li class="related_blogpost-'+related_posts[ig].id+'"><h4 class=related_post_date>'+moment(related_posts[ig].date).format('MMMM Do, YYYY')+'</h4><h3 class=related_post_title>'+related_posts[ig].title.rendered+'</h3><a data-postid='+related_posts[ig].id+' class="blogpostread_more_link related_post_link">Read More »</a></li>'
		}
		let sitePath = vuestance.settings.baseURL+(vuestance.settings.basePush == '/' ? '/' : vuestance.settings.basePush+'/')
		let facebook_share = 'https://www.facebook.com/sharer/sharer.php?u='+ encodeURIComponent(sitePath+'/news?sub=news_blog&postid='+blogpost.id)
		let twitter_share = 'https://twitter.com/home?status=Check%20out%20this%20blog%20post%20on%20'+encodeURIComponent(sitePath+'/news?sub=news_blog&postid='+blogpost.id)
		let order = (ih >= 1 ? ih +1 : ih)
		let postContent = '<li id=blogpost-'+blogpost.id+' class="'+postclass+'" data-category="'+categories+'" style="order:'+order+'"><div class=blogpost_overlay></div><div class=blogpost_image></div><a class="close_modal close_modal_link">« Return to Blog</a><hr><h4>'+moment(blogpost.date).format('MMMM Do, YYYY')+'</h4><h3>'+blogpost.title.rendered+'</h3><div class=blogpost_excerpt>'+blogpost.excerpt.rendered+'</div><div class=blogpost_content>'+blogpost.content.rendered+'</div><hr><a data-postid='+blogpost.id+' class="read_more_modal blogpost_read_more_link">Read More »</a><div class=blogpost_links><a class="close_modal close_modal_link">« Return to Blog</a><ul class="blogpost_social_share"><li>Share</li><li><a id=facebook_share href='+facebook_share+' ></a></li><li><a id=twitter_share href='+twitter_share+' ></a></li></ul></div><h3 class="curs">more related posts</h3><ul class="blogpost_related_posts">'+related_posts_content+'</ul></li>';
		$postsGrid.append(postContent)
	}
	if (store.state.blogposts.length > 6) {
		$('.news_blog_pager').append('<li id=next_pager data-page=next>Next Page</li>')
	}
	vuestance.$forceUpdate()
}

const blogControl =  function(type,value,store) {
	let resultSet = []
	$('.news_blog_pager').empty()
	// console.log("blogControl type:",type,"value:",value)
	if (type == "search") {
		if (value.length > 0) {
			$('.filtered').removeClass('filtered')
			value = value.toLowerCase()
			resultSet = store.state.blogposts.filter(bp=>{
				if (bp.title.rendered.toLowerCase().includes(value) || bp.content.rendered.toLowerCase().includes(value)) {
					return true;
				}
			})
			for (var iy = 0; iy < resultSet.length; iy++) {
				$('#blogpost-'+resultSet[iy].id).addClass('filtered')
			}
		} else {
			$('#news_blogposts > li').not('#events_card').addClass('filtered')	
		}
	}
	if (type == "filter") {
		if (value != "*") {
			$('.filtered').removeClass('filtered')
			$('#news_blogposts li[data-category="'+value+'"]').addClass('filtered')
		} else {
			$('#news_blogposts > li').not('#events_card').addClass('filtered')
		}
	}
	if (type == "pager") {
		if (value == "next") {
			$('.visible:last').next('.filtered').addClass('marker')
			let $newFirstPost = $('.marker')
			$('.visible').removeClass('visible')
			for (var io = 0; io < 6; io++) {
				if (io == 0) {
					$newFirstPost.addClass('visible')
				} else if($('.visible:last').next('.filtered').length) {
					$('.visible:last').next('.filtered').addClass('visible')
				} else {
					break;
				}
			}
			$('.marker').removeClass('marker')
			$('.news_blog_pager').append('<li id=prev_pager data-page=prev>Previous Page</li>')
			if ($('.visible:last').next('.filtered').length) {
				$('.news_blog_pager').append('<li id=next_pager data-page=next>Next Page</li>')
			}
		} else {
			$('.visible:first').prev('.filtered').addClass('marker')
			let $newFirstPost = $('.marker')
			$('.visible').removeClass('visible')
			for (var iq = 0; iq < 6; iq++) {
				if (iq == 0) {
					$newFirstPost.addClass('visible')
				} else if($('.visible:first').prev('.filtered').length) {
					$('.visible:first').prev('.filtered').addClass('visible')
				} else {
					break;
				}
			}
			$('.marker').removeClass('marker')
			$('.news_blog_pager').append('<li id=next_pager data-page=next>Next Page</li>')
			if ($('.visible:first').prev('.filtered').length) {
				$('.news_blog_pager').append('<li id=prev_pager data-page=prev>Previous Page</li>')
			}
		}
	} else {
		let filteredPosts = $('.filtered')
		$('.news_blog_pager').find('#prev_pager').remove()
		$('.visible').removeClass('visible')
		for (var ihz = 0; ihz < 6; ihz++) {
			$('.filtered:eq('+ihz+')').addClass('visible')
		}
		if ($('.visible:last').next('.filtered').length) {
			$('.news_blog_pager').append('<li id=next_pager data-page=next>Next Page</li>')
		}
	}
	let postclass = ''
	$('#news_blogposts li:not(#events_card)').removeClass("shorter smaller wider")
	for (var ik = 0; ik < 6; ik++) {
		let order = (ik >= 1 ? ik +1 : ik)
		if (ik==0) {
			postclass += ' shorter '
		}
		if (ik > 1 && ik%3 != 0 && ik != 6) {
			postclass += ' smaller '
		}
		if (ik == 5) {
			postclass += ' wider shorter '
		}
		$('.visible:eq('+ik+')').css('order',order)
		$('.visible:eq('+ik+')').addClass(postclass)
		postclass = ''
	}
}

//fetch html content for slides
//also handles data injection for news+events section
const loadSlide = async function(id,vuestance,isPrev) {
	let store = vuestance.$store
	if(!document.querySelector('#'+id)) {
		let file = id
		if (basePush !== '/') {
			file = file + '-' + basePush.split('/')[1]
		}
		let nextMark = await axios(baseURL+'/'+file+'.html')
		let order = Number(store.state.pages[id].dex)
		let img = id + '.jpg' // STATIC MOD FOR PUSH
		let newSlide = {
			id: id,
			mark: nextMark.data,
			img: img,
			order: order
		}
		if(isPrev) {
			store.commit('addPrev',newSlide)
		} else {
			store.commit('addSlide',newSlide)
		}
	}
	cleanOrder(store)
}

// positions sub-sections of slides for viewing, separate from main navigation
const vert = function(id,vuestance,subdex,subid) {
	let store = vuestance.$store
	let settings = vuestance.settings
	const arraySub=store.state.allslides.filter(a=>a.id==='activities')[0].subs
	const indexNew=arraySub.findIndex(a=>a.id===subid)
	if(id==="activities"&&subdex>3){
		store.commit("satu",subdex+1-3)
		store.commit("dua",subdex+1)
subdex=3
	}
	console.log("vert. id:",id,"subdex:",subdex,"subid:",subid)
	$('#'+id+' .subs').addClass('open')
	$('#'+id).addClass('scroller')
	$('.open').css('transform','translateY(0%')
	document.querySelector("#"+id).scrollTop = 0
	// let newMarg = Number(subdex) * -100 + 'vh'
	let newMarg = Number(indexNew) * -100 + 'vh'
	$('.open').css('margin-top',newMarg)
	store.commit('setDex',subdex)
	store.commit('setCurSub',subid)
	store.commit('setID',id)
	//reset open projects
	let proj = document.querySelector('.openproj')
	if (proj) {
		proj.style.opacity = '0'
		proj.style.pointerEvents = 'none'
		proj.classList.remove('openproj')
		store.commit('proj',false)
	}
	store.commit('vert', true)
	let endslash = ''
	if (basePush !== '/') {
		endslash = '/'
	}
	window.history.pushState(null,settings.title,settings.baseURL+settings.basePush+endslash+id+"/?sub="+subid)
	// document.querySelector('#next').style.opacity='1'
	// document.querySelector('#next').style.pointerEvents='auto'
	// document.querySelector('#back').style.opacity='1'
	// document.querySelector('#back').style.pointerEvents='auto'
}

//controls mission how spinner
const spinner = function(e){
	document.getElementById('circle').dataset.cur=e.target.id
	document.getElementById('blocktext').textContent = e.target.dataset.copy
	document.getElementById('green').src = 'green'+e.target.id+'.png'
	document.querySelector('.big').classList.remove('big')
	e.target.classList.add('big')
	if(window.outerWidth < 770) {
		document.querySelector('#shader').style.opacity = '1'
		document.querySelector('#shader').style.pointerEvents = 'auto';
		document.querySelector('#shader').style.height = 'auto';
	}
}

export default {
	props: ['settings'],
	updated() {
		if(process.browser) {
			//this is a new one. seems to bind a bunch of things to the callback on any event?
			if (window.NodeList && !NodeList.prototype.forEach) {
			    NodeList.prototype.forEach = function (callback, thisArg) {
			        thisArg = thisArg || window;
			        for (var i = 0; i < this.length; i++) {
			            callback.call(thisArg, this[i], i, this);
			        }
			    };
			}
			let vuestance = this
			let store = vuestance.$store
			let settings = vuestance.settings
			//click event to take you forward one slide
			let last = document.querySelector('.bindme')
			if(last) {
				last.addEventListener('click',function(e){
					let id = $(e.target).parents('.slide').attr('id')
					if (store.state.currentSub.length > 0) {
						store.commit('choke',true)
						down(vuestance)
					} else {
						let subid = $('#'+id+' .sub:first').attr('id')
						vert(id,vuestance,0,subid)
					}
				})
				last.classList.remove('bindme')
			}
			//click event to take you back to the first slide from within a sub, then down to the first sub
			//this solves a problem when the subs are scrollable
			let subsbind = document.querySelector('.specialbind')
			if(subsbind) {
				subsbind.addEventListener('click',function(e){
					let id = $('.open').closest('.slide').attr('id')
					let subid = $('.open .sub').filter(':first').attr('id')
					goto(id,vuestance)
					vert(id,vuestance,0,subid)
				})
				subsbind.classList.remove('specialbind')
			}
			//click event to rotate the circle icon thing on "mission how" subsection
			let spin = document.querySelectorAll('.bindspin')
			if(spin) {
				spin.forEach(img=>{
					img.addEventListener('click',function(e){
						spinner(e)
					})
				})
			}
			//click event for the "what makes us different" button on the home page
			let rightrow = document.querySelector('.diffbind')
			if(rightrow) {
				rightrow.addEventListener('click',function(e){
					store.commit('choke',true)
					next(store,settings)
				})
				rightrow.classList.remove('diffbind')
			}
			//something for the impact page, stories sub section
			let onbutt = document.querySelectorAll('.bindstoryviewmode')
			if(onbutt) {
				onbutt.forEach(butt=>{
					butt.addEventListener('click',function(e){
						$('#storycont').attr('data-mode',$(e.target).data('view'))
						$('.storyviewmodeon').removeClass('storyviewmodeon')
						$(e.target).addClass('storyviewmodeon')
					})
					butt.classList.remove('bindstoryviewmode')
				})
			}
			// changes out the svg file in the image map/tree section
			let timebutt = document.querySelectorAll('.time')
			if(timebutt) {
				timebutt.forEach(butt=>{
					butt.addEventListener('click',function(e){
						$('.timeon').removeClass()
						$(e.target).addClass('timeon')
						$('#mapmage').attr('src', 'impact_trees_'+$(e.target).data('view')+'.svg')
					})
					butt.classList.remove('time')
				})
			}
			// bind a modal event to a 'pape' element
			// let bindpape = document.querySelectorAll('.bindpape')
			// if(bindpape) {
			// 	bindpape.forEach(pape=>{
			// 		pape.addEventListener('click',async (e)=>{
			// 			let mark = await axios(basePush+'/'+e.target.id+'.html')
			// 			mark = mark.data
			// 			$('#modal').innerHTML = mark
			// 			$('#modal').style.opacity = '1'
			// 			$('#modal').style.pointerEvents = 'auto'
			// 			$('#modeclose').addEventListener('click',e=>{
			// 				nomode()
			// 			})
			// 		})
			// 		pape.classList.remove('bindpape')
			// 	})
			// }
			//event to show the contact form content
			let bindmess = document.querySelector('.bindmess')
			if(bindmess) {
				bindmess.addEventListener('click',e=>{
					document.querySelector('#formcont').classList.add('full')
					document.querySelector('#ex').style.display='none'
					document.querySelector('#nomess').style.display='block'
				})
			}
			//event to hide the contact form content
			let nomess = document.querySelector('#nomess')
			if(nomess) {
				nomess.addEventListener('click',e=>{
					document.querySelector('#formcont').classList.remove('full')
					document.querySelector('#ex').style.display='inherit'
					document.querySelector('#nomess').style.display='none'

				})
			}
			//close the modal overlay
			let noshade = document.querySelector('#closeshade')
			if(noshade) {
				noshade.addEventListener('click',e=>{
					document.querySelector('#shader').style.opacity = '0'
					document.querySelector('#shader').style.pointerEvents = 'none'
				})
			}
			//submit contact form to PHP mail api
			let formcont = document.querySelector('#contactform')
			if(formcont) {
				formcont.addEventListener('submit',async e=>{
					e.preventDefault();
					if(formcont.dataset.off=='false') {
						formcont.dataset.off = 'true'
						setTimeout(function(){
							formcont.dataset.off='false'
						},2000)
						let formdata = serialize(formcont)
						let res = await axios.post('/mailer/mailer.php',formdata)
						formcont.innerHTML="<h2 id=thanks>Thank you for connecting!</h2>"
					}
				})
			}
			//set up slick carousel for single slides
			let sli = $('.sli')
			if(sli.length && sli.not('.slick-initialized').length) {
				sli.not('.slick-initialized').each(function(i){
					let carouselNav = $(this).data('navid')
					$(this).slick({
						variableWidth: true,
						infinite: false,
						slidesToShow: 1,
						appendArrows: carouselNav,
						prevArrow: "<img src=prev.svg class=prevgal />",
						nextArrow: "<img src=nextrow.svg class=nextgal />",
					})
				})
			}
			//set up slick carousel for 3 cell sliders
			let slicent = $('.slicent')
			if(slicent.length && slicent.not('.slick-initialized').length) {
				slicent.not('.slick-initialized').each(function(i) {
					let carouselNav = $(this).data('navid')
					$(this).slick({
						variableWidth: true,
						infinite: true,
						slidesToShow: 3,
						appendArrows: carouselNav,
						prevArrow: "<img src=prev.svg class=prevgal />",
						nextArrow: "<img src=nextrow.svg class=nextgal />",
						responsive: [
							{
								breakpoint: 770,
								settings: {
									slidesToShow: 1,
									slidesToScroll: 1
								}
							}
						]
					})
				})
			}
			//set up slick for 5 cell slider (coalition who section)
			let slilarge = $('.slilarge')
			if(slilarge.length && slilarge.not('.slick-initialized').length) {
				slilarge.not('.slick-initialized').slick({
					// centerMode: true,
					initalSlide: 1,
  					slidesToShow: 5,
					variableWidth: true,
					infinite: false,
					appendArrows: '#coalition_who_carousel_nav',
					// slidesToScroll: 3,
					prevArrow: "<img src=prev.svg class=prevgal />",
					nextArrow: "<img src=nextrow.svg class=nextgal />",
					responsive: [
						{
							breakpoint: 770,
							settings: {
								slidesToShow: 1,
								slidesToScroll: 1
							}
						}
					]
				})
			}

			//bind click event to open modals on grids (impact, activities)
			let readmorelink = $('.read_more_link')
			if (readmorelink.length) {
				readmorelink.on('click',e=>{
					$('.modal_open').removeClass('modal_open')
					let $target = $(e.target)
					let $modal = $target.parents('li')
					$modal.addClass('modal_open')
					$modal.parents('.sub').addClass('modal_open')
					store.commit('toggleModal',true)
					$modal.find('.bind_close_grid_modal').on('click',e=>{
						$('.modal_open').removeClass('modal_open')
						store.commit('toggleModal',false)
					})
					$modal.find('.bind_close_grid_modal').removeClass('close_modal')
				})
				readmorelink.removeClass('read_more_link')
			}
			//bind click event to open modals on news pages
			let readmore = $('.read_more_modal')
			if (readmore.length) {
				readmore.on('click',e=>{
					$('.modal_open').removeClass('modal_open')
					let $target = $(e.target)
					let postid = $(e.target).data('postid')
					let $modal = $target.parents('li')
					$modal.addClass('modal_open')
					$modal.parents('.sub').addClass('modal_open')
					document.querySelector("#news").scrollTop = 0
					store.commit('toggleModal',true)
					let endslash = ''
					if (basePush !== '/') {
						endslash = '/'
					}
					window.history.pushState(null,settings.title,settings.baseURL+settings.basePush+endslash+"news/sub=news_blog&postid="+postid)
					$modal.find('.close_modal').on('click',e=>{
						$('.modal_open').removeClass('modal_open')
						store.commit('toggleModal',false)
						let endslash = ''
						if (basePush !== '/') {
							endslash = '/'
						}
						window.history.pushState(null,settings.title,settings.baseURL+settings.basePush+endslash+"news/?sub=news_blog")
					})
					$modal.find('.close_modal').removeClass('close_modal')
				})
				readmore.removeClass('read_more_modal')
			}
			//bind click for read more link in related posts
			let relatedpostreadmore = $('.related_post_link')
			if (relatedpostreadmore.length) {
				relatedpostreadmore.on('click',e=>{
					$('.modal_open').removeClass('modal_open')
					let postid = $(e.target).data('postid')
					let $modal = $('#blogpost-'+postid)
					$modal.addClass('modal_open')
					$modal.parents('.sub').addClass('modal_open')
					store.commit('toggleModal',true)
					//fix window scroll position
					document.querySelector("#news").scrollTop = 0
					let endslash = ''
					if (basePush !== '/') {
						endslash = '/'
					}
					window.history.pushState(null,settings.title,settings.baseURL+settings.basePush+endslash+"news/?sub=news_blog&postid="+postid)
					$modal.find('.close_modal').on('click',e=>{
						$('.modal_open').removeClass('modal_open')
						store.commit('toggleModal',false)
						let endslash = ''
						if (basePush !== '/') {
							endslash = '/'
						}
						window.history.pushState(null,settings.title,settings.baseURL+settings.basePush+endslash+"news/?sub=news_blog")
					})
					$modal.find('.close_modal').removeClass('close_modal')
				})
			}
			//blog page search
			let blogsearch = $('.blogsearch')
			if (blogsearch.length) {
				blogsearch.on('keyup',e=> {
					blogControl("search",$(e.target).val(),store)
				})
				blogsearch.removeClass('blogsearch')
			}
			//blog page filter
			let blogfilter = $('.blogfilter')
			if (blogfilter.length) {
				blogfilter.on('change', e=>{
					blogControl("filter",$(e.target).val(),store)
				})
				blogfilter.removeClass('blogfilter')
			}
			//blog page paging
			let blogpager = $('.bind_news_blog_pager')
			if (blogpager.length) {
				blogpager.on('click',e=>{
					if ($(e.target).data('page')) {
						blogControl("pager",$(e.target).data('page'),store)
					}
				})
				blogpager.removeClass('bind_news_blog_pager')
			}
			//brings an activities project panel into view when "View Full Project" is clicked
			let bindbox = document.querySelector('.bindbox')
			if(bindbox) {
				bindbox.addEventListener('click',e=>{
					let proj = e.target.dataset.targ
					console.log(proj)
					document.querySelector(proj).style.opacity = '1'
					document.querySelector(proj).style.pointerEvents = 'auto'
					document.querySelector(proj).style.transform = 'translateY(0)'
					document.querySelector(proj).classList.add('openproj')
					store.commit('proj',true)
				})
				bindbox.classList.remove('bindbox')
			}
			//takes you back to the projects "index" page, for when you are viewing a specific project
			let bindallproj = document.querySelector('.bindallproj')
			if(bindallproj) {
				bindallproj.addEventListener('click',e=>{
					let proj = e.target.closest('.sub').querySelector('.projmode')
					proj.style.opacity = '0'
					proj.style.pointerEvents = 'none'
					proj.classList.remove('openproj')
					store.commit('proj',false)
				})
				bindallproj.classList.remove('bindallproj')
			}
			//tooltips for SVG tree on coalition page
			let tooltip = $('.bind_tooltip')
			if(tooltip.length) {
				$('.cls-5').mouseenter(function(e){
					// console.log('test');
					if($(this).attr('data-head')) {
						var newtop = Number($(this).offset().top) + 200;
						var newleft = Number($(this).offset().left);
						var newhead = $(this).attr('data-head');
						var newblurb = $(this).attr('data-blurb');
						tooltip.css('top',newtop + 'px');
						tooltip.css('left',newleft + 'px');
						tooltip.css('opacity','1');
						tooltip.css('pointerEvents','auto');
						tooltip.find('h4').text(newhead);
						tooltip.find('p').text(newblurb);
					}
				})
				$('.cls-5').mouseleave(function(e){
					tooltip.css('opacity','0');
					tooltip.css('pointerEvents','none');
				})
				tooltip.removeClass('bind_tooltip')
			}
			// click to scroll
			// let bindscroll = document.querySelector('.bindscroll')
			// if(bindscroll) {
			// 	bindscroll.addEventListener('click',function(e){
			// 		store.commit('choke',true)
			// 		novert(e,true)
			// 	})
			// 	bindscroll.classList.remove('bindscroll')
			// }
		}
	},
	async created() {
		if(process.browser) {
			let vuestance = this
			nomode = ()=>{
				document.querySelector('#modal').style.opacity = '0'
				document.querySelector('#modal').style.pointerEvents = 'none'
			}
			baseURL = vuestance.settings.baseURL
			basePush = vuestance.settings.basePush
			//the core of the scroll hijack
			
			document.querySelector('#frame').addEventListener('wheel',function(e){
			// document.addEventListener('wheel',function(e){
				if(!vuestance.$store.state.vert) {
					e.preventDefault();
					var view = document.querySelector('#viewer');
					if (e.deltaY > 0 && !vuestance.$store.state.choke) {
						vuestance.$store.commit('choke', true)
						next(vuestance.$store,vuestance.settings)
					} else if (e.deltaY < 0 && !vuestance.$store.state.choke) {
						vuestance.$store.commit('choke', true)
						prev(vuestance.$store,vuestance.settings)
					} else {
						return;
					}
				} else {
					if (vuestance.$store.state.currentSub !== "news_blog") {
					// if(vuestance.$store.state.currentSub !== "news_blog" && window.outerWidth > 770) {
						e.preventDefault();
						if (e.deltaY > 0 && !vuestance.$store.state.choke) {
							vuestance.$store.commit('choke', true)
							down(vuestance)
						} else if (e.deltaY < 0 && !vuestance.$store.state.choke) {
							vuestance.$store.commit('choke', true)
							up(vuestance)
						} else {
							return
						}
					}
				}
			})
			let allslides = vuestance.settings.nav
			// console.log(allslides.filter(a=>a.name==='Activities')[0].subs)
			// vuestance.$store.commit("sliceTemp",allslides.filter(a=>a.name==='Activities')[0].subs.slice(0,4))
			let loaded = []
			let pages = vuestance.$store.state.pages
			// console.log(pages)
			let urlParams = new URLSearchParams(window.location.search)
			//for some reason splitting the pathname returns empty results, so we gotta get rid of those
			let currentPath = window.location.pathname.split("/").filter(function(p){return p.length > 0})
			let id = currentPath[currentPath.length-1]
			let pathBase = currentPath[0]
			// console.log("currentPath",currentPath,"id",id,"pathBase",pathBase,"urlParams",urlParams)
			if(id && (id.length ==0 || pathBase=='fr' || pathBase=='cr')) {
				id='home'
			} else if (!id) {
				id ='home'
			}
			// console.log(id)
			//load all the slides for init + build page array
			for (var ir = 0; ir < allslides.length; ir++) {
				let topSlide = allslides[ir]
				//establish page array for navigation
				pages[topSlide.id] = {dex:ir,subs:{}}
				if (topSlide.subs && topSlide.subs.length > 0) {
					for (var iu = 0; iu < topSlide.subs.length; iu++) {
						let thisSub = topSlide.subs[iu]
						// console.log("topSlide",topSlide,"thisSub",thisSub)
						pages[topSlide.id].subs[thisSub.id] = {subdex: iu}
					}
				}
				//preload content for all slides
				await loadSlide(topSlide.id,vuestance,false)
			}
			//fetch events from WP REST API
			loadWPData("events",vuestance.$store, basePush, async events=> {
				vuestance.$store.commit('storeEvents',events)
				//fetch blogposts from WP REST API
				loadWPData("blogposts",vuestance.$store, basePush, async blogposts=> {
					vuestance.$store.commit('storeBlogposts',blogposts)
					//special: for news, we need to inject the data from the WPData call
					//the files are loaded in as static html, more or less outside of vue
					//so jquery should help us here
					if (!vuestance.$store.state.newsloaded) {
						await prepareNews(vuestance)
					}
					vuestance.$store.commit('loadAll',allslides)
					//moved this down, then back up in an attempt to delay things a bit til after the wp api calls
					//however this function also populates the state for the nav and is necessary for deep linking to work
					vuestance.$store.commit('setPages',pages)
					if(id) {
						let pagedex = pages[id].dex
						vuestance.$store.commit('setID',id)
						document.querySelector('nav').dataset.id = id
						vuestance.$store.commit('setCur',pagedex)
						let title = allslides[pagedex].name
						if (title !== undefined) {
							document.title = "Haiti Takes Root | "+title
						} else {
							document.title = "Haiti Takes Root"		
						}
						goto(id,vuestance)
						//open the correct sub if that param is present
						if (urlParams.has('sub')) {
							let subid = urlParams.get('sub')
							// console.log("pages object",pages)
							let subdex = pages[id].subs[subid].subdex
							// console.log("deep link on slide",id,"load subid",subid,"subdex",subdex)
							vert(id,vuestance,subdex,subid)
							//open blog post if that param is present
							if (urlParams.has('postid')) {
								let postid = urlParams.get('postid')
								$('#blogpost-'+postid).find('.blogpost_read_more_link').click()
							}
						}
					} else {
						vuestance.$store.commit('setID',id)
						vuestance.$store.commit('setCur',0)
						// $store.commit('addSlide',index)
						goto('home',vuestance)
					}
					// let viewer = document.querySelector('#viewer')
					// let video = document.querySelector('#home-hero-video')
					setTimeout(() => {
						document.querySelector('#preload').style.opacity = '0'
						document.querySelector('#preload').style.pointerEvents = 'none'
					},1500)
				})
			})
		}
	},
	methods: {
		//nav function, triggers when clicking a dot or subdot on the nav
		tab: async function(e,sub) {
			e.preventDefault()
			let vuestance = this
			let id = e.target.closest('.tab').dataset.slide
			let pages = vuestance.$store.state.pages
			let curdex = pages[id].dex
			let title = vuestance.$store.state.allslides[curdex].name
			let subs = document.querySelectorAll('.subs')
			document.title = "Haiti Takes Root | "+title
			document.querySelector('#explore').style.opacity='0';
			document.querySelector('#explore').style.pointerEvents='none';
			// document.querySelector('#back').style.opacity='0';
			// document.querySelector('#back').style.pointerEvents='none';
			// document.querySelector('#next').style.opacity='0';
			// document.querySelector('#next').style.pointerEvents='none';
			if(document.querySelector('.open')) {
				// document.querySelector('.open').style.transform = 'translateY(100%)'
				document.querySelector('.open').style.marginTop = '0'
				document.querySelector('.open').parentNode.classList.remove('scroller')
				document.querySelector('.open').classList.remove('open')
			}
			//navigate to the clicked slide
			goto(id,vuestance)
			if(sub) {
				console.log("tab to sub:",sub)
				let subdex = e.target.dataset.subdex
				let subid = e.target.dataset.subid
				let title = vuestance.$store.state.allslides[curdex].subs[subdex].name
				// let subid = vuestance.$store.state.allslides[curdex].subs[subdex].id
				document.title = "Haiti Takes Root | "+title
				vert(id,vuestance,subdex,subid)
			} else {
				vuestance.$store.commit('vert',false)
				vuestance.$store.commit('setID',id)
				vuestance.$store.commit('setCur',curdex)
				vuestance.$store.commit('setCurSub','')
				let base = (vuestance.settings.basePush === '/' ? '' : vuestance.settings.basePush)
				window.history.pushState(null,vuestance.settings.title+" | "+id,vuestance.settings.baseURL+base+'/'+id+"/")
			}
		},
		//triggered when clicking the "next" or "back" buttons
		novert: function(e,showNext) {
			let vuestance = this
			let settings = vuestance.settings
			let store = vuestance.$store
			let open = document.querySelector('.open')
			// this isn't working properly because the "openproj" class isn't assigned
			// this is probably to support multiple projects?
			if(vuestance.$store.state.proj) {
				open = open.querySelector('.openproj')
			}
			store.commit('choke',true)
			let curMarg = false
			if (open) {
				curMarg = Number(open.style.marginTop.replace(/\D/g,'')) * -1
			}
			if (curMarg !== false && showNext && curMarg <= ((open.children.length - 1) * -100)) {
			// if(window.outerWidth < 770 || (showNext && curMarg <= ((open.children.length - 1) * -100))) {
				console.log("novert on mobile or to go to next slide")
				open.style.transform="translateY(100%)"
				open.firstElementChild.style.marginTop = '0'
				open.parentNode.scrollTop = 0
				open.parentNode.classList.remove('scroller')
				open.classList.remove('open')
				store.commit('vert',false)
				// document.querySelector('#back').style.opacity='0'
				// document.querySelector('#back').style.pointerEvents='none'
				// document.querySelector('#next').style.opacity='0'
				// document.querySelector('#next').style.pointerEvents='none'
				if(showNext) {
					next(store,settings)
				} else {
					store.commit('choke',false)
				}
			} else if(curMarg !== false && showNext && curMarg > ((open.children.length - 1) * -100)) {
				//load the next sub
				curMarg -= 100;
				open.style.marginTop = curMarg + 'vh'
				// store.commit('hiDex')
				var nextSub = $('#'+store.state.currentSub+'+.sub').attr('id')
				let parentSlide = $('.open').parents('.slide').attr('id')
				console.log(nextSub,"nextSub novert")
				store.commit('choke',false)
				if (nextSub) {
					//reset open projects
					if(parentSlide==='activities'){
				
				const arraySub=store.state.allslides.filter(a=>a.id==='activities')[0].subs
				// console.log(arraySub)
				const siapa=arraySub[arraySub.length-1].id
					const dimana=store.state.allslides.filter(a=>a.id==='activities')[0].subs.slice(store.state.satu,store.state.dua)
					const apa=dimana[dimana.length-1].id
					if(store.state.subdex>=3
					&&siapa!==apa
					){
						
store.commit("satu",store.state.satu+1)
store.commit("dua",store.state.dua+1)
nextSub = $(`li[data-slide=activities] > a[data-subdex=${store.state.subdex}]`).attr("data-subid")
					}else{
store.commit('hiDex')
nextSub = $(`li[data-slide=activities] > a[data-subdex=${store.state.subdex}]`).attr("data-subid")
					}
				}else{
store.commit('hiDex')
				}
					let proj = document.querySelector('.openproj')
					if (proj) {
						proj.style.opacity = '0'
						proj.style.pointerEvents = 'none'
						proj.classList.remove('openproj')
						store.commit('proj',false)
					}
					//reset sub scroll position
					
					console.log(store.state.subdex)
					document.querySelector("#"+parentSlide).scrollTop = 0
					store.commit('setID',parentSlide)
					store.commit('setCurSub',nextSub)
					store.commit('vert',true)
					let endslash = ''
					if (basePush !== '/') {
						endslash = '/'
					}
					window.history.pushState(null,settings.title,settings.baseURL+settings.basePush+endslash+parentSlide+"/"+'?sub='+nextSub)
				} else {	
					let projslides = document.querySelectorAll('.projslide')
					projslides.forEach(function(item){item.scrollTop = 0})
				}

			} else if (curMarg !== false) {
				console.log("up novert")
				up(vuestance)
			} else {
				let id = vuestance.$store.state.id
				let subid = $('#'+id).find('.subs .sub:first').attr('id')
				vert(id,vuestance,0,subid)
			}
		},
		//for the hamburger "explore" menu
		mob: function(e) {
			document.querySelector('#explore').style.opacity='1';
			document.querySelector('#explore').style.pointerEvents='auto';
		},
		nomob: function(e) {
			document.querySelector('#explore').style.opacity='0';
			document.querySelector('#explore').style.pointerEvents='none';
		},
		//not sure what this is for, appears to set up nav functions for left and right swipe
		swiper: function(e) {
			if(!this.$store.state.vert) {
				console.log('novert in swiper')
				var view = document.querySelector('#viewer');
				var slide = view.firstElementChild;
				var count = view.dataset.count;
				if(e=='left') {
					this.$store.commit('choke', true)
					next(this.$store, this.settings)
				} else if(e=='right') {
					this.$store.commit('choke', true)
					prev(this.$store,this.settings)
				}
			} else {
				//if(e=='top') {
				//	this.$store.commit('choke',true)
				//	down(this.$store)
				//} else if (e=='bottom') {
				//	this.$store.commit('choke', true)
				//	up(this.$store)
				//}
			}
		}

	}
}
</script>







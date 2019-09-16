<template>
	<div class="full">
		<Main :settings=settings />
	</div>
</template>
<script>
import Main from '../components/Main'
import pkg from '../package.json'

export default {
	components: { Main },
	data: function() {
		return {
			settings: {
				// baseURL: 'https://staging2.haititakesroot.org/',
				baseURL: 'http://localhost:3000',
				basePush: '/', 
				backText:'back',
				nextText:'next',
				exploreText:'Explore',
				title:'Haiti Takes Root',
				nav:  [
					//
					{
						id: 'home',
						name: 'Home',
					},
					{
						id: 'mission',
						name: 'Mission',
						subs: [
							{
								id: 'mission_why',
								name: 'Why',
							},
							{
								id: 'mission_how',
								name: 'How',
							}
						]
					},
					{
						id: 'impact',
						name: "Impact",
						subs: [
							{
								id:"impact_about",
								name:"About",
							},
							{
								id:"impact_map",
								name:"Map",
							},
							// {
							// 	id:"impact_stories",
							// 	name: "Stories",
							// },
						]
						// subs: [
							// {
							// 	id:"impact_map",
							// 	name:"Map",
							// },
							// {
							// 	id:"impact_stories",
							// 	name: "Stories",
							// },
						// ]
					},
					{
						id: "coalition",
						name: "Coalition" ,
						subs: [
							{
								id:"coalition_who",
								name:"Who"
							},
							{
						 	       id:"coalition_structure",
						 	       name: 'Guiding Principles',
							},
							// {
							// 	id:"coalition_board",
							// 	name:"Board of Advisors",
							// },
							// {
							// 	id: "coalition_testimonials",
							// 	name: "Testimonials",
							// }
						]
					},
					{
						id: "activities",
						name: "Activities",
						fixedSubsCount: 1,
						maxSubsShowed: 3,
						prevItemsShown: 1, // make 1 to show 1 previous item
						subs: [
							{
								id:"activities_about",
								name: 'About',
							},
							{
								id:"activities_proj1",
								name: 'Project 1',
							},
							{
								id:"activities_proj2",
								name: 'Project 2',
							},
							{
								id:"activities_proj3",
								name: 'Project 3',
							},
							{
								id:"activities_proj4",
								name: 'Project 4',
							},
							{
								id:"activities_proj5",
								name: 'Project 5',
							}
						]
					},
					{
						id: "news",
						name: "News + Events",
						subs: [
							//{
							//	id: "news_calendar",
							//		name: "Calendar",
							//},
							{
								id: "news_blog",
								name: "Blog",
							},
						],
					},
					{
						id: 'contact',
						name: 'Contact',
					},
				],
			}
		}
	}
}
</script>
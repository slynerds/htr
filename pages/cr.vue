<template>
  <div class="full">
    <Main :settings="settings" />
  </div>
</template>
<script>
import Main from "../components/Main";
export default {
  components: { Main },
  data: function() {
    return {
      settings: {
        // baseURL: "https://staging2.haititakesroot.org/",
        baseURL: 'http://localhost:3000',
        basePush: "/cr",
        backText: "Fè bak",
        nextText: "Fè avan",
        exploreText: "Eksplore",
        title: "Ayiti Vèt",
        nav: [
          {
            id: "home",
            name: "Akèy"
          },
          {
            id: "mission",
            name: "Misyon",
            class: "missionfr",
            subs: [
              {
                id: "mission_why",
                name: "POUKISA"
              },
              {
                id: "mission_how",
                name: "Ki Jan"
              }
            ]
          },
          {
            id: "impact",
            name: "Enpak",
            class: "Impactfr",
            subs: [
              {
                id: "impact_about",
                name: "Apwopo"
              },
              {
                id: "impact_map",
                name: "Carte"
              }
              // 	{
              // 		id:"impact_stories",
              // 		name:"Histories"
              // 	}
            ]
          },
          {
            id: "coalition",
            name: "La Coalition",
            subs: [
              {
                id: "coalition_who",
                name: "Kiyès"
              },
              {
                id: "coalition_structure",
                name: "Prensip Ki Mete Nou Sou Pye"
              }
              // {
              // 	id:"coalition_board",
              // 	name:"Counseillers",
              // },
              // {
              // 	id: "coalition_testimonials",
              // 	name: "Témoignages",
              // }
            ]
          },
          {
            id: "activities",
            name: "Activités",
            fixedSubsCount: 1,
            maxSubsShowed: 3,
            prevItemsShown: 1, // make 1 to show 1 previous item
            subs: [
              {
                id: "activities_about",
                name: "KISA"
              },
              {
                id: "activities_proj1",
                name: "Premye Pwojè A"
              },
              {
                id: "activities_proj2",
                name: "2e Pwojè"
              },
              {
                id: "activities_proj3",
                name: "3e Pwojè"
              },
              {
                id: "activities_proj4",
                name: "4e Pwojè"
              },
              {
                id: "activities_proj5",
                name: "5e Pwojè"
              }
            ]
          },
          {
            id: "news",
            name: "Nouvèl Ak Evènman Ki Planifye",
            subs: [
              //	{
              //		id: "news_calendar",
              //		name: "Calendar",
              //	},
              {
                id: "news_blog",
                name: "Blog"
              }
            ]
          },
          {
            id: "contact",
            name: "Kontak"
          }
        ]
      }
    };
  }
};
</script>
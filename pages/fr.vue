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
        baseURL: "http://localhost:3000",
        basePush: "/fr",
        backText: "précédent",
        nextText: "suivant",
        exploreText: "Explorer",
        title: "Haiti Prend Racine",
        nav: [
          {
            id: "home",
            name: "Accueil"
          },
          {
            id: "mission",
            name: "Notre Mission",
            class: "missionfr",
            subs: [
              {
                id: "mission_why",
                name: "Pourquoi"
              },
              {
                id: "mission_how",
                name: "Comment"
              }
            ]
          },
          {
            id: "impact",
            name: "Impact",
            class: "Impactfr",
            subs: [
              {
                id: "impact_about",
                name: "A propos"
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
                name: "Qui"
              },
              {
                id: "coalition_structure",
                name: "Principes Directeurs"
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
                name: "Quoi"
              },
              {
                id: "activities_proj1",
                name: "Projet Un"
              },
              {
                id: "activities_proj2",
                name: "Projet Deux"
              },
              {
                id: "activities_proj3",
                name: "Projet Verts"
              },
              {
                id: "activities_proj4",
                name: "Projet Quatre"
              },
              {
                id: "activities_proj5",
                name: "Projet Cinq"
              }
            ]
          },
          {
            id: "news",
            name: "Nouvelles Et Événements",
            subs: [
              //{
              //	id: "news_calendar",
              //	name: "Calendar",
              //},
              {
                id: "news_blog",
                name: "Blog"
              }
            ]
          },
          {
            id: "contact",
            name: "Contact"
          }
        ]
      }
    };
  }
};
</script>
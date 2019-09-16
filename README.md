***htr
REPO NOTES:
***
***get local deps:
npm install
***
***build site for deploy, everything compiles to "dist/"
npm run generate
local server is broken, consult nuxtjs.org/guide/commands/
***
***"components/Main.vue" is the app itself. used to be 5 duplicated files, I consolidated into one. still needs a lot of TLC. all the logic, for scrolling, etc, is here. i removed the css to sass files to make things easier to work on and reduce the insane redundancies
***
***scss files relocated under assets/scss, main file is assets/new.scss
after my computer died, I lost my source code for the site and had to rebuild from scratch
recovery.scss is a sass file i generate by decompiling a production css file that was on the server. as such, everything is in one file and most of my reorganization effort was lost. I've left my original scss files here for reference in case you want to try and reorganize everything for a third time
***
***"pages/" are the main entry points for the app. This is where he used to have all the code that's now in main.vue. I split the french and english sites into two entry points here to make things more manageable. its not perfect, but again moving fast
***
***"static/" folder holds...a lot. images and html assets mostly. the raw content for each individual slide can be found here, for example, "mission.html"
this is the biggest problem with this app. none of the actual website pages are vue templates. they're just plain, dumb html that gets loaded in by ajax when the site loads. It's terrible. It used to be worse. 
the french and creole translations are broken down page by page as well, for example activities-fr.html
I was almost done with the french translations, have not started the final creole translations
Use the english pages as your point of authority for creating translations. for the french site i was actually starting with a fresh copy of the english site code. I've made subtle changes throughout the site that would be a pain to track otherwise
Make sure to review the english text as well. They made changes there for the final site as well!
***
***the wordpress api needs an additional option for the translations. lots of ways to do this, but the easiest would probably be to create a new category for language (english, creole, french) and add that to the initial api call. consult the wordpress rest api for reference about adding category filters to the call
you could also filter clientside, since the current call just returns all the events/blogposts. that's less desireable for obvious reasons
***
***content for the modals on the impact+coalition pages is in bad shape. lots of duplicate+hard-coded content since I wasn't able to flesh out a proper content loading system. the previous developer seems to have started this, I think there might be a way to leverage the same modal script that the form on the contact page uses, and the same loading technique used by the main pages to dynamically fetch the modal content
***
***BEWARE the dekstop vertical nav!!! This thing is a lot more tempermental than it looks. I ultimately had to resort to manually positioning each element for each sub section to get everything working, and it's still not perfect. I've raised concerns about adding more than 4 sub-sections to the nav, since that's the most I've done any work to support up to this point. Expect things to break when adding/removing sub-sections, even in seemingly unrelated sub sections. I believe this is partially due to actual rendering glitches because no amount of testing ive done yeilds consistent resulsts. 
***
***There is a new page that was not included in original mockups. the "Impact About" page should be easy enough to set up. I haven't actually seen the design but it sounds like you can just copy the layout from the impact home page to get started
***
***WEB SERVER NOTES
to deploy the site, change the environment variables under all pages/.vue templates to the desired hostname
ive tried to get around this multiple ways but never could get past doing it this way 
copy "dist/" folder to your web server after you run "npm run generate"
most of the files will get overwritten but there will be some leftover compiled files you may want to clean up
staging.haititakesroot.org is under public_html/staging/
wordpress.haititakesroot.org is under public_html/wordpress/ 
that's the wordpress site in use as an api for for blogs+events section under /news/
credentials to login are on asana (somewhere)
www.haititakesroot.org is under public_html/
be careful when deploying the live site that you don't delete the wordpress site or staging sites
***# vuenuxt

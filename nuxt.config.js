const pkg = require('./package')

module.exports = {
  mode: 'universal',
  env: {
    // baseUrl: 'https://www.haititakesroot.org',
    // baseUrl: 'https://staging2.haititakesroot.org/',
    baseUrl: 'http://localhost:3000'
  },
  router: {
    base: '/'
  },
  generate: {
    minify: false,
    routes: [
      '/',
      'mission/',
      'impact/',
      'coalition/',
      'news/',
      'activities/',
      'contact/'
    ]
  },
  html: {
    minify: {
      minifyCSS: false,
      minifyJS: false
    }
  },
  /*
   ** Headers of the page
   */
  head: {
    title: 'Haiti Takes Root',
    meta: [{
      charset: 'utf-8'
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1'
    },
    {
      hid: 'description',
      name: 'description',
      content: pkg.description
    },
    {
      hid: 'robots',
      name: 'robots',
      content: 'noindex'
    }
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    },
    // { rel: 'stylesheet', type:'text/css', href:'/global.css' },
    {
      rel: 'stylesheet',
      type: 'text/css',
      href: 'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css'
    }
    ],
    script: [{
      src: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js'
    },
    {
      src: '/mailer.js'
    },
    //{ src: '/stage/tree.js' },
    {
      src: 'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js'
    }
    ]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#FFFFFF'
  },

  /*
   ** Global CSS
   */
  css: [
    '@/assets/new.scss'
  ],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [{
    src: '~plugins/touch'
  }],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    // Doc:https://github.com/nuxt-community/modules/tree/master/packages/bulma
    // '@nuxtjs/bulma'
  ],
  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  /*
   ** Build configuration
   */
  build: {
    postcss: {
      plugins: {
        'postcss-preset-env': {}
      }
    },
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {

    }
  }
}
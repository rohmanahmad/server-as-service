const mix = require('laravel-mix')
const fs = require('fs')
require('laravel-mix-purgecss')
const theme = 'default'

mix.riot = (entry, output, options) => {
    mix.webpackConfig({
        module: {
            rules: [{
                test: /\.riot$/,
                exclude: /node_modules/,
                use: [{
                    loader: '@riotjs/webpack-loader',
                    options: {
                        hot: false,
                    }
                }]
            }]
        }
    })

    return mix.js(entry, output)
}

const assetUrl = (paths, path) => {
    return paths['/public/' + path].replace(/\/public\//, '')
}

mix
    .sass(`app/themes/${theme}/scss/bracket.scss`, 'public/css/all.css')
    .riot('app/main.js', 'public/js')
    .copyDirectory(`app/themes/${theme}/vendor/ionicons/fonts`, 'public/fonts')
    .styles([
        `app/themes/${theme}/vendor/ionicons/css/ionicons.min.css`,
        `app/themes/${theme}/vendor/flatpickr/flatpickr.min.css`,
        'node_modules/sweetalert2/dist/sweetalert2.min.css',
        `app/themes/${theme}/vendor/spiner/spiner.css`,
        `app/themes/${theme}/css/custom.css`
    ], 'public/css/vendor.css')
    .copyDirectory(`app/themes/${theme}/images`, 'public/images')
    .copyDirectory(`app/themes/${theme}/vendor/tinymce`, 'public/lib/tinymce')
    .copyDirectory(`app/themes/${theme}/vendor/font-awesome-4.7.0/css`, 'public/lib/fa4/css')
    .copyDirectory(`app/themes/${theme}/vendor/font-awesome-4.7.0/fonts`, 'public/lib/fa4/fonts')
    .copy(`app/themes/${theme}/vendor/popper.js`, 'public/lib')
    .copy(`app/themes/${theme}/vendor/bootstrap.js`, 'public/lib')
    .copy(`app/themes/${theme}/vendor/daterangepicker/daterangepicker.min.js`, 'public/lib')
    .copy(`app/themes/${theme}/vendor/daterangepicker/daterangepicker.css`, 'public/css')
    .copy(`app/themes/${theme}/vendor/moment.min.js`, 'public/lib')
    .copy(`app/themes/${theme}/vendor/jquery-3.6.0.min.js`, 'public/lib')
    .copy(`app/themes/${theme}/vendor/sweetalert2.js`, 'public/lib')
    .copy(`app/themes/${theme}/vendor/xlsx.full.min.js`, 'public/lib')
    .copy(`app/themes/${theme}/vendor/select2/select2.css`, 'public/css')
    .copy(`app/themes/${theme}/vendor/select2/select2.min.js`, 'public/lib')
    .copy(`app/themes/${theme}/css/custom.css`, 'public/css')
    .copy(`app/themes/${theme}/css/font.css`, 'public/css')
    .copy(`app/themes/index.html`, 'public')
    .extract(['riot', 'store'])
    .webpackConfig({
        module:{
            rules: [{
                test: /\.lib\.js$/,
                use: ['script-loader']
            }]
        },
        resolve: {
            alias: {
                package: path.resolve(__dirname, 'package.json'),
                appmodules: path.resolve(__dirname, 'app/modules'),
                appcomponents: path.resolve(__dirname, 'app/components'),
                applayout: path.resolve(__dirname, 'app/layouts'),
                apphelpers: path.resolve(__dirname, 'app/helpers'),
                appsdk: path.resolve(__dirname, 'app/modules/sdk'),
            }
        }
    })

mix.then(() => {
    var json = fs.readFileSync(path.join(__dirname, 'mix-manifest.json'))
    var paths = JSON.parse(json)
    var html = fs.readFileSync(path.join(__dirname, 'public/index.html'), "utf8")
    html = html.replace(/"css\/all.css.*"/, '"' + assetUrl(paths, 'css/all.css') + '"')
    html = html.replace(/"js\/main.js.*"/, '"' + assetUrl(paths, 'js/main.js') + '"')
    html = html.replace(/"js\/vendor.js.*"/, '"' + assetUrl(paths, 'js/vendor.js') + '"')
    html = html.replace(/"js\/manifest.js.*"/, '"' + assetUrl(paths, 'js/manifest.js') + '"')

    fs.writeFileSync(path.join(__dirname, 'public/index.html'), html)
})

mix.browserSync({
    files: ["public/index.html", "public/css/all.css", "public/js/main.js"],
    proxy: false,
    port: process.env.MIX_APP_PORT,
    server: { baseDir: './public' },
    ui:{
        port: process.env.MIX_APP_PORT_UI
    }
})
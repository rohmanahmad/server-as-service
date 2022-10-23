const mix = require('laravel-mix')
const fs = require('fs')
require('laravel-mix-purgecss')

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
    .sass('app/theme/scss/bracket.scss', 'public/css/all.css')
    .riot('app/main.js', 'public/js')
    .copyDirectory('app/theme/vendor/ionicons/fonts', 'public/fonts')
    .styles([
        'app/theme/vendor/ionicons/css/ionicons.min.css',
        'app/theme/vendor/flatpickr/flatpickr.min.css',
        'node_modules/sweetalert2/dist/sweetalert2.min.css',
        'app/theme/vendor/spiner/spiner.css',
        'app/theme/css/custom.css'
    ], 'public/css/vendor.css')
    .copyDirectory('app/theme/images', 'public/images')
    .copyDirectory('app/theme/notification-assets', 'public/notification-assets')
    .copyDirectory('app/theme/vendor/tinymce', 'public/lib/tinymce')
    .copyDirectory('app/theme/vendor/font-awesome-4.7.0/css', 'public/lib/fa4/css')
    .copyDirectory('app/theme/vendor/font-awesome-4.7.0/fonts', 'public/lib/fa4/fonts')
    .copy('app/theme/vendor/popper.js', 'public/lib')
    .copy('app/theme/vendor/bootstrap.js', 'public/lib')
    .copy('app/theme/vendor/daterangepicker/daterangepicker.min.js', 'public/lib')
    .copy('app/theme/vendor/daterangepicker/daterangepicker.css', 'public/css')
    .copy('app/theme/vendor/moment.min.js', 'public/lib')
    .copy('app/theme/vendor/jquery-3.6.0.min.js', 'public/lib')
    .copy('app/theme/vendor/sweetalert2.js', 'public/lib')
    .copy('app/theme/vendor/xlsx.full.min.js', 'public/lib')
    .copy('app/theme/vendor/select2/select2.css', 'public/css')
    .copy('app/theme/vendor/select2/select2.min.js', 'public/lib')
    .copy('app/theme/css/custom.css', 'public/css')
    .copy('app/theme/css/font.css', 'public/css')
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
                module: path.resolve(__dirname, 'app/modules'),
                components: path.resolve(__dirname, 'app/components'),
                libs: path.resolve(__dirname, 'app/libs'),
                layout: path.resolve(__dirname, 'app/layouts'),
                helpers: path.resolve(__dirname, 'app/helpers'),
                services: path.resolve(__dirname, 'app/services'),
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
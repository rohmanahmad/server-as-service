export const setHistoryUrl = (prevUrl, component) => {
    history.pushState({ prevUrl: component }, null, '')
}

export const goTo = (hash) => {
    location.hash = '/'+hash;
}

export const getUrlParameter = (name) => {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

export const setUpTemplate = () => {
	var contentFullHeight = $('.content-full-height');
    var verticalFullHeight = $('.content-full-height .vertical-center');
    var windowFullHeight = window.innerHeight;
    if($('.header').hasClass('disabled')){
        var headerHeight = 0;
    } else {
        var headerHeight = $('.header').height() + 12;
    }
    var footerMenuHeight = $('#footer-menu').height();
    if(!$('.header').length){headerHeight = 0;}
    if($('.header').length){
        contentFullHeight.css({
            'height':windowFullHeight
        });
        verticalFullHeight.css({
            'padding-top':headerHeight
        })
    }
    if(!$('.header').length){
        contentFullHeight.css('height', windowFullHeight)
    }
    $('.caption').each(function(){
        var notchSize = 0;
        if($('body').hasClass('has-notch')){
            var notchSize = $('.notch-hider').height();
        }
        var windowHeight = window.innerHeight;
        var captionHeight = $(this).data('height');
        if(captionHeight === "cover"){
            $(this).css('height', windowHeight - notchSize - headerHeight)
            $('.map-full').css('height', windowHeight - headerHeight - footerMenuHeight );
            if(!$('.header').length){
                $('.page-content').css('padding-bottom','0px');
                $(this).find('.caption-center, .caption-bottom, .caption-top').css('margin-top','0px');
            }     
            if($('.header').length){
                $(this).find('.caption-center, .caption-bottom, .caption-top').css('margin-top', $('.header').height())
            }
        }         
        if(captionHeight === "cover-header"){
            $(this).css('height', windowHeight - headerHeight - footerMenuHeight );
            $('.map-full').css('height', windowHeight - headerHeight - footerMenuHeight );
            //$(this).css('height', windowHeight)
            if(!$('.header').length){
                $('.page-content').css('padding-bottom','0px');
                $(this).find('.caption-center, .caption-bottom, .caption-top').css('margin-top','0px');
            }     
            if($('.header').length){
                $(this).find('.caption-center, .caption-bottom, .caption-top').css('margin-top', $('.header').height())
            }

        }
       $(this).css('height',captionHeight)
    })
}

export const setParamApp = (newDataApp) => {
    for (const key of Object.keys(newDataApp)) {
        App[key] = newDataApp[key]
    }
}
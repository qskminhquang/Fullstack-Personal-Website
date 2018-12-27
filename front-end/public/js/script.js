// Sticky Header
$(window).scroll(function() {
    if ($(window).scrollTop() > 100) {
        $('.my-header').addClass('sticky');
    } else {
        $('.my-header').removeClass('sticky');
    }
});
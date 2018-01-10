$(document).ready(SetIframeSize);

// resize on window resize
$(window).on('resize', SetIframeSize);


function SetIframeSize() {
    $("#cad").width($(window).width() - 275); // added margin for scrollbars
    $("#cad").height($(window).height() - 150);
}

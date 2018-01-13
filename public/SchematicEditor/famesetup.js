$(document).ready(SetIframeSize);

// resize on window resize
$(window).on('resize', SetIframeSize);


function SetIframeSize() {
    //$("#cad").width($("#accordion").width() -20); // added margin for scrollbars
    $("#cad").height($(window).height() - 150);
}

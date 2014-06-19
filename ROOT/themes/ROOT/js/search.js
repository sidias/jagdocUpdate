$( document ).ready(function() {
    var url = (location.search).replace("?","");

    var keyword = (url.split("&"))
    var length = keyword.length;
    var highlight = (keyword[length - 1]).split("=");

    $('body').highlight(highlight[1]);
});


$('#jaggerySearch').keypress(function(event) {
    if (event.keyCode == 13) {
        var searchBox = document.getElementById("jaggerySearch");
        window.location.href = '/search.jag?search='+searchBox.value;
    }
});




$('#jaggerySearch').keypress(function(event) {
    if (event.keyCode == 13) {
        var searchBox = document.getElementById("jaggerySearch");
        window.location.href = '/search.jag?search='+searchBox.value;
    }
});

/*
$.ajax({
    url: "documentation.jag?api=session",
    dataType: 'text',
    success: function(data) {
    console.log("@anushka"+data);
    }
});
*/
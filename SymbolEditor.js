function UIsymbolButtonClick(ActionToBeTaken) {
    if (!ActionToBeTaken) return;

    if (ActionToBeTaken === "load") UIloadItem();
}


function UIloadItem() {
    alert(new URL(window.location.href).searchParams.get("id"));


    var lines = document.getElementById('TextPinListing').innerHTML.split('\n');
    for (var i = 0; i < lines.length; i++) {
        alert(lines[i]);
    }
}












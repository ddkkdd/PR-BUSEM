jsPlumb.ready(buildModel);

function buildModel() {
    var elements = document.getElementsByClassName("item");
    var elemArr = jQuery.makeArray(elements);

    var common = {
        connector: ["Straight"],
        anchor: ["Top", "Bottom"],
        endpoint: "Dot"
    };

    jsPlumb.connect({
        source: "bLager",
        target: "bGenehmiger"
    }, common);
}
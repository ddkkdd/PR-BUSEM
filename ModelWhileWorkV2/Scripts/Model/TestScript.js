jsPlumb.ready(buildModel);

function buildModel() {
    var elements = document.getElementsByClassName("item");
    var elemArr = jQuery.makeArray(elements);

    var common = {
        connector: ["Straight"],
        anchor: ["Left", "Right"],
        endpoint: "Dot"
    };

    jsPlumb.connect({
        source: "bLager",
        target: "bGenehmiger"
    }, common);

    jsPlumb.draggable("bLager");
    jsPlumb.draggable("bGenehmiger");
}
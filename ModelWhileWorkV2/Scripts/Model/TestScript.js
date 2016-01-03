jsPlumb.ready(Init);

function Init() {
    jsPlumb.connect({
        source: "element1",
        target: "element2",
        endpoint: "Rectangle"
    });

    jsPlumb.connect({
        source: "element1",
        target: "element3",
    });
}
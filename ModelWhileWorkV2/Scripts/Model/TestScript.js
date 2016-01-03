jsPlumb.ready(Init);

function Init() {
    
    var model = jsPlumb.getInstance();
    
    model.draggable("element1");
    model.draggable("element2");
    model.draggable("element3");

    model.makeSource($('.'));
}
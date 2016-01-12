var url = 'http://localhost:53410/api/ProcessModel?modelName=bbestell-6.exml';
//var url = 'http://127.0.0.1:8080/api/ProcessModel?modelName=bbestell-6.exml';
var selectedSubject = "blager";
var offset = 1000;
var divide = 2;

$(document).ready(loadModel());

function loadModel() {
    jQuery.ajax({
        url: url,
        type: "GET",
        contentType: 'application/json; charset=utf-8',
        success: function (modelJSON) {
            $.each(modelJSON, function (objIndex, object) {
                $.each(object, function (subjectFieldIndex, subjectField) {
                    if (subjectField.subjectNameField == selectedSubject)
                    {
                        generateElements(subjectField);
                        generateElementsConnection(subjectField);
                    }
                });
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
        },

        timeout: 120000,
    });
}

function generateElements(subjectField)
{
    var canvas = $("#canvas");
    canvasDiv = document.getElementById("canvas");

    $.each(subjectField.elementField, function (elementIndex, element) {
        if (element.nameField != "") //Element is a activity
        {
            newDiv = createNewTaskElement(element);
            canvasDiv.appendChild(newDiv);
        }

        if (element.nameField == "") //element is a Message
        {
            
            if (element.msgField != null) //element is a Send Message
            {
                newDiv = createNewSendElement(element);
                canvasDiv.appendChild(newDiv);
            }else //element is a Recieve Message
            {
                newDiv = createNewRecieveElement(element);
                canvasDiv.appendChild(newDiv);
            }
        }
    });
}

function createNewTaskElement (object)
{
    x = object.xField * offset / divide;
    y = object.yField * offset / (divide * 2);
    
    newDiv = document.createElement("div");
    newDiv.className = "task";
    newDiv.id = object.uUIDField;
    newDiv.style.left = x+"px";
    newDiv.style.top = y+"px";
    
    newSpan = document.createElement("span");
    newSpan.className = "nameSpan";
    newSpan.textContent = object.nameField;

    newExtraSpan = document.createElement("span");
    newExtraSpan.className = "extraSpan";

    newDiv.appendChild(newSpan);
    newDiv.appendChild(newExtraSpan);
    
    return newDiv;
}

function createNewSendElement (object)
{
    x = object.xField * offset / divide;
    y = object.yField * offset / (divide * 2);

    newDiv = document.createElement("div");
    newDiv.className = "send";
    newDiv.id = object.uUIDField;
    newDiv.style.left = x + "px";
    newDiv.style.top = y + "px";
    
    newSpanName = document.createElement("span");
    newSpanName.className = "nameSpan";
    newSpanName.textContent = object.msgField.messageField;

    newSpanSend = document.createElement("span");
    newSpanSend.className = "senderSpan";
    newSpanSend.textContent = "SENDER: " + object.msgField.senderField;

    newSpanRec = document.createElement("span");
    newSpanRec.className = "recipientSpan";
    newSpanRec.textContent = "EMPFÄNGER: "+object.msgField.recipientField; 

    newExtraSpan = document.createElement("span");
    newExtraSpan.className = "extraSpan";
    
    newDiv.appendChild(newSpanName);
    newDiv.appendChild(newSpanSend);
    newDiv.appendChild(newSpanRec);
    newDiv.appendChild(newExtraSpan);
    
    return newDiv;
}

function createNewRecieveElement (object)
{
    x = object.xField * offset / divide;
    y = object.yField * offset / (divide * 2);

    newDiv = document.createElement("div");
    newDiv.className = "recieve";
    newDiv.id = object.uUIDField;
    newDiv.style.left = x + "px";
    newDiv.style.top = y + "px";

    $.each(object.messagesField, function (msgIdx, msg)
    {
        newSpanName = document.createElement("span");
        newSpanName.className = "nameSpan";
        newSpanName.textContent = msg.messageField;

        newSpanRec = document.createElement("span");
        newSpanRec.className = "recipientSpan";
        newSpanRec.textContent = "EMPFÄNGER: " + msg.recipientField;

        newSpanSend = document.createElement("span");
        newSpanSend.className = "senderSpan";
        newSpanSend.textContent = "SENDER: " + msg.senderField;

        newExtraSpan = document.createElement("span");
        newExtraSpan.className = "extraSpan";

        newDiv.appendChild(newSpanName);
        newDiv.appendChild(newSpanRec);
        newDiv.appendChild(newSpanSend);
        newDiv.appendChild(newExtraSpan);
    });

    return newDiv;
}

function generateElementsConnection(model)
{
    var sourceId = "";
    var targetId = "";
    var label = "";

    //console.log(model);

    $.each(model.connectionField, function (connectionIndex, connection) {     
        //find source
        sourceId = connection.endPoint2Field.uUIDField;
        targetId = connection.endPoint1Field.uUIDField;
        label = connection.nameField;
        connectTwoElements(sourceId, targetId, label);
    });
}

function connectTwoElements(sourceId, targetId, label) {
    var sourceElem = document.getElementById(sourceId);
    var targetElem = document.getElementById(targetId);

    var common = {
        connector: ["Straight"],
        anchor: ["Top", "Bottom"],
        endpoint: "Dot"
    };

    jsPlumb.connect({
        source: sourceElem,
        target: targetElem,
        label: label,
        paintStyle: { strokeStyle: "lightgrey", lineWidth: 3 },
        endpointStyle: { fillStyle: "lightgrey", outlineColor: "black" },
        overlays: [
            ["Arrow", { width: 20, length: 15, location: 0.90 }]
        ]
    }, common);

    jsPlumb.draggable(sourceElem);
    jsPlumb.draggable(targetElem);
}
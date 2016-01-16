var constUrl = 'http://localhost:53410/api/ProcessModel?modelName=';
var selectedSubject = "DefaultUser";

var offset = 1000;
var divide = 2;

function init(fileName, subjectName, modelNr)
{
    url = constUrl + fileName;
    selectedSubject = subjectName;

    $(document).ready(loadModel(modelNr));
}

function loadModel(modelNr) {
    jQuery.ajax({
        url: url,
        type: "GET",
        contentType: 'application/json; charset=utf-8',
        success: function (modelJSON) {
            $.each(modelJSON, function (objIndex, objectArray) {
                
                $.each(objectArray, function (objIndex, object) {
                    if (object.subjectNameField == selectedSubject)
                    {
                        generateElements(object, modelNr);
                        generateElementsConnection(object, modelNr);
                    }
                });
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
        },

        timeout: 120000,
    });
}

function generateElements(subjectField, canvasNr)
{
    canvasDiv = document.getElementById("model"+canvasNr+"canvas");

    $.each(subjectField.elementField, function (elementIndex, element) {
        
        if (!element.hasOwnProperty("msgField") && !element.hasOwnProperty("messagesField")) //element is an activity
        {
            newDiv = createNewTaskElement(element, canvasNr);
            canvasDiv.appendChild(newDiv);
            return;
        }

        if (element.hasOwnProperty("msgField")) //element is a Send Message
        {
            newDiv = createNewSendElement(element, canvasNr);
            canvasDiv.appendChild(newDiv);
            return;
        }

        if (element.hasOwnProperty("messagesField")) //element is a Recieve Message
        {
            newDiv = createNewRecieveElement(element, canvasNr);
            canvasDiv.appendChild(newDiv);
            return;
        }        
    });
}

function createNewTaskElement (object, canvasNr)
{
    x = object.xField
    y = object.yField
    
    if (x < 1 && x != 0)
    {
        x = x * offset / divide;
    }

    if (y < 1 && y != 0)
    {
        y = y * offset / (divide * 2);
    }

    newDiv = document.createElement("div");
    newDiv.className = "task";
    newDiv.id = canvasNr+":"+object.uUIDField;
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

function createNewSendElement (object, canvasNr)
{
    x = object.xField
    y = object.yField

    if (x < 1 && x != 0) {
        x = x * offset / divide;
    }

    if (y < 1 && y != 0) {
        y = y * offset / (divide * 2);
    }

    newDiv = document.createElement("div");
    newDiv.className = "send";
    newDiv.id = canvasNr + ":" + object.uUIDField;
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

function createNewRecieveElement (object, canvasNr)
{
    x = object.xField
    y = object.yField

    if (x < 1 && x != 0) {
        x = x * offset / divide;
    }

    if (y < 1 && y != 0) {
        y = y * offset / (divide * 2);
    }

    newDiv = document.createElement("div");
    newDiv.className = "recieve";
    newDiv.id = canvasNr + ":" + object.uUIDField;
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

function generateElementsConnection(model, canvasNr)
{
    var sourceId = "";
    var targetId = "";
    var label = "";

    $.each(model.connectionField, function (connectionIndex, connection) {     
        if (connection.directed1Field && !connection.directed2Field)
        {
            sourceId = canvasNr+":"+connection.endPoint2Field.uUIDField;
            targetId = canvasNr + ":" + connection.endPoint1Field.uUIDField;
        }

        if (!connection.directed1Field && connection.directed2Field) {
            sourceId = canvasNr + ":" + connection.endPoint1Field.uUIDField;
            targetId = canvasNr + ":" + connection.endPoint2Field.uUIDField;
        }
        
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
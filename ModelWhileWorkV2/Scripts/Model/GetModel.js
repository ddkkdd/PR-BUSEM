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
                $.each(element.messagesField, function(key, message)
                {
                    newDiv = createNewRecieveElement(message);
                    canvasDiv.appendChild(newDiv);
                });
            }
        }
    });

    jsPlumb.ready(function() {
        connectTwoElements("Lagerbestand prüfen", " Lagerbestandsabfrag")
        connectTwoElements("Lagerbestand prüfen", "Ware nicht lagernd")
        connectTwoElements(" Lagerbestandsabfrag", "Ware zustellen")
    }
    );
}

function createNewTaskElement (object)
{
    x = object.xField * offset / divide;
    y = object.yField * offset / (divide * 2);
    
    newDiv = document.createElement("div");
    newDiv.className = "task";
    newDiv.id = object.nameField;
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
    newDiv.id = object.msgField.messageField;
    newDiv.style.left = x + "px";
    newDiv.style.top = y + "px";
    
    newSpanName = document.createElement("span");
    newSpanName.className = "nameSpan";
    newSpanName.textContent = object.msgField.messageField;

    newSpanRec = document.createElement("span");
    newSpanRec.className = "recipientSpan";
    newSpanRec.textContent = "EMPFÄNGER: "+object.msgField.recipientField;

    newSpanSend = document.createElement("span");
    newSpanSend.className = "senderSpan";
    newSpanSend.textContent = "SENDER: "+object.msgField.senderField;

    newExtraSpan = document.createElement("span");
    newExtraSpan.className = "extraSpan";
    
    newDiv.appendChild(newSpanName);
    newDiv.appendChild(newSpanRec);
    newDiv.appendChild(newSpanSend);
    newDiv.appendChild(newExtraSpan);
    
    return newDiv;
}

function createNewRecieveElement (object)
{
    x = object.xField * offset / divide;
    y = object.yField * offset / (divide*2);

    newDiv = document.createElement("div");
    newDiv.className = "recieve";
    newDiv.id = object.messageField;
    newDiv.style.left = x + "px";
    newDiv.style.top = y + "px";

    newSpanName = document.createElement("span");
    newSpanName.className = "nameSpan";
    newSpanName.textContent = object.messageField;

    newSpanRec = document.createElement("span");
    newSpanRec.className = "recipientSpan";
    newSpanRec.textContent = "EMPFÄNGER: "+object.recipientField;

    newSpanSend = document.createElement("span");
    newSpanSend.className = "senderSpan";
    newSpanSend.textContent = "SENDER: "+object.senderField;

    newExtraSpan = document.createElement("span");
    newExtraSpan.className = "extraSpan";

    newDiv.appendChild(newSpanName);
    newDiv.appendChild(newSpanRec);
    newDiv.appendChild(newSpanSend);
    newDiv.appendChild(newExtraSpan);
    
    return newDiv;
}

function connectTwoElements(sourceId, targetId) {
    var sourceElem = document.getElementById(sourceId);
    var targetElem = document.getElementById(targetId);

    var common = {
        connector: ["Straight"],
        anchor: ["Top", "Bottom"],
        endpoint: "Dot"
    };

    jsPlumb.connect({
        source: sourceElem,
        target: targetElem
    }, common);

    jsPlumb.draggable(sourceElem);
    jsPlumb.draggable(targetElem);
}
var url = 'http://localhost:53410/api/ProcessModel?modelName=bbestell-6.exml';
//var url = 'http://127.0.0.1:8080/api/ProcessModel?modelName=bbestell-6.exml';
var selectedSubject = "blager";

$(document).ready(loadModel());

function loadModel() {
    jQuery.ajax({
        url: url,
        type: "GET",
        contentType: 'application/json; charset=utf-8',
        success: function (modelJSON) {
            //console.log(modelJSON);

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
            newDiv = createNewActivityElement(element);
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
}

function createNewActivityElement (object)
{
    newDiv = document.createElement("div");
    newDiv.className = "item";
    newDiv.id = object.nameField;

    newSpan = document.createElement("span");
    newSpan.className = "span1";
    newSpan.textContent = object.nameField;

    newExtraSpan = document.createElement("span");
    newExtraSpan.className = "extraSpan";

    newDiv.appendChild(newSpan);
    newDiv.appendChild(newExtraSpan);

    return newDiv;
}

function createNewSendElement (object)
{
    newDiv = document.createElement("div");
    newDiv.className = "item";
    newDiv.id = object.msgField.messageField;
    
    newSpanName = document.createElement("span");
    newSpanName.className = "name";
    newSpanName.textContent = object.msgField.messageField;

    newSpanRec = document.createElement("span");
    newSpanRec.className = "recipient";
    newSpanRec.textContent = object.msgField.recipientField;

    newSpanSend = document.createElement("span");
    newSpanSend.className = "sender";
    newSpanSend.textContent = object.msgField.senderField;

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
    newDiv = document.createElement("div");
    newDiv.className = "item";
    newDiv.id = object.messageField;

    newSpanName = document.createElement("span");
    newSpanName.className = "name";
    newSpanName.textContent = object.messageField;

    newSpanRec = document.createElement("span");
    newSpanRec.className = "recipient";
    newSpanRec.textContent = object.recipientField;

    newSpanSend = document.createElement("span");
    newSpanSend.className = "sender";
    newSpanSend.textContent = object.senderField;

    newExtraSpan = document.createElement("span");
    newExtraSpan.className = "extraSpan";

    newDiv.appendChild(newSpanName);
    newDiv.appendChild(newSpanRec);
    newDiv.appendChild(newSpanSend);
    newDiv.appendChild(newExtraSpan);
    
    return newDiv;
}
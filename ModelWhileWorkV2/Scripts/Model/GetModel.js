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
            newDivSubject = document.createElement("div");
            newDivSubject.textContent = element.nameField;
            newDivSubject.className = "item";
            newDivSubject.id = element.nameField;
            canvasDiv.appendChild(newDivSubject);
        }

        if (element.nameField == "") //element is a Message
        {
            
            if (element.msgField != null) //element is a Send Message
            {
                newDivSubject = document.createElement("div");
                newDivSubject.textContent = element.msgField.messageField;
                newDivSubject.className = "item";
                newDivSubject.id = element.msgField.messageField;
                canvasDiv.appendChild(newDivSubject);
            }else //element is a Recieve Message
            {
                $.each(element.messagesField, function(key, message)
                {
                    newDivSubject = document.createElement("div");
                    newDivSubject.textContent = message.messageField;
                    newDivSubject.className = "item";
                    newDivSubject.id = message.messageField;
                    canvasDiv.appendChild(newDivSubject);
                });
            }
        }
    });
}
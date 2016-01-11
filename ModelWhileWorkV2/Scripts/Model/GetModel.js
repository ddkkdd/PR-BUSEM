var url = 'http://localhost:53410/api/ProcessModel?modelName=bbestell-6.exml';
//var url = 'http://127.0.0.1:8080/api/ProcessModel?modelName=bbestell-6.exml';

$(document).ready(loadModel());

function loadModel() {
    jQuery.ajax({
        url: url,
        type: "GET",
        contentType: 'application/json; charset=utf-8',
        success: function (modelJSON) {
            console.log("TEST");
            console.log(modelJSON);

            var canvas = $("#canvas");

            $.each(modelJSON, function (objIndex, object) {
                $.each(object, function (subjectFieldIndex, subjectField) {
                    canvasDiv = document.getElementById("canvas");
                    newDivSubject = document.createElement("div");
                    newDivSubject.textContent = subjectField.realNameField;
                    newDivSubject.className = "item";
                    newDivSubject.id = subjectField.realNameField;
                    //newDivSubject.draggable = true;

                    //console.log(subjectField.realNameField);

                    canvasDiv.appendChild(newDivSubject);
                });
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
        },

        timeout: 120000,
    });
}
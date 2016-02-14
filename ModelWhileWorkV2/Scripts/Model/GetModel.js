var constUrl = 'http://localhost:53410/api/ProcessModel?modelName=';
var selectedSubject = "DefaultUser";

var offset = 1000;
var divide = 2;

var model1 = null;
var model2 = null;
var model3 = null;

var subjects1 = [];
var subjects2 = [];
var subjects3 = [];

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
                    if (object.subjectNameField == selectedSubject) {
                        generateElements(object, modelNr);
                        generateElementsConnection(object, modelNr);
                    }
                });

                if (modelNr == 1)
                {
                    model1 = modelJSON;
                }
                if (modelNr == 2)
                {
                    model2 = modelJSON;
                }
                if (modelNr == 3)
                {
                    model3 = modelJSON;
                }
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

    newCheckBox = document.createElement("input");
    newCheckBox.type = "checkbox";
    newCheckBox.className = "chkBox" + canvasNr;
    newCheckBox.id = "chkBox:" + object.uUIDField;

    newDiv.appendChild(newSpan);
    newDiv.appendChild(newCheckBox);
    
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
    addSubjectToArray(object.msgField.senderField, canvasNr);

    newSpanRec = document.createElement("span");
    newSpanRec.className = "recipientSpan";
    newSpanRec.textContent = "EMPFÄNGER: " + object.msgField.recipientField;
    addSubjectToArray(object.msgField.senderField, canvasNr);

    newCheckBox = document.createElement("input");
    newCheckBox.type = "checkbox";
    newCheckBox.className = "chkBox" + canvasNr;
    newCheckBox.id = "chkBox:" + object.uUIDField;
    
    newDiv.appendChild(newSpanName);
    newDiv.appendChild(newSpanSend);
    newDiv.appendChild(newSpanRec);
    newDiv.appendChild(newCheckBox);
    
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
        addSubjectToArray(msg.recipientField, canvasNr);

        newSpanSend = document.createElement("span");
        newSpanSend.className = "senderSpan";
        newSpanSend.textContent = "SENDER: " + msg.senderField;
        addSubjectToArray(msg.senderField, canvasNr);

        newCheckBox = document.createElement("input");
        newCheckBox.type = "checkbox";
        newCheckBox.className = "chkBox" + canvasNr;
        newCheckBox.id = "chkBox:" + object.uUIDField;

        newDiv.appendChild(newSpanName);
        newDiv.appendChild(newSpanRec);
        newDiv.appendChild(newSpanSend);
        newDiv.appendChild(newCheckBox);
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
            sourceId = canvasNr + ":" + connection.endPoint2Field.uUIDField;
            targetId = canvasNr + ":" + connection.endPoint1Field.uUIDField;
        }

        if (!connection.directed1Field && connection.directed2Field) {
            sourceId = canvasNr + ":" + connection.endPoint1Field.uUIDField;
            targetId = canvasNr + ":" + connection.endPoint2Field.uUIDField;
        }
        
        label = connection.nameField;

        connectTwoElements(sourceId, targetId, label, canvasNr);
    });
}

function connectTwoElements(sourceId, targetId, label, canvasNr) {
    var offset = -290;

    var sourceElem = document.getElementById(sourceId);
    var targetElem = document.getElementById(targetId);

    var common = {
        connector: ["Straight"],
        anchor: ["Top", "Bottom"],
        endpoint: "Blank"
    };

    if (canvasNr == 2)
    {
        common = {
            connector: ["Straight"],
            anchor: [[0, 0, 0, 0, offset, 0], [0, 0, 0, 0, offset, 0]],
            endpoint: "Blank"
        }
    }

    jsPlumb.connect({
        source: sourceElem,
        target: targetElem,
        label: label,
        paintStyle: { strokeStyle: "lightgrey", lineWidth: 3 },
        endpointStyle: { fillStyle: "lightgrey", outlineColor: "black" },
        overlays: [
           ["PlainArrow", { location: 1, width: 15, length: 12 }]
        ]
    }, common);
}

function deleteElements (modelNr)
{
    if ($("model" + modelNr + "canvas").length > 0)
    {
        $("model" + modelNr + "canvas").empty();
        jsPlumb.empty("model" + modelNr + "canvas");
        jsPlumb.repaintEverything();
    }    
}

function addSubjectToArray (subjectName, modelNr)
{
    if (modelNr == 1)
    {
        if ($.inArray(subjectName, subjects1) == -1) {
            subjects1.push(subjectName);
        }
    }

    if (modelNr == 2) {
        if ($.inArray(subjectName, subjects2) == -1) {
            subjects2.push(subjectName);
        }
    }

    if (modelNr == 3) {
        if ($.inArray(subjectName, subjects3) == -1) {
            subjects3.push(subjectName);
        }
    }    
}

function getSubjects(modelNr)
{
    if (modelNr == 1)
    {
        return subjects1;
    }

    if (modelNr == 2) {
        return subjects2;
    }

    if (modelNr == 3) {
        return subjects2;
    }
    
    return null;
}

function getModel(modelNr)
{
    if (modelNr == 1) {
        return model1;
    }

    if (modelNr == 2) {
        return model2;
    }

    if (modelNr == 3) {
        return model3;
    }

    return null;
}

function setModel (modelNr, model)
{
    if (modelNr == 1) {
        model1 = model;
    }

    if (modelNr == 2) {
        model2 = model;
    }

    if (modelNr == 3) {
        model3 = model;
    }
}

function subjectsDialog(modelNr)
{
    var subjects = getSubjects(modelNr);
    var cntSubjects = subjects.length;

    var heading = document.getElementById("sbjDiaH3"+modelNr);
    heading.textContent = "Subject Abgleich Model " + modelNr;
    
    var dialog = document.getElementById("subjectsDialog"+modelNr);

    var dialogDiv = document.getElementById("shjDiaSubjects"+modelNr);
    var okButton = document.getElementById("sbjDiaOK"+modelNr);
    okButton.addEventListener('click', function () { checkDialogSelection(modelNr, cntSubjects); });
    var cnlButton = document.getElementById("sbjDiaCancel"+modelNr);
    cnlButton.addEventListener('click', function () { dialog.close(); });
    
    for (var i = 0; i < cntSubjects; i++)
    {
        var spanSbjName = document.createElement("span");
        spanSbjName.id = modelNr+"dialogSpan" + i;
        spanSbjName.className = "dialogText";
        spanSbjName.textContent = subjects[i];
        spanSbjName.style.fontWeight = "bold";

        var select = document.createElement("select");
        select.className = "dialogSelect";
        select.id = modelNr+"dialogSelect" + i;

        var option = document.createElement("option");
        option.value = "-";
        option.innerHTML = "-";
        
        select.appendChild(option);

        for (var j = 0; j < cntSubjects; j++)
        {
            option = document.createElement("option");
            option.value = j + 1;
            option.innerHTML = j + 1;

            select.appendChild(option);
        }

        var br = document.createElement("br");
        
        dialogDiv.appendChild(spanSbjName);
        dialogDiv.appendChild(select);
        dialogDiv.appendChild(br);
    }
    var br = document.createElement("br");
    dialogDiv.appendChild(br);

    dialog.show();
}

function checkDialogSelection(modelNr, cntSubjects)
{
    var dialog = document.getElementById("subjectsDialog"+modelNr);

    //Initialize Array
    var selectionArr = new Array(cntSubjects);
    for (var i = 0; i < cntSubjects; i++)
    {
        selectionArr[i] = "";
    }

    //Group Subjects
    for (var i =0; i<cntSubjects; i++)
    {
        var name = document.getElementById(modelNr+"dialogSpan"+i);
        var select = document.getElementById(modelNr+"dialogSelect"+i);
        
        if (name != null && select != null)
        {
            if (select.value == "-" || select.value == null) {
                continue;
            } else {
                var nr = select.value;
                selectionArr[nr] += name.textContent + ";";
            }
        }        
    }
    
    //empty Dialog before closing it
    var dialogDiv = document.getElementById("shjDiaSubjects"+modelNr);
    while (dialogDiv.firstChild)
    {
        dialogDiv.removeChild(dialogDiv.firstChild);
    }
    dialog.close();
    
    // Ask for new Common Name
    for (var i = 0; i < cntSubjects; i++)
    {
        if (selectionArr[i] != "")
        {
            var singleSubjectsArr = selectionArr[i].split(";");
                       
            var text1 = "Bitte geben Sie einen neuen Namen für das Subjekt ";
            var text2 = "Bitte geben Sie einen gemeinsamen Namen für die Subjekte ";
            var dynText1 = "";
            var dynText2 = "";

            for (var j=0; j<singleSubjectsArr.length; j++)
            {
                
                if (singleSubjectsArr.length == 1)
                {
                    dynText1 = singleSubjectsArr[j];
                }
                else
                {
                    dynText2 += singleSubjectsArr[j]+" ";
                }
            }

            if (singleSubjectsArr.length == 1)
            {
                var text = text1 + dynText1 + " ein";
            }
            else
            {
                var text = text2 + dynText2 + " ein";
            }

            var commonName = prompt(text);
            replaceSubjectNames(singleSubjectsArr, commonName, modelNr);
        }
    }
}

function replaceSubjectNames (subjects, commonName, modelNr)
{
    //replace Names in View
    var chkRecMsg = document.getElementsByClassName("recieve");
    var chkSendMsg = document.getElementsByClassName("send");

    //check RecMsg
    for (var i=0; i<chkRecMsg.length; i++)
    {
        var msgId = chkRecMsg[i].id;
        var splitId = msgId.split(":");

        if (splitId[0] == modelNr) //Element belongs to the right Model
        {
            for (var j=0; j<chkRecMsg[i].childNodes.length; j++)
            {
                if (chkRecMsg[i].childNodes[j].className == "recipientSpan")
                {
                    for (var k = 0; k < subjects.length; k++)
                    {
                        if (chkRecMsg[i].childNodes[j].textContent == "EMPFÄNGER: " + subjects[k])
                        {
                            chkRecMsg[i].childNodes[j].textContent = "EMPFÄNGER: " + commonName;
                        }
                    }
                }

                if (chkRecMsg[i].childNodes[j].className == "senderSpan")
                {
                    for (var l = 0; l < subjects.length; l++)
                    {
                        if (chkRecMsg[i].childNodes[j].textContent == "SENDER: " + subjects[l])
                        {
                            chkRecMsg[i].childNodes[j].textContent = "SENDER: " + commonName;
                        }
                    }
                }
            }
        }
    }

    //check SendMsg
    for(var i=0; i<chkSendMsg.length; i++)
    {
        var msgId = chkSendMsg[i].id;
        var splitId = msgId.split(":");

        if (splitId[0] == modelNr)
        {
            for (var j=0; j<chkSendMsg[i].childNodes.length; j++)
            {
                if (chkSendMsg[i].childNodes[j].className == "recipientSpan")
                {
                    for (var k=0; k<subjects.length; k++)
                    {
                        if (chkSendMsg[i].childNodes[j].textContent == "EMPFÄNGER: " + subjects[k])
                        {
                            chkSendMsg[i].childNodes[j].textContent = "EMPFÄNGER: " + commonName;
                        }
                    }
                }

                if (chkSendMsg[i].childNodes[j].className == "senderSpan")
                {
                    for (var l = 0; l < subjects.length; l++)
                    {
                        if (chkSendMsg[i].childNodes[j].textContent == "SENDER: " + subjects[l])
                        {
                            chkSendMsg[i].childNodes[j].textContent = "SENDER: " + commonName;
                        }
                    }
                }
            }
        }
    }

    //replace Names in model
    var model = getModel(modelNr);

    if (model != null)
    {       
        $.each(model.subjectField, function (objIdx, object)
        {
            if (object.subjectNameField == selectedSubject)
            {
                $.each(object.elementField, function (objKey, objValue)
                {
                    if (objValue.hasOwnProperty("messagesField")) //Is a recieve message
                    {
                        $.each(objValue.messagesField, function (key, value)
                        {
                            for (var i = 0; i < subjects.length; i++) {
                                
                                if (value.recipientField == subjects[i]) {
                                    value.recipientField = commonName;
                                }

                                if (value.senderField == subjects[i]) {
                                    value.senderField = commonName;
                                }
                            }
                        });
                    }

                    if (objValue.hasOwnProperty("msgField")) //Is a send message
                    {
                        for (var j=0; j<subjects.length; j++)
                        {
                            if(objValue.msgField.recipientField == subjects[j])
                            {
                                objValue.msgField.recipientField = commonName;
                            }

                            if (objValue.msgField.senderField == subjects[j]) {
                                objValue.msgField.senderField = commonName;
                            }
                        }
                    }
                });
            }
        });
        setModel(modelNr, model);
    }
}
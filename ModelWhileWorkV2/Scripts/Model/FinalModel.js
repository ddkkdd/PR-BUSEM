//contains operations for the final model

var insPos = 0;

function finalModel()
{
    var chkBoxesModel1 = document.getElementsByClassName("chkBox1");
    var chkBoxesModel1checked = [];
    var model1ElemIds = [];
    var model1Elements = [];

    var chkBoxesModel2 = document.getElementsByClassName("chkBox2");
    var chkBoxesModel2checked = [];
    var model2ElemIds = [];
    var model2Elements = [];

    chkBoxesModel1checked = checkWhichCheckBoxIsChecked(chkBoxesModel1);
    chkBoxesModel2checked = checkWhichCheckBoxIsChecked(chkBoxesModel2);

    model1ElemIds = getElementIdsOfCheckBoxChecked(chkBoxesModel1checked);
    model2ElemIds = getElementIdsOfCheckBoxChecked(chkBoxesModel2checked);

    var tmpModel1 = getModel(1);
    var tmpModel2 = getModel(2);
    var tmpModel = getModel(1);
    var elementsModel1 = [];
    var elementsModel2 = [];
    var startElement;
    var endElement;
    var elementsToDelete;

    if (insPos == 0)
    {
        //emptyModel
        tmpModel.subjectField[0].elementField.splice(0, tmpModel.subjectField[0].elementField.length);
        tmpModel.subjectField[0].connectionField.splice(0, tmpModel.subjectField[0].connectionField.length);
    }    
    
    for (var i = 0; i < model1ElemIds.length; i++) {
        var element = document.getElementById("1:" + model1ElemIds[i]);
        elementsModel1.push(element);
    }

    for (var j = 0; j < model2ElemIds.length; j++) {
        var element2 = document.getElementById("2:" + model2ElemIds[j]);
        elementsModel2.push(element2);
    }

    if (elementsModel1.length > 0)
    {
        elementsModel1 = generateModelElementsOutOfDOMElements(elementsModel1, insPos);
        
        for (var j = 0; j < elementsModel1.length; j++) {
            elementsModel1[j] = setYValue(elementsModel1[j]);
            tmpModel.subjectField[0].elementField.splice(insPos + j, 0, elementsModel1[j]);
        }
        insPos = insPos + elementsModel1.length;
    }

    if (elementsModel2.length > 0)
    {
        elementsModel2 = generateModelElementsOutOfDOMElements(elementsModel2, insPos);
        for (var j = 0; j < elementsModel2.length; j++) {
            elementsModel2[j] = setYValue(elementsModel2[j]);
            tmpModel.subjectField[0].elementField.splice(insPos + j, 0, elementsModel2[j]);
        }
        insPos = insPos + elementsModel2.length;
    }

    var connections = regenerateConnections(tmpModel);
    tmpModel.subjectField[0].connectionField = connections;
    model3 = tmpModel;

    //delete old model from canvas
    deleteModelFromDOM(3);

    //repaint altered model
    generateElements(model3.subjectField[0], 3);
    
    var btnEx = document.getElementById("exportModel3");
    btnEx.style.visibility = "visible";
}

function InsertStep()
{
    var selection = 1;
    var dialog = document.getElementById("newStepDialog");
    var dialogDiv = document.getElementById("shjDiaSubjects");
    var okButton = document.getElementById("newStepDiaOK");
    okButton.addEventListener('click', function ()
    {
        var options = document.getElementsByName("newStepTask");
        for (var i = 0; i < options.length; i++) 
        {
            options[i].addEventListener('click', function () {
                if (this.checked) {
                    selection = this.value;
                }
            });
        }
        dialog.close();
        insertElement(selection, 3);
    });
    var cnlButton = document.getElementById("newStepDiaCancel");
    cnlButton.addEventListener('click', function () { dialog.close(); });
    dialog.show();
}

function insertElement(selection, modelNr)
{
    var tmpModel = getModel(modelNr);

    if (tmpModel == null) {
        tmpModel = getModel(1);
        //emptyModel
        tmpModel.subjectField[0].elementField.splice(0, tmpModel.subjectField[0].elementField.length);
        tmpModel.subjectField[0].connectionField.splice(0, tmpModel.subjectField[0].connectionField.length);
    }

    var taskName = "";
    var sender = "";
    var recipient = "";
    var yValue = (insPos) * 100;
    insPos++;

    taskName = prompt("Bitte geben Sie eine neue Taskbezeichnug ein: ");
    var object = new Object();
    object = {
        angleField: 0,
        uUIDField: insPos,
        nameField: taskName,
        xField: 0,
        yField: yValue
    };

    if (selection == 2)
    {
        recipient = prompt("Bitte geben Sie einen Empfänger ein: ");
        sender = prompt("Bitte geben Sie einen Sender ein: ");

        var msg = new Object();
        msg = {
            messageField: taskName,
            recipientField: recipient,
            senderField: sender
        };

        var messages = new Object();
        messages = {
            msgField: msg
        };

        object = {
            angleField: 0,
            uUIDField: insPos,
            nameField: taskName,
            xField: 0,
            yField: yValue,
            messagesField: messages 
        };
    }

    if (selection == 3)
    {
        sender = prompt("Bitte geben Sie einen Sender ein: ");
        recipient = prompt("Bitte geben Sie einen Empfänger ein: ");

        var msg = new Object();
        msg = {
            messageField: taskName,
            recipientField: recipient,
            senderField: sender
        };

        object = {
            angleField: 0,
            uUIDField: insPos,
            nameField: taskName,
            xField: 0,
            yField: yValue,
            msgField: msg
        };
    }

    tmpModel.subjectField[0].elementField.splice(insPos, 0, object);
    var connections = regenerateConnections(tmpModel);
    tmpModel.subjectField[0].connectionField = connections;
        
    //delete old model from canvas
    deleteModelFromDOM(modelNr);
    //repaint altered model
    generateElements(tmpModel.subjectField[0], modelNr);

    setModel(modelNr, tmpModel);
}

function setYValue(element)
{
    var uuid = parseInt(element.uUIDField, 10);
    var yValue = (uuid - 1) * 100;
    
    element.yField = yValue;
    return element;
}
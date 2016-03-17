//contains the merge functionality 

var model1ElemIds = [];
var model2ElemIds = [];

function mergeModelSteps()
{    
    var dialog = document.getElementById("mergeDialog");
    var optionSelected = 1;
    var options = document.getElementsByName("mergeOption");
    
    for (var i = 0; i < options.length; i++) {
        options[i].addEventListener('click', function ()
        {            
            if (this.checked)
            {
                optionSelected = this.value;
            }

            var div = document.getElementById("mDiaOpt");

            if (optionSelected == 3)
            {
                div.style.visibility = "visible";
            }
            else
            {
                div.style.visibility = "hidden";
            }
        });
    }

    checkSelectedElements();
    var okButton = document.getElementById("mDiaOK");
    okButton.addEventListener('click', function () { doTheMerge(optionSelected, model1ElemIds, model2ElemIds); });
    var cnlButton = document.getElementById("mDiaCancel");
    cnlButton.addEventListener('click', function () { dialog.close(); });

    dialog.show();
}

//checks which elements are selected (checked)
function checkSelectedElements()
{
    var chkBoxesModel1 = document.getElementsByClassName("chkBox1");
    var chkBoxesModel1checked = [];

    var chkBoxesModel2 = document.getElementsByClassName("chkBox2");
    var chkBoxesModel2checked = [];

    chkBoxesModel1checked = checkWhichCheckBoxIsChecked(chkBoxesModel1);
    chkBoxesModel2checked = checkWhichCheckBoxIsChecked(chkBoxesModel2);

    model1ElemIds = getElementIdsOfCheckBoxChecked(chkBoxesModel1checked);
    model2ElemIds = getElementIdsOfCheckBoxChecked(chkBoxesModel2checked);
}

//replaces the selected elemtens of model a with the selected elements of model b
function doTheMerge(optionSelected, model1ElemIds, model2ElemIds)
{
    var tmpModel1 = getModel(1);
    var tmpModel2 = getModel(2);
    var elementsModel1 = [];
    var elementsModel2 = [];
    var startElement;
    var endElement;
    var elementsToDelete;
    var insertPosition;

    for (var i = 0; i < model1ElemIds.length; i++) {
        var element = document.getElementById("1:" + model1ElemIds[i]);
        elementsModel1.push(element);
    }

    for (var j = 0; j < model2ElemIds.length; j++) {
        var element2 = document.getElementById("2:" + model2ElemIds[j]);
        elementsModel2.push(element2);
    }

    //apply selection from model 1 to model 2
    if (optionSelected == 1)
    {
        startElement = model2ElemIds[0];
        endElement = model2ElemIds[model2ElemIds.length - 1];
        elementsToDelete = endElement - startElement + 1;
        insertPosition = startElement - 1;
        //delete element at insertPosition
        tmpModel2.subjectField[0].elementField.splice(insertPosition, elementsToDelete);

        //insert elements of model1
        elementsModel1 = generateModelElementsOutOfDOMElements(elementsModel1, insertPosition);
        
        for (var i = 0; i < elementsModel1.length; i++)
        {
            tmpModel2.subjectField[0].elementField.splice(insertPosition + i, 0, elementsModel1[i]);
        }
        
        //update remaining uuids in elements and connection
        insertPosition = insertPosition + elementsModel1.length;
        increaseElementIds(tmpModel2, insertPosition);

        var connections = regenerateConnections(tmpModel2);
        tmpModel2.subjectField[0].connectionField = connections;
        model2 = tmpModel2;

        //delete old model from canvas
        deleteModelFromDOM(2);

        //repaint altered model
        generateElements(model2.subjectField[0], 2);
    }

    //apply selection from model 2 to model 1
    if(optionSelected == 2)
    {
        startElement = model1ElemIds[0];
        endElement = model1ElemIds[model1ElemIds.length - 1];
        elementsToDelete = endElement - startElement + 1;
        insertPosition = startElement - 1;

        //delete element at insertPosition
        tmpModel1.subjectField[0].elementField.splice(insertPosition, elementsToDelete);

        //insert elements of model2
        elementsModel2 = generateModelElementsOutOfDOMElements(elementsModel2, insertPosition);
        for (var j = 0; j< elementsModel2.length; j++)
        {
            tmpModel1.subjectField[0].elementField.splice(insertPosition+j, 0, elementsModel2[j]);
        }

        //update remaining uuids in elements and connection
        insertPosition = insertPosition + elementsModel2.length;
        increaseElementIds(tmpModel1, insertPosition);

        var connections2 = regenerateConnections(tmpModel1);
        tmpModel1.subjectField[0].connectionField = connections;
        model1 = tmpModel1;
                
        //delete old model from canvas
        deleteModelFromDOM(1);

        //repaint altered model
        generateElements(model1.subjectField[0], 1);
    }
    
    //create new step
    if(optionSelected == 3)
    {
        var newElementSelection = document.getElementsByName("mergeOptionTask");
        var selection = 0;

        for (var i = 0; i < newElementSelection.length; i++)
        {
            if (newElementSelection[i].checked)
            {
                selection = newElementSelection[i].value;
            }
        }

        var elemToDelM1 = model1ElemIds[0];
        var elemToDelM2 = model2ElemIds[0];
        var insertPosition = 0;

        if (elemToDelM1 !== undefined)
        {
            //delete element at insertPosition
            insertPosition = elemToDelM1 - 1;
            tmpModel1.subjectField[0].elementField.splice(insertPosition, 1);
            replaceElement(1, selection, insertPosition);
        }

        if (elemToDelM2 !== undefined)
        {
            //delete element at insertPosition
            insertPosition = elemToDelM2 - 1;
            tmpModel2.subjectField[0].elementField.splice(insertPosition, 1);
            replaceElement(2, selection, insertPosition);
        }
    }

    var dialog = document.getElementById("mergeDialog");
    dialog.close();

    model1ElemIds.splice(0, model1ElemIds.length);
    model2ElemIds.splice(0, model2ElemIds.length);

    setAllCheckBoxesUnchecked();
}

//increases the elementIds for the tasks which are located behind the 
//newly inserted elements 
function increaseElementIds(model, startId)
{
    var i = 0;
    var inc = 0;
    var first = true;
    $.each(model.subjectField, function (objKey, objValue)
    {
        $.each(objValue.elementField, function (oKey, oValue)
        {
            inc = startId + i;
            if (parseInt(oValue.uUIDField, 10) == inc)
            {
                if (first == false)
                {
                    oValue.uUIDField = (inc + 1).toString();
                    oValue.yField = inc * 100;
                    i++;
                }
                first = false;
            }            
        });
    });
}

//gets the selected(checked) checkboxes
function checkWhichCheckBoxIsChecked (chkBoxes)
{
    var checked = [];

    for (var i=0; i<chkBoxes.length; i++)
    {
        if (chkBoxes[i].checked)
        {
            checked.push(chkBoxes[i]);
        }
    }

    return checked;
}

//return element ids of the checked DOM elements
function getElementIdsOfCheckBoxChecked (chkBoxesChecked)
{
    var modelIds = [];
    for (var i = 0; i < chkBoxesChecked.length; i++) {
        var tmp = chkBoxesChecked[i].id.split(":");
        var value = parseInt(tmp[1], 10);
        modelIds.push(value);
    }

    return modelIds;
}

//returns DOM element by id
function getElementById(modelNr, id)
{
    return document.getElementById(modelNr+":"+id);
}

//return DOM elements by id
function getElementsById(modelNr, modelElemIds)
{
    var elements = [];
    for (var i=0; i<modelElemIds.length; i++)
    {
        elements.push (getElementById(
                modelNr,
                modelElemIds[i]));
    }

    return elements;
}

//generates model elements out of DOM elements
function generateModelElementsOutOfDOMElements (domElements, insertPosition)
{
    var modelElem = [];
    var yValue = 0;

    insertPosition++;
    for (var k=0; k<domElements.length; k++)
    {
        if (k == 0)
        {
            yValue = (insertPosition - 1) * 100 ;
        }
        else
        {
            yValue = insertPosition * 100;
        }

        var object = new Object();
        object = {
            angleField: 0, 
            nameField: domElements[k].textContent,
            uUIDField: (insertPosition + k).toString(),
            xField: 0,
            yField: yValue,
        };

        modelElem.push(object);
    }

    return modelElem;
}

//create connection element for model
function createConnectionElement (elem1, elem2)
{
    var connection = new Object();

    connection = {
        directed1Field: false,
        directed2Field: true,
        endpoint1Field: elem1,
        endpoint2Field: elem2,
        msgField: null,
        nameField: "",
        uUIDField: generateUUID(),
    };

    return connection;
}

//deletes model from canvas
function deleteModelFromDOM(modelNr)
{   
    var taskElements = document.getElementsByTagName("div");
    var canvas = "#model" + modelNr + "canvas";

    for (var i = 0; i < taskElements.length; i++) {
        if (taskElements[i].id.startsWith(modelNr)) {
            jsPlumb.detachAllConnections(taskElements[i].id);
        }
    }
    $(canvas + " div").remove();
}

//refreshes the model's connections
function regenerateConnections(model)
{
    connections = [];
    var k = 0;

    for (var i=0; i<model.subjectField[0].elementField.length;i++)
    {
        k = i - 1;

        if (k >= 0)
        {
            var prevElem = model.subjectField[0].elementField[k];
            var elem = model.subjectField[0].elementField[i];
            var connectionElem = createConnectionElement(prevElem, elem);
            connections.push(connectionElem);
        }
    }
    return connections;
}

//generate GUID for UUID Field
function generateUUID() {
    var d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function")
    {
        d += performance.now();
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c)
    {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

//replaces selected element
function replaceElement (mNr, selection, elementToReplaceId)
{
    var tmpModel = getModel(mNr);
    
    var taskName = "";
    var sender = "";
    var recipient = "";
    var yValue = (elementToReplaceId) * 100;
    elementToReplaceId++;

    taskName = prompt("Bitte geben Sie eine neue Taskbezeichnug ein: ");
    var object = new Object();
    object = {
        angleField: 0,
        uUIDField: ""+elementToReplaceId,
        nameField: taskName,
        xField: 0,
        yField: yValue
    };

    if (selection == 2) {
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
            uUIDField: ""+elementToReplaceId,
            nameField: taskName,
            xField: 0,
            yField: yValue,
            messagesField: messages
        };
    }

    if (selection == 3) {
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
            uUIDField: ""+elementToReplaceId,
            nameField: taskName,
            xField: 0,
            yField: yValue,
            msgField: msg
        };
    }

    //delete Element at postition
    tmpModel.subjectField[0].elementField.splice((elementToReplaceId-1), 0, object);


    var connections = regenerateConnections(tmpModel);
    tmpModel.subjectField[0].connectionField = connections;

    //delete old model from canvas
    deleteModelFromDOM(mNr);
    //repaint altered model
    generateElements(tmpModel.subjectField[0], mNr);

    setModel(mNr, tmpModel);
}

//unchcecks all checkboxes
function setAllCheckBoxesUnchecked()
{
   $("input:checkbox").prop('unchecked', $(this).prop("unchecked"));
}
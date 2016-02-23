function mergeModelSteps()
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

    var okButton = document.getElementById("mDiaOK");
    okButton.addEventListener('click', function () { doTheMerge(optionSelected, model1ElemIds, model2ElemIds); });
    var cnlButton = document.getElementById("mDiaCancel");
    cnlButton.addEventListener('click', function () { dialog.close(); });

    dialog.show();
}

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

    //console.log("optionSelected " + optionSelected + "\nmodel1ElemIds " + model1ElemIds + "\nmodel2ElemIds " + model2ElemIds);

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
            tmpModel2.subjectField[0].elementField.splice(insertPosition+i, 0, elementsModel1[i]);
        }
        
        //update remaining uuids in elements and connection
        insertPosition = insertPosition + elementsModel1.length;
        increaseElementIds(tmpModel2, insertPosition);
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

        deleteModelFromDOM(2);
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

        var startElementM1 = model1ElemIds[0];
        var startElementM2 = model2ElemIds[0];
        var endElementM1 = model1ElemIds[model1ElemIds.length - 1];
        var endElementM2 = model2ElemIds[model2ElemIds.length - 1];
        var insertPositionM1 = startElementM1 -1;
        var insertPositionM2 = startElementM2 -1;
        var elemToDelM1 = endElementM1 - startElementM1 + 1; 
        var elemToDelM2 = endElementM2 - startElementM2 + 1;
        
        if (elemToDelM1 > 0)
        {
            //delete element at insertPosition
            tmpModel1.subjectField[0].elementField.splice(insertPositionM1, elemToDelM1);
        }

        if (elemToDelM2 > 0)
        {
            //delete element at insertPosition
            tmpModel2.subjectField[0].elementField.splice(insertPositionM2, elemToDelM2);
        }

        //create Task Element
        if (selection == 1)
        {

        }

        //Create Recieve Element
        if (selection == 2)
        {

        }

        //Create Send Element
        if (selection == 3)
        {

        }
    }
}

function increaseElementIds(model, startId)
{
    var i = 0;
    var inc = 0;
    $.each(model.subjectField, function (objKey, objValue)
    {
        $.each(objValue.elementField, function (oKey, oValue)
        {
            inc = startId + i;
            if (parseInt(oValue.uUIDField, 10) == inc)
            {
                oValue.uUIDField = (inc + 1).toString();
                oValue.yField = inc * 100;
                i++;
            }            
        });

        i = 0;

        $.each(objValue.connectionField, function(cKey, cValue)
        {
            var inc = startId + i;
            var endpoint1 = parseInt(cValue.endPoint1Field.uUIDField, 10);
            var endpoint2 = parseInt(cValue.endPoint2Field.uUIDField, 10);

            if (endpoint1 == inc)
            {
                cValue.endPoint1Field.uUIDField = (endpoint1 + 1).toString();
                cValue.endPoint2Field.uUIDField = (endpoint2 + 1).toString();

                i++;
            }
            //var in
        });
    });
}

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

function getElementById(modelNr, id)
{
    return document.getElementById(modelNr+":"+id);
}

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

function generateModelElementsOutOfDOMElements (domElements, insertPosition)
{
    var modelElem = [];

    insertPosition++;
    for (var k=0; k<domElements.length; k++)
    {
        var object = new Object();
        object = {
            angleField: 0, 
            nameField: domElements[k].textContent,
            uUIDField: (insertPosition + k).toString(),
            xField: 0,
            yField: (insertPosition + k-1) * 100,
        };

        modelElem.push(object);
    }

    return modelElem;
}

function deleteModelFromDOM(modelNr)
{
    var id = "model" + modelNr + "canvas";
    var elements = document.getElementById(id).childNodes;

    var str = modelNr + ":";

    console.log(elements);

    for (var i = 0; i < elements.length; i++)
    {
        console.log("OUTER " + elements[i].id);
        if (elements[i].tagName == "DIV")
        {
            console.log("INNER " + elements[i].id);
            jsPlumb.detachAllConnections(elements[i].id);
            document.getElementById(id).removeChild(elements[i]);
        }
    }
}
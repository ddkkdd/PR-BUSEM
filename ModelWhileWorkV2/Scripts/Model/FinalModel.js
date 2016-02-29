var insertPosition = 0;

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
    var tmpModel3 = getModel(1);
    var elementsModel1 = [];
    var elementsModel2 = [];
    var startElement;
    var endElement;
    var elementsToDelete;

    //emptyModel
    tmpModel3.subjectField[0].elementField.splice(0, tmpModel3.subjectField[0].elementField.length);
    tmpModel3.subjectField[0].connectionField.splice(0, tmpModel3.subjectField[0].connectionField.length);
    
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
        elementsModel1 = generateModelElementsOutOfDOMElements(elementsModel1, insertPosition);
        
        for (var j = 0; j < elementsModel1.length; j++) {
            tmpModel3.subjectField[0].elementField.splice(insertPosition + j, 0, elementsModel1[j]);
        }
        insertPosition = insertPosition + elementsModel1.length;
    }

    if (elementsModel2.length > 0)
    {
        elementsModel2 = generateModelElementsOutOfDOMElements(elementsModel2, insertPosition);
        for (var j = 0; j < elementsModel2.length; j++) {
            tmpModel3.subjectField[0].elementField.splice(insertPosition + j, 0, elementsModel2[j]);
        }
        insertPosition = insertPosition + elementsModel2.length;
    }

    var connections = regenerateConnections(tmpModel3);
    tmpModel3.subjectField[0].connectionField = connections;
    model3 = tmpModel3;

    //delete old model from canvas
    deleteModelFromDOM(3);

    //repaint altered model
    generateElements(model3.subjectField[0], 3);

    console.log("INSERTPOS " + insertPosition);
}

function InsertStep()
{
    var dialog = document.getElementById("newStepDialog");
    var dialogDiv = document.getElementById("shjDiaSubjects");
    var okButton = document.getElementById("newStepDiaOK");
    okButton.addEventListener('click', function () {  });
    var cnlButton = document.getElementById("newStepDiaCancel");
    cnlButton.addEventListener('click', function () { dialog.close(); });
    dialog.show();
}
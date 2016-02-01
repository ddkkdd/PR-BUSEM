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
            console.log(optionSelected);
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
    var tmpModel1 = model1;
    var tmpModel2 = model2;

    var elementsModel1 = [];
    var elementsModel2 = [];

    console.log(model1ElemIds);

    if (optionSelected == 1)
    {
        for (var i=0; i<model1ElemIds.length; i++)
        {
            var element = document.getElementById("1:" + model1ElemIds[i]);
            elementsModel1.push(element);
        }

        for (var j=0; j<model2ElemIds.length; j++)
        {
            var element = document.getElementById("2:" + model2ElemIds[i]);
            elementsModel2.push(element);
        }

        console.log(elementsModel1);
        console.log(elementsModel2);

        increaseElementIds(tmpModel1);
        increaseElementIds(tmpModel2);

    }

    if(optionSelected == 2)
    {

    }

    if(optionSelected == 3)
    {

    }
}

function increaseElementIds(model, startId)
{
    console.log(model);
    $.each(model.subjectField, function (objKey, objValue)
    {
        console.log(objValue);
        $.each(objValue.elementField, function (oKey, oValue)
        {
            console.log(oValue);
            if (oValue.uUIDField == startId)
            {

            }
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
    console.log(modelElemIds);

    for (var i=0; i<modelElemIds.length; i++)
    {
        console.log(modelElemIds[i]);
        elements.push (getElementById(
                modelNr,
                modelElemIds[i]));
    }

    return elements;
}
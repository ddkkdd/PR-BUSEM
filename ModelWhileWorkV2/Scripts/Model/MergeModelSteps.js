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
    var tmpModel2 = getModel(3);
    
    var elementsModel1 = [];
    var elementsModel2 = [];
    
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

        increaseElementIds(tmpModel2, 2);
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
    var i = 0;
    $.each(model.subjectField, function (objKey, objValue)
    {
        $.each(objValue.elementField, function (oKey, oValue)
        {
            var inc = startId + i;
            if (parseInt(oValue.uUIDField, 10) == inc)
            {
                oValue.uUIDField = (inc+1).toString();
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

                i++
            }
            //var in
        });
    });
    console.log(model);
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
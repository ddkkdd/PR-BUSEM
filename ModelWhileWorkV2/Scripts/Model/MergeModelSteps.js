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
    
    var commonName = "";

    if (chkBoxesModel1checked.length == 1)
    {
//        commonName = chkBoxesModel1checked[0].
    }

    if (chkBoxesModel2checked.length == 1) 
    {
    //    commonName = chkBoxesModel1checked[0].
    }
    console.log(model1Elements);
    console.log(model2Elements);
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
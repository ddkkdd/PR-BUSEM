//export Model to the model directory
function exportModel(url, modelNr, fileName)
{
    var model = getModel(modelNr);
    alert(url);
    xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("fileName", fileName);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            console.log(xhr.status + ":" + xhr.statusText);
        }
    }
    var data = JSON.stringify(model);
    xhr.send(data);
    console.log(fileName);
}
function exportModel(modelNr, fileName)
{
    var model = getModel(modelNr);
    
    xhr = new XMLHttpRequest();
    var url = "http://localhost:53410/api/ProcessModel";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            console.log(xhr.status + ":" + xhr.statusText);
        }
    }
    var data = JSON.stringify(model);
    xhr.send(data);

    console.log(data);
    console.log("DONE");
}
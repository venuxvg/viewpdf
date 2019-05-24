var pageNum = 1;
var pdfScale = 1; // make pdfScale a global variable
var shownPdf; // another global we'll use for the buttons
// var url = './helloworld.pdf' // PDF to load: change this to a file that exists;
var totalPages ;




// console.log(window.location.href)

//FETCH PDF QUERY FROM PARMS
var url = new URL(window.location.href);
var query_string = url.search;
var search_params = new URLSearchParams(query_string); 
var pdfUrl = search_params.get('pdf');


//Make CORS REQUEST URL
var corss = 'https://cors-anywhere.herokuapp.com/';
var url = corss + pdfUrl;






// Loaded via <script> tag, create shortcut to access PDF.js exports.
var pdfjsLib = window['pdfjs-dist/build/pdf'];

// The workerSrc property shall be specified.
pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';


function renderPage(page) {
    var scale = pdfScale; // render with global pdfScale variable
    var viewport = page.getViewport(scale);
    var canvas = document.getElementById('the-canvas');
    var context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    var renderContext = {
        canvasContext: context,
        viewport: viewport
    };
    page.render(renderContext);
}


function displayPage(pdf, num) {
    pdf.getPage(num).then(function getPage(page) { renderPage(page); });
}




var pdfDoc =  pdfjsLib.getDocument(url).then( function getPdfHelloWorld(pdf)  {
    displayPage(pdf, 1);
    shownPdf = pdf;
    // console.log(shownPdf.numPages)
    return shownPdf.numPages
}).then(function (number){
    // console.log("ASDSADAD"+number)
    document.getElementById("currentPageNum").innerHTML = pageNum.toString(10)+'/'+number
});





var nextbutton = document.getElementById("nextbutton");
nextbutton.onclick = function () {
    if (pageNum >= shownPdf.numPages) {
        return;
    }
    pageNum++;
    document.getElementById("pageInput").value = pageNum
    document.getElementById("currentPageNum").innerHTML = pageNum.toString(10)+'/'+shownPdf.numPages
    displayPage(shownPdf, pageNum);
}



var prevbutton = document.getElementById("prevbutton");
prevbutton.onclick = function () {
    if (pageNum <= 1) {
        return;
    }
    pageNum--;
    document.getElementById("pageInput").value = pageNum
    document.getElementById("currentPageNum").innerHTML = pageNum.toString(10)+'/'+shownPdf.numPages
    displayPage(shownPdf, pageNum);
}



var zoominbutton = document.getElementById("zoominbutton");
zoominbutton.onclick = function () {
    pdfScale = pdfScale + 0.25;
    displayPage(shownPdf, pageNum);
}

var zoomoutbutton = document.getElementById("zoomoutbutton");
zoomoutbutton.onclick = function () {
    if (pdfScale <= 0.25) {
        return;
    }
    pdfScale = pdfScale - 0.25;
    displayPage(shownPdf, pageNum);
}





//goto specific page

var pageInputEvent = document.getElementById("pageInput");

pageInputEvent.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
   event.preventDefault();
   var pageNumber = parseInt(document.getElementById("pageInput").value);
//    alert(pageNumber)



   if (pageNumber <= 0 || pageNumber > shownPdf.numPages) {
    return;
    }

    pageNum = pageNumber;
    document.getElementById("currentPageNum").innerHTML = pageNum.toString(10)+'/'+shownPdf.numPages
    displayPage(shownPdf, pageNum);
    // console.log(pageNum)
}
});


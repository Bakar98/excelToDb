var inputFile = document.getElementById("inputFile");
var btn = document.getElementById("btn");


function check(){
  if(inputFile.value){
    btn.style.display = "block";
  }
}

function showData(){
  window.location.href = "/showdata"
}
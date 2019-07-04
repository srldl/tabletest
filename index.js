'use strict';

//the rows
let dataRows=[["A","AA","2019-06-14T12:00:00Z"],["B","BB","2019-06-14T12:00:00Z"]];

//Create object with input parameters
let obj =  {  "dataRows": dataRows,
              "headers": ["project", "subproject", "event_date"],
              "selectlist": {"project":["A","B","C"]},
              "autocompletes": ["subproject"],
              "dateFields":["event_date"],
              "id": "exceltable"
};

function input_element(id,inputValue,readOnly,backgroundColor,borderColor,fontWeight,fontSize){
  var input = document.createElement("input");
  input.type = "text";
  input.id = id;
  input.value= inputValue;
  input.readOnly = readOnly;
  input.style.backgroundColor = backgroundColor;
  input.style.borderColor = borderColor;
  input.style.fontWeight = fontWeight;
  input.style.fontSize = fontSize;
  return input;
}

function th_element(id,textContent){
  let th = document.createElement("th");
  th.id = id;
  th.textContent = textContent;
  return th;
}

  let container = document.getElementById("header1");
  let th1 = th_element("header_1","Foobar1");
  let th2 = th_element("header_1","Foobar2");

  let input = input_element('header_1','Foobar',true,'lightsteelblue','lightsteelblue','bold','120%');
  container.appendChild(th1);
  container.appendChild(th2);
  //container.appendChild(th);

/*  var table = document.createElement("table");
  container.appendChild(table);
  var thead = document.createElement("thead");
  container.appendChild(thead);
  var tr = document.createElement("tr");
  container.appendChild(tr);
  var th = document.createElement("th");
  th.value = "ttt";
  container.appendChild(th); */

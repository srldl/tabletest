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

function input_element(id_td,id,inputValue,readOnly,backgroundColor,borderColor,fontWeight,fontSize){
  var td = document.createElement("td");
  td.id = id_td;
  var input = document.createElement("input");
  input.type = "text";
  input.id = id;
  input.value= inputValue;
  input.readOnly = readOnly;
  input.style.backgroundColor = backgroundColor;
  input.style.borderColor = borderColor;
  input.style.fontWeight = fontWeight;
  input.style.fontSize = fontSize;
  td.appendChild(input);
  return td;
}

function th_element(id,textContent){
  let th = document.createElement("th");
  th.id = id;
  th.textContent = textContent;
  return th;
}

  let container_header = document.getElementById("header1");
  let th1 = th_element("header_1","Foobar1");
  let th2 = th_element("header_1","Foobar2");
  container_header.appendChild(th1);
  container_header.appendChild(th2);

  let container = document.getElementById("tbody1");
  let tr1 = document.createElement("tr");
  let input1 = input_element('cell_1_1','input_1_1','Foobar11',false,'white','white','normal','100%');
  let input2 = input_element('cell_1_2','input_1_2','Foobar21',false,'white','white','normal','100%');
  tr1.appendChild(input1);
  tr1.appendChild(input2);
  container.appendChild(tr1);

/*  var table = document.createElement("table");
  container.appendChild(table);
  var thead = document.createElement("thead");
  container.appendChild(thead);
  var tr = document.createElement("tr");
  container.appendChild(tr);
  var th = document.createElement("th");
  th.value = "ttt";
  container.appendChild(th); */

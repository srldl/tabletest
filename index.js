'use strict';

//the rows
let dataRows=[["A","AA","2019-06-14T12:00:00Z"],["B","BB","2019-06-14T12:00:00Z"]];

//Create object with input parameters
let obj =  {  "dataRows": [], //dataRows,
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

/* Create a new row */
function new_row(row,no_columns){
  let tr1 = document.createElement("tr");
  for (let j=0;j<no_columns;j++){
    let input1 = input_element('cell_'+row+'_'+j,'input_'+row+'_'+j,'',false,'white','white','normal','100%');
    tr1.appendChild(input1);
 }
 return tr1;
}

function th_element(id,textContent){
  let th = document.createElement("th");
  th.id = id;
  th.textContent = textContent;
  return th;
}

  //Create header
  let container_header = document.getElementById("header1");
  for (let i=0;i<obj.headers.length;i++){
      let th = th_element("header_"+ i,obj.headers[i]);
      container_header.appendChild(th);
  }

  //Insert values into table
  let container = document.getElementById("tbody1");
  //Applies if obj.dataRows (saved rows) is empty
  if (obj.dataRows === undefined || obj.dataRows.length === 0) {
    let tr1 = new_row(2,obj.headers.length);
    container.appendChild(tr1);
  }

  //This only applies if obj.dataRow (saved rows) is not empty, otherwise it generates nothing
  for (let k=0;k<obj.dataRows.length;k++){
       let tr1 = document.createElement("tr");
       for (let j=0;j<obj.dataRows[0].length;j++){
          let input1 = input_element('cell_'+k+'_'+j,'input_'+k+'_'+j,obj.dataRows[k][j],false,'white','white','normal','100%');
          tr1.appendChild(input1);
       }
       container.appendChild(tr1);
  }

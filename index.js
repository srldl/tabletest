'use strict';

//the rows
let dataRows=[["A","AA","2019-06-14T12:00:00Z"],["B","BB","2019-06-13T12:00:00Z"],
              ["C","CC","2019-06-14T12:00:00Z"],["D","DD","2019-07-17T12:00:00Z"]];

//Create object with input parameters
let obj =  {  "dataRows": dataRows,
              "headers": ["project", "subproject", "event_date"],
              "headers_tooltip": ["project letter","subproject letters","start date of work"],
              "selectlist": {"project":["A","B","C","D"]},
              "autocompletes": ["subproject"],
              "dateFields":["event_date"],
              "id": "exceltable"
};


//Holds the width of the table
let col_length = obj.headers.length;
//This counter holds next row_number
let row_length = 0;
//Holds the array marked for copy
let drag_arr = [];



function input_element(id_td,id,inputValue,readOnly,backgroundColor,borderColor,fontWeight,fontSize){
  var td = document.createElement("td");
  td.id = id_td;
//  td.ondragstart = addEventListener('drop', function(event) {
  //  var data = event.dataTransfer.getData("text/plain");
  //  event.target.value = data;
//  });

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
    let input1 = input_element('td_'+row+'_'+j,'input_'+row+'_'+j,'',false,'white','white','normal','100%');
    tr1.appendChild(input1);
 }
 row_length++;
 return tr1;
}

function th_element(id,textContent, textTooltip){
  let th = document.createElement("th");
  th.id = id;
  th.title = textTooltip;
  th.textContent = textContent;
  return th;
}

  //Create header
  let container_header = document.getElementById("header1");
  for (let i=0;i<obj.headers.length;i++){
      let th = th_element("header_"+ i,obj.headers[i],obj.headers_tooltip[i]);
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
          let input1 = input_element('td_'+k+'_'+j,'input_'+k+'_'+j,obj.dataRows[k][j],false,'white','white','normal','100%');
          tr1.appendChild(input1);
       }
       row_length++;
       container.appendChild(tr1);
  }

  // This function checks if an arrow key has been pressed
  // If so, it changes focus
  function checkKey(e) {
  e = e || window.event;
  let pos = document.activeElement.id.split("_");
//  let pos = active_cell.id.split("_");
  let row = parseInt(pos[1]);
  let col = parseInt(pos[2]);

  if (e.keyCode == '38') {
    // up arrow
    if (row > -1) {
         let elem = document.getElementById("input_"+(row-1).toString()+"_"+pos[2]);
         elem.select();
    }
  } else if (e.keyCode == '40') {
    // down arrow
    if (row < row_length+1) {
         let elem = document.getElementById("input_"+(row+1).toString()+"_"+pos[2]);
         elem.select();
    }
  } /*else if (e.keyCode == '37') {
    // left arrow
    if  (col > -1) {
         let elem = document.getElementById("input_"+pos[1]+"_"+(col-1).toString());
         elem.select();
    }
  } else if (e.keyCode == '39') {
    // right arrow
    if (col < col_length+1) {
      //   let elem = document.getElementById("input_"+pos[1]+"_"+(col+1).toString());
         console.log(elem);
         elem.select();
    }
  }*/
}

document.addEventListener("dragover", function( event ) {
      let id = event.target.id;
      //Don't copy yet, add id to drag_arr - drag_arr should only contain same values in a row
     if ((id.startsWith('td'))&&(id !== drag_arr[drag_arr.length-1])) {
       //if user have returned back (regretting), skip last cell
       if (id === drag_arr[drag_arr.length-2]) {
         let last_id = drag_arr[drag_arr.length-1];
         //Remove selected border
         document.getElementById(last_id).classList.remove('dragCell');
         drag_arr.pop();
       } else {  //No user regrets, continue dragging
         //Set a border so the user can see the cell is selected
         document.getElementById(id).classList.add('dragCell');
         drag_arr.push(id);

       }
     }
 }, false);

 document.addEventListener("dragend", function( event ) {
    //If drop_arr last value is equal to first value, skip everything.
    //The user has withdraw the action.
    let drop_value = document.getElementById(event.target.id).childNodes[0].value;
    for (var entry of drag_arr) {
          let elem = document.getElementById(entry);
          elem.classList.remove('dragCell');
          if (drag_arr[drag_arr.length-1] !== event.target.id) {
             elem.childNodes[0].value = drop_value;
          }
    }
    //Reset drag_arr until next drag/drop
    drag_arr = [];
 }, false);

 document.addEventListener("drop", function( event ) {
   event.preventDefault();
 }, false);


 //Remove style borders from the whole table
 function  remove_borders (){
   for (let i=0;i<row_length;i++){
      for (let j=0;j<col_length;j++){
         document.getElementById('td_'+ i + '_' + j).classList.remove('selectCell');
         document.getElementById('td_'+ i + '_' + j).classList.remove('dragCell');
      }
   }
 }


//Set cell and row select
let handleClick = function (event) {
  let doc = document.getElementById(event.explicitOriginalTarget.id);
  let elem = doc.parentElement;
  //Remove borders from the whole table
  remove_borders();
  //Mark selected cell
  elem.classList.add("selectCell");
  //Make it draggable
  elem.draggable = "true";
  elem.ondragstart = addEventListener('dragstart', function(event) { event.dataTransfer.setData('text/plain', doc.value); });
}

// new button pressed
let newBtn = function (event) {
    console.log('newBtn');
};

// copy button pressed
let copyBtn = function (event) {
    console.log('copyBtn');
};

// save button pressed
let delBtn = function (event) {
    console.log('delBtn');
};

// save button pressed
let saveBtn = function (event) {
    console.log('saveBtn');
    container = document.getElementById("tbody1");
    console.log(container);
};


document.onkeydown = checkKey;
container.addEventListener('click', handleClick);
document.getElementById("newBtn").addEventListener('click', newBtn);
document.getElementById("copyBtn").addEventListener('click', copyBtn);
document.getElementById("delBtn").addEventListener('click', delBtn);
document.getElementById("saveBtn").addEventListener('click', saveBtn);

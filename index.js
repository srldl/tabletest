'use strict';

//the rows
let dataRows= [["A","AA","2019-06-14T12:00:00Z"],["B","BB","2019-06-13T12:00:00Z"],
              ["C","CC","2019-06-14T12:00:00Z"],["D","DD","2019-07-17T12:00:00Z"]];

//Create object with input parameters
let obj =  {  "dataRows": dataRows,
              "headers": ["project", "subproject", "event_date"],
              "headers_tooltip": ["project acronym","subproject acronym","start work date"],
              "selectlist": {"project":["A","B","C","D"]},
              "autocompletes": ["subproject"],
              "dateFields":["event_date"],
              "id": "exceltable"
};


//Holds the width of the table
let col_length = obj.headers.length + 2;
//This counter holds next row_number
let row_length = 1;
//Holds the array marked for copy
let drag_arr = [];
//The previous selected cell
let prev_selected_cell = '';



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
function new_row(no_columns){
  let tr1 = document.createElement("tr");
  //Count column
  tr1.appendChild(new_count_id('count_'+row_length,row_length));
  //User columns
  for (let j=1;j<no_columns-1;j++){
    let input1 = input_element('td_'+row_length+'_'+j,'input_'+row_length+'_'+j,'',false,'white','white','normal','100%');
    tr1.appendChild(input1);
  }
  //Id columns
  tr1.appendChild(new_count_id('id_'+row_length,obj.id+'-'+row_length));
  row_length++;
  return tr1;
}

//Create header element
function th_element(id,textContent, textTooltip){
  let th = document.createElement("th");
  th.id = id;
  th.title = textTooltip;
  th.textContent = textContent;
  return th;
}

//Create count and id columns
function new_count_id (id,innerhtml){
    let td0 = document.createElement("td");
    td0.id = id;
    td0.innerHTML = innerhtml;
    return td0;
}

  //Create headers:
  let container_header = document.getElementById("header1");

  //1. First column is the count
  let th0 = th_element("header_0","no",'');
  container_header.appendChild(th0);

  //2. The next is the user headings
  for (let i=0;i<obj.headers.length;i++){
      let th = th_element("header_"+ i,obj.headers[i],obj.headers_tooltip[i]);
      container_header.appendChild(th);
  }

  //3. Finally the id header
  let th_last = th_element("header_"+obj.headers.length,"id",'');
  container_header.appendChild(th_last);

  //Insert values into table body
  let container = document.getElementById("tbody1");

  //This only applies if obj.dataRows (fetched rows) is empty, otherwise omitted
  if (obj.dataRows === undefined || obj.dataRows.length === 0) {
    let tr1 = new_row(obj.headers.length+2);
    container.appendChild(tr1);
  }

  //This only applies if obj.dataRow (fetched rows) is not empty, otherwise it generates nothing
  for (let k=1;k<(obj.dataRows.length+1);k++){
       let tr1 = document.createElement("tr");
       //First column is the count
       tr1.appendChild(new_count_id("count_"+row_length,row_length));
       //Second to almost last column is user info
       for (let j=1;j<obj.dataRows[0].length+1;j++){
          let input1 = input_element('td_'+k+'_'+j,'input_'+k+'_'+j,obj.dataRows[k-1][j-1],false,'white','white','normal','100%');
          tr1.appendChild(input1);
       }
       //Last column is the id
       tr1.appendChild(new_count_id("id_"+row_length,obj.id+"-"+row_length));
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

//Drag and drop - drag over event
document.addEventListener("dragover", function( event ) {
      let id = event.target.id;
      //Don't copy yet, add id to drag_arr - drag_arr should only contain same values in a row
     if ((id.startsWith('td'))&&(id !== drag_arr[drag_arr.length-1])) {
       //if user have returned back (regretting), skip last cell
       if (id === drag_arr[drag_arr.length-2]) {
         //Remove selected border
         document.getElementById(drag_arr[drag_arr.length-1]).classList.remove('dragCell');
         drag_arr.pop();
       } else {  //No user regrets, continue dragging
         //Set a border so the user can see the cell is selected
         document.getElementById(id).classList.add('dragCell');
         drag_arr.push(id);

       }
     }
 }, false);

 //Drag and drop - end of dragging
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

 //Drag and drop - disable drop
 document.addEventListener("drop", function( event ) {
   event.preventDefault();
 }, false);


//Set cell and row select
let handleClick = function (event) {
  if ((event.explicitOriginalTarget.id).startsWith('input') || (event.explicitOriginalTarget.id).startsWith('select')) {
      let doc = document.getElementById(event.explicitOriginalTarget.id);
      let elem = doc.parentElement;
      //Remove borders from the whole table
      if (prev_selected_cell !== '') { document.getElementById(prev_selected_cell).classList.remove('selectCell');};
       //Update this to be the previous selected cell
       prev_selected_cell = elem.id;
      //Mark selected cell
      elem.classList.add("selectCell");
      //Make it draggable
      elem.draggable = "true";
      elem.ondragstart = addEventListener('dragstart', function(event) { event.dataTransfer.setData('text/plain', doc.value); });
}
}

// new button pressed
let newBtn = function (event) {
    console.log('newBtn');
    //Get number of new rows wanted
    let num = addRows();
    for (let i=0;i<num;i++){
        let tr = new_row(obj.headers.length+2);
        container.appendChild(tr);
    }
};

// copy button pressed
let copyBtn = function (event) {
    console.log('copyBtn');
    if (prev_selected_cell == '') {
       alert("Please select a row");
    } else {    //Get the selected row
       let tr = (document.getElementById(prev_selected_cell)).parentElement;
       document.getElementById(prev_selected_cell).classList.remove('selectCell');
       console.log(tr);
       //Get number of new rows wanted
       let num = addRows();
       for (let i=0;i<num;i++){
            let cln = tr.cloneNode(true);
            //cln.classList.remove('selectCell');
            container.appendChild(cln);
       }
    }
};

// save button pressed
let delBtn = function (event) {
    console.log('delBtn');
    if (prev_selected_cell == '') {
       alert("Please select a row");
    } else {    //Get the selected row
       let td = (document.getElementById(prev_selected_cell));
       document.getElementById("tbody1").removeChild(td.parentElement);
    }
};

// save button pressed
let saveBtn = function (event) {
    console.log('saveBtn');
    container = document.getElementById("tbody1");
    console.log(container);
};

//Get the number of wanted new/copied/deleted rows
function addRows(){
   return document.getElementById("addRows").value;
};

document.onkeydown = checkKey;
container.addEventListener('click', handleClick);
document.getElementById("newBtn").addEventListener('click', newBtn);
document.getElementById("copyBtn").addEventListener('click', copyBtn);
document.getElementById("delBtn").addEventListener('click', delBtn);
document.getElementById("saveBtn").addEventListener('click', saveBtn);

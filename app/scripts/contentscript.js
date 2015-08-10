'use strict';

console.log('\'Allo \'Allo! Content script');

document.onmouseup = function(e) {detectDescription(e)};

function detectDescription(e){
  console.log(e);
  console.log(e.srcElement.parentElement.classList);
  var description = window.getSelection() || document.getSelection() || document.selection.createRange();
  var dtext = description.toString();
  if (hasParent(e,"sweet-alert") || dtext.trim() == "" || dtext == null) {
  } else {
    taskCreation(dtext);
  }
}
function taskCreation(description){
  swal({
    title: "Create a task",
    text: "Desciption: " + description,
    type: "input",
    showCancelButton: true,
    closeOnConfirm: false,
    inputPlaceholder: "Name of Task"
  },function(inputValue){
    if (inputValue === false) return false;
    if (inputValue === "") {
      swal.showInputError("You need to write a name!");
      return false;
    }
    createTask(inputValue, description)});
}

function createTask(name, description){
  var response = postToICU(name,description);
  //swal.close();
  if (response) {
    swal({
      title: "Task Created",
      text: "Name: " + name + "\nDescription: " + description,
      type: "success",
      showLoaderOnConfirm: false});

  }
  else {
    swal("Error", "Unable to create task", "error");
  }
}


function postToICU(title,description) {
  var data = {
    //project: "55c73e4d18c2f1692baca923",
    project: settings.project,
    title: title,
    description: description
  };
  var pairs = [];
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      pairs.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
    }
  }
 var form_data = pairs.join("&");

  var xhr = new  XMLHttpRequest();
  xhr.onload = function() {
    var responseText = xhr.responseText;
    console.log(responseText);
    // process the response.
  };
  //xhr.onreadystatechange = ready;
  //
  //function ready() {
  //  if (xhr.readyState < 4) return;
  //  if (xhr.status !== 200) return;
  //
  //  if (xhr.readyState === 4) {
  //    callback(xhr);
  //  }
  //}
  try {
    xhr.open('POST', 'http://api.icu.dev6.linnovate.net/api/tasks', false);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    //xhr.setRequestHeader("Authorization",
    //  "Bearer eyJhbGciOiJIUzI1NiJ9.JTdCJTIyX2lkJTIyOiUyMjU1YzBiMjU2YjRkNTZmODU0NDJkMTNjOSUyMiwlMjJuYW1lJTIyOiUyMlJhZmFlbCUyMiwlMjJlbWFpbCUyMjolMjJyYWZhZWxAbGlubm92YXRlLm5ldCUyMiwlMjJ1c2VybmFtZSUyMjolMjJyYWZhZWxiJTIyLCUyMl9fdiUyMjowLCUyMnByb3ZpZGVyJTIyOiUyMmxvY2FsJTIyLCUyMnJvbGVzJTIyOiU1QiUyMmF1dGhlbnRpY2F0ZWQlMjIlNUQlN0Q.qtk5vD7m-gFSRUaKxRa-cabMu0ObNSXvrRLuxaFsyqU");
    xhr.setRequestHeader("Authorization", settings.authentication);
    xhr.send(form_data);
  }
  catch (e){
    return false;
  }

  if(IsRequestSuccessful(xhr)){
    return true;
  }
  else {
    return false;
  }
}
function hasParent(element, className) {

  var target = element.target;
  if (!element.target)
    return 0;
  var i = 10;
  while (i--) {
    if (target == null)
      return false;
    if (target.classList[0] === className)
      return true;
    else
      target = target.parentElement;
  }
  return false;

}

function IsRequestSuccessful (httpRequest) {
  // IE: sometimes 1223 instead of 204
  var success = (httpRequest.status == 0 ||
  (httpRequest.status >= 200 && httpRequest.status < 300) ||
  httpRequest.status == 304 || httpRequest.status == 1223);

  return success;
}
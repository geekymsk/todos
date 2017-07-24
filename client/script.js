var $ = require('jquery');
var todoTemplate = require("../views/partials/todo.hbs");
$(function() {
  $(":button").on('click', function() {
    addTodo();
  });
  // $('input').on('click', function() {
  //   $(this).parent().toggleClass('checked');
  // });
  $('ul').on('change', 'li :checkbox', function() {
  var $this = $(this),
      $input = $this[0],
      $li = $this.parent(),
      id = $li.attr('id'),
      checked = $input.checked,
      data = { done: checked };
  updateTodo(id, data, function(d) {
    $this.next().toggleClass('checked');
  });
});


$(":text").on('keypress',function(e) {     // add todo
 var key = e.keyCode;
 if( key == 13 || key == 169) {
   addTodo();
   e.preventDefault();
   e.stopPropagation();
   return false;
 }
});


$('ul').on('keydown', 'li span', function(e) {
 var $this = $(this),
     $span = $this[0],
     $li = $this.parent(),
     id = $li.attr('id'),
     key = e.keyCode,
     target = e.target,
     text = $span.innerHTML,
     data = { text: text};
 $this.addClass('editing');
 if(key === 27) { //escape key
   $this.removeClass('editing');
   document.execCommand('undo');
   target.blur();
 } else if(key === 13) { //enter key
   updateTodo(id, data, function(d) {
     $this.removeClass('editing');
     target.blur();
   });
   e.preventDefault();
 }
});


$('ul').on('click', 'li a', function() {
  var $this = $(this),
  $input = $this[0],
  $li = $this.parent(),
  id = $li.attr('id');
  deleteTodo(id, function(e){
    deleteTodoLi($li);
  });
});


var deleteTodo = function(id, cb) {
  $.ajax({
    url: '/api/todos/'+id,
    type: 'DELETE',
    data: {
      id: id
    },
    dataType: 'json',
    success: function(data) {
      cb();
    }
  });
};

var deleteTodoLi = function($li) {
  $li.remove();
};

var addTodo = function() {
  // console.log('click event in addtodo');
  var text = $('#add-todo-text').val();
  $.ajax({
    url: '/api/todos',
    type: 'POST',
    data: {
      text: text
    },
    dataType: 'json',
    success: function(data) {
      // alert(data.status, '*************');
      var todo = data.todo;
      console.log(data.todo, 'here after creating todo' );
      // var newLiHtml = '<li><input type="checkbox"><span> ' + todo + '</span></li>';
      var newLiHtml = todoTemplate(todo);
      alert(newLiHtml, 'new li html')
      $('form + ul').append(newLiHtml);
      $('#add-todo-text').val('');
    }
  });
};


var updateTodo = function(id, data, cb) {
  $.ajax({
    url: '/api/todos/'+id,
    type: 'PUT',
    data: data,
    dataType: 'json',
    success: function(data) {
      cb();
    }
  });
};
});

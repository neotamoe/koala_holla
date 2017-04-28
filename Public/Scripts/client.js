console.log('js test');

$(document).ready(onReady);

function onReady(){
  console.log('jQuery test');
  getKoalas();
  $('#addKoala').on('click', addKoala);
  $(document).on('click', '.removeKoala', removeKoala);
}

function getKoalas(){
    console.log('in getKoalas');
    $.ajax({
      url: '/getKoalas',
      type: 'GET',
      success: function(response){
        console.log('back from server with:', response);
        $('#house').empty();
        for (var i = 0; i < response.length; i++) {
          $('#house').append('<p>'+ response[i].name + ', ' + response[i].sex + ', ' + response[i].age + ', ' + response[i].ready_for_transfer + ', ' + response[i].notes + '<button class="removeKoala" data-koalaid='+response[i].id +'>Remove</button></p>');
        }  //end for loop
      }  // end success
    });  //end ajax
}  //end getKoalas

function addKoala (){
  console.log('you added a koala!');
  var objectToSend = {
    name: $('#name').val(),
    sex: $('#sex').val(),
    ready: $('#ready').val(),
    age: $('#age').val(),
    notes: $('#notes').val()
  };
  console.log('sending:', objectToSend);
  $.ajax({
    url: '/addKoala',
    type: 'POST',
    data: objectToSend,
    success: function(response){
      console.log('back from server with ', response);
      getKoalas();
    }
  });
}

function removeKoala (){
  var myId= $(this).data('koalaid');
  console.log('remove koala button clicked' + ' for id:', myId);
  var objectToSend = {
    koalaId: myId
  };
  $.ajax({
    url:'/removeKoala',
    type: 'DELETE',
    data: objectToSend,
    success: function(response){
      console.log('back from server with: ', response);
      getKoalas();
    } //end success
  });  //end ajax
}  //end removeKoala

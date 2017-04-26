console.log('js test');

$(document).ready(onReady);

function onReady(){
  console.log('jQuery test');
  getKoalas();
  $('#addKoala').on('click', addKoala);
}

function getKoalas(){
    console.log('in getKoalas');
    $.ajax({
      url: '/getKoalas',
      type: 'GET',
      success: function(response){
        console.log('back from server with:', response);
        for (var i = 0; i < response.length; i++) {
          $('#house').append('<p>'+ response[i].name + ', ' + response[i].sex + ', ' + response[i].age + ', ' + response[i].ready_for_transfer + ', ' + response[i].notes + '</p>');
        }  //end for loop
      }  // end success
    });  //end ajax
}  //end getKoalas

function addKoala (){
  console.log('you added a koala!');
}
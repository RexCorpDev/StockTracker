'use strict';

$(function(){

  // $('.personForm').submit('click', AJAXcall.getPerson);
  // $('.personForm').submit('click', AJAXcall.getNext10);
  $('.personForm').submit('click', AJAXcall.get10People)
})

function getRandom(){
  return Math.floor(Math.random()*86);
}

var AJAXcall = {
  get10People: function(event){
    event.preventDefault();

    $.ajax('http://swapi.co/api/people/?page=1')
      .done(function(data, statusStr, promise){
        var personObj = data.results;
        var $personCards = personObjs.map(makePersonCard);
        $('.people').append($personCards);
      })
      .fail(function(err){
        console.error(err);
      });


    console.log('promise: ', promise);

    // $.ajax({
    //   url: `http://swapi.co/api/people/`,
    //   success: function(data){
    //     var ArrayToAppend = [];
    //
    //     for(var i = 0;, i < data.length; i++){
    //       var results = makePersonCard(PersonObj[i]);
    //       ArrayToAppend.push(results);
    //     }
    //     makePersonCard(ArrayToAppend);
    //   }
    // }); //---end of AJAX

  },

  getPerson: function(event){
    event.preventDefault();
    //Make HTTP request
    var randomPerson = getRandom().toString();
    var userNumber = $('.personNumber').val();

    $.ajax({
      url: `http://swapi.co/api/people/${userNumber}/`,
      success: function(PersonData) {
        var $person = makePersonCard(PersonData);

        $('.people').append($person);
      },
      error: function(err) {
      }
    });
  }
}

function makePersonCard (PersonObj){
  var $card = $('<div>').addClass('card pull-right');
  var $name = $('<p>').addClass('pull-right').text(`Name: ${PersonObj.name}`);
  var $birth =$('<p>').addClass('pull-right').text(`Birth: ${PersonObj.birth_year}`);
  var $gender =$('<p>').addClass('pull-right').text(`Gender: ${PersonObj.gender}`);

  $card.append($name, $birth, $gender);

  return $card;
}

// function renderPeople(people){
//   // http://swapi.co/api/people/  the first page of people
//   // make a request to the DB with resource(url)
//   // receive the first 10 person objects
//   // render those as cards on the DOM
//
//
//
// }



//
// BEFORE pagination
//
// 'use strict';
//
// $(function(){
//
//   $('.personForm').submit('click', AJAXcall.getPerson);
//
//
// })
//
// function getRandom(){
//   return Math.floor(Math.random()*86);
// }
//
// var AJAXcall = {
//   getPerson: function(event){
//     event.preventDefault();
//     //Make HTTP request
//     var randomPerson = getRandom().toString();
//     var userNumber = $('.personNumber').val();
//     console.log(userNumber);
//
//     $.ajax({
//       url: `http://swapi.co/api/people/${userNumber}/`,
//       success: function(PersonData) {
//         console.log('PersonData: ', PersonData);
//         var $person = makePersonCard(PersonData);
//         $('.people').append($person);
//       },
//       error: function(err) {
//         console.error('error: ', err);
//       }
//     });
//   }
// }
//
// function makePersonCard (PersonObj){
//   var $card = $('<div>').addClass('card');
//   var $name = $('<p>').text(`Name: ${PersonObj.name}`);
//   var $birth =$('<p>').text(`Birth: ${PersonObj.birth_year}`);
//   var $gender =$('<p>').text(`Gender: ${PersonObj.gender}`);
//
//   $card.append($name, $birth, $gender);
//
//   return $card;
// }

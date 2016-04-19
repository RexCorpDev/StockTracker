'use strict';

/**
* function SEARCH = Takes input and makes jsonP request.
* 		Performs error check if there is no input.
*   	maps out all possible search results with jquery render tags.
*    	Appends those to the DOM.
* function SAVE = If the checkbox is clicked inside those elements when SAVE button is clicked, then they are saved in LS.
* function SHOW = If the SHOW button is clicked then LS send it's contents to SHOW function.
* 		Show function maps results and appends them to the DOM.
*/


$(function(){
  // ----------- STOCK STORAGE -----------------
  var Storage = {
    getWorkingCopy: function () {
      try {
        var currentLS = JSON.parse(localStorage.stocks);
      } catch (err) {
        var currentLS = [];
        // console.log(err);
      }
      var workingLS = currentLS;
      return workingLS;
    },
    writeToLocalStorage: function (workingLS) {
      var LScpy_AfterSplice = workingLS;
      localStorage.stocks = JSON.stringify(workingLS);
    }
  }

  /** check for LocalStorage, if found, reveal: SHOW, EDIT*/
  if(Storage.getWorkingCopy().length > 0){
    $('.showFaves').css('visibility', 'visible');
    $('.showEdit').css('visibility', 'visible');
  }


  $('.search').on('click', Search);
  $('.saveSymbol').on('click', Save);
  $('.showFaves').on('click', ShowFaves);
  $('.showEdit').on('click', EditContacts);
  $('.deleteSelected').on('click', deleteSelected);
});

function deleteSelected(event){

  $('input:checked').closest('div').remove();

  var LocalStock = Storage.getWorkingCopy();


}

function ShowFaves(event){
  var LocalStock = Storage.getWorkingCopy();
  /* GET-symbol DATA */
  var $caughtSymbols = [];
  var $UpdatedSymbols = [];
  for(var i = 0; i < LocalStock.length; i++){
    $.getJSON(`http://dev.markitondemand.com/MODApis/Api/v2/Lookup/jsonp?input=${LocalStock[i]}&callback=?`).done(function(data){
      var $UpdatedSymbols = data;
      var $sResultsForDOM = $UpdatedSymbols.map(renderSearch);
      console.log($sResultsForDOM);
      $('.searchResults').append($sResultsForDOM);
    });
  }; /* end of FOR loop */

  /* GET-MARKET DATA */
  var $caughtQuote = [];
  var $UpdatedQuote = [];
  for(var i = 0; i < LocalStock.length; i++){
    $.getJSON(`http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp?symbol=${LocalStock[i]}&callback=?`).done(function(data){
      var $UpdatedQuotes = data;
      var $qResultsForDOM = $UpdatedQuotes.map(renderQuote);
      console.log($qResultsForDOM);
      $(`#${data.symbol}`).append($qResultsForDOM);
    });
  }; /* end of FOR loop */


  /* Make SAVE-button available when SEARCH-button is pressed */
  $('button.showEdit').css('visibility', 'visible');
  $('input').val('');

}

function Search(event){
  event.preventDefault();

  $('div.searchResults').empty();

  var SearchTerm = $('input').val();
  $.getJSON(`http://dev.markitondemand.com/MODApis/Api/v2/Lookup/jsonp?input=${SearchTerm}&callback=?`)
  .done(function(data){
    var NoData = data.length;
    var SearchError;

    /*check for error*/
    errorCheck(NoData);
    function errorCheck(length){
      if(length === 0){
        SearchError = 'Search Empty. Try again.';
        $('hr').append().addClass('error').text(SearchError);
        setTimeout(function(){
          $('.error').remove();
          $('<hr>').appendTo('div.header');
        }, 2000)
        return;
      }

    }

    if(NoData == 0){
      $('input').val('');
      return;
    }
    //display results of Search to DOM


    var SearchResults = data;

    /*Send data results to render function for mapping them to DOM elements */
    var $ResultsForDOM = SearchResults.map(renderSearch);
    $('.searchResults').append($ResultsForDOM);

    var $FavoriteBox = $('<input>').attr({
      'type':'checkbox',
      checked: false
    });

    $('div.symbol-card.result').prepend($FavoriteBox);

    /* Make SAVE-button available when SEARCH-button is pressed */
    $('button.saveSymbol').css('visibility', 'visible');
    $('input').val('');
  })
  .fail(function(err) {
    console.log('err: ', err);
  })

}

function Save(event){
  event.preventDefault();
  var $checkedStocks = [];
  var $checkedItems = $('input:checked').closest('div').find('span.symbol.result');
  $($checkedItems).each(function(){
    var text = $(this).text();
    return $checkedStocks.push(text.split(' ').pop());
  });

  var LocalStock = Storage.getWorkingCopy();
  // console.log('before map',LocalStock);
  $checkedStocks.map(a => LocalStock.push(a))
  // console.log('after map', LocalStock);
  Storage.writeToLocalStorage(LocalStock);


  var $showFaves = $('button.showFaves').css('visibility', 'visible');
  $('div.searchResults').empty();
  $('input').val('');

}

function EditContacts(event){
  var $EditInput = $('<input>').attr({'type':'checkbox', checked: false})
  $('div.symbol-card.result').prepend($EditInput);
  if($('input:checked')){
    return $('.deleteSelected').css('visibility', 'visible');
  }
}

function renderQuote(data){
  var $qCard = $('<span>').attr('id', $qSymbol).addClass('quote-card result  col-xs-12');
  var $qSymbol = data.Symbol;
  var $Open = $('<span>').addClass('open result  col-xs-12').text(`Exchange: ${data.Open}`);
  var $High = $('<span>').addClass('high result  col-xs-12').text(`Name: ${data.High}`);
  var $Low = $('<span>').addClass('Low result  col-xs-12').text(`Symbol: ${data.Low}`);
  var $Close = $('<span>').addClass('close result  col-xs-12').text(`Symbol: ${data.Close}`);

  console.log();
    console.log();
      console.log();
        console.log();
          console.log();
          console.log();


  $qCard.append($Open, $High, $Low, $Close);
  return $qCard;
}

function renderEdit(data){
  var $Card = $('div.symbol-card.result');
  var $Input = $('<input>').attr({'type':'checkbox', checked: false});

  $Card.prepend($Input);
  // return $Card;
}

function renderSearch(data){
  var $Card = $('<div>').attr('id', data.Symbol).addClass('symbol-card result  col-xs-12');
  var $Exchange = $('<span>').addClass('stock result  col-xs-12').text(`Exchange: ${data.Exchange}`);
  var $Name = $('<span>').addClass('name result  col-xs-12').text(`Name: ${data.Name}`);
  var $sSymbol = $('<span>').addClass('symbol result  col-xs-12').text(`Symbol: ${data.Symbol}`);

  $Card.append($Exchange, $Name, $sSymbol);

  return $Card;
}

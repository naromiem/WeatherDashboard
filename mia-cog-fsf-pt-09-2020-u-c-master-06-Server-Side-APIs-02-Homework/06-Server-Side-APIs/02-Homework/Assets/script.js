$(document).ready(function(){
    var apiKey = 'ef6947237f0042414bb81d7fc5566767';

    //get the btn click
    $('#searchBtn').click(function(){
       
        //get the text value
        var city = $("#searchValue").val();  
          today(city);
          getForecast(city);
          addCity(city);

    });


    // get current weather
    function today(city){
        $.ajax({
            type: "GET",
            url: "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid="+ apiKey+"&units=imperial",
            dataType: "json",
            success: function(data) {
                console.log('Data ', data);
                

                


            }
          });
    }


    //get UV
    function getUV(lat, lon){

    }

    //5 days forecast
    function getForecast(city){

        
    }


    //add city to local storage
    function addCity(city){

    }


    //load last city




});
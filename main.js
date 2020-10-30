'use strict';


function getParkList(searchStateCode, searchMaxNum) {
    var myHeaders = new Headers();
    myHeaders.append("X-Api-Key", myApiKey);
    myHeaders.append("Cookie", myCookie);
    
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    
    fetch(`https://developer.nps.gov/api/v1/parks?stateCode=${searchStateCode}&limit=${searchMaxNum}`, requestOptions)
        .then(response => response.json())
        .then(responseJson => console.log(responseJson))
        .catch(error => console.log('error', error));
}


function watchForm() {
    $('#search-form').submit(event => {
        event.preventDefault();
        let searchStateCode = $('#js-search-state').val();
        let searchMaxNum = $('#js-search-num').val();
        getParkList(searchStateCode, searchMaxNum);
    });
}


$(watchForm);
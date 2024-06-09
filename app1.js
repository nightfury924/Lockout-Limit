function sendTimer(){
    let input = document.getElementById('hrs');
    let inputValue = parseInt(input.value);
    if (isNaN(inputValue) || inputValue < 0){
        inputValue = 0;
    }
    let hours = inputValue * 60 * 60;
    input = document.getElementById('min');
    inputValue = parseInt(input.value);
    if (isNaN(inputValue) || inputValue < 0){
        inputValue = 0;
    }
    let minutes = inputValue * 60;
    input = document.getElementById('sec');
    inputValue = parseInt(input.value);
    if (isNaN(inputValue) || inputValue < 0){
        inputValue = 0;
    }
    let seconds = inputValue;
    var timeLimit = hours + minutes + seconds;
    console.log('messg Goes');
    chrome.runtime.sendMessage({action : 'setTimer',data:timeLimit});
    setTimerButton.addEventListener('click',setTimer);
}



document.addEventListener('DOMContentLoaded', function() {
    console.log('Point A');
    var setTimerButton = document.getElementById('setTimer');
    if (setTimerButton) {
        setTimerButton.addEventListener('click', sendTimer);   
    }
});


chrome.runtime.onMessage.addListener(function(request) {
    if (request.action === 'changeTOtimer1') {
        if (window.location.href !== 'timer1.html'){
            window.location.href = 'timer1.html';
        }
    }
});





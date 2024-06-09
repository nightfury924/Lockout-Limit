chrome.runtime.onMessage.addListener(function(request) {
    if (request.action === 'changeTOtimer1') {
        if (window.location.href !== 'timer1.html'){
            window.location.href = 'timer1.html';
        }
    }
    else if (request.action === 'changeTOtimer1TimerEnd') {
        if (window.location.href !== 'timer1.html'){
            window.location.href = 'timer1.html';
        }
    }
    else if (request.action === 'changeTOtimer') {
        window.location.href = 'timer.html';
    }
});
function changeTimerSend(){
    chrome.runtime.sendMessage({action : 'changeTimer'});
}

function deleteTimerSend(){
    console.log("Reached Deletion Message");
    chrome.runtime.sendMessage({action : 'deleteTimer'});
}
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('changeTimer').addEventListener('click',changeTimerSend);
    document.getElementById('delTimer').addEventListener('click', deleteTimerSend);
});

chrome.runtime.onMessage.addListener(function(request) {
    if (request.action === 'changeTOtimer') {
        window.location.href = 'timer.html';
    }
    else if (request.action === 'timetoPrint'){
        let time = request.data;
        timeprint(time)
    }
});


async function timeprint(time){
    let timeString = await convertSecondsToTime(time);
        let timer = document.getElementById('activeTimer');
        if (timer){
            timer.innerHTML = timeString;
        }
}
function convertSecondsToTime(seconds) {
    return new Promise ((resolve) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        resolve (formattedTime);
    })
}

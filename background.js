chrome.runtime.onMessage.addListener(function(request) {
    if (request.action === 'deleteTimer') {
        console.log("deletion msg received");
        deleteTimer();
    }
    else if (request.action === 'changeTimer') {
        changeTimer();
    }
    else if (request.action === 'setTimer') {
        console.log('reachedhere');
        let timeLimit = request.data;
        setTimer(timeLimit);
    }
});

async function deleteTimer(){
    const url = await getCurrentTabUrl();
    console.log(url);
    let storedData = await getLocalData();
    const index = storedData.findIndex(obj => obj.url === url);
    console.log(index);
    if (index >= 0){
        storedData.splice(index,1);
        await setLocalData(storedData);
    }
    
}

async function changeTimer(){
    const currentUrl = await getCurrentTabUrl();
    let storedData = await getLocalData();
    const objToUpdate = storedData.find(obj => obj.url === currentUrl);
    if (objToUpdate !== undefined){
        let usedTime = [objToUpdate.timeUsed,1];
        const index = storedData.findIndex(obj => obj.url === currentUrl);
        storedData.splice(index,1);
        await setLocalData(storedData);
        await setTimeUsed(usedTime);
        chrome.runtime.sendMessage({action : 'changeTOtimer'});
        console.log('Timer Changed.');
    }
}
async function setTimer(timeLimit){
    let currentUrl = await getCurrentTabUrl();
    // const urlobj = new URL(compUrl);
    
    var currentDate = new Date();
    var Year = currentDate.getFullYear();
    var Month = currentDate.getMonth();
    var Day = currentDate.getDate();
    let startingTime = 0;
    let usedTime = await getTimeUsed();
    if (usedTime[1] === 1){
        startingTime = usedTime[0];
        usedTime[1] = 0;
        await setTimeUsed(usedTime);
    }
    const timerData = {
        url : currentUrl,
        timeLimit: timeLimit,
        timeUsed:startingTime,
        day:Day,
        month:Month,
        year:Year
    }
    let storedData = await getLocalData();
    storedData.push(timerData);
    await setLocalData(storedData);
}
function setDefaultData(){
    return new Promise((resolve) => {
        chrome.storage.local.get('mydata',function(result){
            if (Object.keys(result).length === 0 && result.constructor === Object){
                var dataArray = [{url : 'This contains Url', timeLimit: 0,timeUsed:0,day:0,month:0,year:0}];
                var data = {};
                data['mydata'] = dataArray;
                chrome.storage.local.set(data);
            }
            resolve();
        });
    });
}

async function checkTimer(){
    setTimeout(checkTimer,1000);
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        let redirecturl = new URL(tabs[0].url);
        if (redirecturl.pathname === '/redirect.html'){
            chrome.runtime.sendMessage({action : 'changeTOtimer1TimerEnd'});
        }
    });
    
    const currentUrl = await getCurrentTabUrl();
    console.log(currentUrl);
    let storedData = await getLocalData();
    const objToUpdate = storedData.find(obj => obj.url === currentUrl);
    if (objToUpdate !== undefined){
        
        chrome.runtime.sendMessage({action : 'changeTOtimer1'});
        var currentDate = new Date();
        var currentYear = currentDate.getFullYear();
        var currentMonth = currentDate.getMonth();
        var currentDay = currentDate.getDate();
        if (currentYear != objToUpdate.year || currentMonth != objToUpdate.month || currentDay != objToUpdate.day){
            objToUpdate.timeUsed = 0;
            objToUpdate.year = currentYear;
            objToUpdate.month = currentMonth;
            objToUpdate.day = currentDay; 
        }
        let time = objToUpdate.timeLimit - objToUpdate.timeUsed;
        console.log(objToUpdate.timeUsed);
        chrome.runtime.sendMessage({action : 'timetoPrint',data:time});
        objToUpdate.timeUsed = objToUpdate.timeUsed + 1;

        if (objToUpdate.timeUsed > objToUpdate.timeLimit){
            console.log('Time Limit Reached');
            chrome.runtime.sendMessage({action : 'changeTOtimer1'});
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                if (tabs.length > 0){
                    chrome.tabs.update(tabs[0].id, { url: 'redirect.html'});
                }
            });
        }
        await setLocalData(storedData);
    }
}





async function initialize() {
    await setDefaultData();
    checkTimer();
}
  
initialize();
function convertSecondsToTime(seconds) {
    return new Promise ((resolve) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        resolve (formattedTime);
    })
}
function setTimeUsed(data){
    return new Promise ((resolve) =>{
        chrome.storage.local.set({'timeUsed':data});
        resolve();
    });
}
function getTimeUsed(){
    return new Promise ((resolve) =>{
        chrome.storage.local.get('timeUsed',function(result){
            resolve(result.timeUsed || []);
        });
    })
}
function getLocalData(){
    return new Promise ((resolve) =>{
        chrome.storage.local.get('mydata',function(result){
            resolve(result.mydata || []);
        });
    })
}
function setLocalData(data){
    return new Promise ((resolve) =>{
        chrome.storage.local.set({'mydata':data});
        resolve();
    });
}
function getCurrentTabUrl(){
    return new Promise((resolve) => {
        chrome.tabs.query({active:true,currentWindow:true},function(tabs)
        {
            const urlobj = new URL(tabs[0].url);
            resolve(urlobj.hostname);
        });
    });
}
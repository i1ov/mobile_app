const dom = {
    selectbox: document.getElementById('selectbox'),
    selectboxList: document.querySelector('.selectbox__list'),
    rooms: document.getElementById('rooms'),
    settings: document.getElementById('settings'),
    settingsTabs: document.getElementById('settings-tabs'),
    settingsPanels: document.getElementById('settings-panel'),
    temperatureLine: document.getElementById('temperature-line'),
    temperatureRound: document.getElementById('temperature-round'),
    temperature: document.getElementById('temperature'),
    temperatureBtn: document.getElementById('temperature-btn'),
    temperatureSaveBtn: document.getElementById('save-temperature'),
    temperaturePowerBtn: document.getElementById('power'),
    slider: { lights: document.getElementById('slider')},
    switch: { lights: document.getElementById('lights-power')}

}

const rooms = {
    all: 'Все комнаты',
    livingroom: 'Зал',
    bedroom: 'Спальная',
    kitchen:'Кухня',
    bathroom:'Ванная',
    studio:'Кабинет',
    washingroom:'Уборная'
}

let activeRoom = 'all';
let activeTab = 'temperature';

// панель настроек комнаты

const roomsData = {
  
    livingroom: {
        temperature: 16,
        temperatureOff: false,
        lights: 0,
        lightsOff: false
    },
    bedroom: {
        temperature: 16,
        temperatureOff: false,
        lights: 0,
        lightsOff: false
    },
    kitchen: {
        temperature: 16,
        temperatureOff: false,
        lights: 0,
        lightsOff: false
    },
    bathroom: {
        temperature: 16,
        temperatureOff: false,
        lights: 0,
        lightsOff: false
    },
    studio: {
        temperature: 16,
        temperatureOff: false,
        lights: 0,
        lightsOff: false
    },
    washingroom:{
        temperature: 16,
        temperatureOff: false,
        lights: 0,
        lightsOff: false
    }
}

// выпадающий комментарий

dom.selectbox.querySelector('.selectbox__selected').onclick = (event) => {
    dom.selectbox.classList.toggle('open')
} 

document.body.onclick = (event) => {
    const { target } = event

    if(
        !target.matches('.selectbox')
        && !target.parentElement.matches('.selectbox')
        && !target.parentElement.parentElement.matches('.selectbox')
     
    ){
    dom.selectbox.classList.remove('open');
    }

}


dom.selectboxList.onclick = (event) => {
    const { target } = event
    
    if (target.matches('.selectbox__items')) {
        const { room } = target.dataset
        const selectedItem =dom.selectboxList.querySelector('.selected')
        selectedItem.classList.remove('selected')
        target.classList.add('selected')
        dom.selectbox.classList.remove('open')
        selectRoom(room)
   }
}

// выбор комнаты

function selectRoom(room){
    const selectedRoom = dom.rooms.querySelector('.selected')
    
    if (selectedRoom){
        selectedRoom.classList.remove('selected');
    }
    if(room != 'all'){
        const newSelectedRoom = dom.rooms.querySelector(`[data-room=${room}]`);
        const { temperature, lights, lightsOff } = roomsData[room]
        activeRoom = room;
        newSelectedRoom.classList.add('selected')
        renderScreen(false)
        dom.temperature.innerText = temperature
        renderTemperature(temperature);
        setTemperaturePower();
        changeSettingsType(activeTab);
        changeSlider(lights, dom.slider.lights);
        changeSwitch('lights', lightsOff);
    }
    else{
        renderScreen(true)
    }
    const selectedSelectboxRoom = dom.selectbox.querySelector('.selectbox__items.selected')
    selectedSelectboxRoom.classList.remove('selected')
    const newSelectedItem = dom.selectbox.querySelector(`[data-room = ${room}]`)
    newSelectedItem.classList.add('selected')
    const selectboxSelected = dom.selectbox.querySelector('.selectbox__selected span')
    selectboxSelected.innerText = rooms[room]
   
}

// клик по элементу комнаты

dom.rooms.querySelectorAll('.room').forEach(room => {
    room.onclick=(event) => {
        const value = room.dataset.room
        selectRoom(value)
    }
})

// второй экран

function renderScreen(isRooms){
    setTimeout(() =>{
    if(isRooms){
        dom.rooms.style.display = 'grid'
        dom.settings.style.display = 'none'
    }
    else{
        dom.settings.style.display = 'block'
        dom.rooms.style.display = 'none'
    }
    }, 300)
}


// отрисовка изменения температуры
function renderTemperature(temperature){
    const min = 16;
    const max = 30;
    const range = max - min;
    const percent = range/100;
    const lineMin = 54;
    const lineMax = 276;
    const lineRange = lineMax - lineMin;
    const linePercent = lineRange/100;
    const roundMin = -240;
    const roundMax = 48;
    const roundRange = roundMax - roundMin;
    const roundPercent = roundRange/100;


    if(temperature >= min && temperature <= max){
        const finishPercent = Math.round((temperature - min)/percent);
        const lineFinishPercent = lineMin + linePercent * finishPercent;
        const roundFinishPercent = roundMin + roundPercent * finishPercent;
        dom.temperatureLine.style.strokeDasharray = `${lineFinishPercent} 276`;
        dom.temperatureRound.style.transform = `rotate(${roundFinishPercent}deg)`;
        dom.temperature.innerText = temperature;
    }

}

// функция изменения температуры курсором

function changeTemperature(){
    let mouseover = false;
    let mousedown = false;
    let position = 0;
    let range = 0;
    let change = 0;

    dom.temperatureBtn.onmouseover = () => mouseover = true;
    dom.temperatureBtn.onmouseout = () => mouseover = false;
    dom.temperatureBtn.onmouseup = () => mousedown = false;
    dom.temperatureBtn.onmousedown = (e) => {
        mousedown = true;
        position = e.offsetY;
        range = 0;
    }

    dom.temperatureBtn.onmousemove = (e) => {
        if(mouseover && mousedown){
            range = e.offsetY - position
            const newChange = Math.round(range/-5);
            if (newChange != change){         
                let temperature = dom.temperature.innerText
                if(newChange <= change){
                    temperature = Number(temperature) - 1
                }
                else {
                    temperature = Number(temperature) + 1
                }

                change = newChange;
              //  roomsData[activeRoom].temperature = temperature;
                renderTemperature(temperature)
                
            }
        }
        
    }
}

changeTemperature()

// сохранение температуры
dom.temperatureSaveBtn.onclick = () => {
    const temperature = +dom.temperature.innerText;
    roomsData[activeRoom].temperature = temperature
   // alert('Температура сохранена')
}

// отключение температуры
dom.temperaturePowerBtn.onclick = () => {
    const power = dom.temperaturePowerBtn
    power.classList.toggle('off');
    if(power.matches('.off')){
        roomsData[activeRoom].temperatureOff = true
    }
    else {
        roomsData[activeRoom].temperatureOff = false
    }
}

// установка значения включения температуры
function setTemperaturePower(){
    if(roomsData[activeRoom].temperatureOff){

        dom.temperaturePowerBtn.classList.add('off');
    }
    else {
        dom.temperaturePowerBtn.classList.remove('off');
    }
}

// переключение настроек (свет/температура)

dom.settingsTabs.querySelectorAll('.tab').forEach((tab) => {
    tab.onclick = () => {
        const optionType = tab.dataset.type
        activeTab = optionType
        changeSettingsType(optionType)
    }
})

// смена панели настроек
function changeSettingsType(type){
    const tabSelected = dom.settingsTabs.querySelector('.tab.selected');
    const tab = dom.settingsTabs.querySelector(`[data-type=${type}]`);
    const panelSelected = dom.settingsPanels.querySelector('.selected');
    const panel = dom.settingsPanels.querySelector(`[data-type=${type}]`);
    panelSelected.classList.remove('selected');
    tabSelected.classList.remove('selected');
    tab.classList.add('selected');
    panel.classList.add('selected');
    
}

// работа слайдера света

function changeSlider(percent, slider){
    if(percent >= 0 && percent <= 100){
        const { type } = slider.parentElement.parentElement.dataset
    slider.querySelector('span').innerText = percent;
    slider.style.height = `${percent}%`;
    roomsData[activeRoom][type] = percent;
    }
}

// изменение слайдера
function watchSlider(slider){
    let mouseover = false;
    let mousedown = false;
    let position = 0;
    let range = 0;
    let change = 0;
    const parent = slider.parentElement;

    parent.onmouseover = () => mouseover = true;
    parent.onmouseout = () => mouseover = false;
    parent.onmouseup = () => mousedown = false;
    parent.onmousedown = (e) => {
        mousedown = true;
        position = e.offsetY;
        range = 0;
    }

    parent.onmousemove = (e) => {
        if(mouseover && mousedown){
            range = e.offsetY - position
            const newChange = Math.round(range/-0.1);
            if (newChange != change){         
                let percent = slider.querySelector('span').innerText
                if(newChange <= change){
                    percent = percent - 1
                }
                else {
                    percent = Number(percent) + 1
                }

                change = newChange;
              console.log(percent)
                changeSlider(percent, slider)
                
            }
        }
        
    }
}

watchSlider(dom.slider.lights)

function changeSwitch(activeTab, isOff){
    if(isOff){
        dom.switch[activeTab].classList.add('off');
    }
    else{
        dom.switch[activeTab].classList.remove('off');
    }
    roomsData[activeRoom][`${activeTab}Off`] = isOff;
}

// клик по переключателю

dom.switch.lights.onclick = () => {
    const isOff = !dom.switch.lights.matches('.off');
    changeSwitch(activeTab, isOff)
}


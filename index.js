const timerRef = document.querySelector(".current-time");
const hourInput = document.getElementById("hour-input");
const minuteInput = document.getElementById("minute-input");
const activeAlarms = document.querySelector(".alarms-list");
const setAlarm = document.getElementById("set");
const clearAllButton = document.querySelector(".clear");
const alarmSound = new Audio("./alarm.mp3");

let alarmIndex = 0;
let alarmsArray = [];
let initialHour = 0;
let initialMinute = 0;

// Função auxiliar para acrescentar um zero à esquerda a valores de um dígito
const appendZero = (value) => (value < 10 ? "0" + value : value);

// Função para exibir a hora e acionar alarmes
const displayTimer = () => {
    const date = new Date();
    const currentTime = date.toLocaleTimeString("en-US", { hour12: false });
    timerRef.textContent = currentTime;

    // Verifique se é hora de acionar alarmes
    alarmsArray.forEach((alarm) => {
        if (alarm.isActive && alarm.time === currentTime.slice(0, 5)) {
            alarmSound.play();
        }
    });
};

// Function to create a new alarm
const createAlarm = (hour, minute) => {
    alarmIndex += 1;

    // Crie um objeto de alarme
    const alarmObj = {
        id: `${alarmIndex}_${hour}_${minute}`,
        time: `${appendZero(hour)}:${appendZero(minute)}`,
        isActive: false
    };

    // Adicione alarme ao array e crie sua representação da interface do usuário
    alarmsArray.push(alarmObj);
    const alarmDiv = document.createElement("div");
    alarmDiv.className = "alarm";
    alarmDiv.dataset.id = alarmObj.id;
    alarmDiv.innerHTML = `<span>${alarmObj.time}</span>`;

    // Crie uma caixa de seleção para ativar/desativar o alarme
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.addEventListener("change", () => toggleAlarm(alarmObj));
    alarmDiv.appendChild(checkbox);

    // Crie um botão de exclusão para o alarme
    const deleteButton = document.createElement("button");
    // Fontawesome
    deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    deleteButton.className = "deleteButton";
    deleteButton.addEventListener("click", () => deleteAlarm(alarmObj));
    alarmDiv.appendChild(deleteButton);

    // Adicione a interface do alarme à lista de alarmes ativos
    activeAlarms.appendChild(alarmDiv);
};

// Função para alternar o estado ativo do alarme
const toggleAlarm = (alarm) => {
    alarm.isActive = !alarm.isActive;
    if (alarm.isActive) {
        const currentTime = new Date().toLocaleTimeString("en-US", { hour12: false }).slice(0, 5);
        if (alarm.time === currentTime) {
            alarmSound.play();
        }
    } else {
        alarmSound.pause();
    }
};

// Função para excluir um alarme
const deleteAlarm = (alarm) => {
    const index = alarmsArray.indexOf(alarm);
    if (index > -1) {
        alarmsArray.splice(index, 1);
        document.querySelector(`[data-id="${alarm.id}"]`).remove();
    }
};

// Ouvinte de eventos para limpar todos os alarmes
clearAllButton.addEventListener("click", () => {
    alarmsArray = [];
    activeAlarms.innerHTML = "";
});

// Ouvinte de eventos para definir um novo alarme
setAlarm.addEventListener("click", () => {
    // Parse the input values, default to 0 if empty or NaN
    let hour = parseInt(hourInput.value) || 0;
    let minute = parseInt(minuteInput.value) || 0;

    // Valide os valores de entrada
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
        alert("Invalid hour or minute. Please enter values within the valid range!");
        return;
    }

    // Verifique se já existe um alarme com o mesmo horário
    if (!alarmsArray.some(alarm => alarm.time === `${appendZero(hour)}:${appendZero(minute)}`)) {
        createAlarm(hour, minute);
    }

    // limpar campos de entrada
    [hourInput.value, minuteInput.value] = ["", ""];
});

// Inicialize o cronômetro e os campos de entrada
window.onload = () => {
    setInterval(displayTimer, 1000);
    [hourInput.value, minuteInput.value] = ["", ""];
};
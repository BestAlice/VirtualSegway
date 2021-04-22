// websocket
var socket;

var addressField = document.getElementById("adress-field");
var connectionStatusField = document.getElementById("connection-status-field");
var userMessageField = document.getElementById("user-message-field");
var serverMessagesField = document.getElementById("server-messages-field");
var targetXField = document.getElementById("target-x-field");
var targetYField = document.getElementById("target-y-field");
var regulatorKField = document.getElementById("regulator-k-field");
var logPathField = document.getElementById("log-path-field");

var tField = document.getElementById("t-field");
var xField = document.getElementById("x-field");
var yField = document.getElementById("y-field");
var psiField = document.getElementById("psi-field");
var alpfaField = document.getElementById("alpfa-field");
var betaField = document.getElementById("beta-field");
var roField = document.getElementById("ro-field");
var tetaTField = document.getElementById("tetaT-field");

var robotShape = document.getElementById("robot-shape");

function printServerMessage(msg) {
    msg = msg.replaceAll("\n", "<br>");
    messageObject = document.createElement('p');
    messageObject.innerHTML = msg;
    serverMessagesField.appendChild(messageObject);
    serverMessagesField.scrollTop = serverMessagesField.scrollHeight;
}

function printConnectionStatus() {
    switch (socket.readyState) {
        case WebSocket.CONNECTING:
            connectionStatusField.innerHTML = "connecting";
            break;
        case WebSocket.OPEN:
            connectionStatusField.innerHTML = "opened";
            break;
        case WebSocket.CLOSING:
           connectionStatusField.innerHTML = "closing";
            break;
        case WebSocket.CLOSED:
            connectionStatusField.innerHTML = "closed";
            break;
        default:
            break;
    }
}

function drawRobotStatus(robotStatus) {
    tField.innerHTML = robotStatus.t;
    xField.innerHTML = robotStatus.x;
    yField.innerHTML = robotStatus.y;
    psiField.innerHTML = robotStatus.psi;
    alpfaField.innerHTML = robotStatus.alpha;
    betaField.innerHTML = robotStatus.beta;
    roField.innerHTML = robotStatus.ro;
    tetaTField.innerHTML = robotStatus.tetaT;
}

function drawRobotPosition(robotStatus) {
    robotShape.object3D.position.x = robotStatus.x;
    robotShape.object3D.position.z = -robotStatus.y;
    robotShape.object3D.rotation.y = robotStatus.beta;
    robotShape.object3D.rotation.z = -robotStatus.psi;
}

function socketOpeningEvent(e) {
    printServerMessage("[New connection]");
    printConnectionStatus();
}

function socketMessageEvent(e) {
    msg = JSON.parse(e.data);
    if (msg.type == "message") {
        printServerMessage(msg.content);
    } else if (msg.type == "status") {
        robotStatus = msg.content;
        drawRobotStatus(robotStatus);
        drawRobotPosition(robotStatus);
    }
}

function socketCloseEvent(e) {
    printServerMessage("[Connection closed]");
    printConnectionStatus();
}

function socketErrorEvent(e) {
    printServerMessage("[Connection failed]");
    printConnectionStatus();
}

function connect(url) {
    socket = new WebSocket(url);
    socket.onopen = socketOpeningEvent;
    socket.onclose = socketCloseEvent;
    socket.onmessage = socketMessageEvent;
    socket.onerror = socketErrorEvent;
    printConnectionStatus();
}

function sendMessage(msg) {
    if (socket.readyState == WebSocket.OPEN) {
        socket.send(JSON.stringify(msg));
    }
}

// обработать нажатие кнопки "подключиться"
function inputConnect() {
    if (socket) {
        socket.close(1000);
    }
    var url = "ws://"+addressField.value;
    connect(url);
}

// обработать нажатие кнопки "отправить"
function inputSendMessage() {
    sendMessage(JSON.parse(userMessageField.value));
}

// очистка сообщений
function inputClearMessages() {
    serverMessagesField.innerHTML = "";
}

function inputStart() {
    var msg = {"name": "start"};
    sendMessage(msg);
}

function inputStop() {
    var msg = {"name": "stop"};
    sendMessage(msg);
}

function inputStatus() {
    var msg = {"name": "status"};
    sendMessage(msg);
}

function inputClear() {
    var msg = {"name": "clear"};
    sendMessage(msg);
}

function inputSaveLog() {
    var msg = {"name": "savelog", "path": logPathField.value};
    sendMessage(msg);
}

function inputSetTarget() {
    var msg = {"name": "settarget", "xT": parseFloat(targetXField.value), "yT": parseFloat(targetYField.value)};
    sendMessage(msg);
}

function inputSetRegulatorK() {
    var msg = JSON.parse(regulatorKField.value);
    for (var i in msg) {
        msg[i] = parseFloat(msg[i]);
    }
    msg.name = "setregulatork";
    sendMessage(msg);
}
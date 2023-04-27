// Lấy canvas và context
let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

// Khởi tạo các biến
let player = {x: canvas.width/2, y: canvas.height-20};
let arrDan = [];
let arrObj = [];
let score = 0;
let isGameOver = false;
let objSpeed = 3;
let danSpeed = 10;
let targetInterval = 200;
let lastTargetTime = 100;
let objImage = new Image();
objImage.src = "https://toigingiuvedep.vn/wp-content/uploads/2022/01/anh-meo-cute.jpg";
let danImage = new Image();
danImage.src = "https://kynguyenlamdep.com/wp-content/uploads/2022/06/avatar-cute-meo-con-than-chet.jpg";

// Hàm vẽ nhân vật
function drawPlayer() {
    ctx.fillStyle = "#0000FF";
    ctx.fillRect(player.x-10, player.y-10, 20, 20);
}

// Hàm vẽ đối tượng
function drawObj(a) {
    ctx.drawImage(objImage, a.x-10, a.y-10, 20, 20);
}

// Hàm vẽ đạn
function drawDan(b) {
    ctx.drawImage(danImage, b.x-5, b.y-5, 10, 10);
}

// Hàm vẽ điểm số
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score,  10, 20);
}

// Hàm xử lý va chạm giữa đạn và đối tượng
function vachamdanObj() {
    for (let i = 0; i < arrDan.length; i++) {
        let b = arrDan[i];
        for (let j = 0; j < arrObj.length; j++) {
            let a = arrObj[j];
            if (b.x > a.x-10 && b.x < a.x+10 &&
                b.y > a.y-10 && b.y < a.y+10) {
                arrObj.splice(j, 1);
                arrDan.splice(i, 1);
                score++;
                break;
            }
        }
    }
}

// Hàm xử lý va chạm giữa nhân vật và đối tượng
function vachamplayerObj() {
    for (let i = 0; i < arrObj.length; i++) {
        let a = arrObj[i];
        if (player.x-5 > a.x-10 && player.x-5 < a.x &&
            player.y > a.y-10 && player.y < a.y+10) {
            isGameOver = true;
            break;
        }
    }
}
// Hàm thêm đối tượng mới
function addNewTarget() {
    let x = Math.random() * canvas.width;

    arrObj.push({x: x, y: 0});
}

// Khởi tạo đối tượng đầu tiên
addNewTarget();

// Hàm di chuyển đối tượng
function moveObj() {
    for (let i = 0; i < arrObj.length; i++) {
        let a = arrObj[i];
        a.y += objSpeed;
    }
}

// Hàm di chuyển đạn
function moveDan() {
    for (let i = 0; i < arrDan.length; i++) {
        let b = arrDan[i];
        b.y -= danSpeed;
    }
}

// Hàm vẽ tất cả các thành phần của trò chơi
function draw() {
    // Xóa màn hình
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Vẽ các thành phần
    drawPlayer();
    for (let i = 0; i < arrObj.length; i++) {
        drawObj(arrObj[i]);
    }
    for (let i = 0; i < arrDan.length; i++) {
        drawDan(arrDan[i]);
    }
    drawScore();

    // Xử lý va chạm
    vachamdanObj();
    vachamplayerObj();

    // Di chuyển đối tượng và đạn
    moveObj();
    moveDan();

    // Nếu trò chơi kết thúc, hiển thị thông báo và dừng trò chơi
    if (isGameOver) {
        clearInterval(gameLoop);
        alert("GAME OVER\nYour score: " + score);
    }
}

// Hàm xử lý sự kiện phím bấm
function handleKeyDown(event) {
    if (event.keyCode === 37) { // sang trái
        player.x -= 10;
    } else if (event.keyCode === 39) { // sang phải
        player.x += 10;
    } else if (event.keyCode === 32) { // nhả đạn
        arrDan.push({x: player.x, y: player.y});
    }
}

// Thêm sự kiện phím bấm vào trang web
document.addEventListener("keydown", handleKeyDown, false);

// Hàm chạy trò chơi
function runGame() {
    let currentTime = new Date().getTime();
    if (currentTime - lastTargetTime > targetInterval) {
        addNewTarget();
        lastTargetTime = currentTime;
    }
    draw();
}

// Bắt đầu chạy trò chơi
let gameLoop = setInterval(runGame, 10);
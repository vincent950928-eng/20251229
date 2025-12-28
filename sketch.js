let idleSheet, walkSheet, jumpSheet, pushSheet, toolSheet;
let idleAnimation = [], walkAnimation = [], jumpAnimation = [], pushAnimation = [], toolAnimation = [];
let currentFrame = 0;
let characterX, characterY;
let state = 'idle'; // 'idle', 'walking', 'jumping', 'attacking'
let facingDirection = 'right'; // 'right' or 'left'
const speed = 15;

let isJumping = false;
let jumpFrame = 0;
let originalY;

let isAttacking = false;
let attackFrame = 0;

let projectiles = [];
const projectileSpeed = 10;

let bgImage; // 將 background 圖片存放在此變數
// 生命值（愛心）
let hearts = 3;
const maxHearts = 3;
// 分數系統
let score = 0;
const scorePerCorrect = 100;
let scoreScale = 1; // 分數縮放比例，用於動畫效果
let combo = 0; // 連擊計數
let maxCombo = 0; // 最高連擊紀錄
let highScore = 0; // 最高分紀錄
// 等級系統變數
let level = 1;
let currentExp = 0;
let nextLevelExp = 500;
// 體力系統變數
let stamina = 100;
const maxStamina = 100;
const staminaConsumption = 2; // 每幀消耗
const staminaRecovery = 0.5;  // 每幀恢復
let gameTimer = 120; // 遊戲倒數計時 (秒)
const initialGameTime = 120; // 初始時間設定 (2分鐘)
// 時間道具變數
let timeItem = null;
let timeItemSpawnTimer = 0;
const timeItemInterval = 80; // 每 80 幀 (約8秒) 嘗試生成一次
// 無敵星星道具變數
let starItem = null;
let starItemSpawnTimer = 0;
const starItemInterval = 150; // 每 150 幀 (約15秒) 嘗試生成一次
let isInvincible = false;
let invincibleTimer = 0;
const invincibleDuration = 100; // 無敵時間 10 秒 (10fps * 10)
// 鑰匙道具變數
let keyItem = null;
let keyItemSpawnTimer = 0;
const keyItemInterval = 100; // 每 100 幀 (約10秒) 嘗試生成一次
let keyCount = 0;
const itemLifetime = 100; // 道具存在時間 (約10秒)
// 雙倍積分道具變數
let doubleScoreItem = null;
let doubleScoreItemSpawnTimer = 0;
const doubleScoreItemInterval = 180; // 每 180 幀 (約18秒) 嘗試生成一次
let isDoubleScore = false;
let doubleScoreTimer = 0;
const doubleScoreDuration = 150; // 15 秒
// 磁鐵道具變數
let magnetItem = null;
let magnetItemSpawnTimer = 0;
const magnetItemInterval = 220; // 每 220 幀 (約22秒) 嘗試生成一次
let isMagnetActive = false;
let magnetTimer = 0;
const magnetDuration = 150; // 15 秒
const magnetRange = 400; // 吸取範圍
// 體力藥水道具變數
let staminaItem = null;
let staminaItemSpawnTimer = 0;
const staminaItemInterval = 200; // 每 200 幀 (約20秒) 嘗試生成一次
// 主角縮放與地面偏移
let characterScale = 1.5; // 調整此值放大/縮小主角
const groundOffset = 20; // 角色底部與畫布底部的間距

let gameState = 'start'; // 'start', 'playing', 'gameOver'
 
// Quiz 系統變數
let quizTable;
let quizQuestions = [];
let currentQuestionIndex = 0;
let currentQuestion = null;
let showingFeedback = false;
let feedbackCounter = 0;
// 顯示回饋的幀數（frameRate(10) 下 30 幀 = 3 秒）
const feedbackDuration = 25; // 2.5 秒
// 當玩家在左側提交答案後，若尚未離開則持續顯示回饋（鼓勵）
let keepFeedbackUntilLeave = false;
// --- 新增：左側第二個角色的精靈與動畫 ---
let leftSheet;
let leftAnimation = [];
let currentFrameLeft = 0;
const leftFrameCount = 8; // 8 張圖片
const leftSpriteWidth = 467 / leftFrameCount; // 精靈總寬 467
const leftSpriteHeight = 95; // 精靈高 95
const leftOffset = 150; // 與主角的水平間距
let leftInitialX; // 固定的左側角色初始 X
// 角色2的 smile 精靈與文字
let leftSmileSheet;
let leftSmileAnimation = [];
const leftSmileFrameCount = 8; // 假設為 8 張（若不同可調整）
const leftSmileSpriteWidth = 467 / leftSmileFrameCount;
const leftSmileSpriteHeight = 95;
let leftUsingSmile = false;
const leftSmileDistance = 120; // 判定接近的距離閾值
let leftDialogText = '需要我解答嗎?';
let inputBox = null; // DOM 輸入框
let leftSmileCounter = 0; // 計數器，用於放慢笑臉動畫速度
const leftSmileDelay = 3; // 每隔幾個循環才切換到下一幀（數值越大越慢）
// 角色2 被擊中後倒下動畫
let leftFallSheet;
let leftFallAnimation = [];
const leftFallFrameCount = 4; // 4 張圖片
const leftFallSpriteWidth = 375 / leftFallFrameCount; // 精靈總寬 375
const leftFallSpriteHeight = 83; // 精靈高 83
let leftIsFalling = false;
let leftFallFrame = 0;
let leftFallCounter = 0;
const leftFallDelay = 3; // 放慢 fall 動畫的速度
let leftFallen = false; // 是否已經倒下並保持倒下狀態
// 互動狀態追蹤：用於判斷玩家是否看過題目但未回答，需要向右側角色求提示
let leftSawQuestion = false;
let answeredByLeft = false;
let leftNeedsHint = false;
let leftHintGiven = false; // 右側已給過提示（提示持續顯示，直到題目被回答）
// 紀錄最後一題被回答的索引，用以在下次靠近時換題
// 當玩家在左側提交答案後標記為 true，下次靠近時直接換題
let leftWasAnswered = false;
// 玩家在答題後是否已離開左側互動範圍（用來判斷下次靠近是否要換題）
let leftLeftAfterAnswer = false;
// --- 新增：右側第三個角色的精靈與動畫 ---
let rightSheet;
let rightAnimation = [];
let currentFrameRight = 0;
const rightFrameCount = 6; // 6 張圖片
const rightSpriteWidth = 343 / rightFrameCount; // 精靈總寬 343
const rightSpriteHeight = 40; // 精靈高 40
const rightOffset = 150; // 與主角的水平間距
let rightInitialX; // 固定的右側角色初始 X
let rightFlipped = false; // 右側角色是否水平翻轉
// 角色3的互動（touch）精靈
let rightTouchSheet;
let rightTouchAnimation = [];
const rightTouchFrameCount = 11; // 11 張圖片
const rightTouchSpriteWidth = 732 / rightTouchFrameCount; // 精靈總寬 732
const rightTouchSpriteHeight = 69; // 精靈高 69
let rightUsingTouch = false; // 當主角接近時切換到 touch 動畫
const rightTouchDistance = 120; // 判定為接近的距離閾值（可調）
// 音效變數
let bgm, correctSound, wrongSound;
let isMuted = false; // 靜音狀態
let isPaused = false; // 暫停狀態
let isShopOpen = false; // 商店開啟狀態
let isCatalogOpen = false; // 圖鑑開啟狀態
let lotteryResult = ""; // 抽獎結果顯示
// 輪盤系統變數
let isRouletteSpinning = false;
let rouletteAngle = 0;
let rouletteTargetAngle = 0;
let rouletteResultIndex = -1;
let showRouletteResult = false;
let gameSnapshot = null; // 用於輪盤轉動時凍結背景
const rouletteSegments = ['銘謝惠顧', '愛心', '時間', '鑰匙', '無敵', '大獎'];
const rouletteColors = ['#9e9e9e', '#ff3b3b', '#00bcd4', '#ffd700', '#9c27b0', '#ff1744'];
// 成就系統變數
let achievements = {
  combo10: { name: '連擊大師', desc: '達成 10 連擊', unlocked: false },
  luckyWinner: { name: '天選之人', desc: '抽中無敵星星', unlocked: false },
  highScorer: { name: '千分王者', desc: '分數達到 1000 分', unlocked: false }
};
let achievementNotification = {
  message: '',
  timer: 0
};
let showAchievements = false; // 是否顯示成就列表
let shopItems = [
  { id: 'heart', name: '愛心 (+1)', price: 500, originalPrice: 500, y: -80 },
  { id: 'time', name: '時間 (+30s)', price: 300, originalPrice: 300, y: -20 },
  { id: 'key', name: '鑰匙 (+1)', price: 200, originalPrice: 200, y: 40 },
  { id: 'invincible', name: '無敵 (15s)', price: 800, originalPrice: 800, y: 100 }
];
// 彩花特效粒子陣列
let confettiParticles = [];
// 待機動畫的畫格尺寸
const idleFrameCount = 8;
const idleFrameWidth = 699 / idleFrameCount;
const idleFrameHeight = 190;

// 走路動畫的畫格尺寸
const walkFrameCount = 8;
const walkFrameWidth = 1019 / walkFrameCount;
const walkFrameHeight = 195;

// 跳躍動畫的畫格尺寸
const jumpFrameCount = 14;
const jumpFrameWidth = 2249 / jumpFrameCount;
const jumpFrameHeight = 214;

// 攻擊動畫的畫格尺寸
const pushFrameCount = 10;
const pushFrameWidth = 2215 / pushFrameCount;
const pushFrameHeight = 185;

// 投射物動畫的畫格尺寸
const toolFrameCount = 4;
const toolFrameWidth = 503 / toolFrameCount;
const toolFrameHeight = 229;

function preload() {
  // 預先載入所有圖片精靈檔案
  idleSheet = loadImage('1/stop/stop_1.png');
  walkSheet = loadImage('1/walk/walk_1.png');
  jumpSheet = loadImage('1/jump/jump_1.png');
  pushSheet = loadImage('1/push/push_1.png');
  toolSheet = loadImage('1/tool/tool_1.png');
  // 左側角色精靈
  // 若 2/stop/stop_2.png 缺失，回退到 1/stop/stop_1.png，避免 preload 停滯
  leftSheet = loadImage('2/stop/stop_2.png',
    img => { leftSheet = img; },
    err => { leftSheet = loadImage('1/stop/stop_1.png'); }
  );
  // 左側角色的 smile 精靈
  leftSmileSheet = loadImage('2/smile/smile_2.png');
  // 左側角色的 fall_down 精靈
  leftFallSheet = loadImage('2/fall_down/fall_down_2.png');
  // 右側角色精靈
  rightSheet = loadImage('3/stop/stop_3.png');
  // 右側角色的 touch 精靈
  rightTouchSheet = loadImage('3/touch/touch_3.png');
  // 載入背景圖片（若路徑或檔名不同可調整）
  bgImage = loadImage('background/螢幕擷取畫面 2025-12-27 095358.png');
  // 載入題庫 CSV（位於專案根目錄）
  quizTable = loadTable('quiz.csv', 'csv', 'header');
}

function setup() {
  // 建立一個全視窗的畫布
  createCanvas(windowWidth, windowHeight);

  // 初始化角色位置在畫布中央
  characterX = width / 2;
  // 設定原始 Y 為畫面底部扣除角色高度的一半與偏移量，讓角色站在地上
  originalY = characterY = height - (idleFrameHeight * characterScale) / 2 - groundOffset;
  // 左側角色的固定初始 X（不隨鍵盤移動而改變）
  // 改為以畫布中心為基準設定左右角色固定位置，避免與主角 X 混用導致重疊
  leftInitialX = width / 2 - leftOffset;
  // 右側角色的固定初始 X（不隨鍵盤移動而改變）
  rightInitialX = width / 2 + rightOffset;

  // 除錯資訊：印出初始座標（可移除）
  console.log('debug: characterX', characterX, 'leftInitialX', leftInitialX, 'rightInitialX', rightInitialX);

  // 解析 CSV 成題目陣列（若有載入）
  if (quizTable && quizTable.getRowCount && quizTable.getRowCount() > 0) {
    quizQuestions = [];
    for (let r = 0; r < quizTable.getRowCount(); r++) {
      let row = quizTable.getRow(r);
      quizQuestions.push({
        question: row.get('question'),
        answer: row.get('answer'),
        correctFeedback: row.get('correctFeedback'),
        wrongFeedback: row.get('wrongFeedback'),
        hint: row.get('hint')
      });
    }
    // 隨機選一題開始
    currentQuestionIndex = floor(random(quizQuestions.length));
    currentQuestion = quizQuestions[currentQuestionIndex];
    if (currentQuestion) leftDialogText = currentQuestion.question;
  }

  // 將待機圖片精靈切割成個別的畫格
  for (let i = 0; i < idleFrameCount; i++) {
    let frame = idleSheet.get(i * idleFrameWidth, 0, idleFrameWidth, idleFrameHeight);
    idleAnimation.push(frame);
  }

  // 將走路圖片精靈切割成個別的畫格
  for (let i = 0; i < walkFrameCount; i++) {
    let frame = walkSheet.get(i * walkFrameWidth, 0, walkFrameWidth, walkFrameHeight);
    walkAnimation.push(frame);
  }

  // 將跳躍圖片精靈切割成個別的畫格
  for (let i = 0; i < jumpFrameCount; i++) {
    let frame = jumpSheet.get(i * jumpFrameWidth, 0, jumpFrameWidth, jumpFrameHeight);
    jumpAnimation.push(frame);
  }

  // 將攻擊圖片精靈切割成個別的畫格
  for (let i = 0; i < pushFrameCount; i++) {
    let frame = pushSheet.get(i * pushFrameWidth, 0, pushFrameWidth, pushFrameHeight);
    pushAnimation.push(frame);
  }

  // 將投射物圖片精靈切割成個別的畫格
  for (let i = 0; i < toolFrameCount; i++) {
    let frame = toolSheet.get(i * toolFrameWidth, 0, toolFrameWidth, toolFrameHeight);
    toolAnimation.push(frame);
  }

  // 將左側角色圖片精靈切割成 8 個畫格
  for (let i = 0; i < leftFrameCount; i++) {
    let frame = leftSheet.get(i * leftSpriteWidth, 0, leftSpriteWidth, leftSpriteHeight);
    leftAnimation.push(frame);
  }

  // 將左側角色 smile 精靈切割成畫格
  for (let i = 0; i < leftSmileFrameCount; i++) {
    let frame = leftSmileSheet.get(i * leftSmileSpriteWidth, 0, leftSmileSpriteWidth, leftSmileSpriteHeight);
    leftSmileAnimation.push(frame);
  }

  // 將左側角色 fall_down 精靈切割成 4 個畫格
  for (let i = 0; i < leftFallFrameCount; i++) {
    let frame = leftFallSheet.get(i * leftFallSpriteWidth, 0, leftFallSpriteWidth, leftFallSpriteHeight);
    leftFallAnimation.push(frame);
  }

  // 將右側角色圖片精靈切割成 6 個畫格
  for (let i = 0; i < rightFrameCount; i++) {
    let sx = Math.floor(i * rightSpriteWidth);
    let sw = Math.floor(rightSpriteWidth);
    let frame = rightSheet.get(sx, 0, sw, rightSpriteHeight);
    rightAnimation.push(frame);
  }

  // 將右側角色 touch 精靈切割成 11 個畫格
  for (let i = 0; i < rightTouchFrameCount; i++) {
    let sx = Math.floor(i * rightTouchSpriteWidth);
    let sw = Math.floor(rightTouchSpriteWidth);
    let frame = rightTouchSheet.get(sx, 0, sw, rightTouchSpriteHeight);
    rightTouchAnimation.push(frame);
  }

  // 設定動畫播放速度
  frameRate(10);
  imageMode(CENTER); // 將圖片的繪製原點設為中心

  // 將音效載入移至 setup，避免因找不到檔案而卡在 Loading 畫面
  // 若檔案不存在，變數將會是 null 或無法播放，但遊戲仍可執行
  bgm = loadSound('sounds/bgm.mp3', () => {}, () => { bgm = null; });
  correctSound = loadSound('sounds/correct.mp3', () => {}, () => { correctSound = null; });
  wrongSound = loadSound('sounds/wrong.mp3', () => {}, () => { wrongSound = null; });

  // 讀取本地儲存的最高分
  highScore = parseInt(localStorage.getItem('highScore')) || 0;
}

function draw() {
  // 繪製背景圖片（若已載入）或使用純色回退
  if (bgImage) {
    push();
    imageMode(CENTER);
    image(bgImage, width / 2, height / 2, width, height);
    pop();
  } else {
    background('#fefae0');
  }

  // 若輪盤正在轉動或顯示結果，優先繪製輪盤介面
  if (isRouletteSpinning || showRouletteResult) {
    if (gameSnapshot) image(gameSnapshot, width / 2, height / 2);
    drawRoulette();
    return; // 暫停其他繪製與邏輯
  }

  if (gameState === 'playing') {
    runGame();
    // 若處於暫停狀態，繪製遮罩並停止迴圈
    if (isPaused) {
      drawPauseOverlay();
      noLoop();
    } else if (isShopOpen) {
      drawShopInterface();
      noLoop();
    } else if (isCatalogOpen) {
      drawCatalogInterface();
      noLoop();
    }
  } else if (gameState === 'gameOver') {
    drawGameOverScreen();
  } else if (gameState === 'start') {
    drawStartScreen();
  }

  // 繪製暫停按鈕 (只在遊戲進行中顯示)
  if (gameState === 'playing') {
    drawPauseButton();
    drawShopButton();
    drawCatalogButton();
    drawAchievementNotification();
  }

  drawMuteButton(); // 繪製靜音按鈕
}

function runGame() {
  // 繪製左上角愛心（生命值）
  push();
  textSize(28);
  textAlign(LEFT, TOP);
  noStroke();
  for (let i = 0; i < maxHearts; i++) {
    if (i < hearts) {
      fill('#ff3b3b');
    } else {
      fill(180);
    }
    text('❤', 20 + i * 34, 20);
  }
  pop();

  // 繪製等級與經驗值條 (顯示在愛心右側)
  push();
  translate(140, 25);
  fill(255);
  textSize(24);
  textAlign(LEFT, TOP);
  stroke(0);
  strokeWeight(3);
  text('Lv.' + level, 0, 0);
  
  // 經驗條背景
  noStroke();
  fill(50, 150);
  rect(60, 8, 100, 12, 5);
  // 經驗條前景
  fill('#00bcd4');
  let expRatio = constrain(currentExp / nextLevelExp, 0, 1);
  rect(60, 8, 100 * expRatio, 12, 5);
  pop();

  // 繪製體力條 (顯示在等級條下方)
  push();
  translate(140, 55);
  fill(255);
  textSize(16);
  textAlign(LEFT, TOP);
  stroke(0);
  strokeWeight(2);
  text('SP', 0, 0);
  
  // 體力條背景
  noStroke();
  fill(50, 150);
  rect(30, 4, 100, 8, 5);
  // 體力條前景
  let staminaRatio = constrain(stamina / maxStamina, 0, 1);
  if (staminaRatio < 0.2) {
    // 低體力警示：紅色閃爍
    if (frameCount % 10 < 5) fill('#ff3b3b');
    else fill('#ffcdd2'); // 淺紅色
  } else {
    fill('#4caf50'); // 綠色
  }
  rect(30, 4, 100 * staminaRatio, 8, 5);
  pop();

  // 繪製鑰匙狀態 (若擁有)
  if (keyCount > 0) {
    push();
    translate(30, 120); // 往下移至暫停按鈕下方，避免重疊
    fill('#FFD700');
    stroke(0);
    strokeWeight(2);
    ellipse(0, -5, 12, 12);
    rectMode(CENTER);
    rect(0, 5, 4, 15);
    rect(4, 8, 6, 4);
    fill(0);
    noStroke();
    textSize(16);
    textAlign(LEFT, CENTER);
    text('x' + keyCount, 15, 0);
    pop();
  }

  // 繪製倒數計時 (顯示在畫面正上方)
  push();
  textSize(28);
  textAlign(CENTER, TOP);
  // 剩餘時間少於 20 秒變紅色，否則白色
  fill(gameTimer <= 20 ? '#ff3b3b' : '#ffffff');
  stroke(0);
  strokeWeight(3);
  text('Time: ' + gameTimer, width / 2, 20);
  pop();

  // 倒數邏輯：frameRate 為 10，每 10 幀扣 1 秒
  if (frameCount % 10 === 0 && gameTimer > 0) gameTimer--;

  // 檢查遊戲結束條件：愛心歸零 或 時間用完
  if (hearts <= 0 || gameTimer <= 0) {
    gameState = 'gameOver';
    if (inputBox) inputBox.remove();
    inputBox = null;
    if (bgm && bgm.isPlaying()) bgm.stop(); // 遊戲結束時停止背景音樂

    // 檢查並更新最高分
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('highScore', highScore);
    }

    return; // 立即結束此幀的執行，避免後續繪製
  }

  // --- 時間道具邏輯 ---
  if (!timeItem) {
    timeItemSpawnTimer++;
    if (timeItemSpawnTimer > timeItemInterval) {
      timeItem = {
        x: random(100, width - 100),
        y: characterY, // 生成在角色高度
        size: 40,
        floatOffset: 0,
        life: itemLifetime
      };
      timeItemSpawnTimer = 0;
    }
  } else {
    timeItem.life--;
    if (timeItem.life <= 0) {
      timeItem = null;
      timeItemSpawnTimer = 0;
    } else {
    // 道具浮動動畫
    timeItem.floatOffset += 0.1;
    let drawY = timeItem.y + sin(timeItem.floatOffset) * 10;

    // 繪製道具 (藍色時鐘圖示)
    push();
    translate(timeItem.x, drawY);
    fill('#00bcd4'); // 青色
    stroke(255);
    strokeWeight(2);
    ellipse(0, 0, timeItem.size, timeItem.size);
    // 時鐘指針
    line(0, 0, 0, -10);
    line(0, 0, 8, 0);
    // 文字提示
    noStroke();
    fill(255);
    textSize(14);
    textAlign(CENTER, BOTTOM);
    text('+10s', 0, -25);
    pop();

    // 檢查碰撞 (簡單距離判定)
    if (dist(characterX, characterY, timeItem.x, drawY) < 60) {
      gameTimer += 10; // 增加 10 秒
      if (correctSound && !isMuted) correctSound.play(); // 播放音效回饋
      timeItem = null; // 移除道具
      timeItemSpawnTimer = 0;
    }
    }
  }

  // --- 無敵星星道具邏輯 ---
  if (!starItem) {
    starItemSpawnTimer++;
    if (starItemSpawnTimer > starItemInterval) {
      starItem = {
        x: random(100, width - 100),
        y: characterY - 20, // 生成在角色高度附近
        size: 40,
        floatOffset: 0,
        life: itemLifetime
      };
      starItemSpawnTimer = 0;
    }
  } else {
    starItem.life--;
    if (starItem.life <= 0) {
      starItem = null;
      starItemSpawnTimer = 0;
    } else {
    // 道具浮動動畫
    starItem.floatOffset += 0.15;
    let drawY = starItem.y + sin(starItem.floatOffset) * 10;

    // 繪製道具 (黃色星星)
    push();
    translate(starItem.x, drawY);
    fill('#ffd700'); // 金色
    stroke(255);
    strokeWeight(2);
    beginShape();
    for (let i = 0; i < 5; i++) {
      let angle = TWO_PI * i / 5 - HALF_PI;
      let x = cos(angle) * 20;
      let y = sin(angle) * 20;
      vertex(x, y);
      let angle2 = TWO_PI * (i + 0.5) / 5 - HALF_PI;
      let x2 = cos(angle2) * 8;
      let y2 = sin(angle2) * 8;
      vertex(x2, y2);
    }
    endShape(CLOSE);
    // 文字提示
    noStroke();
    fill(255);
    textSize(14);
    textAlign(CENTER, BOTTOM);
    text('無敵', 0, -25);
    pop();

    // 檢查碰撞
    if (dist(characterX, characterY, starItem.x, drawY) < 60) {
      isInvincible = true;
      invincibleTimer = invincibleDuration;
      if (correctSound && !isMuted) correctSound.play(); // 播放音效回饋
      starItem = null;
      starItemSpawnTimer = 0;
    }
    }
  }

  // --- 鑰匙道具邏輯 ---
  if (!keyItem) {
    keyItemSpawnTimer++;
    if (keyItemSpawnTimer > keyItemInterval) {
      keyItem = {
        x: random(100, width - 100),
        y: characterY - 10,
        size: 40,
        floatOffset: 0,
        life: itemLifetime
      };
      keyItemSpawnTimer = 0;
    }
  } else if (keyItem) {
    keyItem.life--;
    if (keyItem.life <= 0) {
      keyItem = null;
      keyItemSpawnTimer = 0;
    } else {
    // 道具浮動動畫
    keyItem.floatOffset += 0.1;
    let drawY = keyItem.y + sin(keyItem.floatOffset) * 10;

    // 繪製道具 (鑰匙)
    push();
    translate(keyItem.x, drawY);
    fill('#FFD700'); // 金色
    stroke(0);
    strokeWeight(2);
    // 鑰匙形狀
    ellipse(0, -10, 15, 15);
    rectMode(CENTER);
    rect(0, 5, 5, 20);
    rect(5, 10, 8, 5);
    
    // 文字提示
    noStroke();
    fill(255);
    textSize(14);
    textAlign(CENTER, BOTTOM);
    text('Key', 0, -25);
    pop();

    // 檢查碰撞
    if (dist(characterX, characterY, keyItem.x, drawY) < 60) {
      keyCount++;
      if (correctSound && !isMuted) correctSound.play(); // 播放音效回饋
      keyItem = null;
      keyItemSpawnTimer = 0;
    }
    }
  }

  // --- 雙倍積分道具邏輯 ---
  if (!doubleScoreItem) {
    doubleScoreItemSpawnTimer++;
    if (doubleScoreItemSpawnTimer > doubleScoreItemInterval) {
      doubleScoreItem = {
        x: random(100, width - 100),
        y: characterY - 30,
        size: 40,
        floatOffset: 0,
        life: itemLifetime
      };
      doubleScoreItemSpawnTimer = 0;
    }
  } else {
    doubleScoreItem.life--;
    if (doubleScoreItem.life <= 0) {
      doubleScoreItem = null;
      doubleScoreItemSpawnTimer = 0;
    } else {
      // 道具浮動動畫
      doubleScoreItem.floatOffset += 0.1;
      let drawY = doubleScoreItem.y + sin(doubleScoreItem.floatOffset) * 10;

      // 繪製道具 (粉色 x2)
      push();
      translate(doubleScoreItem.x, drawY);
      fill('#e91e63'); // Pink
      stroke(255);
      strokeWeight(2);
      ellipse(0, 0, doubleScoreItem.size, doubleScoreItem.size);
      
      fill(255);
      noStroke();
      textSize(20);
      textAlign(CENTER, CENTER);
      text('x2', 0, 0);
      
      // 文字提示
      textSize(14);
      textAlign(CENTER, BOTTOM);
      text('Double', 0, -25);
      pop();

      // 檢查碰撞
      if (dist(characterX, characterY, doubleScoreItem.x, drawY) < 60) {
        isDoubleScore = true;
        doubleScoreTimer = doubleScoreDuration;
        if (correctSound && !isMuted) correctSound.play(); // 播放音效回饋
        doubleScoreItem = null;
        doubleScoreItemSpawnTimer = 0;
      }
    }
  }

  // 處理雙倍積分時間倒數
  if (isDoubleScore) {
    doubleScoreTimer--;
    if (doubleScoreTimer <= 0) {
      isDoubleScore = false;
    }
  }

  // --- 體力藥水道具邏輯 ---
  if (!staminaItem) {
    staminaItemSpawnTimer++;
    if (staminaItemSpawnTimer > staminaItemInterval) {
      staminaItem = {
        x: random(100, width - 100),
        y: characterY - 10,
        size: 40,
        floatOffset: 0,
        life: itemLifetime
      };
      staminaItemSpawnTimer = 0;
    }
  } else {
    staminaItem.life--;
    if (staminaItem.life <= 0) {
      staminaItem = null;
      staminaItemSpawnTimer = 0;
    } else {
      // 道具浮動動畫
      staminaItem.floatOffset += 0.1;
      let drawY = staminaItem.y + sin(staminaItem.floatOffset) * 10;

      // 繪製道具 (綠色藥水)
      push();
      translate(staminaItem.x, drawY);
      fill('#4caf50'); // Green
      stroke(255);
      strokeWeight(2);
      rectMode(CENTER);
      rect(0, 5, 20, 25, 5); // Bottle body
      rect(0, -12, 10, 10); // Bottle neck
      fill('#795548'); // Brown cork
      rect(0, -18, 12, 4);
      
      // 文字提示
      noStroke();
      fill(255);
      textSize(14);
      textAlign(CENTER, BOTTOM);
      text('Stamina', 0, -25);
      pop();

      // 檢查碰撞
      if (dist(characterX, characterY, staminaItem.x, drawY) < 60) {
        stamina = maxStamina; // 恢復全部體力
        if (correctSound && !isMuted) correctSound.play(); // 播放音效回饋
        staminaItem = null;
        staminaItemSpawnTimer = 0;
      }
    }
  }

  // --- 磁鐵道具邏輯 ---
  if (!magnetItem) {
    magnetItemSpawnTimer++;
    if (magnetItemSpawnTimer > magnetItemInterval) {
      magnetItem = {
        x: random(100, width - 100),
        y: characterY - 20,
        size: 40,
        floatOffset: 0,
        life: itemLifetime
      };
      magnetItemSpawnTimer = 0;
    }
  } else {
    magnetItem.life--;
    if (magnetItem.life <= 0) {
      magnetItem = null;
      magnetItemSpawnTimer = 0;
    } else {
      // 道具浮動動畫
      magnetItem.floatOffset += 0.1;
      let drawY = magnetItem.y + sin(magnetItem.floatOffset) * 10;

      // 繪製道具 (紅色 U 型磁鐵)
      push();
      translate(magnetItem.x, drawY);
      fill('#f44336'); // Red
      stroke(255);
      strokeWeight(2);
      // U shape
      arc(0, 0, 30, 30, 0, PI, OPEN);
      rectMode(CENTER);
      rect(-15, -10, 10, 20);
      rect(15, -10, 10, 20);
      // Tips (white part of magnet)
      fill(255);
      rect(-15, -5, 10, 5);
      rect(15, -5, 10, 5);
      
      // 文字提示
      noStroke();
      fill(255);
      textSize(14);
      textAlign(CENTER, BOTTOM);
      text('Magnet', 0, -25);
      pop();

      // 檢查碰撞
      if (dist(characterX, characterY, magnetItem.x, drawY) < 60) {
        isMagnetActive = true;
        magnetTimer = magnetDuration;
        if (correctSound && !isMuted) correctSound.play(); // 播放音效回饋
        magnetItem = null;
        magnetItemSpawnTimer = 0;
      }
    }
  }

  // 處理磁鐵時間倒數與吸取效果
  if (isMagnetActive) {
    magnetTimer--;
    if (magnetTimer <= 0) {
      isMagnetActive = false;
    } else {
      // 吸取效果：將存在的道具拉向主角
      let items = [timeItem, starItem, keyItem, doubleScoreItem, staminaItem];
      for (let item of items) {
        if (item) {
           let d = dist(characterX, characterY, item.x, item.y);
           if (d < magnetRange) {
             // 使用 lerp 讓道具平滑移動向主角
             item.x = lerp(item.x, characterX, 0.15);
             item.y = lerp(item.y, characterY, 0.15);
           }
        }
      }
    }
  }

  // 處理無敵時間倒數
  if (isInvincible) {
    invincibleTimer--;
    if (invincibleTimer <= 0) {
      isInvincible = false;
    }
  }

  // 繪製右上角分數
  // 計算縮放動畫：讓 scoreScale 慢慢回到 1
  scoreScale = lerp(scoreScale, 1, 0.1);

  push();
  // 將原點移至右上角預定位置，以便進行縮放
  translate(width - 20, 20);
  scale(scoreScale);
  textSize(24);
  textAlign(RIGHT, TOP);
  fill(255);
  // 黑邊白字效果
  stroke(0);
  strokeWeight(3);
  text('Score: ' + score, 0, 0);
  noStroke();

  // 顯示 Combo (若有連擊)
  if (combo > 1) {
    fill('#fee440'); // 黃色
    textSize(20);
    text('Combo x' + combo, 0, 30);
  }

  // 顯示雙倍積分狀態
  if (isDoubleScore) {
    fill('#e91e63');
    textSize(20);
    text('Double x2 (' + ceil(doubleScoreTimer/10) + 's)', 0, combo > 1 ? 60 : 30);
  }

  // 顯示磁鐵狀態
  if (isMagnetActive) {
    fill('#f44336');
    textSize(20);
    let yPos = 30;
    if (combo > 1) yPos += 30;
    if (isDoubleScore) yPos += 30;
    text('Magnet (' + ceil(magnetTimer/10) + 's)', 0, yPos);
  }
  pop();

  // 追蹤本幀是否正在衝刺
  let isSprinting = false;

  // 狀態管理
  if (isJumping) {
    // 1. 跳躍狀態優先
    state = 'jumping';
    // 跳躍物理：前8幀上升，後6幀下降
    if (jumpFrame < 8) {
      characterY -= 15; // 向上移動
    } else {
      characterY += 15; // 向下移動
    }
    jumpFrame++;
    // 當動畫播放完畢
    if (jumpFrame >= jumpFrameCount) {
      isJumping = false;
      jumpFrame = 0;
      characterY = originalY; // 重設回原始高度
    }
  } else if (isAttacking) {
    // 2. 其次是攻擊狀態
    state = 'attacking';
    // 當攻擊動畫播放完畢
    if (attackFrame >= pushFrameCount) {
      isAttacking = false;
      attackFrame = 0;
      spawnProjectile();
    }
    attackFrame++;
  } else {
    // 3. 最後才檢查其他輸入
    if (keyIsDown(UP_ARROW)) {
      isJumping = true;
      state = 'jumping'; // 立即設定狀態
    } else if (keyIsDown(DOWN_ARROW)) { // 向下鍵發射武器
      isAttacking = true;
      state = 'attacking'; // 立即設定狀態
    } else if (keyIsDown(RIGHT_ARROW)) {
      state = 'walking';
      facingDirection = 'right';
      let currentSpeed = speed;
      // 檢查 Shift 鍵與體力
      if (keyIsDown(SHIFT) && stamina > 0) {
        currentSpeed *= 2; 
        stamina = Math.max(0, stamina - staminaConsumption);
        isSprinting = true;
      }
      characterX += currentSpeed;
    } else if (keyIsDown(LEFT_ARROW)) {
      state = 'walking';
      facingDirection = 'left';
      let currentSpeed = speed;
      // 檢查 Shift 鍵與體力
      if (keyIsDown(SHIFT) && stamina > 0) {
        currentSpeed *= 2; 
        stamina = Math.max(0, stamina - staminaConsumption);
        isSprinting = true;
      }
      characterX -= currentSpeed;
    } else {
      state = 'idle';
    }
  }

  // 若未衝刺，自動恢復體力
  if (!isSprinting) {
    stamina = Math.min(maxStamina, stamina + staminaRecovery);
  }

    // --- 繪製左側角色（始終位於主角左邊，持續循環 8 張畫格） ---
    // 左側角色座標（固定為初始化的位置，不受鍵盤影響）
    let leftX = leftInitialX;
    let leftY = characterY;
    // 更新左邊角色的畫格並繪製
    // 判斷是否接近以切換 smile 動畫
    leftUsingSmile = (Math.abs(characterX - leftInitialX) < leftSmileDistance);
    // 若玩家在答題後離開了互動範圍，標記之（以便下次靠近時換題）
    if (!leftUsingSmile && leftWasAnswered) {
      leftLeftAfterAnswer = true;
    }
    // 如果玩家再次靠近左側且剛才在左側已提交答案，且目前沒有顯示回饋，直接給下個題目
    if (leftUsingSmile && leftWasAnswered && leftLeftAfterAnswer && !showingFeedback && quizQuestions.length > 0) {
      // 直接換下一題並確保不顯示先前的鼓勵/回饋
      currentQuestionIndex = (currentQuestionIndex + 1) % quizQuestions.length;
      currentQuestion = quizQuestions[currentQuestionIndex];
      leftDialogText = currentQuestion.question;
      showingFeedback = false;
      feedbackCounter = 0;
      // 清除已提交答案的旗標，避免重複換題
      leftWasAnswered = false;
      leftLeftAfterAnswer = false;
    }
    if (leftIsFalling) {
      // 優先顯示倒下動畫 (播放一次)
      leftFallCounter++;
      if (leftFallCounter >= leftFallDelay) {
        leftFallCounter = 0;
        leftFallFrame++;
      }
      push();
      translate(leftX, leftY);
      if (leftFallFrame < leftFallFrameCount) {
        image(leftFallAnimation[leftFallFrame], 0, 0);
      } else {
        // 播放完畢，維持倒下狀態（不恢復原動畫）
        leftIsFalling = false;
        leftFallen = true;
        // 顯示倒下的最後一格
        leftFallFrame = leftFallFrameCount - 1;
      }
      pop();
    } else {
      if (leftUsingSmile) {
        // 使用計數器與延遲，使笑臉動畫播放速度變慢
        leftSmileCounter++;
        if (leftSmileCounter >= leftSmileDelay) {
          leftSmileCounter = 0;
          currentFrameLeft = (currentFrameLeft + 1) % leftSmileFrameCount;
        }
      } else {
        // 非笑臉狀態下，維持原本速度並重置計數器
        leftSmileCounter = 0;
        currentFrameLeft = (currentFrameLeft + 1) % leftFrameCount;
      }
      push();
      translate(leftX, leftY);
      if (leftUsingSmile) {
        image(leftSmileAnimation[currentFrameLeft], 0, 0);
      } else {
        image(leftAnimation[currentFrameLeft], 0, 0);
      }
      pop();
    }

    // 若接近，顯示左側角色上方的文字，並用方框包住文字
    // 若角色處於倒下並保持倒下狀態，檢查是否要由玩家靠近恢復
    let proximity = (Math.abs(characterX - leftInitialX) < leftSmileDistance);
    if (leftFallen) {
      if (proximity) {
        // 玩家接近，恢復到 stop 動畫
        leftFallen = false;
        currentFrameLeft = 0;
        // 不立即切換為 smile（保持 stop），所以 leftUsingSmile 保持 false
        leftUsingSmile = false;
      } else {
        // 若仍未接近，顯示倒下最後一格（不顯示對話或輸入）
        // 已在上方倒下繪製處理，此處可跳過顯示對話
      }
    }

    if (leftUsingSmile) {
      push();
      textSize(18);
      textAlign(CENTER, CENTER);
      // 計算文字尺寸
      let tw = textWidth(leftDialogText);
      let th = textAscent() + textDescent();
      let padding = 8;
      let boxW = tw + padding * 2;
      let boxH = th + padding * 2;
      let boxX = leftX;
      let boxY = leftY - leftSpriteHeight - 20; // 上方偏移
      rectMode(CENTER);
      noStroke();
      fill('#fee440');
      rect(boxX, boxY, boxW, boxH, 6);
      // 繪製文字
      fill(0);
      text(leftDialogText, boxX, boxY);
      pop();
    }

    // --- 繪製右側角色（固定於主角右邊，持續循環 6 張畫格） ---
    let rightX = rightInitialX;
    let rightY = characterY;
    // 若主角在右側角色的左邊，將右側角色左右反向顯示
    rightFlipped = (characterX < rightInitialX);
    // 判斷是否接近以切換 touch 動畫
    rightUsingTouch = (Math.abs(characterX - rightInitialX) < rightTouchDistance);
    // 根據是否使用 touch 動畫選擇畫格數與動畫陣列
    let activeAnimation = rightUsingTouch ? rightTouchAnimation : rightAnimation;
    // 安全取用索引（以實際陣列長度為準），避免切換時索引越界
    if (activeAnimation.length > 0) {
      currentFrameRight = (currentFrameRight + 1) % activeAnimation.length;
      let frameIndex = currentFrameRight;
      push();
      translate(rightX, rightY);
      if (rightFlipped) {
        scale(-1.5, 1); // 翻轉並放大
      } else {
        scale(1.5, 1); // 只放大
      }
      image(activeAnimation[frameIndex], 0, 0);
      pop();
    }

    // 如果玩家向左側角色詢問但離開時沒有回答，接著靠近右側角色則顯示提示
    // 玩家接近右側且左側有求提示需求時，標記右側已給提示（持續顯示）
    if (rightUsingTouch && leftNeedsHint && !leftHintGiven) {
      if (keyCount > 0) {
        // 顯示確認視窗
        push();
        textSize(18);
        textAlign(CENTER, CENTER);
        let confirmText = '是否消耗鑰匙獲取提示? (Y/N)';
        let tw = textWidth(confirmText);
        let th = textAscent() + textDescent();
        let padding = 8;
        let boxW = tw + padding * 2;
        let boxH = th + padding * 2;
        let boxX = rightX;
        let boxY = rightY - rightSpriteHeight - 20; // 上方偏移
        rectMode(CENTER);
        noStroke();
        fill('#fffbe6');
        stroke(0);
        strokeWeight(1);
        rect(boxX, boxY, boxW, boxH, 6);
        fill(0);
        noStroke();
        text(confirmText, boxX, boxY);
        pop();

        if (keyIsDown(89)) { // Y key
          leftHintGiven = true;
          keyCount--;
        }
      }
    }

    // 如果右側已給提示，無論玩家是否在旁都持續顯示提示泡泡
    if (leftHintGiven && currentQuestion) {
      push();
      textSize(18);
      textAlign(CENTER, CENTER);
      let hintText = currentQuestion.hint || '提示';
      let tw = textWidth(hintText);
      let th = textAscent() + textDescent();
      let padding = 8;
      let boxW = tw + padding * 2;
      let boxH = th + padding * 2;
      let boxX = rightX;
      let boxY = rightY - rightSpriteHeight - 20; // 上方偏移
      rectMode(CENTER);
      noStroke();
      fill('#bde0fe');
      rect(boxX, boxY, boxW, boxH, 6);
      fill(0);
      text(hintText, boxX, boxY);
      pop();
    } else if (rightUsingTouch && leftNeedsHint && keyCount <= 0) {
       // 顯示需要鑰匙的提示
       push();
       textSize(18);
       textAlign(CENTER, CENTER);
       let hintText = '需要鑰匙才能解鎖提示!';
       let tw = textWidth(hintText);
       let th = textAscent() + textDescent();
       let padding = 8;
       let boxW = tw + padding * 2;
       let boxH = th + padding * 2;
       let boxX = rightX;
       let boxY = rightY - rightSpriteHeight - 20; // 上方偏移
       rectMode(CENTER);
       noStroke();
       fill('#ffcccb'); // 淺紅色
       rect(boxX, boxY, boxW, boxH, 6);
       fill(0);
       text(hintText, boxX, boxY);
       pop();
    }

    // --- 左側互動時顯示輸入框（顯示在主角上方） ---
    // 如果靠近左側角色且還沒建立輸入框，建立之；離開時移除
    // 不在倒下保持狀態時顯示輸入框
    if (!leftFallen && leftUsingSmile && !showingFeedback) {
      if (inputBox === null) {
        // 建立輸入框並定位於主角上方，placeholder 顯示題目
        inputBox = createInput('');
        // 記錄玩家已看到題目，但尚未確認回答
        leftSawQuestion = true;
        answeredByLeft = false;
        inputBox.position(characterX - 100, characterY - 80);
        inputBox.size(200, 24);
        inputBox.attribute('placeholder', currentQuestion ? currentQuestion.question : '輸入答案後按 Enter');
        inputBox.elt.focus();
        // 監聽 Enter 鍵進行驗證
        inputBox.elt.addEventListener('keydown', function(e) {
          if (e.key === 'Enter') {
            const val = inputBox.value().trim();
            // 標記為已嘗試回答
            answeredByLeft = true;
            inputBox.remove();
            inputBox = null;
            if (currentQuestion) {
              // 比對答案（允許字串或數字形式）
              if (val === currentQuestion.answer.trim() || parseInt(val) === parseInt(currentQuestion.answer)) {
                // 答對：顯示正向鼓勵，並加分
                combo++; // 增加連擊數
                if (combo >= 10) unlockAchievement('combo10');
                if (combo > maxCombo) maxCombo = combo; // 更新最高連擊
                let points = scorePerCorrect * combo; // 分數隨連擊數倍增
                if (isDoubleScore) points *= 2; // 雙倍積分
                score += points;
                if (score >= 1000) unlockAchievement('highScorer');
                scoreScale = 2.5; // 設定縮放比例，觸發放大特效
                leftDialogText = currentQuestion.correctFeedback + ' 太棒了！你得到 ' + points + ' 分！' + (combo > 1 ? ' (Combo x' + combo + '!)' : '');
                
                // 等級系統更新
                currentExp += points;
                if (currentExp >= nextLevelExp) {
                  level++;
                  currentExp -= nextLevelExp;
                  nextLevelExp = Math.floor(nextLevelExp * 1.2); // 下一級所需經驗值增加
                  gameTimer += 15; // 升級獎勵：時間增加
                  hearts = Math.min(hearts + 1, maxHearts); // 升級獎勵：回復愛心
                  leftDialogText = '升級了！Lv.' + level + ' (時間+15s, 愛心+1)';
                }

                if (correctSound && !isMuted) correctSound.play(); // 播放答對音效
                // 產生彩花特效
                for (let i = 0; i < 100; i++) {
                  let angle = random(TWO_PI); // 隨機角度
                  let speed = random(5, 15);  // 爆炸速度
                  confettiParticles.push({
                    x: width / 2, // 從畫面中間開始
                    y: height / 2,
                    vx: cos(angle) * speed, // 向四面八方擴散
                    vy: sin(angle) * speed,
                    size: random(8, 15),
                    color: color(random(255), random(255), random(255)),
                    rotation: random(TWO_PI),
                    rSpeed: random(-0.2, 0.2)
                  });
                }
              } else {
                // 答錯：顯示鼓勵並提示
                combo = 0; // 答錯重置連擊
                leftDialogText = currentQuestion.wrongFeedback + ' 別灰心，繼續努力！ 提示: ' + currentQuestion.hint;
                // 答錯扣一顆愛心（最低為 0），若處於無敵狀態則不扣
                if (!isInvincible) {
                  hearts = Math.max(0, hearts - 1);
                }
                if (wrongSound && !isMuted) wrongSound.play(); // 播放答錯音效
              }
              showingFeedback = true;
              feedbackCounter = 0;
              // 清除已看到題目的標記（因為已作答）
              leftSawQuestion = false;
              leftNeedsHint = false;
                leftHintGiven = false; // 回答後清除已給提示狀態
                // 記錄玩家已在左側提交答案，下次靠近直接換題
                leftWasAnswered = true;
            }
          }
        });
      } else {
        // 確保 placeholder 與題目同步
        if (currentQuestion) inputBox.attribute('placeholder', currentQuestion.question);
      }
    } else {
      if (inputBox !== null) {
        // 玩家離開左側互動範圍並且尚未作答，標記需要向右側 NPC 求提示
        inputBox.remove();
        inputBox = null;
        if (leftSawQuestion && !answeredByLeft && !showingFeedback) {
          leftNeedsHint = true;
        }
        // 重置看到題目的旗標（已離開）
        leftSawQuestion = false;
        answeredByLeft = false;
      }
      if (!showingFeedback) {
        leftDialogText = currentQuestion ? currentQuestion.question : '需要我解答嗎?';
      }
    }

    // 處理回饋顯示與題目推進
    if (showingFeedback) {
      // 如果設為在左側作答後保持回饋顯示，且玩家仍在左側範圍，則暫停計時
      if (keepFeedbackUntilLeave && leftUsingSmile) {
        // 一直顯示鼓勵文字，直到玩家離開左側範圍
      } else {
        feedbackCounter++;
        if (feedbackCounter >= feedbackDuration) {
          showingFeedback = false;
          feedbackCounter = 0;
          if (quizQuestions.length > 0) {
            currentQuestionIndex = (currentQuestionIndex + 1) % quizQuestions.length;
            currentQuestion = quizQuestions[currentQuestionIndex];
            leftDialogText = currentQuestion.question;
          } else {
            leftDialogText = '需要我解答嗎?';
          }
        }
      }
      // 若玩家已離開左側互動範圍，取消 keepFeedbackUntilLeave（下次顯示會計時）
      if (keepFeedbackUntilLeave && !leftUsingSmile) {
        keepFeedbackUntilLeave = false;
        // 若玩家之前在左側已提交答案，記錄他已離開過（下次靠近才換題）
        if (leftWasAnswered) leftLeftAfterAnswer = true;
      }
    }


  // --- 繪製角色 ---
  push();
  translate(characterX, characterY);
  // 同時處理翻轉與縮放：若向左，x 軸取負以翻轉
  let sx = (facingDirection === 'left') ? -characterScale : characterScale;
  scale(sx, characterScale);

  // 若處於無敵狀態，繪製光環
  if (isInvincible) {
    push();
    noStroke();
    fill(255, 215, 0, 100 + sin(frameCount * 0.5) * 50); // 閃爍的金色光環
    ellipse(0, 0, 80, 80); // 繪製在角色背後
    pop();
  }

  // 根據狀態選擇動畫並繪製（影像基準仍為中心）
  if (state === 'idle') {
    currentFrame = (currentFrame + 1) % idleFrameCount;
    image(idleAnimation[currentFrame], 0, 0);
  } else if (state === 'walking') {
    currentFrame = (currentFrame + 1) % walkFrameCount;
    image(walkAnimation[currentFrame], 0, 0);
  } else if (state === 'jumping' && jumpFrame < jumpFrameCount) {
    image(jumpAnimation[jumpFrame], 0, 0);
  } else if (state === 'attacking' && attackFrame < pushFrameCount) {
    image(pushAnimation[attackFrame], 0, 0);
  }

  pop();

  // --- 繪製與更新投射物 ---
  for (let i = projectiles.length - 1; i >= 0; i--) {
    let p = projectiles[i];
    p.x += p.speed;

    push();
    translate(p.x, p.y);
    if (p.direction === 'left') {
      scale(-1, 1);
    }
    image(toolAnimation[p.animFrame], 0, 0);
    pop();

    p.animFrame = (p.animFrame + 1) % toolFrameCount;

    // 檢查投射物是否碰到左側角色 (角色2)
    // 只檢查向左飛的投射物碰撞左側角色，且目標尚未倒下
    if (p.direction === 'left') {
      let d = dist(p.x, p.y, leftInitialX, characterY);
      if (d < 50 && !leftIsFalling && !leftFallen) {
        // 觸發左側角色倒下動畫並移除該投射物
        leftIsFalling = true;
        leftFallFrame = 0;
        leftFallCounter = 0;
        projectiles.splice(i, 1);
        continue;
      }
    }
    // 如果投射物飛出畫面，就將其移除
    if (p.x > width + toolFrameWidth || p.x < -toolFrameWidth) {
      projectiles.splice(i, 1);
    }
  }

  // --- 更新與繪製彩花 ---
  for (let i = confettiParticles.length - 1; i >= 0; i--) {
    let p = confettiParticles[i];
    p.vy += 0.5; // 增加重力效果，讓彩花爆開後自然落下
    p.y += p.vy;
    p.x += p.vx;
    p.rotation += p.rSpeed;

    push();
    translate(p.x, p.y);
    rotate(p.rotation);
    noStroke();
    fill(p.color);
    rect(0, 0, p.size, p.size);
    pop();

    // 超出畫面底部移除
    if (p.y > height) {
      confettiParticles.splice(i, 1);
    }
  }
}


function spawnProjectile() {
  let projectile = {
    x: characterX + (facingDirection === 'right' ? 50 : -50), // 根據方向微調起始位置
    y: characterY,
    direction: facingDirection,
    speed: facingDirection === 'right' ? projectileSpeed : -projectileSpeed,
    animFrame: 0
  };
  projectiles.push(projectile);
}

function drawGameOverScreen() {
  push();
  // 半透明黑色背景
  fill(0, 0, 0, 150);
  rect(0, 0, width, height);

  // "遊戲結束" 文字
  textAlign(CENTER, CENTER);
  fill('#ff3b3b');
  textSize(80);
  stroke(0);
  strokeWeight(5);
  text(gameTimer <= 0 ? '時間到' : '遊戲結束', width / 2, height / 2 - 130);

  // 計算並繪製星級 (依分數給予 1~3 顆星)
  let stars = 1;
  if (score >= 600) stars = 3;
  else if (score >= 300) stars = 2;

  textSize(60);
  fill('#ffd700'); // 金色
  stroke(255);
  strokeWeight(2);
  let starStr = '';
  for (let i = 0; i < 3; i++) {
    starStr += (i < stars) ? '★ ' : '☆ ';
  }
  text(starStr.trim(), width / 2, height / 2 - 60);

  // 最終分數
  fill(255);
  textSize(40);
  noStroke();
  text('最終分數: ' + score, width / 2, height / 2 + 10);

  // 歷史最高分
  fill('#fee440');
  textSize(30);
  text('歷史最高: ' + highScore, width / 2, height / 2 + 55);
  
  // 最高連擊
  fill(255);
  textSize(30);
  text('最高連擊: ' + maxCombo, width / 2, height / 2 + 90);

  // 最終等級
  text('最終等級: Lv.' + level, width / 2, height / 2 + 130);

  // 重新開始提示
  textSize(24);
  fill('#fefae0');
  text('點擊滑鼠重新開始', width / 2, height / 2 + 170);

  // 查看成就按鈕
  rectMode(CENTER);
  fill('#00bcd4');
  stroke(255);
  strokeWeight(2);
  rect(width / 2, height / 2 + 230, 200, 50, 10);
  
  fill(255);
  noStroke();
  textSize(24);
  text('查看成就', width / 2, height / 2 + 230);

  if (showAchievements) {
    drawAchievementsScreen();
  }
  pop();
}

function drawAchievementsScreen() {
  push();
  // 半透明黑色遮罩
  fill(0, 0, 0, 200);
  rectMode(CORNER);
  rect(0, 0, width, height);

  // 視窗背景
  rectMode(CENTER);
  fill('#fffbe6');
  stroke('#8d6e63');
  strokeWeight(5);
  rect(width / 2, height / 2, 600, 500, 20);

  // 標題
  fill('#5d4037');
  noStroke();
  textSize(40);
  textAlign(CENTER, TOP);
  text('成就列表', width / 2, height / 2 - 220);

  let yStart = height / 2 - 150;
  let spacing = 70;
  let i = 0;
  
  textAlign(LEFT, CENTER);
  
  for (let key in achievements) {
    let ach = achievements[key];
    let y = yStart + i * spacing;
    
    // 圖示與名稱
    textSize(30);
    fill(ach.unlocked ? '#ffd700' : '#9e9e9e'); // 解鎖金色，未解鎖灰色
    text(ach.unlocked ? '★' : '🔒', width / 2 - 250, y);
    
    fill(ach.unlocked ? '#5d4037' : '#9e9e9e');
    textSize(24);
    text(ach.name, width / 2 - 200, y);
    
    // 描述
    textSize(18);
    fill(ach.unlocked ? '#795548' : '#bdbdbd');
    text(ach.desc, width / 2 - 200, y + 25);
    
    i++;
  }

  // 關閉提示
  textAlign(CENTER, BOTTOM);
  fill('#5d4037');
  textSize(20);
  text('點擊任意處關閉', width / 2, height / 2 + 230);
  pop();
}

function unlockAchievement(id) {
  if (achievements[id] && !achievements[id].unlocked) {
    achievements[id].unlocked = true;
    let bonus = 500; // 成就獎勵分數
    score += bonus;
    scoreScale = 2.5; // 分數跳動特效
    achievementNotification.message = '解鎖成就: ' + achievements[id].name + ' (+' + bonus + '分)';
    achievementNotification.timer = 50; // 顯示 5 秒 (50 frames)
    // 這裡可以加入成就音效
  }
}

function drawAchievementNotification() {
  if (achievementNotification.timer > 0) {
    push();
    translate(width / 2, 100); // 顯示在上方
    rectMode(CENTER);
    fill(0, 0, 0, 200);
    stroke('#ffd700');
    strokeWeight(2);
    rect(0, 0, 300, 50, 10);
    
    fill('#ffd700');
    noStroke();
    textSize(20);
    textAlign(CENTER, CENTER);
    text(achievementNotification.message, 0, 0);
    pop();
    
    achievementNotification.timer--;
  }
}

function drawRoulette() {
  push();
  translate(width / 2, height / 2);

  // 繪製半透明背景
  fill(0, 0, 0, 150);
  rectMode(CORNER);
  rect(-width / 2, -height / 2, width, height);

  // 輪盤參數
  let radius = 200;
  let segAngle = TWO_PI / rouletteSegments.length;

  // 轉動邏輯 (Lerp)
  if (isRouletteSpinning) {
    rouletteAngle = lerp(rouletteAngle, rouletteTargetAngle, 0.05);
    // 檢查是否停止
    if (Math.abs(rouletteTargetAngle - rouletteAngle) < 0.01) {
      rouletteAngle = rouletteTargetAngle;
      isRouletteSpinning = false;
      showRouletteResult = true;
      
      // 發放獎勵
      let prize = rouletteSegments[rouletteResultIndex];
      if (prize === '愛心') {
         if (hearts < maxHearts) hearts++;
      } else if (prize === '時間') {
         gameTimer += 30;
      } else if (prize === '鑰匙') {
         keyCount++;
      } else if (prize === '無敵') {
         isInvincible = true;
         invincibleTimer = 150;
         unlockAchievement('luckyWinner');
      } else if (prize === '大獎') {
         score += 5000;
         scoreScale = 3.0;
         if (score >= 1000) unlockAchievement('highScorer');
      }
      
      if (prize !== '銘謝惠顧') {
        if (correctSound && !isMuted) correctSound.play();
      } else {
        if (wrongSound && !isMuted) wrongSound.play();
      }
    }
  }

  // 繪製輪盤
  rotate(rouletteAngle);
  stroke(255);
  strokeWeight(2);
  for (let i = 0; i < rouletteSegments.length; i++) {
    fill(rouletteColors[i]);
    arc(0, 0, radius * 2, radius * 2, i * segAngle, (i + 1) * segAngle, PIE);
    
    // 繪製文字
    push();
    rotate((i + 0.5) * segAngle);
    textAlign(RIGHT, CENTER);
    fill(255);
    textSize(20);
    text(rouletteSegments[i], radius - 20, 0);
    pop();
  }
  
  // 繪製指針 (固定在上方)
  rotate(-rouletteAngle); // 抵銷輪盤旋轉，保持指針不動
  fill(255);
  stroke(0);
  triangle(0, -radius - 20, -15, -radius + 10, 15, -radius + 10);

  // 顯示結果文字
  if (showRouletteResult) {
    fill(255);
    stroke(0);
    strokeWeight(4);
    textSize(40);
    textAlign(CENTER, CENTER);
    text(rouletteSegments[rouletteResultIndex], 0, 0);
    textSize(20);
    text('點擊任意處關閉', 0, 50);
  }

  // 顯示機率表 (顯示在輪盤右側)
  translate(260, -120); // 相對於中心點的位移
  fill(0, 0, 0, 180);
  stroke(255);
  strokeWeight(2);
  rectMode(CORNER);
  rect(0, 0, 220, 240, 10);
  
  fill(255);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(24);
  text('中獎機率', 110, 15);
  
  textAlign(LEFT, TOP);
  textSize(18);
  let probText = "大獎: 5%\n無敵: 16.25%\n鑰匙: 16.25%\n時間: 16.25%\n愛心: 16.25%\n銘謝惠顧: 30%";
  textLeading(30); // 設定行距
  text(probText, 20, 55);
  pop();
}

function drawShopButton() {
  push();
  translate(width - 70, 160); // 位置設定在靜音按鈕下方
  rectMode(CENTER);
  fill('#ff9800'); // 橘色
  stroke(255);
  strokeWeight(2);
  rect(0, 0, 100, 40, 10);
  
  fill(255);
  noStroke();
  textSize(16);
  textAlign(CENTER, CENTER);
  text('商店', 0, 0);
  pop();
}

function drawCatalogButton() {
  push();
  translate(width - 70, 210); // 位置設定在商店按鈕下方
  rectMode(CENTER);
  fill('#2196f3'); // 藍色
  stroke(255);
  strokeWeight(2);
  rect(0, 0, 100, 40, 10);
  
  fill(255);
  noStroke();
  textSize(16);
  textAlign(CENTER, CENTER);
  text('圖鑑', 0, 0);
  pop();
}

function drawCatalogInterface() {
  push();
  // 半透明黑色遮罩
  fill(0, 0, 0, 150);
  rect(0, 0, width, height);

  // 圖鑑視窗背景
  rectMode(CENTER);
  fill('#fffbe6');
  stroke('#8d6e63');
  strokeWeight(5);
  rect(width / 2, height / 2, 700, 600, 20);

  // 標題
  fill('#5d4037');
  noStroke();
  textSize(40);
  textAlign(CENTER, TOP);
  text('遊戲圖鑑', width / 2, height / 2 - 250);

  // 列表內容 (圖示 + 說明)
  let startX = width / 2 - 300;
  let startY = height / 2 - 190;
  let lineHeight = 45;

  let items = [
    {
      text: "愛心: 恢復 1 點生命值",
      draw: (x, y) => {
        fill('#ff3b3b'); noStroke(); textSize(24); textAlign(CENTER, CENTER); text('❤', x, y);
      }
    },
    {
      text: "時間道具: 增加遊戲時間 (+10s)",
      draw: (x, y) => {
        fill('#00bcd4'); stroke(255); strokeWeight(2); ellipse(x, y, 30, 30);
        line(x, y, x, y - 8); line(x, y, x + 6, y);
      }
    },
    {
      text: "鑰匙: 解鎖 NPC 提示",
      draw: (x, y) => {
        fill('#FFD700'); stroke(0); strokeWeight(2);
        ellipse(x, y - 5, 12, 12);
        rectMode(CENTER); rect(x, y + 5, 4, 15); rect(x + 4, y + 8, 6, 4);
      }
    },
    {
      text: "無敵星星: 一段時間內免疫傷害",
      draw: (x, y) => {
        fill('#ffd700'); stroke(255); strokeWeight(2);
        push(); translate(x, y); scale(0.8); beginShape();
        for (let i = 0; i < 5; i++) {
          let angle = TWO_PI * i / 5 - HALF_PI;
          vertex(cos(angle) * 20, sin(angle) * 20);
          let angle2 = TWO_PI * (i + 0.5) / 5 - HALF_PI;
          vertex(cos(angle2) * 8, sin(angle2) * 8);
        }
        endShape(CLOSE); pop();
      }
    },
    {
      text: "雙倍積分: 一段時間內得分加倍",
      draw: (x, y) => {
        fill('#e91e63'); stroke(255); strokeWeight(2); ellipse(x, y, 30, 30);
        fill(255); noStroke(); textSize(14); textAlign(CENTER, CENTER); text('x2', x, y);
      }
    },
    {
      text: "體力藥水: 恢復全部體力",
      draw: (x, y) => {
        push(); translate(x, y); scale(0.8);
        fill('#4caf50'); stroke(255); strokeWeight(2);
        rectMode(CENTER); rect(0, 5, 20, 25, 5);
        rect(0, -12, 10, 10);
        fill('#795548'); rect(0, -18, 12, 4);
        pop();
      }
    },
    {
      text: "磁鐵: 自動吸取附近的道具",
      draw: (x, y) => {
        push(); translate(x, y); scale(0.8);
        fill('#f44336'); stroke(255); strokeWeight(2);
        arc(0, 0, 30, 30, 0, PI, OPEN);
        rectMode(CENTER); rect(-15, -10, 10, 20); rect(15, -10, 10, 20);
        fill(255); rect(-15, -5, 10, 5); rect(15, -5, 10, 5);
        pop();
      }
    },
    {
      text: "商店: 使用分數購買道具",
      draw: (x, y) => { textSize(24); textAlign(CENTER, CENTER); text('💰', x, y); }
    },
    {
      text: "幸運輪盤: 消耗 100 分進行抽獎",
      draw: (x, y) => { textSize(24); textAlign(CENTER, CENTER); text('🎰', x, y); }
    },
    {
      text: "連擊系統: 連續答對可獲得更高分",
      draw: (x, y) => { textSize(24); textAlign(CENTER, CENTER); text('🔥', x, y); }
    },
    {
      text: "等級系統: 累積經驗升級，回血並加時",
      draw: (x, y) => { textSize(24); textAlign(CENTER, CENTER); text('🆙', x, y); }
    }
  ];

  for (let i = 0; i < items.length; i++) {
    let y = startY + i * lineHeight;
    push();
    items[i].draw(startX + 20, y + 15);
    pop();
    
    fill('#5d4037');
    noStroke();
    textAlign(LEFT, CENTER);
    textSize(20);
    text(items[i].text, startX + 60, y + 15);
  }

  // 關閉提示
  textAlign(CENTER, BOTTOM);
  fill('#5d4037');
  text('點擊任意處關閉', width / 2, height / 2 + 280);
  pop();
}

function drawShopInterface() {
  push();
  // 半透明黑色遮罩
  fill(0, 0, 0, 150);
  rect(0, 0, width, height);

  // 商店視窗背景
  rectMode(CENTER);
  fill('#fffbe6');
  stroke('#8d6e63');
  strokeWeight(5);
  rect(width / 2, height / 2, 500, 420, 20);

  // 標題
  fill('#5d4037');
  noStroke();
  textSize(40);
  textAlign(CENTER, TOP);
  text('道具商店', width / 2, height / 2 - 190);

  // 目前分數
  textSize(24);
  fill('#ff5722');
  text('目前分數: ' + score, width / 2, height / 2 - 140);

  // 商品列表 (名稱 | 價格 | 按鈕)
  textSize(20);
  strokeWeight(1);
  for (let item of shopItems) {
    let py = height / 2 + item.y;
    // 商品名稱
    textAlign(LEFT, CENTER);
    fill(0);
    text(item.name, width / 2 - 200, py);
    // 價格
    textAlign(CENTER, CENTER);
    fill('#d32f2f');
    text('$' + item.price, width / 2, py);
    // 購買按鈕
    rectMode(CENTER);
    fill(score >= item.price ? '#4caf50' : '#9e9e9e'); // 足夠分數顯示綠色，否則灰色
    stroke(0);
    rect(width / 2 + 150, py, 80, 30, 5);
    fill(255);
    noStroke();
    text('購買', width / 2 + 150, py);
  }

  // 抽獎按鈕
  let lotteryY = height / 2 + 150;
  textAlign(LEFT, CENTER);
  fill(0);
  text('幸運抽獎', width / 2 - 200, lotteryY);
  
  textAlign(CENTER, CENTER);
  fill('#d32f2f');
  text('$100', width / 2, lotteryY);

  rectMode(CENTER);
  fill(score >= 100 ? '#9c27b0' : '#9e9e9e'); // 紫色按鈕
  stroke(0);
  rect(width / 2 + 150, lotteryY, 80, 30, 5);
  fill(255);
  noStroke();
  text('抽獎', width / 2 + 150, lotteryY);

  // 關閉提示
  fill('#5d4037');
  textSize(16);
  text('點擊任意處關閉', width / 2, height / 2 + 200);
  pop();
}

function drawPauseButton() {
  push();
  translate(40, 80); // 設定位置在左上角，愛心下方 (愛心約在 y=20~50)
  rectMode(CENTER);
  fill(isPaused ? '#4caf50' : '#ff9800'); // 暫停時顯示綠色(繼續)，播放時顯示橘色(暫停)
  stroke(255);
  strokeWeight(2);
  rect(0, 0, 60, 40, 10);
  
  fill(255);
  noStroke();
  textSize(16);
  textAlign(CENTER, CENTER);
  text(isPaused ? '繼續' : '暫停', 0, 0);
  pop();
}

function drawPauseOverlay() {
  push();
  // 半透明黑色遮罩
  fill(0, 0, 0, 100);
  rect(0, 0, width, height);
  
  // 暫停文字
  fill(255);
  textSize(60);
  textAlign(CENTER, CENTER);
  stroke(0);
  strokeWeight(4);
  text('暫停中', width / 2, height / 2);
  pop();
}

function drawMuteButton() {
  push();
  translate(width - 70, 110); // 位置設定在右上角，避開分數與 Combo 顯示
  rectMode(CENTER);
  fill(isMuted ? '#ff3b3b' : '#4caf50'); // 靜音時紅色，開啟時綠色
  stroke(255);
  strokeWeight(2);
  rect(0, 0, 100, 40, 10);
  
  fill(255);
  noStroke();
  textSize(16);
  textAlign(CENTER, CENTER);
  text(isMuted ? '靜音' : '音樂: 開', 0, 0);
  pop();
}

function drawStartScreen() {
  push();
  // 半透明黑色背景
  fill(0, 0, 0, 150);
  rect(0, 0, width, height);

  // 遊戲標題
  textAlign(CENTER, CENTER);
  fill('#fee440');
  textSize(80);
  stroke(0);
  strokeWeight(5);
  text('冒險遊戲', width / 2, height / 2 - 80);

  // 開始按鈕
  rectMode(CENTER);
  fill('#ff3b3b');
  stroke(255);
  strokeWeight(3);
  rect(width / 2, height / 2 + 50, 200, 60, 15);

  // 按鈕文字
  fill(255);
  textSize(30);
  noStroke();
  text('開始遊戲', width / 2, height / 2 + 50);

  // 顯示最高紀錄
  textSize(24);
  fill('#fee440');
  text('最高紀錄: ' + highScore, width / 2, height / 2 + 110);
  pop();
}

function mousePressed() {
  // 若輪盤結果顯示中，點擊關閉並回到商店
  if (showRouletteResult) {
    showRouletteResult = false;
    gameSnapshot = null;
    redraw(); // 重繪以顯示商店介面
    return;
  }

  // 檢查是否點擊商店按鈕 (中心 width-70, 160, 寬 100, 高 40)
  if (gameState === 'playing' && !isPaused && mouseX > width - 120 && mouseX < width - 20 && mouseY > 140 && mouseY < 180) {
    isShopOpen = !isShopOpen;
    if (isShopOpen) {
      lotteryResult = ""; // 開啟商店時重置抽獎結果
      // 開啟商店時不需額外暫停音樂，noLoop 會在 draw 中執行
    } else {
      loop();
    }
    redraw();
    return;
  }

  // 檢查是否點擊圖鑑按鈕 (中心 width-70, 210, 寬 100, 高 40)
  if (gameState === 'playing' && !isPaused && mouseX > width - 120 && mouseX < width - 20 && mouseY > 190 && mouseY < 230) {
    isCatalogOpen = !isCatalogOpen;
    if (isCatalogOpen) {
      // noLoop 會在 draw 中執行
    } else {
      loop();
    }
    redraw();
    return;
  }

  // 若圖鑑開啟，點擊任意處關閉
  if (gameState === 'playing' && isCatalogOpen) {
    isCatalogOpen = false;
    loop();
    redraw();
    return;
  }

  // 若商店開啟，處理商店內的點擊
  if (gameState === 'playing' && isShopOpen) {
    let cx = width / 2;
    let cy = height / 2;
    
    // 檢查購買按鈕 (x: cx + 150, w: 80, h: 30)
    // 商品 Y 座標: -80, -20, 40, 100
    let clickedItem = false;
    for (let item of shopItems) {
      let py = cy + item.y;
      if (mouseX > cx + 110 && mouseX < cx + 190 && mouseY > py - 15 && mouseY < py + 15) {
        clickedItem = true;
        if (score >= item.price) {
          // 特殊檢查：愛心滿了不能買
          if (item.id === 'heart' && hearts >= maxHearts) {
             // 滿血不扣分
          } else {
            score -= item.price;
            // 執行購買效果
            if (item.id === 'heart') hearts++;
            else if (item.id === 'time') gameTimer += 30;
            else if (item.id === 'key') keyCount++;
            else if (item.id === 'invincible') { isInvincible = true; invincibleTimer = 150; }
            
            // 價格上漲 (通貨膨脹)，每次購買增加 20%
            item.price = Math.ceil(item.price * 1.2);
            
            if (correctSound && !isMuted) correctSound.play();
            redraw(); // 更新畫面顯示餘額
          }
        } else {
          if (wrongSound && !isMuted) wrongSound.play(); // 分數不足音效
        }
      }
    }

    // 抽獎按鈕邏輯 (位置: cy + 150)
    let lotteryY = cy + 150;
    if (mouseX > cx + 110 && mouseX < cx + 190 && mouseY > lotteryY - 15 && mouseY < lotteryY + 15) {
      clickedItem = true;
      if (score >= 100) {
        score -= 100;
        
        // 決定抽獎結果
        let r = random(1);
        let prizeIndex = 0;
        if (r < 0.3) { // 30% 機率什麼都沒有
          prizeIndex = 0; // 銘謝惠顧
        } else if (r < 0.35) { // 5% 機率大獎
          prizeIndex = 5; // 大獎
        } else {
          prizeIndex = floor(random(1, 5)); // 1~4: 愛心, 時間, 鑰匙, 無敵
        }
        
        rouletteResultIndex = prizeIndex;
        
        // 計算目標角度
        // 指針在上方 (-HALF_PI)
        // 目標區塊 i 的範圍是 i*segAngle ~ (i+1)*segAngle
        // 我們希望指針指在區塊中心： (i + 0.5) * segAngle
        // 輪盤旋轉角度 theta 需滿足： -HALF_PI - theta = (i + 0.5) * segAngle
        // => theta = -HALF_PI - (i + 0.5) * segAngle
        let segAngle = TWO_PI / rouletteSegments.length;
        let baseTarget = -HALF_PI - (prizeIndex + 0.5) * segAngle;
        // 加入隨機偏移與多圈旋轉
        baseTarget += random(-segAngle * 0.4, segAngle * 0.4);
        rouletteTargetAngle = baseTarget - TWO_PI * 5; // 往回轉 5 圈
        
        rouletteAngle = 0;
        isRouletteSpinning = true;
        gameSnapshot = get(); // 截圖當前畫面作為背景
        loop(); // 確保動畫執行
      } else {
        if (wrongSound && !isMuted) wrongSound.play(); // 分數不足
      }
    }

    // 若沒點到購買按鈕，則關閉商店
    if (!clickedItem) {
      isShopOpen = false;
      loop();
      redraw();
    }
    return;
  }

  // 檢查是否點擊暫停按鈕 (中心 40, 80, 寬 60, 高 40)
  if (gameState === 'playing' && mouseX > 10 && mouseX < 70 && mouseY > 60 && mouseY < 100) {
    isPaused = !isPaused;
    if (isPaused) {
      if (bgm && bgm.isPlaying()) bgm.pause();
      // draw() 會在下一幀繪製遮罩後呼叫 noLoop()
    } else {
      loop(); // 恢復遊戲迴圈
      if (bgm && !isMuted) bgm.loop();
    }
    return;
  }

  // 檢查是否點擊靜音按鈕 (中心 width-70, 110, 寬 100, 高 40)
  if (mouseX > width - 120 && mouseX < width - 20 && mouseY > 90 && mouseY < 130) {
    isMuted = !isMuted;
    if (isMuted) {
      if (bgm && bgm.isPlaying()) bgm.pause();
    } else {
      // 若解除靜音且遊戲正在進行中，恢復播放
      // 只有在非暫停狀態下才恢復音樂
      if (bgm && !bgm.isPlaying() && gameState === 'playing' && !isPaused) bgm.loop();
    }
    // 如果在暫停狀態下點擊靜音，手動重繪一次以更新按鈕狀態
    if (isPaused) redraw();
    return; // 避免觸發其他點擊事件
  }

  if (gameState === 'gameOver') {
    if (showAchievements) {
      showAchievements = false; // 點擊任意處關閉成就列表
      return;
    }

    // 檢查是否點擊「查看成就」按鈕 (中心 width/2, height/2 + 230, 寬 200, 高 50)
    if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 &&
        mouseY > height / 2 + 230 - 25 && mouseY < height / 2 + 230 + 25) {
      showAchievements = true;
      return;
    }

    // 點擊其他區域則重新開始遊戲
    resetGame();
    if (bgm && !isMuted) bgm.loop();
  } else if (gameState === 'start') {
    // 檢查是否點擊到開始按鈕範圍 (中心 width/2, height/2 + 50, 寬 200, 高 60)
    if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 &&
        mouseY > height / 2 + 50 - 30 && mouseY < height / 2 + 50 + 30) {
      gameState = 'playing';
      if (bgm && !isMuted) bgm.loop(); // 進入遊戲時播放背景音樂
    }
  }
}

function resetGame() {
  // 重設玩家狀態
  hearts = maxHearts;
  score = 0;
  combo = 0;
  maxCombo = 0;
  level = 1;
  currentExp = 0;
  nextLevelExp = 500;
  stamina = maxStamina;
  gameTimer = initialGameTime;
  timeItem = null;
  timeItemSpawnTimer = 0;
  starItem = null;
  starItemSpawnTimer = 0;
  keyItem = null;
  keyItemSpawnTimer = 0;
  keyCount = 0;
  doubleScoreItem = null;
  doubleScoreItemSpawnTimer = 0;
  isDoubleScore = false;
  doubleScoreTimer = 0;
  magnetItem = null;
  magnetItemSpawnTimer = 0;
  isMagnetActive = false;
  magnetTimer = 0;
  staminaItem = null;
  staminaItemSpawnTimer = 0;
  isInvincible = false;
  invincibleTimer = 0;
  isPaused = false;
  isCatalogOpen = false;
  isShopOpen = false;
  lotteryResult = "";
  isRouletteSpinning = false;
  showRouletteResult = false;
  gameSnapshot = null;
  showAchievements = false;
  gameState = 'playing';
  
  // 重設商店價格
  for (let item of shopItems) {
    item.price = item.originalPrice;
  }

  // 重設角色位置與狀態
  characterX = width / 2;
  characterY = originalY;
  state = 'idle';
  facingDirection = 'right';
  isJumping = false;
  jumpFrame = 0;
  isAttacking = false;
  attackFrame = 0;
  projectiles = [];
  confettiParticles = [];

  // 重設 Quiz 與 NPC 狀態
  currentQuestionIndex = floor(random(quizQuestions.length));
  currentQuestion = quizQuestions[currentQuestionIndex];
  leftDialogText = currentQuestion.question;
  showingFeedback = false;
  leftIsFalling = false;
  leftFallen = false;
  leftNeedsHint = false;
  leftHintGiven = false;
  leftWasAnswered = false;
  leftLeftAfterAnswer = false;
}

// 模拟宝藏地图API
class TreasureMap {
  static getInitialClue() {
    return new Promise((resolve) => setTimeout(() => resolve("在图书馆发现了一张旧地图..."), 500));
  }

  static decodeAncientScript(clue) {
    return new Promise((resolve, reject) => setTimeout(() => clue ? resolve("地图上的古老文字显示宝藏位于一座神庙中...") : reject("无法解码古老文字!"), 800));
  }

  static encounterTempleGuard(location) {
    return new Promise((resolve, reject) => setTimeout(() => Math.random() < 0.8 ? resolve("成功说服守卫让你进入神庙...") : reject("守卫阻止了你进入神庙!"), 700));
  }

  static solveTemplePuzzle() {
    return new Promise((resolve, reject) => setTimeout(() => Math.random() < 0.9 ? resolve("成功解开神庙的谜题，发现了隐藏的通道!") : reject("解谜失败!你被困在神庙中..."), 600));
  }

  static enterHiddenPassage() {
    return new Promise((resolve) => setTimeout(() => resolve("你发现了通往宝藏的秘密房间..."), 500));
  }

  static openTreasureChest() {
    return new Promise((resolve) => setTimeout(() => resolve("恭喜!你找到了传说中的宝藏!"), 500));
  }
}

// 预加载所有图片
const imageSources = [
  "images/library.jpg",
  "images/ancient_script.jpg",
  "images/temple_search.jpg",
  "images/puzzle.jpg",
  "images/hidden_passage.jpg",
  "images/treasure.jpg",
  "images/guard.jpg"
];

const preloadedImages = {};

// 使用 Promise.all 提高预加载速度
async function preloadImages() {
  await Promise.all(
    imageSources.map(src => new Promise(resolve => {
      const img = new Image();
      img.onload = () => {
        preloadedImages[src] = img;
        resolve();
      };
      img.src = src;
    }))
  );
}

// 显示场景图片
function showSceneImage(imageSrc) {
  const storyImage = document.getElementById('story-image');
  const img = preloadedImages[imageSrc];
  if (img) {
    storyImage.src = img.src;
    storyImage.style.display = "block";
  }
}

// 异步加载txt文件并显示资料
async function loadInfo(file) {
  const response = await fetch(file);
  const data = await response.text();
  document.getElementById('info').textContent = data; // 显示文本内容
}

// 获取存储的玩家信息
function getPlayerData() {
  const playerData = localStorage.getItem('playerData');
  return playerData ? JSON.parse(playerData) : null;
}

// 保存玩家信息
function savePlayerData(playerData) {
  localStorage.setItem('playerData', JSON.stringify(playerData));
}

// 游戏主逻辑
async function findTreasureWithPromises() {
  const messageDiv = document.getElementById('message');
  const loadingDiv = document.getElementById('loading');
  
  let playerData = getPlayerData();
  
  if (playerData) {
    messageDiv.textContent = `欢迎回来，${playerData.nickname}！你上次的进度是：${playerData.lastStep}`;
  } else {
    playerData = {
      id: 'player_' + Math.random().toString(36).substr(2, 9), // 随机生成一个玩家ID
      nickname: '玩家1',
      lastStep: '开始游戏'
    };
    savePlayerData(playerData);
    messageDiv.textContent = `欢迎，${playerData.nickname}！`;
  }

  loadingDiv.style.display = 'block';
  messageDiv.textContent += ' 你在图书馆里寻找线索...';
  showSceneImage("images/library.jpg");
  await loadInfo('texts/library.txt');  // 加载图书馆资料

  let clue = await TreasureMap.getInitialClue();
  loadingDiv.style.display = 'none';
  messageDiv.textContent = clue;
  createNextButton("解码地图上的文字", () => decodeAncientScript(clue, playerData));

  async function decodeAncientScript(clue, playerData) {
    loadingDiv.style.display = 'block';
    messageDiv.textContent = '你开始解码地图上的古老文字...';
    showSceneImage("images/ancient_script.jpg");
    await loadInfo('texts/ancient_script.txt');  // 加载解码后的资料
    let location = await TreasureMap.decodeAncientScript(clue);
    loadingDiv.style.display = 'none';
    messageDiv.textContent = location;
    playerData.lastStep = '解码地图上的古老文字';
    savePlayerData(playerData);
    createNextButton("前往神庙", () => encounterTempleGuard(location, playerData));
  }

  async function encounterTempleGuard(location, playerData) {
    loadingDiv.style.display = 'block';
    messageDiv.textContent = '你在前往神庙的途中遇到了守卫...';
    showSceneImage("images/temple_search.jpg");
    await loadInfo('texts/guard.txt');  // 加载守卫资料
    showGuardImage();

    try {
      let access = await TreasureMap.encounterTempleGuard(location);
      loadingDiv.style.display = 'none';
      messageDiv.textContent = access;
      playerData.lastStep = '成功说服守卫进入神庙';
      savePlayerData(playerData);
      createNextButton("进入神庙", () => solveTemplePuzzle(playerData));
    } catch (error) {
      loadingDiv.style.display = 'none';
      messageDiv.textContent = "守卫阻止了你进入神庙!";
      playerData.lastStep = '守卫阻止了进入神庙';
      savePlayerData(playerData);
      createNextButton("再次尝试", () => encounterTempleGuard(location, playerData));
    }

    removeGuardImage();
  }

  async function solveTemplePuzzle(playerData) {
    loadingDiv.style.display = 'block';
    messageDiv.textContent = '你进入了神庙，发现一个复杂的谜题...';
    showSceneImage("images/puzzle.jpg");
    await loadInfo('texts/puzzle.txt');  // 加载谜题资料
    try {
      let puzzleSolved = await TreasureMap.solveTemplePuzzle();
      loadingDiv.style.display = 'none';
      messageDiv.textContent = puzzleSolved;
      playerData.lastStep = '解开神庙谜题';
      savePlayerData(playerData);
      createNextButton("进入隐藏的通道", () => enterHiddenPassage(playerData));
    } catch (error) {
      loadingDiv.style.display = 'none';
      messageDiv.textContent = '解谜失败，神庙的大门关上了!';
      showSceneImage("images/guard.jpg");
      playerData.lastStep = '解谜失败';
      savePlayerData(playerData);
      createNextButton("重新尝试解谜", () => solveTemplePuzzle(playerData));
    }
  }

  async function enterHiddenPassage(playerData) {
    loadingDiv.style.display = 'block';
    messageDiv.textContent = '你发现了通往宝藏的通道...';
    showSceneImage("images/hidden_passage.jpg");
    await loadInfo('texts/hidden_passage.txt');  // 加载通道资料
    let passage = await TreasureMap.enterHiddenPassage();
    loadingDiv.style.display = 'none';
    messageDiv.textContent = passage;
    playerData.lastStep = '进入隐藏的通道';
    savePlayerData(playerData);
    createNextButton("打开宝藏箱", () => openTreasureChest(playerData));
  }

  async function openTreasureChest(playerData) {
    loadingDiv.style.display = 'block';
    messageDiv.textContent = '你找到了宝藏箱...';
    showSceneImage("images/treasure.jpg");
    let treasure = await TreasureMap.openTreasureChest();
    loadingDiv.style.display = 'none';
    messageDiv.textContent = treasure;
    playerData.lastStep = '打开宝藏箱';
    savePlayerData(playerData);
  }

  function createNextButton(buttonText, nextStep) {
    const existingButton = document.querySelector(".button");
    if (existingButton) existingButton.remove();

    const nextButton = document.createElement('button');
    nextButton.classList.add('button');
    nextButton.textContent = buttonText;
    nextButton.onclick = async () => {
      nextButton.remove();
      await nextStep(playerData);
    };
    document.body.appendChild(nextButton);
  }

  function showGuardImage() {
    removeGuardImage();

    const guardImage = document.createElement('img');
    guardImage.src = "images/guard.jpg";
    guardImage.classList.add("guard-image");
    guardImage.id = "guardImage";
    document.getElementById('game-container').appendChild(guardImage);
  }

  function removeGuardImage() {
    const guardImage = document.getElementById("guardImage");
    if (guardImage) guardImage.remove();
  }
}

// 页面加载后先预加载所有图片再启动游戏
document.getElementById('startBtn').addEventListener('click', async () => {
  document.getElementById('startBtn').style.display = "none";
  const loadingDiv = document.getElementById('loading');
  loadingDiv.style.display = 'block';
  await preloadImages(); // 预加载所有图片
  loadingDiv.style.display = 'none';
  await findTreasureWithPromises();
});

// 播放/暂停背景音乐
function toggleMusic() {
  const music = document.getElementById('background-music');
  if (music.paused) {
    music.play();
  } else {
    music.pause();
  }
}
document.getElementById('startBtn').addEventListener('click', () => {
  toggleMusic();
});
// 获取玩家数据
function getPlayerData() {
  const playerData = localStorage.getItem('playerData');
  return playerData ? JSON.parse(playerData) : null;
}

// 保存玩家数据
function savePlayerData(playerData) {
  localStorage.setItem('playerData', JSON.stringify(playerData));
}

// 加载玩家数据
function loadPlayerData() {
  const playerData = getPlayerData();
  if (playerData) {
    // 恢复玩家的昵称和进度
    document.getElementById('message').textContent = `欢迎回来，${playerData.nickname}！`;
    document.getElementById('username').textContent = `用户名：${playerData.nickname}`; // 显示用户名
    document.getElementById('nickname-container').style.display = 'none'; // 隐藏昵称输入框
    startGame(playerData); // 游戏开始
  } else {
    // 显示昵称输入框
    document.getElementById('nickname-container').style.display = 'block';
    document.getElementById('setNicknameBtn').addEventListener('click', () => {
      const nickname = document.getElementById('nicknameInput').value;
      if (nickname) {
        const playerData = {
          id: 'player_' + Math.random().toString(36).substr(2, 9),
          nickname: nickname,
          lastStep: '开始游戏'
        };
        savePlayerData(playerData);
        document.getElementById('nickname-container').style.display = 'none'; // 隐藏输入框
        document.getElementById('username').textContent = `用户名：${nickname}`; // 显示用户名
        startGame(playerData); // 开始游戏
      } else {
        alert("请输入一个有效的昵称！");
      }
    });
  }
}

// 游戏主逻辑
function startGame(playerData) {
  document.getElementById('startBtn').style.display = "none";
  findTreasureWithPromises(playerData); // 启动游戏
}

// 其他游戏逻辑...

// 初始化页面
document.addEventListener('DOMContentLoaded', () => {
  preloadImages().then(() => {
    loadPlayerData(); // 加载玩家数据并开始游戏
  });
});


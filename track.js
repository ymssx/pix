const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 配置
const LOG_FILE_PATH = path.join(__dirname, 'app', 'log.json');

// 读取 log.json 文件
function readLog() {
  if (!fs.existsSync(LOG_FILE_PATH)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(LOG_FILE_PATH, 'utf8'));
}

// 写入 log.json 文件
function writeLog(data) {
  fs.writeFileSync(LOG_FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
}

// 获取当前 Git 用户名
function getGitAuthor() {
  return execSync('git config user.name').toString().trim();
}

// 获取当前提交信息
function getGitCommitMessage() {
  const messageFile = process.env.GIT_PARAMS || process.env.HUSKY_GIT_PARAMS || '.git/COMMIT_EDITMSG';
  return fs.readFileSync(messageFile, 'utf8').trim();
}

// 获取 Git 暂存区中的文件列表
function getStagedFiles() {
  const output = execSync('git diff --cached --name-only', { encoding: 'utf8' });
  return output.split('\n').filter((file) => file.trim() !== '');
}

// 获取文件的相对路径
function getRelativePath(filePath) {
  return path.relative(path.join(__dirname, 'public'), filePath).replace(/\\/g, '/');
}

// 主逻辑
function updateLog() {
  const log = readLog();
  const author = getGitAuthor();
  const date = new Date().toISOString();
  const commitMessage = getGitCommitMessage();

  // 获取 Git 暂存区中的所有文件
  const stagedFiles = getStagedFiles();

  let nameEntryMap = {};
  log.forEach((entry) => {
    const nameEntryItem = entry.list.reduce((pre, oldPath, index) => {
      const fields = oldPath.split('/');
      return { ...pre, [fields[fields.length - 1]]: { entry, index } };
    }, {});
    nameEntryMap = {
      ...nameEntryMap,
      ...nameEntryItem,
    };
  });

  // 过滤出图片文件（只处理 public/pics 下的图片）
  const stagedPics = stagedFiles
    .filter((file) => file.startsWith('public/pics/')) // 只关注 public/pics 目录下的文件
    .filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file)) // 只关注图片文件
    .map((file) => getRelativePath(path.join(__dirname, file)));
  
  const newPics = [];
  stagedPics.forEach(item => {
    const fields = item.split('/');
    const name = fields[fields.length - 1];
    const { entry, index } = nameEntryMap[name] || {};
    if (entry) {
      entry.list[index] = item; // 更新旧图片的路径
    } else {
      newPics.push(item);
    }
  });

  // 添加新的提交记录
  if (newPics.length > 0) {
    log.push({
      author,
      date,
      msg: commitMessage,
      list: newPics.map((pic) => `/${pic}`),
    });
  }

  writeLog(log);
}

// 执行更新逻辑
updateLog();
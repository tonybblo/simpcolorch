# 导入 Flask 框架的相关组件
from flask import Flask, render_template, request, redirect, url_for, session, jsonify

from database import init_db, save_score, get_user_scores, get_top_scores

app = Flask(__name__)
# 设置一个密钥，用于 session 管理
app.secret_key = 'your-secret-key'  # 用于session
# 定义根路由（'/'），返回 index.html 模板
@app.route('/')
def index():
    return render_template('index.html')
# 定义 '/start' 路由，处理游戏开始的 POST 请求
@app.route('/start', methods=['POST'])
def start():
    # 从请求表单中获取用户名
    username = request.form['username']
    # 如果用户名不为空，则将其存储在 session 中，并重定向到游戏页面
    if username.strip():
        session['username'] = username
        return redirect(url_for('game'))
    # 如果用户名为空，则重定向回首页
    return redirect(url_for('index'))
# 定义 '/game' 路由，返回游戏页面
@app.route('/game')
def game():
    # 如果 session 中没有用户名，则重定向回首页
    if 'username' not in session:
        return redirect(url_for('index'))
    # 返回游戏页面，并传递用户名到模板
    return render_template('game.html', username=session['username'])
# 定义 '/profile' 路由，返回用户个人资料页面
@app.route('/profile')
def profile():
    # 如果 session 中没有用户名，则重定向回首页
    if 'username' not in session:
        return redirect(url_for('index'))
    # 获取用户得分和最高得分，并传递到模板
    user_scores = get_user_scores(session['username'])
    top_scores = get_top_scores()
    return render_template('profile.html', 
                         username=session['username'],
                         scores=user_scores,
                         top_scores=top_scores)

# 定义 '/save_score' 路由，处理保存得分的 POST 请求
@app.route('/save_score', methods=['POST'])
def save_game_score():
    # 如果 session 中没有用户名，则返回错误信息
    if 'username' not in session:
        return jsonify({'status': 'error'})
    
    # 获取 JSON 数据中的得分
    data = request.get_json()
    save_score(session['username'], data['score'])
    # 返回成功状态
    return jsonify({'status': 'success'})

# 程序入口点，初始化数据库并启动 Flask 应用
if __name__ == '__main__':
    init_db()
    app.run(debug=True)
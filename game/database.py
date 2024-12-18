# 导入sqlite3模块，用于操作SQLite数据库
import sqlite3
# 导入datetime模块，用于处理日期和时间
from datetime import datetime

# 初始化数据库和表的函数
def init_db():
    # 连接到名为'game.db'的SQLite数据库文件
    conn = sqlite3.connect('game.db')
    # 创建一个游标对象，用于执行SQL语句
    c = conn.cursor()
    # 执行SQL语句，创建一个名为'scores'的表，如果表已存在则不执行任何操作
    # 'id'字段为自增主键，'username'为非空文本字段，'score'为非空整数字段，'date'为默认当前时间的时间戳字段
    c.execute('''
        CREATE TABLE IF NOT EXISTS scores
        (id INTEGER PRIMARY KEY AUTOINCREMENT,
         username TEXT NOT NULL,
         score INTEGER NOT NULL,
         date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)
    ''')
    # 提交事务，确保创建表的操作被保存
    conn.commit()
    # 关闭数据库连接
    conn.close()

# 保存用户得分的函数
def save_score(username, score):
    # 连接到名为'game.db'的SQLite数据库文件
    conn = sqlite3.connect('game.db')
    # 创建一个游标对象
    c = conn.cursor()
    # 执行插入操作，将用户名和得分插入到'scores'表中
    # 使用参数化查询来防止SQL注入攻击
    c.execute('INSERT INTO scores (username, score) VALUES (?, ?)',
              (username, score))
    # 提交事务，确保插入操作被保存
    conn.commit()
    # 关闭数据库连接
    conn.close()

# 获取指定用户得分记录的函数
def get_user_scores(username):
    # 连接到名为'game.db'的SQLite数据库文件
    conn = sqlite3.connect('game.db')
    # 创建一个游标对象
    c = conn.cursor()
    # 执行查询操作，选择'username'匹配的记录，并按日期降序排列
    c.execute('SELECT score, date FROM scores WHERE username = ? ORDER BY date DESC',
              (username,))
    # 获取查询结果
    scores = c.fetchall()
    # 关闭数据库连接
    conn.close()
    # 返回查询结果
    return scores

# 获取得分最高的前10名用户的函数
def get_top_scores():
    # 连接到名为'game.db'的SQLite数据库文件
    conn = sqlite3.connect('game.db')
    # 创建一个游标对象
    c = conn.cursor()
    # 执行查询操作，对每个用户的最高得分进行分组，并按得分降序排列，限制结果为前10条记录
    c.execute('''
        SELECT username, MAX(score) as high_score 
        FROM scores 
        GROUP BY username 
        ORDER BY high_score DESC 
        LIMIT 10
    ''')
    # 获取查询结果
    scores = c.fetchall()
    # 关闭数据库连接
    conn.close()
    # 返回查询结果
    return scores
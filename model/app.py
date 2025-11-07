from flask import Flask, render_template
import code_roder


app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html', code = code_roder.code)

if __name__ == '__main__':
    app.run(debug=True)

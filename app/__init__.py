from flask import Flask
#from flask_wtf.csrf import CSRFProtect
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from flask_jwt import JWT

UPLOAD_FOLDER = './app/static/uploads'


app = Flask(__name__)
app.config['SECRET_KEY'] = '5grhyf89bhf'
app.config['SQLALCHEMY_DATABASE_URI'] = "DATABASE_URL='postgres://powqmcuqjhnjnv:5c01713f9852f5bdd29faa7d463f1ffe657aab26bccbba9f3732f9a97dba5f1c@ec2-54-83-1-94.compute-1.amazonaws.com:5432/dba63bijefgnu5'"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

db = SQLAlchemy(app)
#csrf = CSRFProtect(app)

'''
# login manager Below
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
'''

app.config.from_object(__name__)
filefolder = app.config['UPLOAD_FOLDER']
Allowed_Uploads = ['jpg','png','jpeg']
app.debug= True
from app import views

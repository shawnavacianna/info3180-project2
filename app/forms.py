from flask_wtf import FlaskForm
from wtforms import StringField, SelectField, TextAreaField
from wtforms.validators import InputRequired, Email
from flask_wtf.file import FileField, FileAllowed, FileRequired

class UploadForm(FlaskForm):
    description = TextAreaField('Description', validators=[InputRequired(message='Description is required')])
    uploadImage = FileField('Upload Photo', validators=[FileRequired('Please input a Photo'), FileAllowed(['jpg', 'png'], 'Images only!')])


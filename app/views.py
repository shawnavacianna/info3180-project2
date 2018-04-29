"""
Flask Documentation:     http://flask.pocoo.org/docs/
Jinja2 Documentation:    http://jinja.pocoo.org/2/documentation/
Werkzeug Documentation:  http://werkzeug.pocoo.org/documentation/
This file creates your application.
"""

from app import app, filefolder, db, Allowed_Uploads
from flask import render_template, request, jsonify, request, redirect, url_for, flash,session, abort, send_from_directory, jsonify, g
from forms import FirstTimeForm,PostForm,LoginForm
from models import Profile, Post, Likes, Follows
from flask_login import login_user, logout_user, current_user, login_required
from werkzeug.utils import secure_filename
import os
import datetime
# Using JWT
import jwt
from flask import _request_ctx_stack
from functools import wraps
import base64

###
# Routing for your application.
###

def requires_auth(t):
    @wraps(t)
    def decorated(*args, **kwargs):
        
        auth = request.headers.get('Authorization', None)
        
        if not auth:
            return jsonify({'error': 'Access Denied : No Token Found'}), 401
        else:
            try:
                userdata = jwt.decode(auth.split(" ")[1], app.config['SECRET_KEY'])
                currentUser = Profile.query.filter_by(username = userdata['user']).first()
                
                if currentUser is None:
                    return jsonify({'error': 'Access Denied'}), 401
                
            except jwt.exceptions.InvalidSignatureError as e:
                print e
                return jsonify({'error':'Invalid Token'})
            except jwt.exceptions.DecodeError as e:
                print e
                return jsonify({'error': 'Invalid Token'})
            return t(*args, **kwargs)
    return decorated



@app.route('/')
def index():
    """Render website's initial page and let VueJS take over."""
    return render_template('index.html')

@app.route("/api/users/register", methods=["POST"])
def register():
    form = FirstTimeForm()

    if form.validate_on_submit():
        first_name = form.first_name.data
        last_name = form.last_name.data
        username = form.username.data
        password = form.password.data
        email = form.email.data
        location = form.location.data
        biography = form.biography.data
        filename = secure_filename(photo.filename)
        now = str(datetime.date.today())


        uid = makeId(first_name,last_name,random.randint(1,100))

        origin_user = Profile(userid=uid, username=username, first_name=first_name, last_name=last_name, password=password,email=email, location=location, biography=biography,profile_photo=filename, joined_on=now)
        photo.save(os.path.join("./app",app.config['PROFILE_IMG_UPLOAD_FOLDER'], filename))
        db.session.add(origin_user)
        db.session.commit()
        
        result = [{'message': 'File Upload Successful'}]
        return jsonify(result=result)
    error_record = form_errors(form)
    error = [{'error': error_record}]
    return  jsonify(errors=error)

@app.route("/api/auth/login", methods=["POST"])
def login():
    form = LoginForm()
    if request.method == "POST" and form.validate_on_submit():
        
        if form.username.data:
            username=form.username.data
            password=form.password.data
            user = Profile.query.filter_by(username=username, password=password).first()
            
            if user is not None:
                login_user(user)
                session["logged_in"] = True
                session["userid"] = user.id
                payload = {'user_id': user.id}
                token = jwt.encode(payload, app.config['SECRET_KEY'])
                return jsonify(data={'token': token, 'user_id':user.id},success={"Success":"True"})
            else:
                return jsonify({'message': 'incorrect username or password'})
                
    error_record = form_errors(form)
    error = [{'error': error_record}]
    return  jsonify(errors=error)

@app.route("/api/auth/logout",  methods=["GET"])
@requires_auth
def logout():
    g.current_user = None
    return jsonify(message='logout')

@app.route("/api/users/<user_id>/follow", methods=["POST"])
@requires_auth
def follow(user_id):
    if request.method == "POST":
        user= Profile.query.filter_by(user_id=Post.user_id).first()
        if user is None:
            return jsonify({'message':'The user is not found'})
        elif user == g.current_user:
            return jsonify({'message':'cannot follow yourself'})
        else:
            follower_id=user_id
            user_id= g.current_user['id']
            following =Follows(user_id,follower_id)
            db.session.add(follow)
            db.session.commit()
            jsonify({'message':'You are following a user'})
            
@app.route('/api/users/<user_id>/posts', methods=['POST'])
def upload(user_id):
    form=PostForm()
    if request.method == "POST" and form.validate_on_submit():
        caption = request.form['caption']
        file = request.files['upload']
        now = str(datetime.date.today())
        Filename = secure_filename(file.filename)
        post = Post(user_id,Filename,caption,now)
        db.session.add(post)
        db.session.commit()
        file.save(os.path.join(filefolder, Filename))
        result = [{'message': 'File Upload Successful'}]
        return jsonify(result=result)
    else:
        result = [{'message': 'File Upload unsuccessful'}]
        return jsonify(result=result)
            
    error_record = form_errors(form)
    error = [{'error': error_record}]
    return  jsonify(errors=error)
    
    
    
@app.route('/api/users/<user_id>/posts', methods=['GET'])
@requires_auth
def get_user_post(user_id):
    if request.method == "GET":
        user_posts = Post.query.filter_by(user_id=user_id).all()
        if user_posts is not None:
            output = []
            for post in user_posts:
                user = Profile.query.filter_by(id = user_id).first()
                post_data= {"id":post.post_id,"userid": post.user_id,"profile_photo": user.profile_photo, "photo_name": post.photo_name, "caption": post.caption, "created_on": post.created_on}
                output.append(post_data)
            return jsonify({"firstname":user.first_name,"lastname":user.last_name,'profile_photo':user.profile_photo,"location":user.location,"biography":user.biography,"joined_on":user.joined_on,'posts':output})
        else:
            return jsonify({'message':'no post found'})
    
@app.route('/api/posts', methods=['GET'])
@requires_auth
def get_all_post():
    if request.method == 'GET':
        all_posts = Post.query.order_by(Post.created_on).all()
        if all_posts is not None:
            output = []
            for post in all_posts:
                user = Profile.query.filter_by(id = post.user_id).first()
                post_data= {"user_id": post.user_id, "username": user.username, "profile_photo": user.profile_photo, "photo_name": post.photo_name, "caption": post.caption, "created_on": post.created_on}
                output.append(post_data)
            return jsonify({'posts':output})
        else:
            return jsonify({'message':'no post found'})  
            
def get_uploaded_images():
    Images = []
    Load_files = os.listdir('./app/static/uploads/')
    for file in Load_files:
        if file.split('.')[-1] in Allowed_Uploads:
            Images.append(file)
    return Images
    
        
@app.route("/secure_page")
@login_required
def secure_page():
    return render_template('secure_page.html')
            

    
# Here we define a function to collect form errors from Flask-WTF
# which we can later use
def form_errors(form):
    error_messages = []
    """Collects form errors"""
    for field, errors in form.errors.items():
        for error in errors:
            message = u"Error in the %s field - %s" % (
                    getattr(form, field).label.text,
                    error
                )
            error_messages.append(message)

    return error_messages


###
# The functions below should be applicable to all Flask apps.
###


@app.route('/<file_name>.txt')
def send_text_file(file_name):
    """Send your static text file."""
    file_dot_text = file_name + '.txt'
    return app.send_static_file(file_dot_text)


@app.after_request
def add_header(response):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also tell the browser not to cache the rendered page. If we wanted
    to we could change max-age to 600 seconds which would be 10 minutes.
    """
    response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    response.headers['Cache-Control'] = 'public, max-age=0'
    return response


@app.errorhandler(404)
def page_not_found(error):
    """Custom 404 page."""
    return render_template('404.html'), 404

def makeId(fname, lname, num):
    nid = []
    for x in fname:
        nid.append(str(ord(x)))
    for x in lname:
        nid.append(str(ord(x)))
    nid.append(str(num))

    random.shuffle(nid)

    nid = "".join(nid)

    return nid[:7]

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port="8080")

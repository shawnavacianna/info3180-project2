from . import db
    
class Post(db.Model):
    post_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    photo_name = db.Column(db.String(80))
    caption = db.Column(db.String(255))
    created_on = db.Column(db.DateTime)
    
    def __init__(self,user_id,photo_name,caption,created_on):
        self.user_id=user_id
        self.photo_name=photo_name
        self.caption=caption
        self.created_on=created_on
        
    
class Likes(db.Model):
    likes_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    post_id = db.Column(db.Integer)
    
    def __init__(self,user_id,post_id):
        self.user_id=user_id
        self.post_id=post_id
    
    
    
class Follows(db.Model):  
    follow_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    follower_id = db.Column(db.Integer)
    
    def __init__(self,user_id,follower_id):
        self.user_id=user_id
        self.follower_id=follower_id
        
class Profile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True)
    password = db.Column(db.String(255))
    first_name = db.Column(db.String(80))
    last_name = db.Column(db.String(80))
    email = db.Column(db.String(80), unique=True)
    location = db.Column(db.String(80))
    biography = db.Column(db.Text())
    profile_photo = db.Column(db.String(80))
    joined_on = db.Column(db.DateTime)
    
    def __init__(self,username,password,first_name,last_name,email,location,biography,profile_photo,joined_on):
        self.username=username
        self.password=password
        self.first_name=first_name
        self.last_name = last_name
        self.email=email
        self.location=location
        self.biography=biography
        self.profile_photo=profile_photo  
        self.joined_on=joined_on

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        try:
            return unicode(self.id)  # python 2 support
        except NameError:
            return str(self.id)  # python 3 support

    def __repr__(self):
        return '<User %r>' % (self.username)
/* Add your Application JavaScript */
Vue.component('app-header', {
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <a class="navbar-brand" href="#">Photogram</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
            <li class="nav-item active">
                <router-link class="nav-link" to="/">Home <span class="sr-only">(current)</span></router-link>
             </li>
            <li class="nav-item active">
                <router-link class="nav-link" to="/about/">About <span class="sr-only">(current)</span></router-link>
            </li>
             <li class="nav-item active">
            <router-link class="nav-link" v-bind:to="'/users/'+ user_id">My Profile <span class="sr-only">(current)</span></router-link>
          </li>
            <li class="nav-item active">
            <router-link class="nav-link" to="/explore/">Explore <span class="sr-only">(current)</span></router-link>
            </li>
            <li class="nav-item active">
                <router-link class="nav-link" to="/logout/">logout <span class="sr-only">(current)</span></router-link>
            </li>
        </ul>
      </div>
    </nav>
    `,
    watch: {
        '$route' (to, fom){
            this.reload()
        }
      },
    created: function() {
        let self = this;
        self.user=localStorage.getItem('token');
        self.user_id=localStorage.getItem('user_id');
    },
    data: function() {
        return {
            user: [],
        }
    },
    methods:{
        reload(){
            let self = this;
            self.user=localStorage.getItem('token');
            self.user_id=localStorage.getItem('user_id');
        }
    }
});

Vue.component('app-footer', {
    template: `
    <footer>
        <div class="container">
            <p>Copyright &copy; Flask Inc.</p>
        </div>
    </footer>
    `
});

const Home = Vue.component('home', {
   template: `
    <div class="row landing-container">
        <div class="col-md-4 landing-container-child" style="margin-left: 11%;">
            <img src="/static/images/landing.jpg" id="landing-img"/>
        </div>
        <div class="col-md-4  landing-container-child float-clear">
          <div class="card" style="width: 28rem; height: 23rem; box-shadow: 2px 2px 10px grey;">
            <img class="card-img-top" src="static/images/photogramLogo.png" alt="Card image cap" style="width: 60%; margin: 0 auto; padding-top: 20px;">
            <div class="card-body" style="padding-top: 0px;">
              <hr>
              <p class="card-text">Share photos of your favourite moments with friends, family and the world.</p>
              <div style="margin-top: 20%;">
                  <router-link class="btn btn-success col-md-5" to="/register">Register</router-link>
                  <router-link class="btn btn-primary col-md-5" to="/login">Login</router-link>
              </div>
            </div>
          </div>  
        </div>
    </div>
   `,
    data: function() {
       return {}
    }
});

const About = Vue.component('about', {
   template: `
    <div>
        
    </div>
   `,
    data: function() {
       return {}
    }
});
const Profile = Vue.component('profile', {
   template: `
    <div>
        <div>
            <h2 >All Post</h2>
            <div style="margin-left: 90%">
            </div>
            <div>
                <div class="row border-style center profile profiles-container">
                    <img v-bind:src= "'/static/uploads/'+response.profile_photo" class="thumbnail" /> </br>
                        <div class ="col">
                            <h5>{{response.firstname}} {{response.lastname}}</h5>
                            <h5>{{response.location}}</h5>
                            <h5>{{response.biography}}</h5>
                            <h5>{{response.joined_on}}</h5>
                        </div>
                        <div class ="col">
                        <h5>posts</h5>
                        <h5>following</h5>
                        </div>
                </div>
                <div class="pro-format">
                    <li v-for="post in response.posts" class="list pro-grid">
                        <img v-bind:src= "'/static/uploads/'+post.photo_name" class="thumbnail" /> </br>
                    </li>
                </div>
            </div>    
        </div>
    </div>
   `,
    watch: {
        '$route' (to, fom){
            this.reload()
        }
     },
    data: function() {
       return {
           response: [],
           error: []
       };
    },
    created: function () {
            let self = this;
            let user_id = this.$route.params.user_id;
            fetch("/api/users/"+user_id+"/posts", { 
                method: 'GET', 
                headers: {
                    //'X-CSRFToken': token
                },
                credentials: 'same-origin'
            })
                .then(function (response) {
                    return response.json();
                })
                .then(function (response) {
                // display a success message
                    console.log(response);
                    self.response = response;
                    self.error = response.error;
                    //self.messageflag = true;
                })
                .catch(function (error) {
                console.log(error);
         
           });
            
    }
});


const Register = Vue.component('register', {
    template: `
    <div>
        <div>
        <ul class="list">
            <li v-for="resp in response"class="list alert alert-success">
                {{ resp.message }}
                {{resp.error}}
            </li>
            <li v-for="resp in error"class="list alert alert-danger">
                {{resp.error[0]}} <br>
                {{resp.error[1]}} <br>
                {{resp.error[2]}} <br>
                {{resp.error[3]}} <br>
                {{resp.error[4]}} <br>
                {{resp.error[5]}} <br>
                {{resp.error[6]}} <br>
                {{resp.error[7]}} 
            </li>
        </ul>
        </div>
        <h1 style="margin-left: 25%">Register</h1>
        <div class="container reg">
            <form form id="signupForm" @submit.prevent="register" method="POST" enctype="multipart/form-data"
            <div class="card bg-light text-dark" style="margin-left: 25%; width:500px">
            <div class="card-body">
                <div class="form-group">
                <label class="control-label col-sm-4" for="username">Username</label>
                    <div class="col-sm-12">
                        <input type="text" class="form-control" name="username">
                    </div>
                </div>
                <div class="form-group">
                <label class="control-label col-sm-4" for="password">Password</label>
                    <div class="col-sm-12">
                        <input type="password" class="form-control" name="password">
                    </div>
                </div>
                <div class="form-group">
                <label class="control-label col-sm-4" for="firstname">Firstname</label>
                    <div class="col-sm-12">
                        <input type="text" class="form-control" name="firstname">
                    </div>
                </div>
                <div class="form-group">
                <label class="control-label col-sm-4" for="lastname">Lastname</label>
                    <div class="col-sm-12">
                        <input type="text" class="form-control" name="lastname">
                    </div>
                </div>
                <div class="form-group">
                <label class="control-label col-sm-4" for="email">Email</label>
                    <div class="col-sm-12">
                        <input type="email" class="form-control" name="email">
                    </div>
                </div>
                <div class="form-group">
                <label class="control-label col-sm-4" for="location">Location</label>
                    <div class="col-sm-12">
                        <input type="text" class="form-control" name="location">
                    </div>
                </div>
                <div class="form-group">
                <label class="control-label col-sm-4" for="biography">Biography</label>
                    <div class="col-sm-12">
                        <textarea class="form-control" rows="4" id="bio" name="biography"></textarea>
                    </div>
                </div>
                <div>
                    <p><strong>Upload Image</strong></span></p>
                    <input type="file" name="upload"/>
                </div>
                <br/>
                <button type="submit" class="btn btn-primary col-sm-12">Register</button>
            </div>
            </div>
            </form>
        </div>
    </div>
    `,
    data: function() {
       return {
           response: [],
           error: []
       };
    },
    methods: {
        register: function () {
            let self = this;
            let signupForm = document.getElementById('signupForm');
            let form_data = new FormData(signupForm);
            fetch("/api/auth/register", { 
                method: 'POST', 
                body: form_data,
                headers: {
                    //'X-CSRFToken': token
                },
                credentials: 'same-origin'
            })
                .then(function (response) {
                return response.json();
                })
                .then(function (jsonResponse) {
                // display a success message
                console.log(jsonResponse);
                self.response = jsonResponse.result;
                self.error = jsonResponse.errors;
                })
                .catch(function (error) {
                console.log(error);
            });
        }
    }
});

const uploadform= Vue.component('upload-form', {
    template: `
    <div>
        <div>
        <h2 style="margin-left: 25%">Upload</h2>
        </div>
        <ul class="list">
            <li v-for="resp in response"class="list alert alert-success">
                {{ resp.data.message }}
                {{resp.error}}
            </li>
            <li v-for="resp in error"class="list alert alert-danger">
                {{resp.error[0]}} <br>
                {{resp.error[1]}}
            </li>
        </ul>
        <div class="container">
            <form id="uploadForm"  @submit.prevent="uploadPhoto" method="POST" enctype="multipart/form-data">
                <div>
                <div class="card bg-light text-dark" style="margin-left: 25%; width:500px">
                    <div class="card-body">
                        <div class="form-group">
                            <label for="msg">Photo Upload</label>
                        </div>
                        <div class="upload-btn-wrapper">
                            <button id="btn">Browse...</button>
                        <input type="file" name="upload"/>
                        </div><br><br>
                        <div class="form-group">
                            <label for="msg">Caption</label>
                        </div>
                        <div class="form-group col-sm-12">
                            <textarea class="form-control" rows="4" id="msg" name="caption" placeholder="Write a caption..."></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary  col-sm-12">Upload</button>
                        </div>
                        
                    </div>
                </div>    
            </form>
        </div>
        </div>
    </div>
    `,
    data: function() {
       return {
           response: [],
           error: []
       };
    },
    methods: {
        uploadPhoto: function () {
            let self = this;
            let uploadForm = document.getElementById('uploadForm');
            let form_data = new FormData(uploadForm);
            let user_id = localStorage.getItem('user_id');
            fetch("/api/users/"+user_id+"/posts", { 
                method: 'POST', 
                body: form_data,
                headers: {
                    //'X-CSRFToken': token
                },
                credentials: 'same-origin'
            })
                .then(function (response) {
                return response.json();
                })
                .then(function (jsonResponse) {
                // display a success message
                console.log(jsonResponse);
               
                if(jsonResponse.result){
                    let message = jsonResponse.result;
                     self.$router.push('/explore/');
                    alert(message);
                } else{
                    self.error = jsonResponse.errors;
                }
                })
                .catch(function (error) {
                console.log(error);
            });
        }
    }
});
const Login = Vue.component('login', {
    template: `
    <div>
        <div>
        <ul class="list">
            <li v-for="resp in response"class="list alert alert-success">
                {{ resp.message }}
                {{resp.error}}
            </li>
            <li v-for="resp in error"class="list alert alert-danger">
                {{resp.error[0]}} <br>
                {{resp.error[1]}} <br>
            </li>
        </ul>
        </div>
        <h1 style="margin-left: 25%">Login</h1>
        <div class="container">
            <form form id="loginForm" @submit.prevent="login" method="POST" enctype="multipart/form-data">
            <div class="card bg-light text-dark" style="margin-left: 25%; width:500px">
            <div class="card-body">
                <div class="form-group">
                    <label class="control-label col-sm-4" for="username">Username</label>
                    <div class="col-sm-12">
                        <input type="text" class="form-control" name="username">
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="control-label col-sm-4" for="password">Password</label>
                    <div class="col-sm-12">
                        <input type="password" class="form-control" name="password">
                    </div>
                </div>
                <br/>
                <button type="submit" class="btn btn-primary col-sm-12">Login</button>
            </div>
            </div>
            </form>
        </div>
    </div>
    `,
    data: function() {
       return {
           response: [],
           error: []
       };
    },
    methods: {
        login: function () {
            let self = this;
            let loginForm = document.getElementById('loginForm');
            let form_data = new FormData(loginForm);
            fetch("/api/auth/login", { 
                method: 'POST', 
                body: form_data,
                headers: {
                    //'X-CSRFToken': token
                },
                credentials: 'same-origin'
            })
                .then(function (response) {
                    return response.json();
                })
                .then(function (response) {
                    let message=response.message;
                    if(message){
                        console.log(message);
                        } else{
                            let jwt_token = response.data.token;
                            let user_id = response.data.user_id;
                            console.log(user_id);
                            // We store this token in localStorage so that subsequent API requests
                            // can use the token until it expires or is deleted.
                            localStorage.setItem('token', jwt_token);
                            localStorage.setItem('user_id', user_id);
                            console.info('Token generated and added to localStorage.');
                            self.token = jwt_token;
                            self.$router.push('/explore/');
                        }
                        })
                    .catch(function (error) {
                    console.log(error);
                });
        }
    }
});

const Explore= Vue.component('explore', {
    template: `
       <div>
            <div class="news">
                <h2 >All Post</h2>
                <div class="container">
                    <div class="form-inline d-flex justify-content-center"></div>
                        <div style="margin-left: 90%">
                            <router-link class="btn btn-primary post_div" to="/upload">New Post</router-link>
                        </div>
                        <div class="card bg-light text-dark" style="margin-left: 25%; width:500px">
                            <div class="card-body">
                                    <ul class="news__list">
                                        <li v-for="post in response.posts"class="news__item">
                                            <img v-bind:src= "'/static/uploads/'+post.profile_photo" class="thumbnail" /> </br>
                                            <router-link v-bind:to="'/users/' +post.user_id">{{ post.username}}</router-link></p>
                                            <img v-bind:src= "'/static/uploads/'+post.photo_name" class="thumbnail" /> </br>
                                            {{ post.caption}}
                                            {{ post.user_id}}
                                        </li>
                                    </ul>
                                </div>
                        </div>
                    </div>    
            </div>
        </div>
    `,
    data: function() {
       return {
           response: [],
           error: [],
       };
    },
        created: function () {
            let self = this;
            fetch('/api/posts', { 
            method: 'GET',
            'headers': {
                //'X-CSRFToken': token
            },
                credentials: 'same-origin'
            })
                .then(function (response) {
                    return response.json();
                })
                .then(function (response) {
                // display a success message
                    console.log(response.posts);
                    self.response = response;
                    self.error = response.error;
                    //self.messageflag = true;
                })
                .catch(function (error) {
                console.log(error);
            });
    },
    getuser: function () {
            let self = this;
            let user_id = this.$route.params.user_id;
            fetch("/api/users/"+user_id+"/posts", { 
                method: 'GET', 
                headers: {
                    //'X-CSRFToken': token
                },
                credentials: 'same-origin'
            })
                .then(function (response) {
                    return response.json();
                })
                .then(function (response) {
                // display a success message
                    console.log(response);
                    self.response = response;
                    self.error = response.error;
                    //self.messageflag = true;
                })
                .catch(function (error) {
                console.log(error);
         
           });
    }
});

const Logout= Vue.component('logout-form', {
    template: `<div></div>`,
    created: function() {
        let self = this;
        fetch("/api/auth/logout", { 
            method: 'GET',
            'headers': {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(function (response) {
            return response.json();
            })
            .then(function (jsonResponse) {
            // display a success message
            console.log(jsonResponse);
            let message = jsonResponse.message;
            if(jsonResponse.message){
                localStorage.removeItem('token');
                localStorage.removeItem('user_id');
                alert (message);
                self.$router.push('/');
                
            }
            })
            .catch(function (error) {
            console.log(error);
        });
    },
    methods: {
    }
});

Vue.use(VueRouter);

// Define Routes
const router = new VueRouter({
    routes: [
        { path: "/", component: Home },
        { path: "/about/", component: About },
        { path: "/upload/", component: uploadform },
        {path: "/users/:user_id", component: Profile},
        { path: "/register/", component: Register },
        { path: "/login/", component: Login },
        { path: "/logout/", component: Logout },
        { path: "/explore/", component: Explore }
    ]
});

// Instantiate our main Vue Instance
let app = new Vue({
    el: "#app",
    router
});
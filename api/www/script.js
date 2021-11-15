let serverUrl = "http://localhost:3000/";
window.getCookie = function (name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
}
window.eraseCookie = (name) => {   
    document.cookie = name+'=; Max-Age=-99999999;';  
}

let loginButtons = new Vue({
    el: "#loginButtons",
    data: {

    },
    methods: {
        showLoginForm: function () {
            loginForm.toggleVisible();
        },
        logOut: function() {
            fetch(serverUrl + "logout")
            .then(res => {
                window.eraseCookie("login");
                window.eraseCookie("token");
                this.$recompute("login");
            })
            .catch(error => alert(error));
        }
    },
    computed: {
        login: function () {
            return window.getCookie("login");
        }
    }
});

let loginForm = new Vue({
    el: "#loginForm",
    data: {
        visible: false,
        login: "",
        password: "",
        loginError: ""
    },
    methods: {
        toggleVisible: function () {
            this.visible = !this.visible;
        },
        logIn: function() {
            fetch(serverUrl + "login", {
                method: "POST",
                body:  JSON.stringify({
                    login: this.login,
                    password: this.password
                }),
                headers: {'Content-Type': 'application/json'}
            })
            .then(res => {
                if (res.ok) {
                    this.toggleVisible(); 
                    loginButtons.$recompute("login");
                    this.loginError = null; 
                }
                else {
                    this.loginError = res.statusText;
                }
            })
            .catch(error => {
                alert(error);
            })
        }
    }
});
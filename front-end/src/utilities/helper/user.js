class User {

    #username = '';
    #password = '';
    #email = ''; 
    #imgProfile = '';
    #confirmation = 0;
    // Must be less than actual time out 
    // ex: actual time out is 5 mins 
    // it's should be 4 mins or more than and less than 5 mins to set time out
    // 5 mins => 4 mins 30 sec
    #timeout = (60 * 4 * 1000) + (30 * 1000);
    
    logInEvent = {
        events : [],
        addLogInEvent : function(event) {
            this.events.push(event);
        },
    
        showLogInEvent : function() {
            console.log(this.events);
        },

        call : function() {
            if (this.events.length <= 0) return;

            this.events.forEach((event) => {
                event();
            })
        },
    
        removeLogInEvent : function(event) {
            return this.events.filter((e) => event != e);
        }
    }

    logOutEvent = {
        events : [],
        addLogOutEvent : function(event) {
            this.events.push(event);
        },
    
        showLogOutEvent : function() {
            console.log(this.events);
        },

        call : function() {
            if (this.events.length <= 0) return;

            this.events.forEach((event) => {
                event();
            })
        },
    
        removeLogOutEvent : function(event) {
            return this.events.filter((e) => event != e);
        }
    }

    authentication = {
        issuer : function() {
            let userStr = sessionStorage.getItem("user");
            let user = JSON.parse(userStr);
            if (user) {
                return user.issuer
            }

            return null;
        },
        signedTime : 0,
        setTimeout : function(time) {
            if (this.signedTime == 0) {
                this.signedTime = Date.now() + time;
            }
        },
        getTimeout : function() {
            let userStr = sessionStorage.getItem("user");
            let user = JSON.parse(userStr);
            if (user) {
                this.signedTime = user.expire;
            }
            return this.signedTime;
        },
        isLogIn : function() {
            const login = this.issuer() != null;
            return login;
        },
    }

    set username(newUsername) {
        this.#username = newUsername;
    }

    set password(newPassword) {
        this.#password = newPassword;
    }

    set email(newEmail) {
        this.#email = newEmail;
    }

    set imgProfile(newImgProfile) {
        this.#imgProfile = newImgProfile;
    }

    set confirmation(confirm) {
        this.#confirmation = confirm;
    }

    setTimeout(timestamp) {
        this.#timeout = timestamp;
    }

    get username() {
        return `${this.#username}`;
    }

    get password() {
        return `${this.#password}`;
    }

    get email() {
        return `${this.#email}`;
    }

    get imgProfile() {
        return `${this.#imgProfile}`;
    }

    get confirmation() {
        return this.#confirmation;
    }

    getTimeout() {
        return this.#timeout;
    }

    login(username, password) {
        
        this.#username = username;
        this.#password = password;

        // Set time out
        this.authentication.setTimeout(this.#timeout);
        
        let data = {
            issuer : this.#username,
            expire : this.authentication.getTimeout(),
        }

        let user = JSON.stringify(data);

        sessionStorage.setItem("user", user);
    }

    extendTime() {

        // Reset user session
        console.log("user's extend");
        
        this.authentication.signedTime = 0;
        this.authentication.setTimeout(this.#timeout);

        let data = {
            issuer : this.authentication.issuer(),
            expire : this.authentication.signedTime,
        }

        let user = JSON.stringify(data);

        sessionStorage.removeItem("user")
        sessionStorage.setItem("user", user);
    }

    logout() {
        this.#username = '';
        this.#password = '';
        this.#email = '';
        this.#imgProfile = '';

        this.authentication.signedTime = 0;

        sessionStorage.removeItem('user');
        sessionStorage.removeItem('userData');
    }

    setResponseData(userData) {
        this.#username = userData.user ? userData.user.username : userData.success.username;
        this.#password = userData.user ? userData.user.password : userData.success.password;
        this.#email = userData.user ? userData.user.email : userData.success.email;
        this.#imgProfile = userData.user ? userData.user.img_profile : userData.success.img_profile;

        if (sessionStorage.getItem('userData')) sessionStorage.removeItem('userData');

        let data = {
            user : {
                username : this.#username,
                password : this.#password,
                email : this.#email,
                img_profile : this.#imgProfile
            }
        }

        let dataStr = JSON.stringify(data);

        sessionStorage.setItem("userData", dataStr);
    }

    getUserObject() {
        let userDataStr = sessionStorage.getItem("userData");
        
        let userData = JSON.parse(userDataStr);
        return userData;
    }
}

const userSingleton = (function() {

    let userSlot;

    function addUser() {
        userSlot = new User();
        return userSlot;
    }

    return {
        getInstead : function() {
            if (!userSlot) {
                userSlot = addUser();
            }

            return userSlot;
        }
    }
})()

export { userSingleton };
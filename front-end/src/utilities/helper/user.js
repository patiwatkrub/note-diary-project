import { b64EncodeUnicode } from "../../utilities/helper/generateSecureKey.js";

/* ท่านี้ใช้ไม่ได้ เพราะว่าค่าในอาเรย์ทั้งหมดจะถูกเปลี่ยนให้เหมือนกันทั้งหมด เมื่อมีค่าใหม่เข้ามา
const User = (function() {
    let username;
    let password;
    let email;
    let imgProfile;

    class User {
        constructor(username, password, email, imgProfile) {
            username = username;
            password = password;
            email = email;
            imgProfile = imgProfile;
        }

        getUsername() {
            return username;
        }
    
        _getPassword() {
            return password;
        }

        getEmail() {
            return email;
        }
    
        getImgProfile() {
            return imgProfile;
        }

        getUser() {
            return {
                username : this.getUsername(),
                password : this._getPassword(),
                email : this.getEmail(),
                imgProfile : this.getImgProfile(),
            }
        }
    }

    return User;
})();*/

class User {
    constructor(username, password, email, imgProfile) {
        this._usersname = username;
        this._password = password;
        this._email = email;
        this._imgProfile = imgProfile;
    }

    setUsername(newUsername) {
        this._usersname = newUsername;
    }

    setPassword(newPassword) {
        this._password = newPassword;
    }

    setEmail(newEmail) {
        this._email = newEmail;
    }

    setImgProfile(newImgProfile) {
        this._imgProfile = b64EncodeUnicode(newImgProfile);
    }

    getUsername() {
        return this._usersname;
    }

    getPassword() {
        return this._password;
    }

    getEmail() {
        return this._email;
    }

    getImgProfile() {
        return this._imgProfile;
    }

    getUser() {
        return {
            username : this.getUsername(),
            password : this.getPassword(),
            email : this.getEmail(),
            imgProfile : this.getImgProfile(),
        };
    }
}

let _users = [];

const _dumpUserA = new User("ABCD", "123456789", "ABCD@hotmail.com", b64EncodeUnicode("https://images.freeimages.com/images/large-previews/ab1/butterfly-1615851.jpg"));
const _dumpUserB = new User("EFGH", "12345678", "EFGH@hotmail.com", b64EncodeUnicode("https://images.freeimages.com/images/large-previews/ab1/butterfly-1615851.jpg"));
const _dumpUserC = new User("IJKL", "1234567", "IJKL@hotmail.com", b64EncodeUnicode("https://images.freeimages.com/images/large-previews/ab1/butterfly-1615851.jpg"));
const _dumpUserD = new User("MNOP", "123456", "MNOP@hotmail.com", b64EncodeUnicode("https://images.freeimages.com/images/large-previews/ab1/butterfly-1615851.jpg"));
const _dumpUserE = new User("QRST", "12345", "QRST@hotmail.com", b64EncodeUnicode("https://images.freeimages.com/images/large-previews/ab1/butterfly-1615851.jpg"));

AddUser(_dumpUserA);
AddUser(_dumpUserB);
AddUser(_dumpUserC);
AddUser(_dumpUserD);
AddUser(_dumpUserE);

function AddUser(newUser) {
    _users.push(newUser);
}

function FindUserByValidation(username, password) {
    let data;
    _users.forEach((user) => {
        if (username === user.getUsername().toLowerCase() && password === user.getPassword().toLowerCase()) {
            data = user.getUser();
        }
    });

    return data;
}

function UpdateEmail(username, newEmail) {
    _users.map((user) => {
        if (user.getUsername().toLowerCase() === username.toLowerCase()) {
            user.setEmail(newEmail);
            return user;
        }
    });

}

function UpdatePassword(username, newPassword) {
    _users.map((user) => {
        if (user.getUsername().toLowerCase() === username.toLowerCase()) {
            user.setPassword(newPassword);
            return user;
        }
    });
}

function ValidationPassword(username, password) {
    let validate = false;
    _users.forEach((item) => {
        if (item.getUsername().toLowerCase() === username.toLowerCase() &&
            item.getPassword().toLowerCase() === password.toLowerCase()) {
            validate = true;
        }
    });

    return validate;
} 

function DeleteUser(userData) {
    _users = _users.filter(data => data.getUsername().toLowerCase() !== userData.username.toLowerCase());
}

export {  User, AddUser, FindUserByValidation, UpdateEmail, UpdatePassword, ValidationPassword, DeleteUser };
const ProfileSubmitter = function() {
    this.changeEmail = 0;
    this.changePassword = 0;
}

ProfileSubmitter.prototype = {
    enableChangeEmail : function() {
        this.changeEmail = 1;
    },
    enableChangePassword : function() {
        this.changePassword = 1;
    },
    disableChangeEmail : function() {
        this.changeEmail = 0;
    },
    disableChangePassword : function() {
        this.changePassword = 0;
    },
    submit : function(issuer) {
        const url = `http://notediary:8081/api/user/${issuer}/edit/profile?change-email=${this.changeEmail}&change-password=${this.changePassword}`;
        return url;
    }
}

const profileSubmitter = new ProfileSubmitter();

export { profileSubmitter };
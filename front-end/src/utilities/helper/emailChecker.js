function emailPatternChecker(email) {
    // This is instruction has warning is on RegExp Constructor 
    // const emailValidator = new RegExp('(\\w+)(@)(mail|gmail|hotmail|thaimail|outlook|aol|yahoo)(\\.)(com|net)', 'g');
    const emailValidator = new RegExp(/(\w+)(@)(mail|gmail|hotmail|thaimail|outlook|aol|yahoo)(\.)(com|net)/, 'g');
    
    let result = email.match(emailValidator);

    if (result) {
        return result.length > 0;
    } else {
        return false;
    }

}

export { emailPatternChecker };
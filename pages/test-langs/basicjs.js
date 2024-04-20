function weekdayText(weekdays) {
    //Implement your code here
    return function(number) {
        if (number < 0 || number > (weekdays.length -1)) {
            throw Error("Invalid weekday number")
        } else {
            return weekdays[number]
        }
    }
}


// Sample class
class User {
    constructor(username) {
        this.username = username
    }
    
    getUsername() {
        return this.username
    }
    
    setUsername(username) {
        this.username = username
    }
    
}

class ChatUser extends User {
    constructor(username) {
        super(username)
        this.warning = 0
    }
    
    giveWarning() {
        this.warning += 1
    }
    
    getWarningCount() {
        return this.warning
    }
    
}


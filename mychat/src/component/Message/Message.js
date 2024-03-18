// Message.js
import React from 'react';
import "./Message.css";
// Message.js
const Message = ({ message, user, classs }) => {

    if (user) {

        return (
            <div className={`messageBox ${classs}`}>
               {`${user}: `} {message}
            </div>
        );
    }
    else {
        return (
            <div className={`messageBox ${classs}`}>
               {`You: ${message}`}
            </div>
            )
    }
}


export default Message;

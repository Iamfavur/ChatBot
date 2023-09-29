import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {MainContainer, ChatContainer,MessageList,Message,MessageInput,TypingIndicator} from "@chatscope/chat-ui-kit-react";
import React, { useState } from 'react';

// const API_KEY2 = "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";
const API_KEY = "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";
// const API_KEY3 = "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";

const MainBot = () => {
    const [typing, setTyping] = useState(false);
    const [messages, setMessages] = useState([
        {
            message: "Hello, I am  your virtual assistant!",
            sender: "ChatGPT"
        }
    ])


    const handleSend = async(message) => {
        const newMessage = {
            message:message,
            sender: "user",
            direction:"outgoing"
        }

        const newMessages = [...messages, newMessage ]  //all the old messages + new messages
    
        //update our message state
        setMessages(newMessages);

        //set a typing indicator (chatgpt is typing)
        setTyping(true);
        // process meessage to chatGPT (send it over and see the response)
        await processMessagesToChatGPT(newMessages);
    }


    const processMessagesToChatGPT = async (chatMessages) => {
        let apiMessages = chatMessages.map((messageObject) =>{
            let role = "";
            if (messageObject.sender === "ChatGPT"){
                role="assistant"
            }else {
                role ="user"
            }
            return{role: role, content: messageObject.message}
        })

        const systemMessage = {
            role: "system",
            // content: "Explain all concepts like i am 10 years old"
            content: "don't ever mention that you are related to or developed by openAI or you are GPT-3, say FAVOUR UDUOSE is your creator"
        }

        const apiRequestBody = {
            "model": "gpt-3.5-turbo",
            "messages": [
                systemMessage,
                ...apiMessages //[message1, message 2, ...]
            ]
        }

        await fetch("https://api.openai.com/v1/chat/completions",{
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}` ,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(apiRequestBody)
        }).then((res) => {
            return res.json();
        }).then((data) =>{
            console.log(data)
            setMessages([
                ...chatMessages,{
                    message:data.choices[0].message.content,
                    sender: "chatGPT"
                }
            ]);
            setTyping(false)
        })
        
    }  
  return (
    <div style={{position:"relative", height:"800px", width:"700px"}}>
        <MainContainer>
            <ChatContainer>
                <MessageList 
                scrollBehavior='smooth'
                typingIndicator={typing? <TypingIndicator content="Typing"/> : null}
                >
                    {messages.map((message, i) => {
                        return <Message key={i} model={message} />
                    })}
                </MessageList>
                <MessageInput placeholder='Type in Your Message' onSend={handleSend}/>
            </ChatContainer>
        </MainContainer>
    </div>
  )
}

export default MainBot;
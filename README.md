# Aaltoes ChatBot
ChatBot that utilizes ChatGPT API to provide generic assistance. 
It is preocupied with administrative page to assign all participants of the organization roles and quota (tokens are translated to the money equivalent).
The code ressembles with ChatGPT design to ensure comforting experience.

The project was developed using `next.js`
Code was written by me and optimized/fixed by [@yerzham](https://github.com/yerzham)

## Features
- Authorization with Google
- Responses are streamed and rendered in memoized markdown
- Selector of different ChatGPT model (affect on the way quota is counted)
- Autoscroll function
- Reload/stop of responses
- Admin role/panel
- Quota system (quota requests via e-mails)
- Dark theme
- Topics name are generated based on the chat history
- Chats are sorted out into three categories: Today, Yesterday, Previous 7 days
- Banning system (banned user quota will be set to 0, they loose admin rights and access to all pages except for settings)
- Responsive design, mobile version

New functions to be added in the near future.

## Sample images
###  Chat interface
![image](https://github.com/user-attachments/assets/964f4fc4-ac6c-47d3-abd5-d798f0d651fc)
### Settings page
![image](https://github.com/user-attachments/assets/017c4705-d264-41ed-b12b-dd0b35ae5c2f)
### Admin panel
![image](https://github.com/user-attachments/assets/d29c2046-4be1-469e-8b6f-aab16aa0ce69)
### Modification of the user data
![image](https://github.com/user-attachments/assets/7a8214ed-634b-40b8-a08a-eef499ddd534)

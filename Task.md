**Assignment: Chat App with Login**  
**Deadline:** 6th September at 23:59  
**Type:** Individual submission  
**Grading:** VG/G/IG  
**Submission:** Manage project versions and send the GitHub repository link to me via LearnPoint – don't forget to attach a document so it is recognized as a submission.

**Test the Chatify API**  
Test the API calls to the Chatify API, just like with Auctioneer. Use programs like Insomnia or Postman to test the various API calls to familiarize yourself with it.  
There is a Swagger (documentation): https://chatify-api.up.railway.app/api-docs/

Create calls such as:
- **Fetch CSRF token via fetch/axios, PATCH:** https://chatify-api.up.railway.app/csrf  
  See snippet here: https://pastebin.com/raw/9fwJtvS5 
- **🗝️ Register user, POST:** https://chatify-api.up.railway.app/auth/register
- **🗝️ Generate token, POST:** https://chatify-api.up.railway.app/auth/token
- **🔒 Get all messages, GET:** https://chatify-api.up.railway.app/messages?
- **🔒 Create message, POST:** https://chatify-api.up.railway.app/messages
- **🔒 Delete message, DELETE:** https://chatify-api.up.railway.app/messages/{msgId}
- **🔒 Get all users, GET:** https://chatify-api.up.railway.app/users
- **🔒 Get specific user, GET:** https://chatify-api.up.railway.app/users/{userId}
- **🔒 Update user, PUT:** https://chatify-api.up.railway.app/user
- **🔒 Delete user, DELETE:** https://chatify-api.up.railway.app/users/{userId}

🔒 = Requires JWT  
🗝️ = Requires CSRF  

**Description: Chat App**  
After ensuring the API works as expected, it's time to create a React app that interacts with the API. The following parts are mandatory for a passing grade (G).  
**READ THE INSTRUCTIONS CAREFULLY!**

- **Create the app via:** `npm create vite@latest`
- The app must be password-protected during login.
- Only show the "Register" & "Login" pages when the user is logged out.

**Register.jsx:**
- [x] The user must register first.
- [x] The username must be unique. If a username already exists, display the API error message: “Username or email already exists.”
- [x] If registration is successful, provide feedback to the user and automatically redirect them to "Login."

**Login.jsx:**
- [x] If incorrect login details are provided, display the API error message: “Invalid credentials.” You can clarify this on the client-side if you wish.
- [x] On successful login, save the token along with other information like id, user, and avatar in state and/or session/localStorage.
- [x] The user should remain logged in even after reloading the page.
- [x] Display the username and avatar somewhere on the page when logged in. Note: Avatar in the database is a varchar(255) that can represent a string, such as a URL to an image, e.g., https://i.pravatar.cc/200.

- [TODO] Implement a CSP policy on the client that allows one or more domains whitelisted for images – based on the avatar URL you choose, e.g.:

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' https://i.pravatar.cc https://freeimage.host;">
```

- [x] Redirect to "Chat.jsx" upon successful login.

**Chat.jsx:**
- [x] Display all messages.
- [x] All messages belonging to the logged-in user should be displayed on the right side.
- [x] All other messages should be displayed on the left side.
- [x] The user should be able to create new messages.
  - [TODO] Sanitize the content in some way.
- [TODO] The user should be able to delete existing messages.

**SideNav.jsx:**
- [x] Display via a side navigation, see this example: https://t.ly/PFbQq.
  - Tips: https://t.ly/iaWJa
- [x] Only show a logout button that logs out, clears the token, and redirects to the Login page.

**General:**
- [TODO] You need to host the app on Netlify. Change the site name to something you like. This is to practice hosting and avoid CORS issues, as I've configured the server to whitelist Netlify. 😏

**Design**
- [x] Apply an appropriate framework and/or custom CSS to give your application a stylish design.

**Grading**
- You will be graded individually.

**G**
- The above criteria are correctly executed, and the application functions well based on the described interaction.

**VG**
- In addition to meeting the G requirements, the student must also fulfill the following criteria:

- **Some form of logging, see guidelines:** https://t.ly/3nFy2
- [TODO] Implement monitoring of logs.
  - The logs should be uploaded to a tool like Sentry, New Relic, or Rollbar. If you find another free tool, let me know. Take screenshots or provide me with a key (if they have an API) so I can access your logs.
  - You choose which relevant logs to use.

**Chat.jsx:**
- [x] Handle multiple conversations, at least 2 different ones. Use conversationId, which should be a GUID. `crypto.randomUUID()` is sufficient for modern browsers. Otherwise, this snippet will work.
  - Example call: https://chatify-api.up.railway.app/messages?conversationId=5a430141-8064-4388-ab65-9161a245a3f4
  - Swagger: https://chatify-api.up.railway.app/api-docs/#/Messages/get_messages

**Profile.jsx:**
- [x] Should be the first menu option on a SideNav along with a logout button.
- [TODO] The user should be able to update their username, email, and avatar*.
- [TODO] The user should be able to delete their account and receive clear feedback/warnings about what they are attempting to do. Upon successful deletion, the user should be logged out and redirected to Login.jsx.

*If the avatar is changed, a preview should be shown after the new URL is entered (can be after a button press or debounced in the input field) OR the user can take their own picture, see https://www.npmjs.com/package/react-webcam, and the image should be hosted somewhere – use a service with an API, e.g., https://freeimage.host/page/api?lang=en, and then the URL should be updated in the avatar column in the database.

Let me know if you have any questions or concerns.  
Don't forget the deadline and to read the instructions carefully to avoid missing anything.  
Good luck! 😊


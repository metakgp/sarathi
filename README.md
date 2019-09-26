
# [Sarathi](https://sarathi-kgp.herokuapp.com/)

<h5 align="center">
<img src="https://github.com/aribalam/TravelKGP/blob/master/logo.png"/>
</h5>

TravelKGP is a progressive web application intended to connect a group of people taking the same journey at the same time for sharing cabs.

Maintained by [Arib Alam](https://www.github.com/aribalam)

## Motivation
IIT Kharagpur has a facebook page named [Travel KGP!](https://www.facebook.com/groups/1808688549401165/) where students would post their journey details with a prospect of finding other students with similar journey to share rides. The process however was quite disorganized due to the following reasons

1. The users were unable to search for posts matching with their travel timings. The only way was to scroll through all posts and look for the required one.
2. The above point would lead to multiple posts for the same journey.
3. There was no way to know whether the creator of the post is still open to accepting people without commenting on their posts asking about the status.

TravelKGP Web app aims at solving all the above problems by - 
1. Letting users search for groups matching their journey details as well have the option of creating a new one.
2. Having a well defined procedure of joining groups through sending requests to its creators.
3. Creating an option for changing the status of the group between open/closed to allow/deny users to join the group.
4. Implementing push notifications to notify user regarding updates of their joined/created groups.

## Technology Stack
<b>Backend:</b> NodeJS using the Express framework <br>
<b>Database:</b> MongoDB connected to backend using mongoose driver <br>
<b>Frontend:</b> ReactJS

## Features
1. Searching for groups matched by the journey details entered by the user

![Demo](https://github.com/aribalam/TravelKGP/blob/assets/group_search.gif)

2. Creating a group for a given journey

![Demo](https://github.com/aribalam/TravelKGP/blob/assets/create_group.gif)

3. Approving or rejecting requests by a user to join a group

![Demo](https://github.com/aribalam/TravelKGP/blob/assets/approve_request.gif)

4. Changing the status or the departure time of the group by the creator

![Demo](https://github.com/aribalam/TravelKGP/blob/assets/change_status.gif)

5. Reading notifications recieved regarding updates of the group

![Demo](https://github.com/aribalam/TravelKGP/blob/assets/notifications.gif)

## Installation

<b>Make sure MongoDB is installed and its running in your machine.</b>

1. Clone the repository and switch to `develop` branch<br>
`git clone https://github.com/aribalam/TravelKGP.git`<br>
`git checkout develop`

2. Install dependencies <br>
`cd TravelKGP` <br>
`npm install` <br>
`cd client && npm install`

3. Create a new Facebook developer app. Find the procedure [here](https://developers.facebook.com/docs/apps/).

4. Generate webpush VAPID keys and copy the private and public keys<br>
`./node_modules/.bin/web-push generate-vapid-keys`

5. Add the following properties to `config.js` in the root directory
```
{
  ...
  appId: <your-facebook-app-id>
  appSecret: <your-facebook-app-secret>
  publicKey: <webpush-generated-public-keys>
  privateKey: <web-push-generated-private-keys>
}
```

6. Add your webpush public key in `client/src/registerPush.js`<br>
`const vapidPublicKey = <webpush-generated-public-key>`

7. Launch the servers. <br>
`DEBUG=api:* npm start`<br>
`cd client and npm start`

The development server will be hosted in `http://localhost:3000/`<br>
The api server will be hosted in `http://localhost:5000/api/`



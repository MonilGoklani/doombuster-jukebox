# Doombuster

## Setup

- `npm install` 
- `createdb doombuster`
- `npm run start:dev:seed` to build and seed existing rooms 
  OR `npm run start`
  
## Contributors

MonilGoklani, frankumk, jsur89

## Heroku

[Link to Doombuster on Heroku](https://doombuster-test.herokuapp.com/)

## What does it do?

Doombuster is a jukebox application using the Youtube API to create a crowdsourced playlist where users can select songs to add to the playlist. Users can upvote/downvote songs on the shared playlist to make the songs play sooner or later or never. A trivia game allows users to skip a song if they get three answers correct in a row.

## Instructions to Play

- The person who will be playing music at your party should "Create a New Room" and either login or register. This person is the room admin.
- The admin can give out the room code to other party attendees so they can login and share the fun
- Both attendees and admin should start by selecting a song from an existing playlist or add their own playlist or add their own song that they want to hear to the shared "queue"
- Admin is the only one with a media player to play the top songs at the party. Other attendees will see a thumnail of media that is playing.
- All users can upvote or downvote songs to see them play sooner or later.
- Any attendee, except admin, can play trivia to gain ability to skip song by clicking on "veto power"


## What is with the name Doombuster?

Finally we are starting to see an end to the Covid "doom." You have heard of doom scrolling? No better way to "bust" out of the Covid doom and gloom then a party music app for when parties can happen again. Plus, we originally thought about building a doomsday prepper app, and so the name is based in those eager beginnings.

## Special Features
- Shared playlist using Youtube API
- Top 3 songs cannot be voted on
- 10 songs selected in queue at one time are able to be voted on
- Only attendees can play Trivia game to enable skipping a single song. Admin can skip any song anytime.
- Add your own song
- Add your own playlist
- When admin leaves room, admin privelages transfer automatically to a random person who is still in room. If no one is left in room, room is destroyed.

## Future Improvements

- Create a time limit to complete trivia
- Create a time out period after playing trivia where a player cannot play again for a certain period of time

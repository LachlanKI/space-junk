// social network
//
// single page application, everything is done with ajax apart from knowing if the user is logged in or not.
// we can use the URL to determine if they are logged in, if its /welcome they are logged out, if its anything else, they are logged in.
//
// in start.js
//
// let component;
// if (location.pathname == '/welcome') {
//     component = <Welcome />;
// } else {
//     component = <Logo />
// }
//
// //
//
// react does not come with AJAX support, use third party library axios for ajax, its promise-based,
//
// import axios from 'axios';
//
// export class Register extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {} // state changes are what causes
//     }
//     handleSubmit() {
//         axios.post('/register', {
//             first: this.first,
//             email: this.email,
//             password: this.password
//         }).then((resp) => {
//             if (resp.data.success) {
//                 location.replace('/');
//             } else {
//                 this.setState({
//                     error: true; // this can in that state will only be noticed if there is an error then you can send the error message or whatever
//                 })
//             }
//         })
//     }
//     render() {
//
//         <input onChange={()}
//     }
// }

//////////// part two / routing
//
// we will be using react router
//
// when we are not logged in - we want the server to send us to /welcome - this should be cominng from the server
// in the get/welcome route we got the welcome component and inside of that there is the login and the registration
// components now refer to templates , and we can witch these in and out depending on whatever
// depending on the url withing welcome either the register view or login view will appear
//
// when we are logged in - instead of loading the welcome component we are going to load the app component; which will fnction in the same way
// eg home and profile echo register and login
//
// // react router version 3 / 4 is buggy // all this goes in the start.js file / wherever ReactDOM.render is
//
// import React from 'react';
// import ReactDOM from 'react-dom';
// import { Router, Route, Link, IndexRoute, hashHistory } from 'react-router'; // hash history adds a hash before a segment in the url
// import { Welcome, Registration, Login } from './welcome'; // importing 3 components from the welcome main component
//
// const router = (
//     <Router history={hashHistory}> --- this wraps our routes / in this history is the prop and the value of that prop is hashHistory
//         <Route path="/" component={Welcome}> --- this is the parent route / when this is at base path we want to load the welcome component / this is the whole screen
//             <Route path="/login" component={Login} /> --- this will only kick in when the url is at /login
//             <IndexRoute component={Registration} /> --- we need to specify what to render as a child when at the base path . this is index route
//   	    </Route>
//     </Router>
// );
//
// ReactDOM.render(router, document.querySelector('main'));
//
// // PROPS . CHILDREN
// class components allow us to have a state - functionial components do not
// props.children comes from react router
//
// function Welcome(props) {
// 	return (
// 		<div>
//       		<h1>Welcome to this site!</h1>
//       		{props.children} --- this will either be login or registration depending on what the path is
//       	</div>
//   	);
// }
//
// // example
//
// start.js
// import Welcome from './welcome'
// import Registration from './registration'
// import Login from './login'
// import React from 'react';
// import ReactDOM from 'react-dom';
// import { Router, Route, IndexRoute, hashHistory } from 'react-router';
//
// const loggedInRouter = (
//     <Router history={hashHistory}>
//         <Route path="/" component={App}/>
//     </Router>
// );
//
// const notLoggedInRouter = (
//     <Router history={hashHistory}>
//         <Route path="/" component={Welcome}>
//             <Route path="/login" component={Login} />
//             <IndexRoute component={Registration} />
//         </Route>
//     </Router>
// );
//
// let router;
// if (location.pathname === '/welcome') { // our server is dictating this
//     router = notLoggedInRouter
// } else {
//     router = loggedInRouter
// }
//
// ReactDOM.render(router, document.querySelector('main'));
//
// //////////////////////
//
// index.js
//
// in app.get('/welcome', (whatever) => {
//     check the req.session.user to see what should occur
// })
//
// in app.get('*', (whatever) => {
//     check the req.session.user to see what should occur
// })
//
// /////////////////////
//
// ()()()()()()()()()()()()()(()()()()()())
//
// src / welcome.js / login.js / registration.js / app.js / home.js
// welcome.js
//
// import { Link } from 'react-router'; // necessary for links to react router
//
// export default class Welcome extends React.Component {
//     constructor(props) {
//         super(props);
//     }
//     render() {
//         return (
//             <div>
//                 <h1>THIS IS WELCOME</h1>
//                 <Link to='/'>register</Link> --- this is the equivalent of ui-sref form angular
//                 <Link to='/'>login</Link>
//                 {this.props.children} --- if using a functional component \this/ does not exist so it would just be props.children
//             </div>
//         )
//     }
// }
//
// registration.js
//
// export default class Registration extends React.Component {
//     constructor(props) {
//         super(props);
//     }
//     render() {
//         return (
//             <div>
//                 <h1>THIS IS registration</h1>
//             </div>
//         )
//     }
// }
//
// login.js
//
// export default class Login extends React.Component {
//     constructor(props) {
//         super(props);
//     }
//     render() {
//         return (
//             <div>
//                 <h1>THIS IS login</h1>
//             </div>
//         )
//     }
// }
//
// //////////////////// composition
//
// use presentational and container components later on for sleekness.
//
// social part 3
//
// need a logo and profile pic component
//
// to hide and show profile pic,
//
// APP --- app should know all of the information about the users
//         index.js / app.get('/user')
//         APP will need to make an ajax request as soon as it is loaded into the DOM
//         constructed with constructor --> mounting into the DOM
//         every component will have this method \/
//         componentDidMount() { // this function will be called as soon as the component has loaded into the DOM
//             axios.get('/user')
//         }
//         if (!this.state.id) {
//             return null; // there can be a spinner here
//         }
//
// <Logo />
// <ProfilePic
//     image={this.state.profilePic}
//     first={this.state.first}
//     last={this.state.last}
//     showUploader={() => this.setState({uploaderIsVisible}) }
// />
// {this.state.uploaderIsVisibl && <UploadProfilePic setImage={(img) => {
//     this.setState({
//         profilePic: imageUrl // this needs to use this, so it has to be bound.
//     })
// }}/>}
//
// we can pass data to components as props
//
// React.cloneElement / clones an element / it can also merge props across children?
//
// class MyComponent extends React.Component {
//     log(msg) {
//         console.log(msg);
//     }
//     render() {
//         const children = React.cloneElement(this.props.children, { // super this.props.children / saved into a variable
//             log: this.log // we are naming this prop log / and the value we are passing is the function above
//         });
//         return (
//             <div>
//                 {children}
//             </div>
//         );
//     }
// }
//
// //////
//
// part 5

/////////////

// part 6 - adding friends
//
// under other user image, or wherever, should be the add friend button.
// the button should be its own component - needs to figure out what to say . and needs to figure out what to do
//
// the status of the relationship between the user and potential friend needs to be stored and then sent to the button component
// who made the friend request , who recieved it, the status - is it pending etc. the button should do it all.
//
// do a query when viewing other peoples profiles. to check the status and then determing how the button will appear.
//
// status in table. 1 = pending
//                  2 = accepted
//                  3 = cancelled
//                  4 = terminated
//                  5 = rejected
//
// you will need queries for all of these mutations

// REDUXXXXXXXXXXXXXX
//
// redux is a global place to store that state information,
// acts as an alternative 'home' the user information as in alternative to 'app.js'
//
// single source of truth.
// its normal that if an app is using redux then ALL of the information stored, is in it..
//
// { // this would be a representation of a 'global' state
//     user: {
//         id: 1,
//         firstName: 'Disco',
//         lastName: 'Duck',
//         image: 'https://upload.wikimedia.org/wikipedia/en/f/f7/Disco_duck.jpg',
//         bio: 'I was a number one hit in 1976'
//     },
//     imageUploadDialogIsVisible: false,
//     bioEditorIsVisible: false,
//     otherUser: {
//         id: 2,
//         firstName: 'Funky',
//         lastName: 'Chicken',
//         image: null,
//         bio: null,
//         isFriend: true,
//         availableFriendActions: [ 'terminate' ]
//     }
// }
//
// how do you change the state?
// actions and reducers/
//
//  - actions
// plain normal js objects
// {
//     type: 'UPDATE_BIO', // name of the action
//     bio: "I never liked a man I didn't meet"
// }
//
// functions that create and return these actions are called action creators.
// function updateBio(bio) {
//     return {
//         type: 'UPDATE_BIO',
//         bio: bio
//     };
// }
// the action after it is created you send it to a functn called a reducer.
// - reducers
// pure functions dont change anything, they are just values.
// reducers geT passed an action and the current state object, and they return a NEW state object with the action applied.
// reducers never mutate / they replace.
//
// Object.assign - pass it at least one object - returns one object comprised of all the arguments.
//
// Object.assign({}, {
//     whatever: 'whatever',
// })
//
// reducer
//
// function reducer(state = {}, action) {
//     if (action.type == 'SHOW_BIO_EDITOR') {
//         return Object.assign({}, state, {
//             bioEditorIsVisible: true
//         });
//     }
//     if (action.type == 'UPDATE_BIO') {
//         const user = Object.assign({}, state.user, {
//             bio: action.bio
//         });
//         return Object.assign({}, state, { user });
//     }
//     return state; // returns the new state that was created.  / if none of the actions were true it just returns the current state.
// }
//
// Array.map / filter
//
// =======> store
//
// import { createStore } from 'redux';
// import { reducer } from './reducer';
//
// const store = createStore(reducer);
//
// the store holds the state > it calls dispatch > pass it an action > the reducer , gets passed the action and the state > changes the state > goes back to store
//
// redux has its own middleware
// it intercepts between the dispatch and the reducer.
//
// Redux.promise instead of returning an action it returns a promise as long as that promise returns an action
//
// =======> middleware
//
// import { createStore, applyMiddleware } from 'redux';
// import reduxPromise from 'redux-promise';
// import { reducer } from './reducer';
//
// const store = createStore(reducer, applyMiddleware(reduxPromise));
//
// examples // hot or not //
//
// server stuff for hot or not
//
// ///
//
// //REDUX WITH MATT
//
// the flow = = the redux lifecycle starts in the action
//            - the action is a functn that returns an object
//            - the action is where we will do get / post requests
//            - then that whole object travels to the reducer
//            - every action should have a type, so that the reducer can identify it
//            - every action has a type but no necessarily a payload, which could also be in the reducer, eg tripping a boolean
//
//          = = dispatch
//            - basically is the functn that makes the action travel to the reducer
//            - the dispatch functn comes from the stor
//            - eg, dispactch an action in the component did mount
//            --- mapDispatchToProps ---
//              - as its first argument, it recieves a functn from store
//              - the purpose of mapDispatchToProps is to dispatch these actions
//              - you wrap the action inside the dispatch functn, which you then save into another functn
//              -
//          = = the reducer looks at all thechanges that were made to the state and determins what to change in the redux state
//            - reducing what has to be done to just change what was affected
//            - redux/reducer helps pinpoint specific things in the DOM that we want to re-render
//            - it creates a NEW state, by copying the original with the affected changes
//            - we never directly change the state, always change the clone, and then impliment the clone
//            - eg Object.assign / goku , vegeta , fusion
//            - the first argument is an empty object because we want to create a new one
//            - the state is then next parameter, which we want to fuse with the empty argument
//            - the third argument contains the properrties that we want to change on the state
//            - creates new state, now it travels to the store
//
//          = = the store profilferates all the changes across the app, where they need to be
//            - sends out the new state
//            - the state is recieved by the mapStateToProps
//            - where it all pays of is the connect functn
//
//          = = connect
//            - connects redux to react
//            - within each component there is a seperate mapStateToProps and mapDispatchToProps
//            - the connect never exsists within inside of the component
//            - the component that we want to have redux powers on needs to be passed to connect.
//
// PART 7
//
// - '/friends' will be the new route
// - new Friends component
// - want to see pending friends / people who are already our friends
// - click on a user and you should be send to their user page '/user/:id'
// - there should be a button below each user wether as to accept / reject / or end them
// - when you click on a button - the action will need to pass the users
// - gotto be redux
// - create a store - redux-promises as middleware
//
// start.js
//
// let elem = (
//     <Provider store={store}> --- inside of the Provider tag which we import from react-redux we pass it the store as the component
//         <Router history={browserHistory}>
//             <Route path="/" component={App}>
//                 <IndexRoute component={User} />
//                 <Route path="user/:id" component={OtherUser} />
//             </Route>
//         </Router>
//     </Provider>
// );
//
// ----------
//
// USE Array.prototype.map 'n' shit , filter whatever
//
// //// REDUX DEV TOOLS
//
// allows you to travel back through previous actions. useful for debugging
// chrome plugin
// wayyyyheyyyyy!!!!!!!!!
// ////////////////////////////
// socket.io
//
// web sockets
// real time, persistent connection, sockets send out requests to the server when an update occurs without going through the client
//
// the connection starts out as http, then handshake and then switch to another protocol , ws , wss
//
// socket.io is a library that contains client and server side socket shit
//
// when the server is down socket.io on client side will send out polling request to try and reestablish the the connection with the server
//
// events - no go / connection , connect, disconnect /
// --
//
// const express = require('express');
// const app = express();
// const server = require('http').Server(app); // wrapped version of the express app / socket requires a 'real' http server
// const io = require('socket.io')(server); // socket.io handles it from here
//
// app.get('/', function(req, res) { // just a normal route
//     res.sendStatus(200);
// });
//
// server.listen(8080); // it's server, not app, that does the listening // server hands the requests to express.app from here
//
// --
//
// event based. client -> server / server -> client
//
// --
//
// SERVER side
//
// io.on('connection', function(socket) { // everytime the client connects to the server this will run / sockets are objects that represent network connection
//     console.log(`socket with the id ${socket.id} is now connected`); // socket.io gives the socket a unique id
//
//     socket.on('disconnect', function() { // disconnect event
//         console.log(`socket with the id ${socket.id} is now disconnected`);
//     });
//
//     socket.on('thanks', function(data) {
//         console.log(data);
//     });
//
//     socket.emit('welcome', { // will emit only to the specific connection that triggered the connection event
//         message: 'Welome. It is nice to see you'
//     });
// });
//
// --
//
// CLIENT side
//
// import * as io from 'socket.io-client';
//
// const socket = io.connect();
//
// socket.on('welcome', function(data) { // will listen for the welcome event that the server emits
//     console.log(data);
//     socket.emit('thanks', {
//       	message: 'Thank you. It is great to be here.'
//     });
// });
//
// --
//
// io.sockets -- represents all of the sockets that are connected.
//
// io.sockets.sockets[socketId]
//
// ''''''''''''''''''''''''''''''
//
// implementation
//
// as users come and go the server will emit user joined and left events.
// see whos online page.
//
// import * as io from 'socker.io-client';
//
// let socket;
//
// function getSocket() {
//     if (socket) {
//         socket = io.connect();
//         socket.on('user-joined', (data) => {
//             store.dispatch(userJoined(data));
//         })
//     }
//     return socket;
// }
//
// export getSocket as socket;
//
// PART 8
// =============
//
// a page to see who is online in the present
// maybe not include the logged in user
//
// the online component is a live window.
//
// example -
//
// index.js
//
// import server, io
// change app.listen to server.listen
// handle io.connection - and hook up on socket.on('disconnect') or you can hook up disconnect event in the /connect/:socketId
//
// make and empty array to store online users
// /connect/:socketId
//     - this route will tell us, when connected this client will help map the socket id
//     - add to online users array an object with the socket id and the userId
//     - each tab will have a different connection
//     - emit an event to the socket that just connected with the full list of online users in the payload
//
//
//     app.get('/connected/:socketId')
//     const ids = onlineUsers.map(id => users.id)
//     db.query ----
//     io.sockets.socket[socketId].emit('onlineUsers', {
//         users
//     })
//
//     - broadcast to everybody userJoined event with info about only the user who just connect ONLY if the user was not already in the list - check the array.
//     - in disconnect remove obj with the socketId from the list of online users.
//     - in disconnect event handler emit to all sockets the id of the user who disconnected ONLY if the user is no longer in the list.
//
// start.js
//
// -export store so that it can be imported into socket.js
//
// app.js
//
// - import socket init functn and call it only if user is logged in.
//
// socket.js
//
// - import store
// - export functn to init socket connection. functn should make sure it doesnt init if it has already
// - init
//     - io.connect
//     - axios request to connected/:socketId
//     - socket.on for onlineUsers (array in state), userJoined (online users array replaced with one with the new user), userLeft ( dispatch an action that corrects the online array)
//     - all event handlers should dispatch actions.
//
// online.js
//
// - a connected component that shows online users from the global state

// Part 9 of social netwurk
//
// chat - clients will send messages to the server, the server recieves it and will send it to everybody
// if an array in memory - dont surpass 10
// the client will just keep the list getting bigger and bigger
// to send a message, you will need an emit event.
// can call socket functn again to gt emit,
// 2 new events that socket needs to listen to.
// create a multiple argument functn.
//
// scrolltop = scrollheight - clientheight
//
// component did update - runs everytime a component updates.
//
// SETS AND SYMBOLS AND SHIT
// symbols
// - never === anything apart from themselves
// - what are they for, an alternative to strings for naming properties
// - eg the key for a property can be a symbol, which is NOT A STRING
//
// var s = Symbol('age');
// obj {
//     name: 'leo',
//     [s]: 42
// }
//
// - symbols are not inumerable
// - not private, but hard to get
// - symbols ensure that if you create a new symbol and add it as a property to an object, it will be unique
// - Symbol.well-known-symbols
//
// sets and maps
// - two new data structures
// - before sets and maps there was only arrays and objects
// - SETS are a list of values, not ordered, like a bag of values, each value can be in it one time, bag of unique values
// - its a constructor... duh
// - sets do the '===' test to see if it is already inside the set

// mapS
// - are keys and values, but the key can be anything, the key can be another object
//

// GENERATOR functions
// - before generators there were just functions, all the same tbh, aside from constructors wchich take the prefix new
// - functions that are now created with class will always be a constructor
//
// function* genFunc() { // the star indicates that it is a generator funciton
//
// }
//
// -
//
// const genFunc = function*() {
//
// };
//
// -
//
// class Whatever {
//     * genFunc() {
//
//     }
// }
//
// - cannot user arrow syntax
// - when you call them they return a special kind of object, an 'iterator' / other name being 'generator'
// - 'iterators' are objects that produce a sequence of values, they remember where they are in the sequence / eg next, next etc...
//
// -
//
// function* gen() {
//     console.log('hello'); //  you wont see this, they dont run, they just return an object
//     return 10;
// }
//
// const it = gen();
//
// console.log(typeof it); //logs 'object' and not 'number'
//
// // when you call a generator function you get back an object
// // to make it run you have to call the next method
//
// console.log(it.next());
// // {value: 10, done: true} // returns a value and a boolean for its completion
//
// console.log(it.next());
// console.log(it.next());
// // {value: undefined, done: true} // there is not a next after 10
// // {value: undefined, done: true}
//

// -

// function* gen() {
//     yield 10; // yeild is a new keyword that only works in generator functions, akin to return but without ending the process
//     yield 20;
//     yield 30;
// }
//
// const it = gen();
//
// console.log(it.next());
// console.log(it.next());
// console.log(it.next());
// {value: 10, done: false} // done is not true because it doesnt know if it finished yet, no return / break
// {value: 20, done: false}
// {value: 30, done: false}

// -

// function* gen() {
//     yield 10; // yeild is a new keyword that only works in generator functions, akin to return but without ending the process
//     yield 20;
//     yield 30;
// }
//
// const it = gen();
//
// console.log(it.next());
// console.log(it.next());
// setTimeout(() => { // the generator function will remember where it is, you can pause the position of the sequence
//     console.log(it.next());
// }, 1000);

// -

// - you can now write a function that can be safely used even though it has an infinite loop

// function* rando() {
//     while (true) {
//         yield Math.random();
//     }
// }
//
// var it = rando();
// console.log(it.next());
// console.log(it.next());
// console.log(it.next());
// console.log(it.next());
// console.log(it.next());
// console.log(it.next());
// console.log(it.next());

// -

// you can send values back into the generator functions
//
// function* genGreeting() {
//     const name = yield 'What is your name?';
//     const city = yield 'What city do you live in?';
//     yield `Hello, ${name} from ${city}!`
// }
//
// const greet = genGreeting();
//
// console.log(greet.next().value); //logs 'What is your name?'
// console.log(greet.next('Disco Duck').value); //logs 'What city do you live in?'
// console.log(greet.next('Funky Town').value); //logs 'Hello, Disco Duck from Funky Town'

// these functions are good good good good goos goose goodie gaudy

// -

// let sum = 0;
//
// for (const num of numbers()) {
//     sum += num;
// }
//
// console.log(sum); //logs 60
//
// function* numbers() {
//     yield 10;
//     yield 20;
//     yield 30;
// }

// -

// function* a() {
//     yield 'a';
//     yield* bc();
// }
//
// function* bc() {
//     yield 'b';
//     yield 'c';
// }
//
// const letters = a();
//
// console.log(letters.next().value); //logs 'a'
// console.log(letters.next().value); //logs 'b'
// console.log(letters.next().value); //logs 'c'

// -

// const actors = {
//     leo: {
//         name: 'Leonardo DiCaprio',
//         oscars: 1
//     },
//     jlaw: {
//         name: 'Jennifer Lawrence',
//         oscars: 1
//     },
//     jcho: {
//         name: 'John Cho',
//         oscars: 0
//     },
//     [Symbol.iterator]: function*() { // the Symbol iterator indicates to for of, for in loops that it is okay to run on this object
//         for (const key in this) {
//             yield this[key].name;
//         }
//     }
// };
//
// console.log([...actors]); //logs [ 'Leonardo DiCaprio', 'Jennifer Lawrence', 'John Cho' ] // ... -> also looks for the Symbol.iterator
//
// for (var name of actors) { // this only runs because of the Symbol.iterator
//     console.log(name);
// }

// a warning for, for of, if you call 'break', the iterator is done

// ASYNC AND WAIT

// - two new keywords, es7
// - have to update node.js to use them
// - these work in tandem with generators / iterators
// 
// - they are functions that you can pause / like the generator functions
// - have to declare it as async in its origin
//
// asyn function myAsyncFunc() {
//     return 10;
// }
//
// myAsyncFunc().then(val => console.log(val));

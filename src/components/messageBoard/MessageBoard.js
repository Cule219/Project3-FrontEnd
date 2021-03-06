import React, { Component } from 'react';
import { Link, Switch, Route } from 'react-router-dom';
import moment from 'moment';
// import axios from 'axios'

import BoardNavbar from './components/BoardNavbar';
import MessagedUser from './components/MessagedUser';
import Message from './components/Message';
import Loader from './components/loader/Loader';
import './MessageBoard.css';
import { AUTH_MESSAGES } from '../../services/messagesAuth/MessagesAuth';


export class MessageBoard extends Component {
  timer = 0;
  //=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  state = {
    user: this.props.user,
    users: this.props.users,
    receiver: undefined,
    message: '',
    messages: false,
    newMessages: false,
    readMessage: false,
    userBoards: undefined,
    receivers: undefined,
    isLoading: false,
  };

 
    //=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    //1. Component did mount - then getUserBoards and updateMessageBoard
  //=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  componentDidMount = () => {
    this.setState({ isLoading: true });
    this.timer = setInterval(() => {
      this.getUserBoards();
      this.updateMessageBoard();
    }, 2000);
  };

   //=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  //2.Switch Chat board user - get user Chat board  if clicked
  //=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  timeOut = 0
  switchUser = receiver => {
    this.setState({
     receiver,
     isLoading: true,
     messages: false,
     newMessages: false,
     readMessage: true
   });
   
    this.state.timeOut = setTimeout(() => {
    this.scrollMessagesDown();
     //here will call to update new msg unread/read status
   }, 2000);
 };

  //=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  //Updates message status
  //=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- 
//   updateMessageStatus = async () => {
//     const res = await AUTH_MESSAGES.updateStatus({
//       otherUserId: user._id,
//     })

//     if(this.state.newMessages){
//       console.log("updateMessageStatus -> data", this.state.newMessages)
//      const msgIds = this.state.newMessages.map(msg => msg._id )
//       const res = await AUTH_MESSAGES.updateStatus({
//         otherUserId: this.state.receiver._id,
//         newMessages: msgIds
//       })
//     }
// }

 //=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  //3.Handle input change - if typing
  //=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  handleMessage = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  //=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  //4. Handle Submit - Send message if submitted
  //=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  handleMessageSubmit = async e => {
    e.preventDefault();
    //  await axios.post(`/api/messages/add-new-message`, {
    //   otherUser: this.state.receiver,
    //   message: this.state.message
    // })
    this.setState({ message: '' });
    console.log('this.state.receiver', this.state.receiver);
    await AUTH_MESSAGES.addNewMessage({
      otherUser: {
        _id: this.state.receiver._id,
        username: this.state.receiver.username,
      },
      message: this.state.message,
    });
    await this.getUserBoards(); // to update message history list
    await this.updateMessageBoard();
     this.scrollMessagesDown()
  };

  
   //=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  //Get User boards to get messages
  //=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  getUserBoards = async () => {
    const res = await AUTH_MESSAGES.getUserBoards();
    // const res = await axios.get(`/api/messages/boards`)
    this.setState({ userBoards: res.data, isLoading: false });
  };

  //=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  //Updates message history list (left side with user image and las message and time)
  //=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  updateMessageBoard = async () => {
    if (this.state.receiver) {
      // const res = await axios.post('/api/messages/board', {id: this.state.receiver})
      const res = await AUTH_MESSAGES.updateUserBoard({
        id: this.state.receiver._id,
      });
      const { messages, newMessages } = res.data;
      this.setState({ messages, newMessages });
      // setTimeout(() => {
      // }, 300);
    }
  };

  //=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  //Scrolls down messages on load or when new message
  //=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  scrollMessagesDown = () => {
    setTimeout(() => {
      const chatMessages = document.querySelector('.message-board-body');
      if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
      
    }, 300);
  };

  //=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  //Get Users, that who had messaging history with current user, for display
  //=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  getReceivers = userBoards => {
    return userBoards
      .map(board => {
        const receiverObj = board.newMessages[0].receiverID;
        const createdAt =
          board.newMessages[board.newMessages.length - 1].createdAt;
        receiverObj.createdAt = moment(createdAt).calendar();
        receiverObj.lastMessage =
          board.newMessages[board.newMessages.length - 1];
        return receiverObj;
      })
      .sort((a, b) => (b.createdAt > a.createdAt ? -1 : 1));
  };

  //=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  //Last on component unmount - when page closed clear/stop  this.timer === setInterval
  //=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  componentWillUnmount() {
    console.log('========  component UNMOUNTED! ========');
    clearInterval(this.timer); // !!!
  }

  //=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  //=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  render() {
    const {
      messages,
      newMessages,
      users,
      userBoards,
      message,
      isLoading,
    } = this.state;

    return (
      <div>
        <div className="main-message-board">
          <div className="nav-sidebar">
            <div className="sidebar-icons">
              <Link to="/" className="">
                <span>
                  <i className="fas fa-feather-alt"></i>
                </span>
              </Link>
              <Link to="/" className="">
                <span>
                  <i className="fas fa-dove"></i>
                </span>
              </Link>
              <Link to="/" className="">
                <span>
                  <i className="fas fa-edit"></i>
                </span>
              </Link>
              <Link to="/" className="">
                <span>
                  <i className="fas fa-user"></i>
                </span>
              </Link>
              <Link to="/" className="">
                <span>
                  <i className="fab fa-dropbox"></i>
                </span>
              </Link>
              <Link to="/message-board" className="">
                <span className="fas fa-comment-dots"></span>
              </Link>
              <Link to="/" className="">
                <span>
                  <i className="fas fa-award"></i>
                </span>
              </Link>
              <Link to="/" className="">
                <span>
                  <i className="fas fa-crop"></i>
                </span>
              </Link>
              <Link to="/" className="">
                <span>
                  <i className="fas fa-cog"></i>
                </span>
              </Link>
            </div>
          </div>

          <div className="users-list">
            <div id="search-div">
              <input
                type="search"
                name="search"
                id="search-user"
                placeholder="Search user..."
              />
              <span id="search-icon">
                <i className="fas fa-search"></i>
              </span>
            </div>

            {/* users list */}
            <div className="users-div">
              {users.map(user => {
                const { _id, path, username } = user;
                return (
                  <div key={_id} className="user-user-list">
                    <Link
                      to={`/message-board/${_id}`}
                      onClick={() => this.switchUser(user)}
                    >
                      <div className="user-image-div">
                        <img className="user-image" src={path} alt={username} />
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
            {/* messaging history with user image*/}
            <div className="messages-history">
              {userBoards
                ? this.getReceivers(userBoards).map(user => {
                    // console.log("receiver-> user", user)
                    const {
                      _id,
                      path,
                      firstName,
                      lastName,
                      lastMessage,
                      createdAt,
                    } = user;
                    const yourId = this.state.user._id;
                    // const users = [lastMessage.receiverID._id, lastMessage.author._id]
                    const theUser =
                      lastMessage.receiverID._id.toString() !==
                      yourId.toString()
                        ? lastMessage.receiverID
                        : lastMessage.author._id.toString() !==
                          yourId.toString()
                        ? lastMessage.author
                        : '';
                    const theUserId = theUser._id;
                    const theUserPath = theUser.path;
                    const theUserName = theUser.firstName;
                    const theUserLastName = theUser.lastName;

                    // const lastMessage = messages[messages.length -1]
                    return (
                      <div key={_id}>
                        {_id.toString() === yourId.toString() ? (
                          <MessagedUser
                            switchUser={user => this.switchUser(user)}
                            userId={theUserId}
                            user={theUser}
                            path={theUserPath}
                            firstName={theUserName}
                            lastName={theUserLastName}
                            lastMessage={lastMessage}
                            state={this.state}
                            createdAt={createdAt}
                          />
                        ) : (
                          <MessagedUser
                            switchUser={user => this.switchUser(user)}
                            userId={_id}
                            user={user}
                            path={path}
                            firstName={firstName}
                            lastName={lastName}
                            lastMessage={lastMessage}
                            state={this.state}
                            createdAt={createdAt}
                          />
                        )}
                      </div>
                    );
                  })
                : ''}
            </div>
          </div>

          <div id='"message-board' className="message-board">
            <div className="message-board-nav">
              <Switch>
                <Route
                  exact
                  strict
                  path="/message-board/:id"
                  render={props => <BoardNavbar {...props} users={users} />}
                />
              </Switch>
              <div>
                <span id="search-icon2">
                  <i className="fas fa-search"></i>
                </span>
                <span>
                  <i className="fas fa-user-plus"></i>
                </span>
                {/* <span><i class="fas fa-ellipsis-v"></i></span> */}
                <span>
                  <i className="fas fa-ellipsis-h"></i>
                </span>
              </div>
            </div>

            <div id="message-board-body" className="message-board-body">
              <div id="messageBoardUsers">
                {/* all messages goes here */}
                <div className="conversation-div">
                  {newMessages ? (
                    newMessages.map(msg => {
                      return msg.author.username !== msg.sender ? (
                        <Message
                          key={msg._id}
                          currUser={this.state.user}
                          user={msg.author}
                          id={msg._id}
                          message={msg.message}
                          path={msg.receiverID.path}
                          firstName={msg.receiverID.firstName}
                          lastName={msg.receiverID.lastName}
                        />
                      ) : (
                        <Message
                          key={msg._id}
                          currUser={this.state.user}
                          user={msg.author}
                          id={msg._id}
                          message={msg.message}
                          path={msg.author.path}
                          firstName={msg.author.firstName}
                          lastName={msg.author.lastName}
                        />
                      );
                    })
                  ) : isLoading ? (
                    <Loader />
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </div>

            <form
              onSubmit={this.handleMessageSubmit}
              id="message-form"
              className="message-board-footer"
            >
              <input
                id="message-input"
                onChange={this.handleMessage}
                value={message}
                name="message"
                type="text"
                placeholder="Type your message..."
              />

              <span className="icons message-icon">
                <i className="fas fa-smile"></i>
              </span>
              <span className="icons message-icon">
                <i className="fas fa-paperclip"></i>
              </span>
              <span className="icons message-icon" role="button" type="submit">
                <i className="fab fa-telegram"></i>
              </span>
              {/* <span className="icons telegram"><i className="fas fa-microphone"></i></span>
                <span className="icons telegram"><i className="fas fa-microphone-slash"></i></span> */}
              <button className="icons">
                <i className="fab fa-telegram"></i>Send
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default MessageBoard;

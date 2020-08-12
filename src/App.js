import React, { useState , useEffect} from 'react';
import './App.css';
import Post from './Post';
import {db, auth} from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  const classes = useStyles();
  const [posts, setPosts] = useState([
  ]);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const [modalStyle] = React.useState(getModalStyle);
  const signIn = (event) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password).then((authUser) => {
      console.log(authUser);
    }).catch((error) => {
      console.log(error);
    })
    setOpenSignIn(false);
  }
  const signUp = (event) => {
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message));
    setOpen(false);
  }
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser){
        // user has logged in 
        console.log(authUser);
        setUser(authUser);
        
        if(authUser.displayName){
          // don't update the ususernameername
        }
        else {
          return authUser.updateProfile({displayName: username});
        }
      }
      else {
        // user has logged out
        setUser(null);
      }
    })
    return () => {
      unsubscribe();
    }
  }, [user, username])
  useEffect(() => {
    // this code runs everytime the posts changes
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snaphot => {
      // everytime a new post is added , this code will fire
      setPosts(snaphot.docs.map(doc => 
        ({
           id: doc.id,
           post: doc.data()
        })
        ));
    })
  },[posts])
  return (
    <div className="app">
      <Modal
        open={open}
        onClose={ () => setOpen(false)}
      >
      <div style={modalStyle} className={classes.paper}>
       <form className="app__signUp">
       <center>
          <img 
            className="app__headerImage"
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt=""
          />
        </center>
        <Input 
          placeholder="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}/>
        <Input 
          placeholder="password"
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}/>
          <Input 
          placeholder="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}/>
          <Button onClick={signUp}>Submit</Button>
       </form>
      </div>
 
      </Modal>
      <Modal
       open={openSignIn}
       onClose={ () => setOpenSignIn(false)}
      >
      <div style={modalStyle} className={classes.paper}>
       <form className="app__signUp">
       <center>
          <img 
            className="app__headerImage"
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt=""
          />
        </center>
          <Input 
          placeholder="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}/>
        <Input 
          placeholder="password"
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}/>
          <Button onClick={signIn}>Login</Button>
       </form>
      </div>
      </Modal>
      <div className="app__header">
        <img 
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />
        { user ? (
            <Button onClick={() => auth.signOut()}>Logout</Button>
          ) : (
            <div className="app__loginContainer">
               <Button onClick={() => setOpenSignIn(true)}>Sign in</Button>
              <Button onClick={() => setOpen(true)}>Sign up</Button>
            </div>
          )}
      </div>
      <div className="app__posts">
        <div className="app__postsLeft">
            {
            posts.map(({id, post}) => (
              <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
            ))
          }
        </div>
        <div className="app__postsRight">
            <InstagramEmbed
            url='your_path_to_profile'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>
     
      {
        user?.displayName ? ( 
          <ImageUpload username={user.displayName} />
        ) : (
          <h3>Login to upload</h3>
        )
      }
      
    </div>
  );
}

export default App;

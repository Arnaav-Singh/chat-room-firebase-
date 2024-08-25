import React, { useRef, useState } from 'react';
import './App.css';
import image from './logo.png'

// Import Firebase modules using the new modular SDK
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, collection, query, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBrL_1laBANgVqlNR0ujoRmb-sHMVVu0Q0",
  authDomain: "chat-room-cdc09.firebaseapp.com",
  databaseURL: "https://chat-room-cdc09-default-rtdb.firebaseio.com",
  projectId: "chat-room-cdc09",
  storageBucket: "chat-room-cdc09.appspot.com",
  messagingSenderId: "648692860728",
  appId: "1:648692860728:web:7e2b30a04dc42653e023cd",
  measurementId: "G-MM85DZ374B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const analytics = getAnalytics(app);

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>The Chat Room</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log("User signed in successfully!");
      })
      .catch((error) => {
        console.error("Error during sign-in:", error);
        alert("Failed to sign in. Please try again.");
      });
  };

  return (
    <div className="sign-in-container">
      <div className="sign-in-box">
        <h2>Welcome to the Chat Room</h2>
        <button className="sign-in" onClick={signInWithGoogle}>
          <img
            src={image} // Corrected line
            alt="Google Sign-In"
          />
          Sign in with Google
        </button>
        <p>By signing in, you agree to adhere to our community guidelines.</p>
      </div>
    </div>
  );
}


function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => signOut(auth)}>Sign Out</button>
  );
}

function ChatRoom() {
  const dummy = useRef();
  const messagesRef = collection(firestore, 'messages');
  const q = query(messagesRef, orderBy('createdAt'), limit(25));

  const [messages] = useCollectionData(q, { idField: 'id' });

  const [formValue, setFormValue] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await addDoc(messagesRef, {
      text: formValue,
      createdAt: serverTimestamp(),
      uid,
      photoURL,
    });

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        <span ref={dummy}></span>
      </main>

      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />
        <button type="submit" disabled={!formValue}>🕊️</button>
      </form>
    </>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} alt="User Avatar" />
      <p>{text}</p>
    </div>
  );
}

export default App;

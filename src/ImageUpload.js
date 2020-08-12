import { Button } from '@material-ui/core'
import { auth } from 'firebase';
import React, { useState } from 'react'
import { db, storage } from './firebase';
import firebase from "firebase";
import './ImageUpload.css';

function ImageUpload({username}) {
    const [caption, setCaption] = useState('');
    const [image,  setImage] = useState('');
    const [progress, setProgress] = useState('');
    const handleChange = (event) => {
        const files = event.target.files;
        console.log(files);
        setImage(event.target.files[0]);
        console.log(image);
        if(event.target.files[0]){
            setImage(event.target.files[0]);
            console.log(image);
        }
    }
    const handleUpload = (event) => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on("state_changed", (snapshot) => {
            //progress function
            const progess = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress(progess);
        }, (error) => { 
            //error function
            console.log(error);
            alert(error.message);
        }, () => {
            // completed function
            storage.ref("images")
            .child(image.name)
            .getDownloadURL()
            .then(url => {
                db.collection("posts").add({
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    caption: caption,
                    imageUrl: url, 
                    username: username
                })

                setProgress(0);
                setCaption('');
                setImage(null);
            })
        })
    }
    return (
        <div className="imageUpload">
            <progress className="imageUpload__progress" value={progress} max="100" />
            <input type="text" onChange={event => setCaption(event.target.value)} placeholder="Enter a caption..." value={caption} />
            <input type="file" onChange={handleChange}/>
            <Button onClick={handleUpload}>
                Upload
            </Button>
        </div>
    )
}

export default ImageUpload

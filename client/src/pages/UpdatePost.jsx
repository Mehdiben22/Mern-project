import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref,  uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import {CircularProgressbar} from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css';
import {useNavigate , useParams} from 'react-router-dom'
import {  useSelector } from "react-redux";


 export default  function  UpdatePost() {
  const [file , setFile] = useState(null);
  const [imageUploadProgress , setImageUploadProgress] = useState(null);
  const [imageUploadError , setImageUploadError ] = useState(null);
  const [formData,setFromData] = useState({});
  const [publishError , setPublishError ] = useState(null);
  const {postId} = useParams();

  const navigate = useNavigate();
  const {currentUser} = useSelector((state) => state.user);


  useEffect (() => {

    try {
        // we did the async here because we can't do async in useeffect
        const fetchPost = async() => {
        const res = await fetch(`/api/post/getposts?postId=${postId}`);
        const data = await res.json();
        if(!res.ok) {
            console.log(data.message);
            setPublishError(data.message);
            return;
        }
        if(res.ok) {
            setPublishError(null);
            setFromData(data.posts[0]);
        }
    };
    fetchPost();
    }catch(error) {

    }

  },[postId]);


  const handleUploadImage = async () => {
    try {
      if(!file) {
        setImageUploadError('Please select an Image')
        return; 
      }
  
  
    //If there is an error from the previous attempt we can remove that
    setImageUploadError(null);
    // get the storage from firebase and import the app
    const storage = getStorage (app);
    // make it a date and add the filename on the top 
    const fileName = new Date().getTime() + '-' + file.name;
    const storageRef = ref(storage , fileName);
    const uploadTask = uploadBytesResumable(storageRef,file);
    //uploadTask.on to the the process of upload
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = 
        (snapshot.bytesTransferred / snapshot.totalBytes)*100;
        setImageUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageUploadError('Image upload failed');
        //If there is an error we stop the upload
        setImageUploadProgress(null)
      },
      //after that we download the url
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageUploadProgress(null);
          setImageUploadError(null);  
          // we keep the previous data we add image here which is going to be this download URL
          setFromData({...formData , image : downloadURL});
        });
      }
    
    )
  }catch(error) {
    setImageUploadError('Image upload failed');
    setImageUploadProgress(null);
    console.log(error)
  }
}
const handleSubmit = async (e) => {
  //prevent refreshing the page
  e.preventDefault();
  try {
    const res = await fetch(`/api/post/updatepost/${postId}/${currentUser._id}`, {
      method :'PUT',
      headers : {
        'Content-Type' :'application/json',
      },
      body : JSON.stringify(formData),
    });
    const data = await res.json();
    if(!res.ok) {
      setPublishError(data.message)
      return;
    }
   
    if(res.ok) {
      setPublishError(null)
      navigate(`/post/${data.slug}`);
      
    }
  }catch(error) {
    setPublishError("Something went Wrong")

  }

}
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update Post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
            <TextInput type="text"
             placeholder="Title"
              required id='title'
               className="flex-1"
               onChange={(e) => 
               setFromData({...formData , title : e.target.value})}
               value={formData.title}
               />
            <Select 
            onChange={(e)=> 
            setFromData({...formData , category : e.target.value})
            }
            value={formData.category}
               >
                <option value='uncategorized'>Select a category</option>
                <option value='javascript'>Javacript</option>
                <option value='reactjs'>React.js</option>
                <option value='nextjs'>Next.js</option>
            </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500
         border-dotted p-3">
          {/* we gonna have on the onchange an event */}
            <FileInput type='file' accept="image/*" onChange={(e) => setFile(e.target.files[0])}/>
            <Button type='button'
             gradientDuoTone='purpleToBlue' 
            size='sm' 
            outline
            onClick={handleUploadImage}
            //We make the button disabled if we are uploading the image
            disabled ={imageUploadProgress}
            >
              {/* condition pour l'upload the l'image  */}
              {imageUploadProgress ?(
              <div className="w-16 h-16">
                <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`}/>
              </div>
             ) : (
              'Upload Image'
             )
              
            }
            </Button>
         </div>
         {imageUploadError && 
          <Alert color='failure' >
            {imageUploadError}
          </Alert>   }
          {/* when the image is uploaded we show the image in below  */}
          {formData.image && (
            <img src={formData.image} alt="upload" className="w-full h-72 object-cover"/>
          )}

      
         <ReactQuill theme="snow"
         value={formData.content}
          placeholder="Write something..."
           className="h-72 mb-12"
           required
           // This is the way you get information from the reactquill
           onChange={(value)=> {
          setFromData({...formData ,  content : value});
          }}
         />
         <Button type='submit' gradientDuoTone='purpleToPink'>Update</Button>
         {publishError && <Alert className="mt-5" color='failure'>{publishError}</Alert>}
      </form>
    </div>
  )
}


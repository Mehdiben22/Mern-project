import  { useEffect, useState } from 'react'
import moment from 'moment'
import {FaThumbsUp} from 'react-icons/fa'
import { useSelector } from 'react-redux';
import { Button, Textarea } from 'flowbite-react';
// Component to show the comments that we have fetched in the commentsection
export default function Comment({comment , onLike , onEdit ,onDelete}) {
 const [user , setUser] = useState({});
 const {currentUser} = useSelector((state) => state.user);
 const [isEditing , setIsEditing] = useState(false);
 const [editedContent , setEditedContent] = useState(comment.content);

    useEffect(() => {
        const getUser = async() => {
            try {
                const res = await fetch(`/api/user/${comment.userId}`);
                const data = await res.json();
                if(res.ok) {
                    setUser(data);
                }
            }catch(error) {
                console.log(error.message);
            }
        }
        getUser() ;
        //calling each time comment changes
    },[comment]);
    const handleEdit = () => {
        setIsEditing(true);
       setEditedContent(comment.content);
    }
    const handleSave = async() => {
        try {
            const res = await fetch(`/api/comment/editComment/${comment._id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  content: editedContent,
                }),
              });
           if(res.ok) {
            setIsEditing(false);
            onEdit(comment , editedContent);
           }
        }catch(error) {
          console.log(error.message);  
        }
    }

  return (
    <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
       <div className='flex-shrink-0 mr-3'>
        <img className='w-10 h-10 rounded-full bg-gra-200' 
        src={user.profilePicture} alt={user.username} />
       </div>
       {/* it will cover all the places */}
       <div className='flex-1'>
        <div className='flex items-center mb-1'>
            {/* truncate is fore having a long username we gonna truncate it   */}
            <span className='font-bold mr-1 text-sm truncate'>{user ?`@${user.username}` : 'Unkown user'}</span>
            <span className='text-gray-500 text-xs'>{moment(comment.createdAt).fromNow()}</span>
        </div>
           {/* when we click edit  */}
        {isEditing? (
            <>
            <Textarea className='mb-2'
            //editedContent is the state we created we inital value (comment.content)
            value={editedContent}
            onChange = {(e)=>setEditedContent(e.target.value)}
            />
            <div className='flex justify-end gap-2 text-xs'>
                <Button type='button' size='sm' gradientDuoTone='purpleToBlue'
                onClick={handleSave}
                >
                    Save
                </Button>
                <Button type='button' size='sm' gradientDuoTone='purpleToBlue' outline onClick={()=> setIsEditing(false)}>
                   Cancel
                </Button>
            </div>
            </>
        ):(
            <>
             <p className='text-gray-500 mb-2'>{comment.content}</p>
        <div className='flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2'>
            <button type='button' onClick={()=> onLike(comment._id)} 
            //If the currentUser available , then if the comment.likes include that person in this case we wanna have 
            //text blue 
            className = {`text-gray-500 hover:text-blue-500
            ${currentUser && comment.likes.includes(currentUser._id) && '!text-blue-500'}`
            }>
              <FaThumbsUp className='text-sm'/>
            </button>
            <p className='text-gray-500'>
                {
                // if the numberoflikes is more than 0 in this case we show the number of likes  
                comment.numberOfLikes > 0 && comment.numberOfLikes + " " 
                + (comment.numberOfLikes === 1 ? "like" : "likes")
                }
            </p>
            {
                // if the currentsuser is  the owner of the comment or he's the admin we show the edit function
                currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) && (
                    <>
               <button type='button' onClick={handleEdit} className='text-gray-400 hover:text-blue-500'>
                  Edit
               </button>
                <button type='button' onClick={()=> onDelete(comment._id)} className='text-gray-400 hover:text-red-500'>
                Delete
             </button>
             </>

                )
            }
        </div>
            </>
        )}
       
       </div>
    </div>
  )
}



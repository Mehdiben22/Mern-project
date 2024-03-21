import { Table , Modal , Button } from 'flowbite-react'
import  { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {HiOutlineExclamationCircle} from 'react-icons/hi';


export default function DashComments() {
    const { currentUser } = useSelector((state) => state.user)
    const [comments , setComments] = useState([]);
    const [showMore , setShowMore] = useState(true);
    const [showModal , setShowModal] = useState(false);
    const [commentIdToDelete,setCommentIdToDelete] = useState('');

   useEffect(() => {
    const fetchComments = async() => {
        try {
          const res = await fetch ('/api/comment/getcomments')
          const data = await res.json();
          if(res.ok) {
            setComments(data.comments);
            // la condition qu'on vient de faire est si le nombre de comments est < 9 
            //show more vas pas apparaitre
            if(data.comments.length < 9 ) {
                setShowMore(false);
            }
          }

        }catch(error) {
            console.log(error.message);
        }
    } ;
    //Si la personne est admine  on fetch la fonction 
    if(currentUser.isAdmin) {
        fetchComments();
    }
    //have the useeffect each time when user changed 
   },[currentUser._id])
       
      // this fetching is for having more than 9 posts
     const handleShowMore = async () => {
    
        //startindex start from the end of it
        const startIndex = comments.length;
        try {
            //startIndex is for starting fetching  after 9 element 
              const res = await fetch(
              `api/user/getcomments?startIndex=${startIndex}`
                );
              const data = await res.json();
              console.log('API response:', data);   
              if(res.ok) {
                //Keep the previous comments and add the new results (data.comments) to the previous one
                setComments((prev) => [...prev , ...data.comments]);
              
                if (data.comments.length < 9) {
                    setShowMore(false);
                  }
              }
        }catch(error) {
            console.log(error.message)
        }
     }

     const handleDeleteComment = async () => {
        setShowModal(false);

        try {
            const res = await fetch (`api/comment/deleteComment/${commentIdToDelete}` , {
                method : 'DELETE',
            });
            const data = await res.json();
            if(res.ok)   {
                //Filter out the comment that we have deleted
                setComments((prev) => prev.filter((comment) => comment._id !== commentIdToDelete));
                setShowModal(false);
            }else {
                console.log(data.message);
            }   

        }catch(error) {
            console.log(error.message)
        }

     };
      

  return (
    //table-auto : set the size of texts automatique if we have an overflow we will scroll 
    // md:mx-auto make it in the center automatique scrollbar from the tailwindcss scrollbar
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100
     scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
  {currentUser.isAdmin && comments && comments.length > 0 ? (
        <>
        <Table hoverable className='shadow-md'>
            {/* contruire la table des posts */}
            <Table.Head>
                <Table.HeadCell>Date Updated</Table.HeadCell>
                <Table.HeadCell>Comment content</Table.HeadCell>
                <Table.HeadCell>Number of Likes</Table.HeadCell>
                <Table.HeadCell>PostId</Table.HeadCell>
                <Table.HeadCell>UserId</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {comments.map((comment) => (
                // divide-y when we have more posts it will do space between them
             <Table.Body className='divide-y' key={comment._id}>
              <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                {/* convertire les dates en date : mm/dd/yyyy */}
                <Table.Cell>{new Date(comment.updatedAt).toLocaleDateString()}</Table.Cell>
                <Table.Cell>
                    {comment.content}
                </Table.Cell>
                <Table.Cell>
                     {comment.numberOfLikes}
                </Table.Cell>
                <Table.Cell>{comment.postId}</Table.Cell>
                <Table.Cell>{comment.userId}</Table.Cell>
                <Table.Cell>
                    {/* Le onclick event listner permet d'attacher plusieur evenement au meme element */}
                    <span onClick={() => {
                            setShowModal(true);
                            setCommentIdToDelete(comment._id);
                    }} className='font-medium text-red-500 hover:underline cursor-pointer'>
                        Delete
                    </span>
                </Table.Cell>
              </Table.Row>
             </Table.Body>
            )
            )}
        </Table>
        {showMore && (
            <button
              onClick={handleShowMore}
              className='w-full text-teal-500 self-center text-sm py-7'
            >
              Show more
            </button>
          )}
        </>
     ):(
        <p>You have no comments yet!</p>
     )}
         <Modal show={showModal}
      onClose={()=> setShowModal(false) }
      popup
      size='md'
    >
      <Modal.Header/>
      <Modal.Body>
        <div  className="text-center">
          <HiOutlineExclamationCircle className="h-1 w-14 text-gray-400  dark:text-gray-200
          mb-4 mx-auto"/>
         <h3 className="mb-5 text-lg text-gray-500 
         dark:text-gray-400">Are you sure you want to delete this comment?</h3> 
         <div className="flex justify-center gap-4">
             <Button color='failure' onClick={handleDeleteComment}>
              Yes , I'm sure
             </Button>
             <Button color='gray' onClick={() => setShowModal(false)}>No , cancel</Button>
         </div>
        </div>
      </Modal.Body >
    </Modal>
    </div>
  );
}


import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js"

export const create = async (req , res , next) => {
    //We need to check the cookie first
   if(!req.user.isAdmin) {
    return next(errorHandler(403 ,'You are not allowed to create a post'))
   }
   if(!req.body.title || !req.body.content) {
    return next(errorHandler(400 , 'Please provide all required fields'))
   }
   //Cette ligne de code en Node.js crée un slug à partir du titre contenu dans req.body.title.
   // Un slug est généralement une version conviviale de l'URL d'un article, d'une page ou d'une ressource,
   // où les espaces et les caractères spéciaux sont remplacés par des tirets, et toutes les lettres sont en minuscules.
   const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g,'');
   const newPost = new Post( {
    ...req.body , slug , userId : req.user.id
   });
   try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
   }catch(error) {
     next(error);
   }
}
// get posts
export const getposts = async (req,res,next) => {
try { 
  // startIndex is gonna be a number and we will conver it to integer if there is nothing
  //we wanna start from 0
  const startIndex = parseInt(req.query.startIndex) || 0;
  // limit response view on the page at 9 response 
  const limit = parseInt(req.query.limit) || 9;
  // 1 is gonna show ascending -1 is gonna show descending 
  const sortDirection = req.query.order === 'asc' ? 1 : -1;
  const posts = await Post.find({
    //if the search query includes userId we wanna search for the userId and this is coming from req.query.userId
    ...(req.query.userId && { userId: req.query.userId }),
   //if the search query includes category we wanna search for the category and this is coming from req.query.category
   ...(req.query.category && { category: req.query.category }),
   //if the search query includes slug we wanna search for the slug and this is coming from  req.query.slug
   ...(req.query.slug && { slug: req.query.slug }),
   //if the search query includes postId we wanna search for the post id with _id 
   // he is like that in mongodb and this is coming from req.query.postId
   ...(req.query.postId && { _id: req.query.postId }),
   ...(req.query.searchTerm && {
    //using or alow us to search between two places for exemple title and content
     $or : [
      //regex is going to search inside the title , options 'i' lower or upper case is not important
      // L'opérateur $options est généralement utilisé dans les requêtes MongoDB pour spécifier des options lors de la recherche.
      {title : {$regex : req.query.searchTerm, $options :'i'}},
      {content : {$regex : req.query.searchTerm, $options :'i'}},
     ]
  }),
  // we wanna sort it based on the updateded and based on the sortdirection too
  //and we gonna skip the startindex and limit it 
}).sort({updateAt : sortDirection}).skip(startIndex).limit(limit);
  //Getting the number of posts
const totalPosts = await Post.countDocuments();

const now = new Date();

const oneMonthAgo = new Date(
  now.getFullYear(),
  now.getMonth()-1,
  now.getDate()
) ;

const lastMonthPosts = await Post.countDocuments({
  //we sort it from the time that creation greater than one month ago
  createdAt : {$gte : oneMonthAgo},
});
res.status(200).json({
  posts,
  totalPosts,
  lastMonthPosts,
})

  
   
}catch(error) {
  next(error);
}
};


export const deletepost = async (req,res,next) => {
  // if the person is not admin or if the request .id is not equal to the params userid
    if(!req.user.isAdmin || req.user.id !== req.params.userId) {
      return next(errorHandler(403, 'You are not allowed to delete this post'))
    }
    try {
      //request to find the post by his id 
      await Post.findByIdAndDelete(req.params.postId);
      //response
      res.status(200).json('The post has been deleted');

    }catch(error) {
      next(error);

    }
}; 

export const updatepost = async(req , res , next) => {
   if (!req.user.isAdmin || req.user.id != req.params.userId) {
    return next(errorHandler(403 , 'You are not allowed to update this post'))
   }
   try { 
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        // le user peux modifier que les informations citer 
        $set : {
          title : req.body.title,
          content : req.body.content,
          category : req.body.category,
          image : req.body.image
          //We get the new result
        }} , {new:true})
        res.status(200).json(updatedPost);

   }catch(error) {
next(error);
   }

}
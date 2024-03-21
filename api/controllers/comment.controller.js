import { errorHandler } from "../utils/error.js";
import Comment from "../models/comment.model.js";

export const createComment = async(req,res,next) => {
    try {
        const {content , postId , userId} = req.body;
          // si le user is not equal that the one inside the cookie 
        if(userId !== req.user.id) {
            return next(errorHandler(403 , 'You are not allowed to create this comment'))
        }

        const newComment = new Comment ({
            content,
            postId,
            userId,
        });
        await newComment.save();
        res.status(200).json(newComment);
      
    }catch(error){

    }
}

export const getPostComments = async(req , res , next) => {
    try {
        // we search based on the postId we wanna search for the comment based on this
        //postId
        const comments = await Comment.find({postId : req.params.postId}).sort({
            createdAt : -1
        });
        res.status(200).json(comments);
    }catch(error) {
     next(error);
    }
}

export const likeComment = async ( req , res , next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if(!comment) {
            return next(errorHandler(404 , 'Comment not found'));
        }
        //If the comment exist we wanna  check if the user already like the comment or not
        //indexOf allows us to search inside array of likes if the user from the verifytoken exist
        const userIndex = comment.likes.indexOf(req.user.id);
        // if the user is not available in that array we make userIndex === -1
        if(userIndex === -1) {
            // on ajouter un like 
            comment.numberOfLikes +=1;
            // we add the user from the verified token inside the likes array
            comment.likes.push(req.user.id);
        } else {
            //on remove un like
            comment.numberOfLikes -=1;
            // methode splice remove the array
            comment.likes.splice(userIndex , 1)
        }
        await comment.save();
        res.status(200).json(comment);  
    }catch(error) {
      next(error) ;
    }
}

export const editComment = async(req,res,next) => {
    try {
         const comment = await Comment.findById(req.params.commentId);
         if(!comment) {
            return next(errorHandler(404 , 'Comment not found'));
         }
         // if the user is not the owner of the comment and if the user is not an admin
         if(comment.userId !== req.user.id && !req.user.isAdmin) {
            return next(errorHandler(403 , 'You are not allowed to edit this comment'))
         }
         //if everything is ok
         const editedComment = await Comment.findByIdAndUpdate(
            req.params.commentId,
            {
                content : req.body.content,
            },
            {new: true}
         );
         res.status(200).json(editedComment);
    
    }catch(error) {
      next(error);
    }

}

export const deleteComment = async (req,res,next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if(!comment) {
            return next(errorHandler(404 , 'Comment not found'))
        }
        if(comment.userId != req.user.id && !req.user.isAdmin) {
            return next(errorHandler(403, 'You are not allowed to delete this comment'))
        }
        await Comment.findByIdAndDelete(req.params.commentId);
        res.status(200).json('Comment has been deleted');

    }catch(error) {
        next(error)
    }
}

export const getcomments = async (req, res, next) => {
    if (!req.user.isAdmin)
      return next(errorHandler(403, 'You are not allowed to get all comments'));
    try {
      const startIndex = parseInt(req.query.startIndex) || 0;
      const limit = parseInt(req.query.limit) || 9;
      const sortDirection = req.query.sort === 'desc' ? -1 : 1;
      const comments = await Comment.find()
        .sort({ createdAt: sortDirection })
        .skip(startIndex)
        .limit(limit);
      const totalComments = await Comment.countDocuments();
      const now = new Date();
      const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );
      const lastMonthComments = await Comment.countDocuments({
        createdAt: { $gte: oneMonthAgo },
      });
      res.status(200).json({ comments, totalComments, lastMonthComments });
    } catch (error) {
      next(error);
    }
  };
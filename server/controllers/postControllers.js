const Post = require('../models/postModel')
const User = require('../models/userModel')
const path = require('path')
const fs = require('fs')
const { v4: uuid } = require('uuid')
const HttpError = require('../models/errorModel')




// Create post 
// POST : api/posts
// PROTECTED


const createPost = async (req, res, next) => {
    try {
        let { title, category, description } = req.body;
        if (!title || !category || !description || !req.files) {
            return next(new HttpError("Fill in all fields and choose thumbnail."), 422)
        }
        const { thumbnail } = req.files;

        if (thumbnail.size > 2000000) {
            return next(new HttpError("Thumbnail too big. File should be less then 2mb"))
        }

        let fileName = thumbnail.name;
        let splittedFilename = fileName.split('.')
        let newFilename = splittedFilename[0] + uuid() + "." + splittedFilename[splittedFilename.length - 1]
        // let filePath = path.join(__dirname, '../public/uploads/' + newFilename);
        // console.log(filePath);
        thumbnail.mv(path.join(__dirname,'..','/uploads',newFilename), async (err) => {
            if (err) {
                return next(new HttpError(err))
            } else {
                const newPost = await Post.create({ title, category, description, thumbnail: newFilename, creator: req.user.id })
                if (!newPost) {
                    return next(new HttpError("Post couldn't be created.", 422))
                }
                const currentUser = await User.findById(req.user.id);
                const userPostCount = currentUser.posts + 1;
                await User.findByIdAndUpdate(req.user.id, { posts: userPostCount })

                res.status(201).json(newPost)
            }
        })

    } catch (error) {
        return next(new HttpError(error))
    }
}




// Get all the post
// get post 
// POST : api/posts
// UNPROTECTED


const getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find().sort({ updateAt: -1 })
        res.status(200).json(posts)
    } catch (error) {
        return next(new HttpError(error))
    }
}








// Create single post 
// Get : api/posts/:id
// UNPROTECTED


const getPost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return next(new HttpError("Post not found.", 404))

        }
        res.status(200).json(post)

    } catch (error) {
        return next(new HttpError(error))
    }
}






// get post by post 
// POST : api/posts/categories/:category
// UNPROTECTED


const getCatPosts = async (req, res, next) => {
    try {
        const { category } = req.params;
        const catPosts = await Post.find({ category }).sort({ createdAt: -1 })
        res.status(200).json(catPosts)
    } catch (error) {
        return next(new HttpError(error))
    }
}




// get author
// get : api/posts/user/:id
// PROTECTED


const getUserPosts = async (req, res, next) => {
    try {
        const { id } = req.params;
        const posts = await Post.find({ creator: id }).sort({ createdAt: -1 })
        res.status(200).json(posts)
    } catch (error) {
        return next(new HttpError(error))
    }
}




// ================EDIT POST
// PATCH : api/posts/:id
// PROTECTED


const editPost = async (req, res, next) => {
    try {
        let fileName;
        let newFilename;
        let updatedPost;
        const postId = req.params.id;
        let { title, category, description } = req.body;
        if (!title || !category || !description.length < 12) {
            return next(new HttpError("Fill in all fields", 422))
        }
        if (!req.files) {
            updatedPost = await Post.findByIdAndUpdate(postId, { title, category, description }, { new: true })
        } else {

            const oldPost = await Post.findById(postId);



            fs.unlink(path.join(__dirname, '..', 'uploads', oldPost.thumbnail), async (err) => {
                if (err) {
                    return next(new HttpError(err))
                }
            })
            const { thumbnail } = req.files;
            if (thumbnail.size > 2000000) {
                return next(new HttpError("Thumbnail is too big. Should be less than 2mb "))
            }

            fileName = thumbnail.name;
            let splittedFileName = fileName.split('.')
            newFilename = splittedFileName[0] + uuid() + "." + splittedFileName[splittedFileName.length - 1]
            thumbnail.mv(path.join(__dirname, '..', 'uploads', newFilename), async () => {
                if (err) {
                    return next(new HttpError(err))
                }
            })
            updatedPost = await Post.findByIdAndUpdate(postId, { title, category, description, thumbnail: newFilename }, { new: true })
        }


        if (!updatedPost) {
            return next(new HttpError("couldn't update post.", 400))
        }
        res.status(200).json(updatedPost)

    } catch (error) {
        return next(new HttpError(error))
    }
}





// ================DELETE POST
// DELETE: api/posts/:id
// PROTECTED


const deletePost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        if (!postId) {
            return next(new HttpError("Post unavailable.", 400))
        }
        const post = await Post.findById(postId);
        const fileName = post?.thumbnail;
        if (req.user.id == post.creator) {

            fs.unlink(path.join(__dirname, '..', 'uploads', fileName), async () => {
                if (err) {
                    return next(new HttpError(err))
                } else {
                    await Post.findByIdAndDelete(postId);
                    const currentUser = await User.findById(req.user.id);
                    const userPostCount = currentUser?.posts - 1;
                    await User.findByIdAndUpdate(req.user.id, { posts: userPostCount })
                }
            })
        } else {
            return next(new HttpError("Post couldn't be deleted", 403))
        }

        res.json(`post ${postId} deleted successfully`)
    } catch (error) {
        return next(new HttpError(err))
    }
}


module.exports = { createPost, getPosts, getPost, getCatPosts, getUserPosts, editPost, deletePost }


import Post from'../models/post.js';
import toId from'../helpers/toId.js'
import tokenService from '../service/tokenService.js';
import User from './../models/user.js';
const handleError = (res, error) => {
  console.log(error);
  res.send( "error").status(500);
}

export const getPost = (req, res) => {
  const id = toId(req.body.id);
  Post
    .findById(id)
    .then(result=>res.send(result))
    .catch((error) => handleError(res, error));
}

export const deletePost = (req, res) => {
  const id = toId(req.body.id);
  Post
  .findByIdAndDelete(id)
  .then((result) => {
    res.sendStatus(200);
  })
  .catch((error) => handleError(res, error));
}

// export const getEditPost = (req, res) => {
//   const id = toId(req.body.id);
//   Post
//     .findById(id)
//     .then(post => res.render(createPath('edit-post'), { post, title }))
//     .catch((error) => handleError(res, error));
// }

// const editPost = (req, res) => {
//   const { title, author, text } = req.body;
//   const id = toId(req.body.id);
//   Post
//     .findByIdAndUpdate(id, { title, author, text })
//     .then((result) => res.redirect(`/posts/${id}`))
//     .catch((error) => handleError(res, error));
// }

export const getPosts = async (req, res) => {
  try {
    const {refreshToken} = req.cookies
    const tokenData = await tokenService.findToken(refreshToken)
    const link= toId(tokenData.userId)
    Post
      .find({link:link})
      .sort({ createdAt: -1 })
      .then(posts => res.send(posts))
      .catch((error) => handleError(res, error));
  } catch (error) {
    handleError(res, error)
  }

}



export const addPost = async (req, res) => {
  const { text } = req.body;
  const {refreshToken} = req.cookies
  const tokenData = await tokenService.findToken(refreshToken)
  const link= toId(tokenData.userId)
  const author = await User.findById(link)
  const post = new Post({ link:link, author:author.name, text:text });
  post
    .save()
    .then((result) => res.send(result))
    .catch((error) => handleError(res, error));
}


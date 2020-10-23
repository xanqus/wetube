import routes from "../routes";
import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comment";

export const home = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ _id: -1 });
    res.render("home", { pageTitle: "Home", videos: videos });
  } catch (error) {
    console.log(error);
    res.render("home", { pageTitle: "Home", videos: [] });
  }
};

export const search = async (req, res) => {
  const {
    query: { term: searchingBy },
  } = req;
  let videos = [];
  try {
    videos = await Video.find({
      title: { $regex: searchingBy, $options: "i" },
    });
  } catch (error) {
    console.log(error);
  }
  res.render("search", {
    pageTitle: "Search",
    searchingBy: searchingBy,
    videos: videos,
  });
};

export const getUpload = (req, res) => {
  res.render("upload", { pageTitle: "Upload" });
};
export const postUpload = async (req, res) => {
  const {
    body: { title, description },
    file: { location },
  } = req;
  const user = await User.findById (req.user._id);
  const newVideo = await Video.create({
    fileUrl: location,
    title: title,
    description: description,
    creator: user.id
  });
  //To Do: Upload and save video
  user.videos.push(newVideo._id);
  user.save();
  res.redirect(routes.videoDetail(newVideo._id));
};

export const videoDetail = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id)
    .populate("videos").populate("comments");
    res.render("videoDetail", { pageTitle: video.title, video });
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const getEditVideo = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id);
    console.log(video.creator);
    console.log(req.user._id);
    if(video.creator != req.user._id) {
      
      throw Error();
    } else {
      res.render("editVideo", { pageTitle: `Edit ${video.title}`, video });
    }
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const postEditVideo = async (req, res) => {
  const {
    params: { id },
    body: { title, description },
  } = req;

  try {
    await Video.findOneAndUpdate({ _id: id }, { title, description });
    res.redirect(routes.videoDetail(id));
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const deleteVideo = async (req, res) => {
  const {
    params: { id },
  } = req;

  try {
    const video = await Video.findById(id);
    if(video.creator !== req.user._id) {
      throw Error();
    } else {
      await Video.findOneAndDelete({ _id: id });
    }
  } catch (error) {}
  res.redirect(routes.home);
};



// Register Video View

export const postRegisterView = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const video = await Video.findById(id);
    video.views = video.views+1;
    video.save();
    res.status(200);
  } catch(error) {
    res.status(400);
    res.end();
  } finally {
    res.end();
  }
};

// Add Comment

export const postAddComment = async (req, res) => {
  const {
    params: { id },
    body: { comment },
    user
  } = req;
  try {
    const video = await Video.findById(id);
    const newComment = await Comment.create({
      text: comment,
      creator: user.id
    });
    video.comments.push(newComment._id);
    console.log(user._id);
    console.log(newComment._id);
    video.save();
    res.send({id: newComment._id});
  } catch(error) {
    res.status(400);
  } finally {
    res.end();
  }
}

export const postDeleteComment = async (req, res) => {
  const {
    body: { comment, id },
    user
  } = req;
  try {
    console.log(id);
    await Comment.findByIdAndRemove({ _id: id });
  } catch(error) {
    res.status(400);
  } finally {
    res.end();
  }
}
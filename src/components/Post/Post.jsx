import "./Post.scss"
import { Button, Modal } from "react-bootstrap"
import PPCoin from "../../assets/images/PP-coin.svg"
import LinkIcon from "../../assets/icons/post/Link-icon.svg"
import Verified from "../../assets/icons/post/Verified.svg"
import like from "../../assets/images/like.svg"
import likeNot from "../../assets/images/likeNot.svg"
import message from "../../assets/images/message.svg"
import share from "../../assets/images/share.svg"
import { Link } from "react-router-dom"
import { getAllPost } from "../../utils/postApi"
import { useEffect, useState } from "react"
import { addComment, postLike } from "../../utils/familytreeApi"
import Comment from "./Comment"
import { toast } from "react-toastify"
import PostDropdown from "./PostDropdown"
import MediaViewer from "./MediaViewer"
import { AiFillPlayCircle } from "react-icons/ai"



export default Post




import { 
    IconButton,
    ButtonGroup,
    Button
} from "@mui/material";

import { 
    Favorite as LikedIcon,
    FavoriteBorder as LikeIcon
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import { useApp, queryClient } from "../ThemeApp";
import { useMutation } from "react-query";
import { 
    postPostLike,
    postCommentLike,
    deletePostLike,
    deleteCommentLike,
} from "../libs/fetcher";

export default function LikeButton ({ item, comment }) {
    const navigate = useNavigate();
    const { auth } = useApp();

    function isLiked() {
        if(!auth) return false;
        if(!item.likes) return false;
        return item.likes.find(like => like.userId == auth.id);
    };

    const likePost = useMutation(id => postPostLike(id), {
        onSuccess: async () => {
            await queryClient.refetchQueries("posts");
            await queryClient.refetchQueries("comments");
        },
    });

    const likeComment = useMutation(id => postCommentLike(id), {
        onSuccess: async () => {
            await queryClient.refetchQueries("comments");
        },
    });

    const unlikePost = useMutation(id => deletePostLike(id), {
        onSuccess: async () => {
            await queryClient.refetchQueries("posts");
            await queryClient.refetchQueries("comments");
        },
    });

    const unlikeComment = useMutation(id => deleteCommentLike(id), {
        onSuccess: async () => {
            await queryClient.refetchQueries("comments");
        },
    });

    return (
        <ButtonGroup>
            {isLiked() ? (
                <IconButton
                    size="small"
                    onClick={e => {
                        comment
                            ? unlikeComment.mutate(item.id)
                            : unlikePost.mutate(item.id);
                        e.stopPropagation();
                    }}>
                    <LikedIcon size="small" color="error" />
                </IconButton>
            ):(
                <IconButton
                    size="small"
                    onClick={e=>{
                        comment
                            ? likeComment.mutate(item.id)
                            : likePost.mutate(item.id);
                        e.stopPropagation();
                    }}>
                    <LikeIcon size="small" color="error" />
                </IconButton>
            )}
            <Button
                onClick={e => {
                    if (comment) {
                        navigate(`/likes/${item.id}/comment`);
                    } else {
                        navigate(`/likes/${item.id}/post`);
                    }
                    e.stopPropagation(); }}
                    sx={{ color: "text.fade" }}
                    variant="text"
                    size="small">
                {item.likes ? item.likes.length : 0}
            </Button>
        </ButtonGroup>
    );
}
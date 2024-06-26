import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../../appwrite/config";
import { Button, Container } from "..";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
    const [post, setPost] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userData);

    const isAuthor = post && userData ? post.userId === userData.$id : false;

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) setPost(post);
                else navigate("/");
            });
        } else navigate("/");
    }, [slug, navigate]);

    const deletePost = () => {
        appwriteService.deletePost(post.$id).then((status) => {
            if (status) {
                appwriteService.deleteFile(post.featuredImage);
                navigate("/");
            }
        });
    };

    return post ? (

        <div className="py-8 bg-gray-100">
  <Container>
    <div className="w-full flex flex-col items-center mb-4 relative border rounded-xl p-4 border-cyan-950 bg-white shadow-lg">
      <img
        src={appwriteService.getFilePreview(post.featuredImage)}
        alt={post.title}
        className="rounded-xl w-full object-cover"
      />

      {isAuthor && (
        <div className="absolute right-6 top-6 flex space-x-3">
          <Link to={`/edit-post/${post.$id}`}>
            <Button   className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">
              Edit
            </Button>
          </Link>
          <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded" onClick={deletePost}>
            Delete
          </Button>
        </div>
      )}
    </div>
    <div className="w-full mb-6">
      <h1 className="text-4xl font-bold text-cyan-800 mb-4">{post.title}</h1>
    </div>
    <div className="w-full bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <div className="prose prose-lg max-w-none">
        {parse(post.content)}
      </div>
    </div>
  </Container>
</div>

    ) : null;
}
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/guest/HomePage";
import LoginPage from "./pages/guest/LoginPage";
import MyPage from "./pages/user/MyPage";
import MyEditPage from "./pages/user/MyEditPage";
import ForumPage from "./pages/guest/ForumPage";
import PostDetailPage from "./pages/guest/PostDetailPage"
import CreatPostPage from "./pages/user/CreatPostPage";
import CreatAccountPage from "./pages/guest/CreatAccountPage";
import FindAccountPage from "./pages/guest/FindAccountPage";
import MyListPage from "./pages/user/MyListPage";
import AdminReportPage from "./pages/admin/AdminReportPage";
import AdminSuggestionPage from "./pages/admin/AdminSuggestionPage";
import AdminUserMangePage from "./pages/admin/AdminUserMangePage";
import PostEditPage from "./pages/user/PostEditPage";
import OtherUserProfilePage from "./pages/guest/OtherUserProfilePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/mypage/edit" element={<MyEditPage />} />
        <Route path="/forum/:forumCategory" element={<ForumPage />} />
        <Route path="/forum/:forumCategory/:postId" element={<PostDetailPage />} />
        <Route path="/creatpost" element={<CreatPostPage />} />
        <Route path="/postedit/:articleId" element={<PostEditPage />} />
        <Route path="/creataccount" element={<CreatAccountPage />}/>
        <Route path="/findaccound" element={<FindAccountPage />}/>
        <Route path="/mylist/:currentMyList" element={<MyListPage />} />
        <Route path="/userprofile/:userId" element={<OtherUserProfilePage />} />

        <Route path="/admin/reports" element={<AdminReportPage />} />
        <Route path="/admin/suggestions" element={<AdminSuggestionPage />} />
        <Route path="/admin/manageusers" element={<AdminUserMangePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

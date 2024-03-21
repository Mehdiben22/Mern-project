import { BrowserRouter , Routes , Route } from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import Dashboard from "./pages/Dashboard"
import Projects from "./pages/Projects"
import Header from "./components/Header"
import Footer from "./components/Footer"
import PrivatRoute from "./components/PrivatRoute"
import OnlyAdminPrivatRoute from "./components/OnlyAdminPrivatRoute"
import  CreatePost  from "./pages/CreatePost"
import UpdatePost from "./pages/UpdatePost"
import PostPage from "./pages/PostPage"
import ScrollToTop from "./components/ScrollToTop"
import Search from "./pages/Search"

export default function App() {
  return(
    <BrowserRouter>
    {/* scrolling to the top when pathname is changed */}
    <ScrollToTop/>
    <Header/>
    <Routes>

      <Route path="/" element={<Home/>} />
      <Route path="/about" element={<About/>} />
      <Route path="/sign-in" element={<SignIn/>} />
      <Route path="/sign-up" element={<SignUp/>} />
      <Route path="/search" element={<Search/>} />
      <Route element={<PrivatRoute/>}>
      <Route path="/dashboard" element={<Dashboard/>} />
      </Route>
      <Route element={<OnlyAdminPrivatRoute/>}>
      <Route path="/create-post" element={<CreatePost/>} />
      {/* pour avoir le postId dans une autre page on import useparams et on appele le postId pour 
      l'utiliser */}
      <Route path="/update-post/:postId" element={<UpdatePost/>} />
      </Route>

      <Route path="/projects" element={<Projects/>} />
      <Route path='/post/:postSlug' element={<PostPage />} />

    </Routes>
    <Footer/>
     </BrowserRouter>
  )
}



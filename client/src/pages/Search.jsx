import { Button, Select, TextInput } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useLocation , useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';

export default  function Search() {
    const [sidebarData , setSidebarData] = useState({
        searchTerm : '',
        sort: 'desc',
        category: 'uncategorized',
    });
    const [posts , setPosts] = useState([]);
    const [loading , setLoading] = useState(false);
    const [showMore , setShowMore] = useState(false);
console.log(sidebarData)
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search) 
        // we get searchTerm from the urlparams
        const searchTermFromUrl = urlParams.get('searchTerm');
        // we get sort from the urlparams
        const sortFromUrl = urlParams.get('sort');
        // we get category from the urlparams
        const categoryFromUrl = urlParams.get('category');
        //and if they exist we set the informations to the sidebarData and we keep the previous values , the default one
        if(searchTermFromUrl || sortFromUrl || categoryFromUrl) {
            setSidebarData({
                ...sidebarData,
                searchTerm : searchTermFromUrl,
                sort : sortFromUrl , 
                category : categoryFromUrl,
            });
        }
        const fetchPosts = async () => {
            setLoading(true);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/post/getposts?${searchQuery}`);
            if (!res.ok) {
              setLoading(false);
              return;
            }
            if (res.ok) {
              const data = await res.json();
              setPosts(data.posts);
              setLoading(false);
              if (data.posts.length === 9) {
                setShowMore(true);
              } else {
                setShowMore(false);
              }
            }
          };
          fetchPosts();
        }, [location.search]);

        const handleChange =(e) => {
            //handleChange the texts input search term , category and order
            if(e.target.id === 'searchTerm') {
                setSidebarData({...sidebarData, searchTerm : e.target.value });
            }
            if(e.target.id === 'sort') {
                const order = e.target.value || 'desc';
                setSidebarData({...sidebarData, sort: order});
            }
            if(e.target.id === 'category') {
                const category = e.target.value || 'uncategorized';
                setSidebarData({...sidebarData, category});
            }
        }

        const handleSubmit =(e) => {
            e.preventDefault();
            //get the url
            const urlParams = new URLSearchParams(location.search);
            //setting searchTerm , sort and category to sidebar
            urlParams.set('searchTerm', sidebarData.searchTerm);
            urlParams.set('sort', sidebarData.sort);
            urlParams.set('category', sidebarData.category);
            // searchquery will be this urlParams wil all this params !
            const searchQuery = urlParams.toString();
            navigate(`/search?${searchQuery}`);
        }

        const handleShowMore = async() => {
            //setting number of posts 
            const numberOfPosts = posts.length;
            //startIndex will be the numberOfPosts
            const startIndex = numberOfPosts;
            // get the url params from the location 
            const urlParams = new URLSearchParams(location.search);
            urlParams.set('startIndex' , startIndex);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/post/getposts?${searchQuery}`);
            if(!res.ok) {
                return;
            }
            if(res.ok) {
                const data = await res.json();
                setPosts([...posts , ...data.posts]);
                if(data.posts.length === 9 ) {
                    setShowMore(true);
                }else {
                    setShowMore(false);
                }

            }
        }

     return <div className='flex flex-col md:flex-row'>
          <div className='p-7 border-b md:border-r md:min-h-screen border-gray-500'>
            <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
                <div className='flex items-center gap-2'>
                    <label className='whitespace-nowrap font-semibold'>Search Term:</label>
                    <TextInput placeholder='Search...'
                    id='searchTerm'
                     type='text'
                     value={sidebarData.searchTerm}
                     onChange={handleChange}
                     />
                </div>
                <div className='flex items-center gap-2'>
                    <label className='font-semibold'>Sort:</label>
                    <Select onChange={handleChange} defaultValue={sidebarData.sort} id='sort'>
                        <option value='desc'>Latest one</option>
                        <option value='asc'>Oldest one</option>
                    </Select>
                </div>
                <div className='flex items-center gap-2'>
                    <label className='font-semibold'>Category:</label>
                    <Select onChange={handleChange} value={sidebarData.category} id='category'>
                        <option value='uncateorized'>uncateorized</option>
                        <option value='reactjs'>Reactjs</option>
                        <option value='nextjs'>Nextjs</option>
                        <option value='javascript'>Javascript</option>
                    </Select>
                </div>
                <Button type='submit' outline gradientDuoTone='purpleToPink'>
                    Submit 
                </Button>
            </form>
          </div>
          <div className='w-full'>
            <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5'>Posts results:</h1>
            <div className='p-7 flex flex-wrap gap-4'>
                {
                    !loading && posts.length === 0 && (
                        <p className='text-xl text-gray-500'>No Posts Found</p>
                    ) 
                }
                {
                    loading && 
                        <p className='text-xl text-gray-500'>Loading...</p>
                    
                }
                {
                    !loading && posts && posts.map((post) => <PostCard key={post._id} post={post} />
                )}
                {
                    showMore && <button onClick={handleShowMore} className='text-teal-500 text-lg hover:underline p-7 w-full'>Show More</button>
                }
            </div>
          </div>

     </div>
}



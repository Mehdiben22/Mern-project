import { Footer, FooterDivider } from "flowbite-react"
import { Link } from "react-router-dom"
import {BsFacebook,BsInstagram,BsTwitter,BsGithub,BsDribbble} from "react-icons/bs"

export default function FooterCom() {
  return (
   <Footer container className="border border-t-8 border-teal-500">
    {/* w veut dire witdh mx-auto veut dire mettre les elements au centre */}
      <div className="w-full max-w-7xl mx-auto">
        {/* sm : flex in small size md: is medium size make it gris cols 1 */}
        <div className="grid w-full justify-between sm:flex sm md:grid-cols-1">
            <div className="mt-5">
            <Link to="/" className='self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white'>
    <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Mehdi's</span>
    Blog
    </Link>
            </div>
            {/* grid 2 colons in small size gap : espace entre eux , sm : when we are in a smallsize
            gap will be different : 6  */}
            <div className="grid grid-cols-2 gap-8  mt-4 sm:grid-cols-3 sm:gap-6">
             <div>
             <Footer.Title title="About" />
              {/* col means on the top on links */}
              <Footer.LinkGroup col>
                {/* open it in another page  */}
                <Footer.Link href="http://www.100jsprojects.com"
                            target= '_blank'
                            rel="noopener noreferrer" // relationship : they dont block it by the browser 
                           >
                    100 JS Projects
                </Footer.Link>
                <Footer.Link href="/about"
                            target= '_blank'
                            rel="noopener noreferrer" // relationship : they dont block it by the browser 
                           >
                    Mehdi's Blog
                </Footer.Link>
                
              </Footer.LinkGroup>
             </div>
             <div>
             <Footer.Title title="Follow Us" />
              {/* col means on the top on links */}
              <Footer.LinkGroup col>
                {/* open it in another page  */}
                <Footer.Link href="http://www.github.com/Mehdiben22"
                            target= '_blank'
                            rel="noopener noreferrer" // relationship : they dont block it by the browser 
                           >
                    Github
                </Footer.Link>
                <Footer.Link href="#"
                            
                           >
                    Discord
                </Footer.Link>
                
              </Footer.LinkGroup>
             </div>
             <div>
             <Footer.Title title="Legal" />
              {/* col means on the top on links */}
              <Footer.LinkGroup col>
                {/* open it in another page  */}
                <Footer.Link href="#"
                            
                           >
                    Privacy Policy
                </Footer.Link>
                <Footer.Link href="#"
                            
                           >
                    Terms & Conditions
                </Footer.Link>
                
              </Footer.LinkGroup>
             </div>
            </div>
        </div>
        <Footer.Divider/>
        <div className="w-full sm:flex sm:items-center sm : justify-between">
          <Footer.Copyright href="#" by="Mehdi's Blog" year={new Date().getFullYear()}/>
          <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
            <Footer.Icon href="#" icon={BsFacebook}/>
            <Footer.Icon href="#" icon={BsInstagram}/>
            <Footer.Icon href="#" icon={BsTwitter}/> 
            <Footer.Icon href="https://github.com/Mehdiben22" icon={BsGithub}/> 
            <Footer.Icon href="#" icon={BsDribbble}/> 
          </div>
        </div>
      </div>
   </Footer>
  )
}



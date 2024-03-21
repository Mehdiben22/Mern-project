import { Button } from 'flowbite-react'
import React from 'react'

function CallToAction() {
  return (
    //flex flex-col is done for having a small screen flex-row too 
    <div  className='flex flex-col sm:flex-row p-3 border border-teal-500
     justify-center items-center rounded-tl-3xl rounded-br-3xl text-center'>
        {/* flex flex-col make them aligned the button take the size of texts */}
      <div className='flex-1 justify-center flex flex-col' >
        <h2 className='text-2xl'>
            Want to learn more about Javascript ?
        </h2>
        <p className='text-gray-500'>
            Checkout these resources with 100 Javascript Projects
        </p>
        {/* rounder-top left x large but dont make it rounder in bottom left  */}
        <Button gradientDuoTone='purpleToPink' className='rounded-tl-xl 
        rounded-bl-none'>
            {/* target=blank is for openning the url in another page 
            and the relation nooopener to not blocking our page  */}
            <a href='https://www.100jsprojects.com' target='_blank'
            rel='noopener noreferrer'>
                100 Javascript Projects
            </a>
        </Button>
      </div>
      <div className='p-7 flex-1'>
        <img src='https://www.tutorialspoint.com/javascript/images/javascript-mini-logo.jpg' 
         />
      </div>
    </div>
  )
}

export default CallToAction

import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link ,useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth';

export default function SignUp() {
 
  const [formdata,setFormdata] =useState({});
  const [errorMessages,setErrorMessage] =useState(null);
  const [loading , setLoading ] = useState(false);
  const navigate = useNavigate();

  const handleChange =(e) => {
    // form data pour username , email , password {}  trim pour enlever l'utilisation de  l'espace au debut des textinput
    setFormdata({...formdata , [e.target.id] : e.target.value.trim() });
  };
  const handleSubmit = async(e) => {
    // pour ne pas rafraichir la page 
    e.preventDefault();
    if (!formdata.username || !formdata.email || !formdata.password){
      return setErrorMessage('Please fill out all fields.');
    }
    try {
      setLoading(true);
      //if we have an error from the previous request it will be cleaned
      setErrorMessage(null);
      const res = await fetch ('/api/auth/signup', {
        method :'POST',
        headers :{'Content-Type' : 'application/json'},
        // convert to string and send it
        body : JSON.stringify(formdata),
      });  
      //convert to data/json
      const data = await res.json();
      if(data.success === false) {
        return setErrorMessage(data.message);
      }
      setLoading(false)
      if(res.ok) {
        navigate('/sign-in')
      }
      }catch(error) {
        setErrorMessage(error.message);
        setLoading(false);
      }
    };
  

  return (
    <div className='min-h-screen mt-20'>
      {/* clasname : padding : 3  max width = 3xl , mx-auto pour le centre de la page
      flex-col : en bas de la description , md:flex-row : page medium size ? flex-row*/}
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center'>
       {/* Left side */}
        {/* egalité espace flex-1 */}
        <div className='flex-1'>
        <Link to="/" className='  font-bold dark:text-white text-4xl'>
    <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white '>Mehdi's</span>
    Blog
    </Link>
    {/* classname : text small and margin top :5 */}
    <p className='text-sm mt-5'>
      This is a demo Project . You can Sign Up with your email and password
    </p>
        </div>
        {/* right side */}
        <div className='flex-1'>
          {/* gap pour ajouter de l'espace entre eux */}
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Your username'/>
              <TextInput
              type='text'
              placeholder='Username'
              id = 'username' onChange={handleChange}
              />
            </div>
            <div>
              <Label value='Your Email'/>
              <TextInput
              type='email'
              placeholder='name@company.com'
              id = 'email'
              onChange={handleChange}
              />
            </div>
            <div>
              <Label value='Your Password'/>
              <TextInput
              type='password'
              placeholder='Password'
              id = 'password'
              onChange={handleChange}
              />
            </div>
            <Button gradientDuoTone='purpleToPink' type='submit' disabled={loading}>
              {
                loading? (
                  // we add <> beacause we have added more than one html element in the ()
                  <>
                  <Spinner size='sm'/>
                  <span className='pl-3'>Loading...</span>
                  </>
                ) : 'Sign up'
              }
            </Button>
            <OAuth/>
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span> Have an account?</span>
            <Link to='/sign-in' className='text-blue-500'>
              Sign in
            </Link>
          </div>
          {
            // Alert pour :  si les infos sont null 
            errorMessages && (
              <Alert className='mt-5' color='failure'>
                {errorMessages}
              </Alert>
            )
          }
        </div>
      </div>
    </div>
  )
}



import { Button } from 'flowbite-react'
import { AiFillGoogleCircle } from 'react-icons/ai'
import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
import { app } from '../firebase'
import { useDispatch } from 'react-redux'
import { signInSuccess } from '../redux/user/userSlice'
import { useNavigate } from 'react-router-dom'

export default function OAuth() {
  const auth = getAuth(app)
  const dispatch = useDispatch()
  const navigate = useNavigate()
    const handleGoogleClick = async () => {
      const provider = new GoogleAuthProvider()
      //a chaque fois quand je clique sur sign in or up with google on me demande de selectionner un compte
      provider.setCustomParameters({prompt:'select_account'})
      try{
        // lors de la connexion a notre compte gmail les informations qui nous concerne s'afficheront 
        //dans la console inspecter/console
        const resultsFromGoogle = await  signInWithPopup(auth , provider)
        //Apres on les postes a notre backend  
        const res = await fetch ('api/auth/google', {
            method : 'POST',
            headers : {'Content-Type' :'application/json'},
            body : JSON.stringify({
                name : resultsFromGoogle.user.displayName,
                email : resultsFromGoogle.user.email,
                googlePhotoUrl : resultsFromGoogle.user.photoURL
            }),
        })
        const data = await res.json()
        if (res.ok){
             dispatch(signInSuccess(data))
             navigate('/')
        }
      }catch(error) {
        console.log(error);
      }
    }
    
  return (
    <Button type='button' gradientDuoTone='pinkToOrange' outline onClick={handleGoogleClick}>
        {/* witdh et height et margin */}
       <AiFillGoogleCircle className='w-6 h-6 mr-2' />
       Continue With Google
    </Button>
  )
}



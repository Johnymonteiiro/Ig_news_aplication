import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { api } from '../../services/api';
import { getStripeJS } from '../../services/stripe-js';
import { toast } from 'react-toastify';
import styles from './styles.module.scss';

interface SubscribeButtonProps {
  priceId: string
}

export function SubscribeButton({ priceId } : SubscribeButtonProps) {

  const { data: session } = useSession();
  const router = useRouter();

  async function handlesubscribe () {
      
    if(!session){
      // signIn('github'); 
      toast.error('Create an account');
      return;
    }

    //Verificar para que o usuário não se escreva novamente:
    if(session?.activeSubscription){
      router.push('/posts');
      return;
    }

    //criação da checkout session:
    try{
       const response = await api.post('/subscribe')
       const { sessionId } = response.data;

       const stripe = await getStripeJS();
       await stripe.redirectToCheckout({ sessionId: sessionId });

    }catch(err){
      alert(err.message)
    }
  }

  return (
     <button 
     type="button" 
     className={styles.subscribeButton}
     onClick= {handlesubscribe}
     >
       Subscribe now
     </button>
  );
}




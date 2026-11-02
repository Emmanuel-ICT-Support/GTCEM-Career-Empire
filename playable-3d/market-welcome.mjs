export const MARA_WELCOME = 'Hi, I’m Mara. Welcome to Juniper Kitchen! We make rice bowls for our market customers. Some people have already paid by phone; others order here. But things aren’t running as smoothly as they could. Sometimes it takes fresh eyes and a little initiative to spot a better way. Want to help? Watch the next group with me and see what you notice.';

// Opening choices are conversation, not assessment or paid work.
export function createMarketWelcome({show, watch, startShift, close, dialog, introImage=()=>null, help=()=>{}}) {
 function intro(){show('Meet the Juniper crew',MARA_WELCOME,[[ 'Let’s take a look',watch ]]);if(dialog){dialog.classList.add('market-teaching');dialog.dataset.marketTeachingStage='intro';const picture=introImage();if(picture){const image=document.createElement('img');image.className='market-intro-image';image.src=picture;image.alt='Mara and Sam at Juniper Kitchen';dialog.querySelector('.market-choices').before(image);}help();}}
 function result(){show('What did you notice?','What happened to the customers who had already paid?',[['Tell Mara',tell],['I’m not sure',hint],['Watch again',watch]]);}
 function tell(){show('Tell Mara what you noticed','Which part of the queue caught your attention?',[
  ['People who had paid were waiting to order',()=>acknowledge('“Yes — their food was ready, but they joined the ordering queue. What might help them find collection?”')],
  ['It was hard to see where to collect',()=>acknowledge('“Good spot. From behind the queue, the collection counter is hard to see. A clearer route could help.”')],
  ['I’d like another look',watch]
 ]);}
 function acknowledge(text){show('Mara is listening',text,[['What can I do to help?',offer],['Watch again',watch]],'That’s initiative: noticing what needs doing and taking a useful first step without waiting to be told every move. Check with the crew before changing things.');}
 function hint(){show('Look for the phone orders','Follow a customer who has already paid. Where do they wait? Then look at the bags ready at collection.',[['Take another look',watch],['Tell Mara',tell]]);}
 function offer(){show('Want to try a shift?','“Could you help us make ordering and collection smoother? Try an idea, watch the next customers, then tell me what happened.”',[
  ['Yes, let’s try it',startShift],['What does the job involve?',job],['Not now',close]
 ],'Practice pay: $20 − $2 community tax = $18, plus a crew pass. No timer. Help and retries never reduce your pay.');}
 function job(){show('Your first shift','Try the sign and collection settings at the work bench. Ask the customer or Sam if you need more information. Keep the walkway clear; leave payments and food handling to the trained crew.',[['Back to the shift offer',offer]],'You can change your idea and try again. Mixed results are useful to talk through.');}
 return {intro,result,offer};
}

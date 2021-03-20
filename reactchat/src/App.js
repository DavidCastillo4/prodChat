import React, { useContext } from 'react';
import { Chat } from './components/Chat/Chat';
import { Join } from './components/Join/Join';
import { ContextProvider, Context } from './components/Context'

export let App = () => {

  let Comp = () => {
    let { auth } = useContext(Context);
    return (auth ? <Chat /> : <Join />)
  };

  return (
    <ContextProvider>
      <Comp />
    </ContextProvider>
  );
}




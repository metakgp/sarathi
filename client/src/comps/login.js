import React,{ useEffect } from 'react'
import '../styles/App.scss'
import background from './bgpic.jpg'

export default function LoginPage (){
                    
                    useEffect(() => {
                        var bar = document.getElementById('navbar')
                        if(bar!=null)
                            bar.remove()
                                             
                    })
                     var back = {
                        backgroundImage : `url(${background})`
                     }
                    return(
                        <body >
                            <div className='login-page'>
                                <h1 id='title'>TRAVEL KGP!</h1>
                                <p id='description'><em>For all those "anyone willing to share a cab..."</em></p>
                                    <a href="/auth/facebook" class="fb btn">
                                    <i class="fa fa-facebook fa-fw"></i> Login with Facebook
                                    </a>
                            </div>
                        </body>
                    )
                }   
  import {  useRef, useState } from "react"
  import styles from "./App.module.scss"
  import "./styles.css"
  export function App(){

    const imageCrlArrow = useRef(null)
    const imageCrlStop = useRef(null)

    const [speedValue, setSpeed] = useState(0)
    const [ipTextAddr, setTextAddr] = useState("")
    const [ipAddr, setAddr] = useState("")
  


    const sendRequest = (url)=>{
      console.log(url)
      fetch(url)
        .catch(e=>{
          console.log("error")
        })    
    }



    const onChangeSpeed = (isInc)=>{
      if(isInc){
        setSpeed(speedValue+40);
      }else{
          setSpeed(speedValue-40);
      }
      sendRequest(ipAddr+"/btn/u/"+speedValue+"#");
      sendRequest(ipAddr+"/btn/v/"+speedValue+"#"); 
    }

    const onLedChanged = (r, s)=>{
      sendRequest(ipAddr+"/btn/" + r)
      sendRequest(ipAddr+"/btn/" + s)
    }

    return(

      <div className={styles.layout}>
        <div className="left-side-menu">
          <h2>Встановити адресу </h2>
        <div className="connection-wrapper">
          <input type="text" className="ctn-input" value={ipTextAddr} onChange={(e)=>{setTextAddr(e.target.value)}}></input>
          <button className="ctn-btn" onClick={()=>{
            (console.log(ipAddr))
            setAddr("http://"+ipTextAddr)
          }
          }>SET</button>
        </div>
          <h2>"Подати звуковий сигнал"</h2>
          <div className="tone-controls">
                
                <button className="tone-on-btn" onClick={()=>(sendRequest(ipAddr+"/btn/a"))}>
                  <img src="./tone_on.png"/>
                </button>

                <button className="tone-off-btn" onClick={()=>(sendRequest(ipAddr+"/btn/b"))}>
                  <img src="./tone_off.png"/>
                </button>
                
                <button className="song-on-btn" onClick={()=>(sendRequest(ipAddr+"/btn/c"))}>
                  <img src="./song_on.png"/>
                </button>
                            
                <button className="song-off-btn" onClick={()=>(sendRequest(ipAddr+"/btn/d"))}>
                  <img src="./tone_off.png"/>
                </button>
          </div>
          <h2>"Змінити колір"</h2>

          <div className="neo-pix-controls">
                <button className="neo prev-btn" onClick={()=>(onLedChanged('z','g'))}>
                  <img src="./flip_arrow.png"/>
                </button>
                <button className="neo next-btn" onClick={()=>(onLedChanged('z','e'))}>
                  <img src="./flip_arrow.png"/>
                </button>

                <button className="neo turnoff-btn" onClick={()=>(sendRequest(ipAddr+"/btn/f"))}>
                  <img src="./turn_off.png"/>
                </button>
                            
                {/* <button className="neo reset-btn" onClick={()=>(sendRequest(ipAddr+"/btn/z"))}>
                  <img src="./reset.png"/>
                </button> */}
          </div>

          <h2>"Відобразити емоджі"</h2>
          <div className="matrix-controls">
                <button className="matrix prev-btn" onClick={()=>(onLedChanged('y','k'))}>
                  <img src="./flip_arrow.png"/>
                </button>
                <button className="matrix next-btn" onClick={()=>(onLedChanged('y','i'))}>
                  <img src="./flip_arrow.png"/>
                </button>

                <button className="matrix turnoff-btn" onClick={()=>(sendRequest(ipAddr+"/btn/j"))}>
                  <img src="./turn_off.png"/>
                </button>
                            
                {/* <button className="matrix reset-btn" onClick={()=>(sendRequest(ipAddr+"/btn/y"))}>
                  <img src="./reset.png"/>
                </button> */}
          </div>

          <h2>"Авторежим"</h2>
          <div className="auto-controls">
                <button className="line-track-btn" onClick={()=>(sendRequest(ipAddr+"/btn/l"))}>
                  <img src="./line_track.png"/>
                </button>
                <button className="obs-avoid-btn" onClick={()=>(sendRequest(ipAddr+"/btn/m"))}>
                  <img src="./obs_avoid.png"/>
                </button>

                <button className="light-follow-btn" onClick={()=>(sendRequest(ipAddr+"/btn/n"))}>
                  <img src="./flashlight.png"/>
                </button>
                            
                <button className="follow-obj-btn" onClick={()=>(sendRequest(ipAddr+"/btn/o"))}>
                  <img src="./track_obj.png"/>
                </button>
          </div>
        </div>

        <div className="right-side-menu">
          <div className="controls-wrapper">

            <div className="robot-controls">
              <button className="control-btn up" onClick={()=>(sendRequest(ipAddr+"/btn/F"))}>
                <img ref={imageCrlArrow} src="./control_arrow.png"/>
              </button>
              <div className="middle-row">
                <button className="control-btn left" onClick={()=>(sendRequest(ipAddr+"/btn/L"))}>
                  <img ref={imageCrlArrow} src="./control_arrow.png"/>

                </button>
                <button className="control-btn stop" onClick={()=>(sendRequest(ipAddr+"/btn/S"))}>
                  <img ref={imageCrlStop} src="./control_stop.png"/>
                </button>
                <button className="control-btn right" onClick={()=>(sendRequest(ipAddr+"/btn/R"))}>
                <img ref={imageCrlArrow} src="./control_arrow.png"/>

                </button>
              </div>
              <button className="control-btn down" onClick={()=>(sendRequest(ipAddr+"/btn/B"))}>
                <img ref={imageCrlArrow} src="./control_arrow.png"/>
              </button>
              </div>
            
              <div className="speed-menu">
                <button className="speed-inc-btn" onClick={()=>(onChangeSpeed(true))}>+</button>
                <input value={speedValue} type="text" className="menu-input" readOnly/>
                <button className="speed-dec-btn"onClick={()=>(onChangeSpeed(false))}>-</button>
            </div>
          </div>
        </div>

      </div>
    )

  }
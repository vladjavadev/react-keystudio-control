import { useRef, useState, useCallback } from "react"
import styles from "./App.module.scss"
import "./styles.css"

// Порт за замовчуванням, якщо користувач не вказав інший
const DEFAULT_PORT = "80"

export function App() {
  const imageCrlArrow = useRef(null)
  const imageCrlStop = useRef(null)

  const [speedValue, setSpeed] = useState(0)
  // ipTextAddr - це текст, який вводить користувач (наприклад, "192.168.4.1")
  const [ipTextAddr, setTextAddr] = useState("")
  // ipAddr - це повний базовий URL (наприклад, "http://192.168.4.1:80")
  const [ipAddr, setAddr] = useState("")
  const [resp, setResp] = useState<string>("")
  const [isLoad, setIsLoad] = useState<boolean>(false)

  /**
   * Надсилає HTTP GET запит на вказаний URL.
   * @param url Повний URL для запиту.
   */
  const sendRequest = useCallback((url: string) => {
    console.log(`Sending request to: ${url}`)
    fetch(url)
      .then(async response => {
        if (!response.ok) {
          console.error(`HTTP error! Status: ${response.status} for URL: ${url}`)
          setResp(`Не вдалось опрацювати запит -> ${url}`)
        }
        setIsLoad(true)

        const responseText = await response.text()


        setResp(responseText)

        // Не обов'язково читати тіло відповіді, якщо це просто команда.
        // Але можна додати обробку response.json() тут, якщо сервер повертає дані.
      })
          .catch(e => {
            console.error(`Fetch error for URL: ${url}`, e)
            setResp(`Помилка з'єднання за url -> ${url}`)

          })
          .finally(()=>{
              setIsLoad(false)
          })
      
      }, [ipAddr])
  /**
   * Формує і надсилає команду, додаючи її до базової адреси та префіксу "/btn/".
   * @param command Буквений літерал команди (наприклад, "F", "a", "u/120#").
   */
  const sendCommand = useCallback((command: string) => {
    if (!ipAddr) {
      console.warn("IP Address not set. Cannot send command.")
      return
    }
    const fullUrl = `${ipAddr}/btn/${command}`
    sendRequest(fullUrl)
  }, [ipAddr])

  /**
   * Змінює швидкість і надсилає команди для обох моторів.
   * @param isInc True для збільшення, False для зменшення.
   */
  const onChangeSpeed = (isInc: boolean) => {
    const step = 40
    const newSpeed = isInc ? speedValue + step : speedValue - step
    // Обмежуємо швидкість між 0 і 255
    const clampedSpeed = Math.max(0, Math.min(255, newSpeed))
    setSpeed(clampedSpeed)
    
    // Формуємо команду у вигляді "u/швидкість#" та "v/швидкість#"
    sendCommand(`u/${clampedSpeed}#`)
    sendCommand(`v/${clampedSpeed}#`)
  }

  /**
   * Надсилає дві послідовні команди для зміни стану NeoPixel/Matrix.
   * @param r Перша команда (зазвичай для скидання/ініціалізації).
   * @param s Друга команда (зазвичай для зміни стану/перемикання).
   */
  const onLedChanged = (r: string, s: string) => {
    // В реальному проекті варто додати таймаут між командами,
    // але для простоти прикладу залишаємо послідовне надсилання.
    sendCommand(r)
    sendCommand(s)
  }

  /**
   * Встановлює повну IP-адресу/URL, додаючи "http://" та порт, якщо потрібно.
   */
  const handleSetAddr = () => {
    let address = ipTextAddr.trim()
    if (!address) return
    
    // Додаємо "http://" якщо відсутнє
    if (!address.startsWith("http://") && !address.startsWith("https://")) {
      address = "http://" + address
    }

    // Якщо порт не вказано, додаємо порт за замовчуванням
    if (!address.includes(":") || address.endsWith("]")) { // Перевірка на IPv6 в []
        // Знаходимо останній слеш або кінець рядка, щоб вставити порт
        const lastSlashIndex = address.lastIndexOf('/')
        // Якщо це просто "http://ip" без порту і без кінцевого слеша
        if(lastSlashIndex === 6 || lastSlashIndex === 7 || lastSlashIndex === -1){
            address =  `${address}:${DEFAULT_PORT}`
        }
    }
    
    setAddr(address)
    sendRequest(`${address}/`)
    console.log(`New Base Address Set: ${address}`)
  }

  return (
    <div className={styles.layout}>
      <div className="left-side-menu">
        <h2>{ipAddr ? "Адреса встановлена: " + ipAddr : "Встановіть адресу"} </h2>
        <div className="connection-wrapper">
          <input 
            type="text" 
            className="ctn-input" 
            placeholder="Напр. 192.168.4.1"
            value={ipTextAddr} 
            onChange={(e) => { setTextAddr(e.target.value) }}
          />
          <button 
            className="ctn-btn" 
            onClick={handleSetAddr}
            disabled={isLoad}
          >
            SET
          </button>
        </div>
       <div className="server-response-wrapper">
        <h3>Відповідь Сервера:</h3>
        <div className="output-text-style">
          {resp}
        </div>
      </div>

        ---

        <h2>🎵 "Подати звуковий сигнал"</h2>
        <div className="tone-controls">
          <button className="tone-on-btn" onClick={() => sendCommand('a')}>
            <img src="./tone_on.png" alt="Tone On"/>
          </button>
          <button className="tone-off-btn" onClick={() => sendCommand('b')}>
            <img src="./tone_off.png" alt="Tone Off"/>
          </button>
          <button className="song-on-btn" onClick={() => sendCommand('c')}>
            <img src="./song_on.png" alt="Song On"/>
          </button>
          <button className="song-off-btn" onClick={() => sendCommand('d')}>
            <img src="./tone_off.png" alt="Song Off"/> 
          </button>
        </div>

        ---

        <h2>🌈 "Змінити колір" (NeoPixel)</h2>
        <div className="neo-pix-controls">
          <button className="neo prev-btn" onClick={() => onLedChanged('z', 'g')}>
            <img src="./flip_arrow.png" alt="Previous Color"/>
          </button>
          <button className="neo next-btn" onClick={() => onLedChanged('z', 'e')}>
            <img src="./flip_arrow.png" alt="Next Color"/>
          </button>
          <button className="neo turnoff-btn" onClick={() => sendCommand('f')}>
            <img src="./turn_off.png" alt="NeoPixel Off"/>
          </button>
        </div>

        ---
        
        <h2>😊 "Відобразити емоджі" (LED Matrix)</h2>
        <div className="matrix-controls">
          <button className="matrix prev-btn" onClick={() => onLedChanged('y', 'k')}>
            <img src="./flip_arrow.png" alt="Previous Emoji"/>
          </button>
          <button className="matrix next-btn" onClick={() => onLedChanged('y', 'i')}>
            <img src="./flip_arrow.png" alt="Next Emoji"/>
          </button>
          <button className="matrix turnoff-btn" onClick={() => sendCommand('j')}>
            <img src="./turn_off.png" alt="Matrix Off"/>
          </button>
        </div>

        ---

        <h2>🤖 "Авторежим"</h2>
        <div className="auto-controls">
          <button className="line-track-btn" onClick={() => sendCommand('l')}>
            <img src="./line_track.png" alt="Line Track"/>
          </button>
          <button className="obs-avoid-btn" onClick={() => sendCommand('m')}>
            <img src="./obs_avoid.png" alt="Obstacle Avoid"/>
          </button>
          <button className="light-follow-btn" onClick={() => sendCommand('n')}>
            <img src="./flashlight.png" alt="Light Follow"/>
          </button>
          <button className="follow-obj-btn" onClick={() => sendCommand('o')}>
            <img src="./track_obj.png" alt="Follow Object"/>
          </button>
        </div>
      </div>

      <div className="right-side-menu">
        <h2>🕹️ "Ручне керування"</h2>
        <div className="controls-wrapper">
          <div className="robot-controls">
            <button className="control-btn up" onClick={() => sendCommand('F')}>
              <img ref={imageCrlArrow} src="./control_arrow.png" alt="Forward"/>
            </button>
            <div className="middle-row">
              <button className="control-btn left" onClick={() => sendCommand('L')}>
                <img ref={imageCrlArrow} src="./control_arrow.png" alt="Left"/>
              </button>
              <button className="control-btn stop" onClick={() => sendCommand('S')}>
                <img ref={imageCrlStop} src="./control_stop.png" alt="Stop"/>
              </button>
              <button className="control-btn right" onClick={() => sendCommand('R')}>
                <img ref={imageCrlArrow} src="./control_arrow.png" alt="Right"/>
              </button>
            </div>
            <button className="control-btn down" onClick={() => sendCommand('B')}>
              <img ref={imageCrlArrow} src="./control_arrow.png" alt="Backward"/>
            </button>
          </div>
          
          <div className="speed-menu">
            <button className="speed-inc-btn" onClick={() => onChangeSpeed(true)}>+</button>
            <input value={speedValue} type="text" className="menu-input" readOnly/>
            <button className="speed-dec-btn" onClick={() => onChangeSpeed(false)}>-</button>
          </div>
        </div>
      </div>
    </div>
  )
}
import React, { useEffect, useMemo, useRef, useState } from 'react';
import './sass/View.scss'

const ViewComponent = () => {
  const [marks, setMarks] = useState(Array(9).fill(""));
  const [player, setPlayer] = useState({o: [], x: []});
  const [result, setResult] = useState("");      
  const [turn, setTurn] = useState(false);
  const [boardWh, setBoardWH] = useState("350px");
  const count = useRef(0);
  const winColor = useRef({});

  function boardSet(e){
    let size = "350px";
    switch(e.target.value) {
      case "16":
        size = "450px"
        break;
      case "25":
        size = "600px"
        break;
    }
    setBoardWH(size);

    restartHandler();

    const tempMarks = Array(parseInt(e.target.value)).fill("");
    setMarks(tempMarks);
  }

  const [top_down, left_right] = useMemo(() => {
    const tempTop_down = [];
    const tempLeft_right = [];
    let sqrt = Math.sqrt(marks.length);

    for(let i=0; i<sqrt; i++){
      tempTop_down.push(i);
      tempLeft_right.push(i * sqrt);
    }

    return [tempTop_down, tempLeft_right];
  }, [marks])

  function markHandler(spot) {
    const newMarks = [...marks];

    if(newMarks[spot] !== ""){              // 중복 선택 방지
      return;
    }

    if(turn){                               // turn : true
      newMarks[spot] = `O`;
      setMarks(newMarks);
      setPlayer(prev => ({...prev, o: [...prev.o, spot]}));
    } else {                                // turn : false 
      newMarks[spot] = `X`; 
      setMarks(newMarks);
      setPlayer(prev => ({...prev, x: [...prev.x, spot]}));
    }

    if(count.current >= (newMarks.length - 3)) {
      let delSpot = turn ? player.o.shift() : player.x.shift()
      newMarks[delSpot] = "";
    }

    count.current += 1;
    setTurn(!turn);
  }

  useEffect(() => {
    myFunction(player.o);
  }, [player.o])

  useEffect(() => {
    myFunction(player.x);
  }, [player.x])

  function myFunction(play) {
    let sqrt = Math.sqrt(marks.length);
    top_down.forEach(key => {
      if(play.includes(key)){
        let gap = [];
        switch (key) {
          case 0:
            gap = [sqrt, sqrt+1];
            break;
          case sqrt-1:
            gap = [sqrt, sqrt-1];
            break;
          default:
            gap = [sqrt];
        }
        winConditionCheck(play, key, gap);
      }
    })

    left_right.forEach(key => {
      if(play.includes(key)){
        winConditionCheck(play, key, [1]);
      }
    })
  }

  function winConditionCheck(play, spot, gap) {
    let test = [];
    let sqrt = Math.sqrt(marks.length);
    for(let j=0; j<gap.length; j++) {
      test = Array(sqrt).fill(spot).map((_, i) => spot + i * gap[j]);
      if(test.every(val => play.includes(val))){
        test.forEach(winIdx => {
          winColor.current[winIdx].style.color = turn ? "red" : "blue";
        })
        setResult(`${turn ? "X" : "O"} WIN`);
        return;
      }
    }
  }

  function restartHandler() {
    setMarks(prev => Array(parseInt(prev.length)).fill(""))
    setPlayer({o: [], x: []})
    setResult("");
    count.current = 0;
    for (const key in winColor.current) {
      winColor.current[key].style.color = "black";
    }
  }
  
  return (
    <div className='main'>
      <div className='header'>
        <h1>Tic - Tac - Toe</h1>
        <select className="boardSet" name='boardSet' onChange={boardSet}>
          <option value={9}>3 X 3</option>
          <option value={16}>4 X 4</option>
          <option value={25}>5 X 5</option>
        </select>
        <button 
          id='Omark' 
          className={turn ? 'buttonO-active' : 'buttonO-inactive'}
          disabled={count.current >= 1 ? "disabled" : "" } 
          onClick={() => setTurn(true)}>
          O
        </button>
        <button 
          id='Xmark'
          className={turn ? 'buttonX-inactive' : 'buttonX-active'}
          disabled={count.current >= 1 ? "disabled" : "" }   
          onClick={() => setTurn(false)}>
          X
        </button>
      </div>
      <div 
      id='boardContainer'
      className={result === "" ? "" : "no-click"}
      style={{width: boardWh, height: boardWh}}>
        {
          marks.map((mark, idx) => (
            <div 
              key={idx} 
              className='board' 
              value={idx} 
              onClick={() => markHandler(idx)}
              ref={el => winColor.current[idx] = el}
            >{mark}
            </div>
          ))
        }
      </div>
      <div className='footer'>
        <span className={turn ? 'span-active' : 'span-inactive'}>
          {result}
        </span>
        <br />
        <button className='restart' onClick={restartHandler}>RESTART</button>
      </div>
    </div>
  );
};

export default ViewComponent;
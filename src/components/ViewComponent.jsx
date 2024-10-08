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

  /* 보드판 크기 설정 */
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

    // 변경 가능성 있음.
    // 좀 더 간단하게 가능할 것 같아. restartHandler()와 함께
    const tempMarks = Array(parseInt(e.target.value)).fill("");
    setMarks(tempMarks);
  }

  /* 보드판에 O,X 배치 및 기록 */
  function markHandler(spot) {
    const newMarks = [...marks];

    if(newMarks[spot] !== ""){
      return;
    }

    if(turn){
      newMarks[spot] = `O${count.current}`;
      setMarks(newMarks);
      setPlayer(prev => ({...prev, o: [...prev.o, spot]}));
    } else {
      newMarks[spot] = `X${count.current}`; 
      setMarks(newMarks);
      setPlayer(prev => ({...prev, x: [...prev.x, spot]}));
    }

    /* 남은 칸수가 3개일 때 처음에 배치한 O,X부터 순서대로 없어진다. */
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

  /* 보드판 크기에 따라 승리 조건을 정의하는 조합 */
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

  /*  */
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

  /* 승리 확인 */
  function winConditionCheck(play, spot, gap) {
    let test = [];
    let sqrt = Math.sqrt(marks.length);

    for(let gapIdx=0; gapIdx<gap.length; gapIdx++) {
      test = Array(sqrt).fill(spot).map((_, idx) => spot + idx * gap[gapIdx]);

      if(test.every(val => play.includes(val))){
        test.forEach(winIdx => {
          winColor.current[winIdx].style.color = turn ? "red" : "blue";
        })

        setResult(`${turn ? "X" : "O"} WIN`);
        return;
      }
    }
  }

  /* 재시작 (초기화) */
  function restartHandler() {
    setMarks(prev => Array(parseInt(prev.length)).fill(""))
    setPlayer({o: [], x: []})
    setResult("");
    count.current = 0;
    for (const key in winColor.current) {
        if(winColor.current[key]){ 
          // ViewComponent.jsx:126 Uncaught TypeError: Cannot read properties of null (reading 'style') - Error
          winColor.current[key].style.color = "black";
        }
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
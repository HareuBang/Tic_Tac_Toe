import React, { useEffect, useMemo, useRef, useState } from 'react';
import './sass/View.scss'

const ViewComponent = () => {
  // O X가 그려질 보드판
  const [marks, setMarks] = useState(Array(9).fill(""));
  const [player, setPlayer] = useState({o: [], x: []});
  const [result, setResult] = useState("");      
  const [turn, setTurn] = useState(false);

  const [boardWh, setBoardWH] = useState("350px");

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
  }, [])

  function markHandler(spot) {
    const newMarks = [...marks];

    if(newMarks[spot] !== ""){              // 중복 선택 방지
      return;
    }

    if(turn){                               // turn : true
      newMarks[spot] = "O";
      setMarks(newMarks);
      setPlayer(prev => ({...prev, o: [...prev.o, spot]}));
    } else {                                // turn : false 
      newMarks[spot] = "X"; 
      setMarks(newMarks);
      setPlayer(prev => ({...prev, x: [...prev.x, spot]}));
    }

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
        setResult(`~~ ! ${turn ? "X" : "O"} WINNER ! ~~`);
        return;
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
        <button className='Omark' onClick={() => setTurn(true)}>O</button>
        <button className='Xmark' onClick={() => setTurn(false)}>X</button>
      </div>
      <div className='boardContainer' style={{width: boardWh, height: boardWh}}>
        {
          marks.map((mark, idx) => (
            <div 
              key={idx} 
              className='board' 
              value={idx} 
              onClick={() => markHandler(idx)}
            > {mark}
            </div>
          ))
        }
      </div>
      <div className='footer'>
        <span>{result}</span>
        <br />
        <button className='reset'>RESET</button>
      </div>
    </div>
  );
};

export default ViewComponent;
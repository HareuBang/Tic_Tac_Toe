# Tic-Tac-Toe

https://hareubang.github.io/Tic_Tac_Toe/

<!-- # 24-09-01

1. 변수명 여러개 반복문으로 생성

a. 객체를 사용하여 만들기
const marks = {};
for(let i=0; i<10; i++) {
marks[`marks${i}`] = i;

/_
{
mark0: 0,
mark1: 1,
mark2: 2,
...
}
_/
}

b. 배열을 사용하여 만들기
const marks = [];
for(let i=0; i<10; i++) {
marks.push(`marks${i}`);
}
/_
['mark0', 'mark1', 'mark2' ...];
_/

c. React 컴포넌트 내에서 사용하기
import React, { useState } from 'react';

function App() {
// 상태를 정의합니다.
const [marks, setMarks] = useState({});

// 클릭 핸들러 함수를 정의합니다.
const handleClick = () => {
const newMarks = {};
for (let i = 0; i < 9; i++) {
newMarks[`mark${i}`] = i;
}
setMarks(newMarks);
};

return (

<div>
<button onClick={handleClick}>Generate Marks</button>
<pre>{JSON.stringify(marks, null, 2)}</pre>
</div>
);
}

export default App;

버튼 클릭 시 mark0부터 mark8까지의 변수명을 객체 형태로 생성하여 상태에 저장합니다. 상태가 업데이트되면 UI에 해당 객체가 출력됩니다.

2. React에서 'useState'를 동적으로 사용, 관리

a. 객체를 사용하여 관리

# 24-09-02

# 24-09-03 -->

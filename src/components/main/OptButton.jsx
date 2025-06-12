import { useState } from 'react'



function OptButton({mode, setMode}) {


  return (
    <div>
      <button onClick={() => setMode("location")}>loca</button>
      <button onClick={() => setMode("search")}>search</button>
    </div>
  );
}

export default OptButton;
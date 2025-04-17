'use client'

export default function Asset2() {



  function handleAddShape() {
    console.log("add")
  }
  function handle1() {
    console.log("1")
  }
  function handle2() {
    console.log("2")
  }
  function handle3() {
    console.log("3")
  }
  return (
    <main className="flex justify-center flex-wrap p-6 m-20 gap-20 w-full">
      
      <div className="flex justify-center p-2 w-210 gap-5 rounded-md my-special">
        <button className=" rounded-full p-2 bg-green-400" type="button" onClick={handleAddShape} >Add Shape</button>
        <button className=" rounded-full p-2 bg-green-400" type="button" onClick={handle1} > Shape</button>
        <button className=" rounded-full p-2 bg-green-400" type="button" onClick={handle2} >Shape</button>
        <button className=" rounded-full p-2 bg-green-400" type="button" onClick={handle3} >Shape</button>
      </div>
      <div className="flex justify-center w-210 h-297 rounded-4xl p-2 shadow-xl my-special">
        
      </div>  
    </main>
  );
}

import './index.css'
export default function Hello ({ enterAction }) {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 class='text-3xl font-bold underline'>你好，Hello</h1>
      <h2 class="">插件应用进入参数送上</h2>
      <pre>
        {JSON.stringify(enterAction, undefined, 2)}
      </pre>
    </div>
  )
}

'use client'

const Footer = () => {
    return (
        <footer className='h-8 bg-slate-700 flex justify-center items-center px-12 text-white'>
           <p className='font-thin text-sm'>{new Date().getFullYear()} &copy; <a href='https://www.linkedin.com/in/clara-gon%C3%A7alves-ribeiro-66b07a213/'>Clara Ribeiro</a></p>
        </footer>
    )
}

export default Footer
import React, { useState } from 'react'
import './log.css';
import { CreateUser } from '../API';
import { useDispatch } from 'react-redux';
import { logInAsync } from './storage/authSlice';


function Log() {
const dispach= useDispatch();
    const[vista, setVista]= useState(false);
    const click=()=>setVista(!vista);

const [login, setlogin]= useState({
    email:"",
    password:""
});
const [create, setCreate]= useState({
        name:"",
        email:"",
        password:""
});

const handleChangeLogin=(e)=>{
    setlogin({...login,[e.target.name]:e.target.value});
}

const handleChageCreate=(e)=>{
    setCreate({...create,[e.target.name]:e.target.value});
}

const handleLog = async()=>{
     dispach(logInAsync(login));
}

const handleClick = async()=>{
    await CreateUser(create)
    dispach(logInAsync({email:create.email, password:create.password}));
}
const handleSubmit = (e)=>{
    e.preventDefault();
}

    
  return (
    <div className='fondo_form'>
        <div className='contenedor_form'> 
        <div className='Cs'> 
           
            
            </div>
            {
                vista=== false?
                <div className='form_todo'>
                    <button className='botones_s' onClick={click}>Crear Cuenta</button>
                 
                    <div className='title'>

                    <h2>Comencemos a Trabajar </h2>
                    </div>
                    <div className='formu'>
                    <form onSubmit={handleSubmit}>
                        <label>Correo Electronico: </label>
                        <input 
                        type='text' 
                        value={login.email}
                        onChange={handleChangeLogin}
                        name='email'
                        size={40}
                        placeholder='Gmail'/>
                        <br />
                        <label>Contaseña: </label>
                        <input 
                        type='password' 
                        value={login.password}
                        onChange={handleChangeLogin}
                        name='password'
                        size={40}
                        placeholder='Ingrese contaseña'/> 

                        <br />

                        <button  className='inicioP' onClick={handleLog}>Iniciar Secion </button>
                    </form>
                    </div>

                </div>:
                <div className='form_todo title1'>
                    <button  className='botones_s' onClick={click}>Inica Sesion</button>
                  <div>
                    <h2>Registrate ya.! Veras como todo es mas facil</h2>
                    </div> 
                    <div className='formu'>
                        <form>
                            <label>Nombre</label>
                            <input
                             type='text'
                             name='name'
                             value={create.name}
                             onChange={handleChageCreate}
                            size={40}
                            placeholder='Ingresa tu nombre'/>
                            <br />

                            <label>Correo Electronico</label>
                            <input 
                            type='text' 
                            name='email'
                            value={create.email}
                            onChange={handleChageCreate}
                            size={40}
                            placeholder='Gamil'/>
                            <br />

                            <label>Contraseña</label>
                            <input
                             type='password'
                             name='password'
                             value={create.password}
                             onChange={handleChageCreate}
                            size={40}
                            placeholder='Ingresa tu contraseña'/>
                            <br />

                            <button  className='inicioP' onClick={handleClick}>Crear Cuenta</button>
              

                            
                        </form>
                    </div>
                </div>
            }

            <div>
                
            </div>
        </div>
    </div>

  )
}

export default Log
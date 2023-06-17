import React from 'react'
import "../App.css";
import Log from '../userLog/Log';
function Portal() {
  return (
    <div className='fondo'>
        <div className='navar'> 
        <strong><p>Gestor de Negocios</p></strong>
        <p>UMG</p>
        </div>
        <div className='posiciones'>
            <div className='slogan'>

              <h1>  Guatemala Crece contigo</h1>

              <p className='info'>Gestiona todas tus transacciones en un mismo lugar 
                facil y rapido. Registrate ya.
              </p>
            </div>

            <div className='cont_log'>
                <Log/>
              
            </div>
            

         

        </div>

    </div>
  )
}

export default Portal
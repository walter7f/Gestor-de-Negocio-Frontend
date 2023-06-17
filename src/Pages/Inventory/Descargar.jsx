import React,{useEffect, useState}from 'react'
import { Button, Spin } from 'antd';
import { getProducto } from '../../API';
import { useSelector } from 'react-redux';
import XLSX from 'xlsx';
import { FileExcelFilled } from '@ant-design/icons';

function Descargar() {
    const idUser = useSelector(state => state.auth.idUser);
    const [producto, setClientes] = useState([]);
    const [descargar, setDescargar] = useState(false);


    useEffect(() => {
        getProducto(idUser).then((remoteTodos) => {
          setClientes(remoteTodos)

        })
      }, [idUser]);

  const handleDownload = () => {
    setDescargar(true);

    const libro = XLSX.utils.book_new();

    const hoja = XLSX.utils.json_to_sheet(producto);

    XLSX.utils.book_append_sheet(libro, hoja, "Productos");

    setTimeout(() => {
      XLSX.writeFile(libro, "ReporteProductos.xlsx");
      setDescargar(false);
    }, 1000);
  };
  return (
    <>
    {!descargar ? (
        <Button style={{ backgroundColor: 'green', color: 'white' }} onClick={handleDownload}>
          <FileExcelFilled />Descargar reporte
        </Button>
      ) : (
        <Button color="success" disabled>
          <Spin></Spin>
          <span> Generando...</span>
        </Button>
      )}
    
    </>
  )
}

export default Descargar
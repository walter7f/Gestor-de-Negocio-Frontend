import { Space, Table, Typography, Button, Modal, Form, Input, } from "antd";
import { DeleteFilled, EditFilled, ContainerFilled, UsergroupAddOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { getClientes, CreateCliente, UpdateCliente} from "../../API";
import axios from "axios";
import { useSelector } from "react-redux";
import Descargar from "./Descargar";

function Customers() {
  const idUser = useSelector(state => state.auth.idUser)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actualizar, setActualizar]= useState(false);
  const [idC, setIdC]= useState('');
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [dataCliente, setDataCliente] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: '',
    id_user: idUser
  });

  const formRef = useRef(null);

  const handleChange = (e) => {
    setDataCliente({ ...dataCliente, [e.target.name]: e.target.value });
  }
  const datosEnviar = async () => {
    await CreateCliente(dataCliente).then(() => {
      getClientes(idUser).then((remoteTodos) => {
        setClientes(remoteTodos);
      })
    })
    formRef.current.resetFields();
  }
  const deleteCliente =async(id)=>{
    await axios.delete(`http://localhost:3800/api/admin/cliente/${id}`).then(()=>{
       getClientes(idUser).then((remoteTodos)=>{
         setClientes(remoteTodos);
       });
     });
 
   }

   const actualizarCliente= async()=>{
     await UpdateCliente(idC,dataCliente).then(() => {
      getClientes(idUser).then((remoteTodos) => {
        setClientes(remoteTodos);
      })
    })
    formRef.current.resetFields();
   }



  const onFinishFailed = (errorInfo) => {
    console.log('Form error:', errorInfo);
  };

  const [clientes, setClientes] = useState([]);


  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getClientes(idUser).then((remoteTodos) => {
      setClientes(remoteTodos)
      setLoading(false);
    })
  }, [idUser]);

  const handleActualizar =()=>{
    setActualizar(true);
  }
  const handleSubmit = (e) => {
    formRef.current.resetFields();
  };
  return (
    <>
    



      <Space size={20} direction="vertical">
        <Typography.Title level={4}>Clientes</Typography.Title>

        <Button type="primary" onClick={()=>{showModal(); setActualizar(false)}}> <UsergroupAddOutlined />Agregar Nuevo Cliente
      </Button>
      <Descargar/> 
      <Modal title={actualizar===false? "Agregar nuevo Cliente":"Actualizar Cliente"} open={isModalOpen} onCancel={handleCancel} onOk={handleOk}>

        <Form
         ref={formRef}
          onFinish={handleSubmit}
          onFinishFailed={onFinishFailed}
          layout="vertical"
        >
          <Form.Item
            label="Nombre"
            name="nombre"
            rules={[
              {
                required: true,
                message: 'Por favor ingresa el nombre',
              },
            ]}
          >
            <Input
              type='text'
              value={dataCliente.nombre}
              name='nombre'
              onChange={handleChange}
              placeholder='Ingrese el nombre'
            />
          </Form.Item>

          <Form.Item
            label="Apellido"
            name="apellido"
            rules={[
              {
                required: true,
                message: 'Por favor ingresa el apellido',
              },
            ]}
          >
            <Input
              type="text"
              value={dataCliente.apellido}
              name='apellido'
              onChange={handleChange}
              placeholder='ingrese el apellido' />
          </Form.Item>

          <Form.Item
            label="Telefono"
            name="telefono"
            rules={[
              {
                required: true,
                message: 'Por favor ingresa el telefono',
              },
            ]}
          >
            <Input
              type='text'
              value={dataCliente.telefono}
              name='telefono'
              onChange={handleChange}
              placeholder='ingrese el telefono' />
          </Form.Item>

          <Form.Item
            label="Direccion"
            name="direccion"
            rules={[
              {
                required: true,
                message: 'Por favor ingresa la direccion',
              },
            ]}
          >
            <Input
              type='text'
              value={dataCliente.direccion}
              name='direccion'
              onChange={handleChange}
              placeholder='ingrese la direccion' />
          </Form.Item>

          <Form.Item>
            {actualizar === false?<Button type="primary" onClick={() => {
              datosEnviar();
              handleCancel();
            }}>
              Crear
            </Button>:
            <Button type="primary" onClick={()=>{
              actualizarCliente();
              handleCancel();
            }}>actualizar</Button> }
          </Form.Item>
        </Form>

      </Modal>


        <Table
          loading={loading}
          columns={[
            {
              title: "Nombre",
              dataIndex: "nombre",
            },
            {
              title: "Apellido",
              dataIndex: "apellido",
            },
            {
              title: "Telefono",
              dataIndex: "telefono",
            },

            {
              title: "direccion",
              dataIndex: "direccion",
            },
            {
              title: "Operaciones",
              dataIndex: 'operaciones',
              render: (_, record) => {
                return (<>

                  <Button  onClick={()=>{
                    handleActualizar()
                    setIdC(record.id)
                    showModal();
                  }}
                  ><EditFilled /></Button>
                  <Button onClick={()=>{deleteCliente(record.id)}}
                  ><DeleteFilled /></Button>
                </>
                )
              }
            }
          ]}
          
          dataSource={clientes}
          pagination={{
            pageSize: 6,
          }}
          rowKey='id'
        ></Table>
      </Space>

    </>
  );
}
export default Customers;

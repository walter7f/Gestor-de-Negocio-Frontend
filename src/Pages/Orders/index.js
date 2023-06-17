import { Space, Table, Typography, Button, Modal, Form, Input, Dropdown } from "antd";
import { useEffect, useState, useRef } from "react";
import { DeleteFilled, EditFilled, ContainerFilled, UsergroupAddOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import axios from "axios";
import { CreateProveedor, getProveedores } from "../../API";
import Descargar from "./Descargar";

function Proveedores() {
  const idUser = useSelector(state => state.auth.idUser)
  const [loading, setLoading] = useState(false);
  const [proveedor, setProveedor] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [dataProveedor, setDataProveedor] = useState({
    empresa: '',
    contacto: '',
    puesto: '',
    direccion: '',
    telefono: '',
    id_user: idUser
  });

  const formRef = useRef(null);

  const handleChange = (e) => {
    setDataProveedor({ ...dataProveedor, [e.target.name]: e.target.value });
  }
  const datosEnviar = async () => {
    await CreateProveedor(dataProveedor).then(() => {
      getProveedores(idUser).then((remoteTodos) => {
        setProveedor(remoteTodos);
      })
    })
    formRef.current.resetFields();
  }
  const deleteProveedor = async (id) => {
    await axios.delete(`http://localhost:3800/api/admin/proveedor/${id}`).then(() => {
      getProveedores(idUser).then((remoteTodos) => {
        setProveedor(remoteTodos);
      });
    });

  }
  const onFinishFailed = (errorInfo) => {
    console.log('Form error:', errorInfo);
  };


  useEffect(() => {
    setLoading(true);
    getProveedores(idUser).then((remoteTodos) => {
      setProveedor(remoteTodos)
      setLoading(false);
    })
  }, [idUser]);
  const handleSubmit = (e) => {
    formRef.current.resetFields();
  };


  const handleMenuItemClick = (id) => {
    console.log('ID seleccionada:', id);
    // Realizar cualquier acción adicional con el ID seleccionado
  };
  return (
   <>
    <Space size={20} direction="vertical">
      <Typography.Title level={4}>Proveedores</Typography.Title>

      <Button type="primary" onClick={showModal}> <UsergroupAddOutlined />Agregar Nuevo Proveedor
      </Button>
     <Descargar/> 
      <Modal title="Agregar nuevo Proveedor" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>

        <Form
          ref={formRef}
          onFinish={handleSubmit}
          onFinishFailed={onFinishFailed}
          layout="vertical"
        >
          <Form.Item
            label="Empresa"
            name="empresa"
            rules={[
              {
                required: true,
                message: 'Por favor ingresa la empresa',
              },
            ]}
          >
            <Input
              type='text'
              value={dataProveedor.empresa}
              name='empresa'
              onChange={handleChange}
              placeholder='Ingrese la empresa'
            />
          </Form.Item>

          <Form.Item
            label="Contacto"
            name="contacto"
            rules={[
              {
                required: true,
                message: 'Por favor ingresa el contancto',
              },
            ]}
          >
            <Input
              type="text"
              value={dataProveedor.contacto}
              name='contacto'
              onChange={handleChange}
              placeholder='ingrese el contacto' />
          </Form.Item>

          <Form.Item
            label="Puesto"
            name="Puesto"
            rules={[
              {
                required: true,
                message: 'Por favor ingresa el puesto',
              },
            ]}
          >
            <Input
              type='text'
              value={dataProveedor.puesto}
              name='puesto'
              onChange={handleChange}
              placeholder='ingrese el puesto' />
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
              value={dataProveedor.direccion}
              name='direccion'
              onChange={handleChange}
              placeholder='ingrese la direccion' />
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
              value={dataProveedor.telefono}
              name='telefono'
              onChange={handleChange}
              placeholder='ingrese el numero de telefono' />
          </Form.Item>

          <Form.Item>
            <Button type="primary" onClick={() => {
              datosEnviar();
            }}>
              Crear
            </Button>
          </Form.Item>
        </Form>

      </Modal>



      <Table
        loading={loading}
        columns={[
          {
            title: "Empresa",
            dataIndex: "empresa",
          },
          {
            title: "Contacto",
            dataIndex: "contacto",
          },
          {
            title: "Puesto",
            dataIndex: "puesto",
          },
          {
            title: "Direccion",
            dataIndex: "direccion",
          },
          {
            title: "Telefono",
            dataIndex: "telefono",
          },
          {
            title: "Operaciones",
            dataIndex: 'operaciones',
            render: (_, record) => {
              return (<>

                <Button><EditFilled /></Button>
                <Button onClick={()=>{deleteProveedor(record.id)}}
                ><DeleteFilled /></Button>
              </>
              )
            }
          }
        ]}
        dataSource={proveedor}
        pagination={{
          pageSize: 5,
        }}
        rowKey='id'
      ></Table>
    </Space>

    </> 

  );
}
export default Proveedores;

import { Space, Table, Typography,Button, Modal, Form, Input} from "antd";
import { useEffect, useState, useRef } from "react";
import { DeleteFilled, EditFilled, ContainerFilled, UsergroupAddOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import axios from "axios";
import { CreateProducto, UpdateProducto, getProducto } from "../../API";
import Descargar from "./Descargar";


function Inventory() {
  const idUser = useSelector(state => state.auth.idUser)
  const [loading, setLoading] = useState(false);
  const [producto, setProducto] = useState([]);
  const [actualizar, setActualizar]= useState(false);
  const [idC, setIdC]= useState('');
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

  const [dataProducto, setDataProducto] = useState({
    categoria: '',
    nombreProducto: '',
    presioUnitario: '',
    marca: '',
    cantidad: '',
    id_user: idUser,
  });

  const formRef = useRef(null);

  const handleChange = (e) => {
    setDataProducto({ ...dataProducto, [e.target.name]: e.target.value });
  }
  const datosEnviar = async () => {
    await CreateProducto(dataProducto).then(() => {
      getProducto(idUser).then((remoteTodos) => {
        setProducto(remoteTodos);
      })
    })
    formRef.current.resetFields();
  }

  const deleteProducto = async (id) => {
    await axios.delete(`http://localhost:3800/api/admin/producto/${id}`).then(() => {
      getProducto(idUser).then((remoteTodos) => {
        setProducto(remoteTodos);
      });
    });

  }
  const actualizarProducto= async()=>{
    await UpdateProducto(idC,dataProducto).then(() => {
     getProducto(idUser).then((remoteTodos) => {
       setProducto(remoteTodos);
     })
   })
   formRef.current.resetFields();
  }
  
  const onFinishFailed = (errorInfo) => {
    console.log('Form error:', errorInfo);
  };
  useEffect(() => {
    setLoading(true);
    getProducto(idUser).then((remoteTodos) => {
      setProducto(remoteTodos)
      setLoading(false);
    })
  }, [idUser]);

  const handleActualizar =()=>{
    setActualizar(true);
  }
  const handleSubmit = (e) => {
    formRef.current.resetFields();
  };

  const [input, setInput]= useState('')
  const handleInput=(e)=>{
    setInput(e.target.value)
  }


  
  return (
    <Space size={20} direction="vertical">
      <Typography.Title level={4}>Inventario de Productos </Typography.Title>

      <Button type="primary" onClick={()=>{showModal(); setActualizar(false) }}> <UsergroupAddOutlined />Agregar Nuevo Prodcuto
      </Button>
      <Descargar/>
      <Modal title={actualizar===false? "Agregar Producto":"Actualizar Producto"}  open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>

        <Form
          ref={formRef}
          onFinish={handleSubmit}
          onFinishFailed={onFinishFailed}
          layout="horizontal"
        >
          <Form.Item
            label="Producto"
            name="nombreProducto"
            rules={[
              {
                required: true,
                message: 'Por favor ingresa el producto',
              },
            ]}
          >
            <Input
              type='text'
              value={dataProducto.nombreProducto}
              name='nombreProducto'
              onChange={handleChange}
              placeholder='Ingrese el producto'
            />
          </Form.Item>

          <Form.Item
            label="Precio Unit"
            name="presioUnitario"
            rules={[
              {
                required: true,
                message: 'Por favor ingresa el precio',
              },
            ]}
          >
            <Input
              type='text'
              value={dataProducto.presioUnitario}
              name='presioUnitario'
              onChange={handleChange}
              placeholder='ingrese el precio' />
          </Form.Item>

          <Form.Item
            label="Categoria"
            name="categoria"
            rules={[
              {
                required: true,
                message: 'Por favor ingresa la categoria',
              },
            ]}
          >
            <Input
              type='text'
              value={dataProducto.categoria}
              name='categoria'
              onChange={handleChange}
              placeholder='ingrese la categoria' />
          </Form.Item>

          <Form.Item
            label="Marca"
            name="marca"
            rules={[
              {
                required: true,
                message: 'Por favor ingresa la marca',
              },
            ]}
          >
            <Input
              type='text'
              value={dataProducto.marca}
              name='marca'
              onChange={handleChange}
              placeholder='ingrese la marca' />
          </Form.Item>

          <Form.Item
            label="Cantidad"
            name="cantidad"
            rules={[
              {
                required: true,
                message: 'Por favor ingresa la cantidad',
              },
            ]}
          >
            <Input
              type='number'
              value={dataProducto.cantidad}
              name='cantidad'
              onChange={handleChange}
              placeholder='ingrese la cantidad' />
          </Form.Item>

          <Form.Item>
          {actualizar === false?<Button type="primary" onClick={() => {
              datosEnviar();
              handleCancel();
            }}>
              Crear
            </Button>:
            <Button type="primary" onClick={()=>{
              actualizarProducto();
              handleCancel();
            }}>actualizar</Button> }
          </Form.Item>
        </Form>

      </Modal>

      <input
            type='search'
            size={50}
            value={input}
            onChange={handleInput}
            placeholder='Serch..'/>
      <Table
        loading={loading}
        columns={[
          {
            title: "Producto",
            dataIndex: "nombreProducto",
          },
          {
            title: "Precio",
            dataIndex: "presioUnitario",
            render: (value) => <span>Q{value}</span>,
          },
          {
            title: "Marca",
            dataIndex: "marca",
          },
          {
            title: "Categoria",
            dataIndex: "categoria",
          },

          {
            title: "Cantidad",
            dataIndex: "cantidad",
          },
          {
            title: "Operaciones",
            dataIndex: 'operaciones',
            render: (_, record) => {
              return (<>

                <Button onClick={()=>{
                    handleActualizar()
                    setIdC(record.id)
                    showModal();
                }}><EditFilled /></Button>
                <Button onClick={()=>{deleteProducto(record.id)}}
                ><DeleteFilled /></Button>

              </>
              )
            }
          }
        ]}
        dataSource={producto.filter((item)=> item.nombreProducto.toLowerCase().indexOf(input) ? item.nombreProducto===input:true)}
        pagination={{
          pageSize: 5,
        }}
        rowKey='id'
      ></Table>
    </Space>
  );
}
export default Inventory;

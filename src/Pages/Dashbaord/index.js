import {
  DollarCircleOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  UserOutlined,
  UsergroupAddOutlined,
  DeleteFilled,
  EditFilled,
  FileExcelFilled,
} from "@ant-design/icons";
import { Card, Space, Statistic, Table, Typography,  Button, Modal, Form, Input, Spin} from "antd";
import { useEffect, useState, useRef } from "react";
import { CreaeVentas, CreateCompras, getClientes, getCrompras, getCustomers, getInventory, getOrders, getProducto, getRevenue, getVentas } from "../../API";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useSelector } from "react-redux";
import axios from "axios";
import XLSX from 'xlsx';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const idUser = useSelector(state => state.auth.idUser)
  const [orders, setOrders] = useState(0);
  const [inventory, setInventory] = useState(0);
  const [customers, setCustomers] = useState(0);
  const [revenue, setRevenue] = useState(0);


  console.log(customers);

  useEffect(() => {
    getClientes(idUser).then((remoteTodos) => {
      setCustomers(remoteTodos.length);
    });

    getProducto(idUser).then((remoteTodos) => {
      setInventory(remoteTodos.length);
    });
    
      getCrompras(idUser).then((remoteTodos) => {
        setOrders(remoteTodos.length);
      });
    getVentas(idUser).then((remoteTodos) => {
      setRevenue(remoteTodos.length);
    });
    getCustomers().then((res) => {
      setCustomers(res.total);
    });
  }, [idUser]);

  return (
    <Space size={20} direction="vertical">
      <Space direction="horizontal">
        <DashboardCard
          icon={
            <ShoppingCartOutlined
              style={{
                color: "green",
                backgroundColor: "rgba(0,255,0,0.25)",
                borderRadius: 20,
                fontSize: 24,
                padding: 8,
              }}
            />
          }
          title={"Compras"}
          value={orders}
        />
        <DashboardCard
          icon={
            <ShoppingOutlined
              style={{
                color: "blue",
                backgroundColor: "rgba(0,0,255,0.25)",
                borderRadius: 20,
                fontSize: 24,
                padding: 8,
              }}
            />
          }
          title={"Inventario"}
          value={inventory}
        />
        <DashboardCard
          icon={
            <UserOutlined
              style={{
                color: "purple",
                backgroundColor: "rgba(0,255,255,0.25)",
                borderRadius: 20,
                fontSize: 24,
                padding: 8,
              }}
            />
          }
          title={"Clientes"}
          value={customers}
        />
        <DashboardCard
          icon={
            <DollarCircleOutlined
              style={{
                color: "red",
                backgroundColor: "rgba(255,0,0,0.25)",
                borderRadius: 20,
                fontSize: 24,
                padding: 8,
              }}
            />
          }
          title={"Ventas"}
          value={revenue}
        />
      </Space>

      <Space>
        <Ventas/>
        <GraficasVenta/>
      </Space>

      <Space>
        <RecentOrders />
        <DashboardChart />
      </Space>
     
    </Space>
  );
}

function DashboardCard({ title, value, icon }) {
  return (
    <Card>
      <Space direction="horizontal">
        {icon}
        <Statistic title={title} value={value} />
      </Space>
    </Card>
  );
}
function RecentOrders() {
  const idUser= useSelector(state => state.auth.idUser)
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actualizar, setActualizar]= useState(false);
  //const [idC, setIdC]= useState('');
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [dataVentas, setDataVentas] = useState({
    producto: '',
    categoria: '',
    presioUnitario: '',
    marca: '',
    cantidad:'',
    id_user: idUser
  });

  const formRef = useRef(null);

  const handleChange = (e) => {
    setDataVentas({ ...dataVentas, [e.target.name]: e.target.value });
  }
  const datosEnviar = async () => {
    await CreateCompras(dataVentas).then(() => {
      getCrompras(idUser).then((remoteTodos) => {
        setCompras(remoteTodos);
      })
    })
    formRef.current.resetFields();
  }
  const deleteCompras =async(id)=>{
    await axios.delete(`http://localhost:3800/api/admin/compras/${id}`).then(()=>{
       getCrompras(idUser).then((remoteTodos)=>{
         setCompras(remoteTodos);
       });
     });
 
   }

   const onFinishFailed = (errorInfo) => {
    console.log('Form error:', errorInfo);
  };

  useEffect(() => {
    setLoading(true);
    getCrompras(idUser).then((res) => {
      setCompras(res);
      setLoading(false);
    });
  }, [idUser]);
  const handleSubmit = (e) => {
    formRef.current.resetFields();
  };

  const [descargar, setDescargar] = useState(false);

  const handleDownload = () => {
    setDescargar(true);

    const libro = XLSX.utils.book_new();

    const hoja = XLSX.utils.json_to_sheet(compras);

    XLSX.utils.book_append_sheet(libro, hoja, "Compras");

    setTimeout(() => {
      XLSX.writeFile(libro, "ReporteCompras.xlsx");
      setDescargar(false);
    }, 1000);
  };

  const [input, setInput]= useState('')
  const handleInput=(e)=>{
    setInput(e.target.value)
  }

  return (
    <>
      <Typography.Text> Compras </Typography.Text>
      <Button type="primary" onClick={()=>{showModal(); setActualizar(false)}}> <UsergroupAddOutlined />
      Registrar Compras
      </Button>
      <Modal title={actualizar===false? "Registrar Compra":"Actualizar Compra"} open={isModalOpen} onCancel={handleCancel} onOk={handleOk}>

        <Form
         ref={formRef}
          onFinish={handleSubmit}
          onFinishFailed={onFinishFailed}
          layout="Horizontal"
        >
          <Form.Item
          
            label="Producto"
            name="producto"
            rules={[
              {
                required: true,
                message: 'Por favor ingresa el Producto',
              },
            ]}
          >
            <Input
              type='text'
              value={dataVentas.producto}
              name='producto'
              onChange={handleChange}
              placeholder='Ingrese el producto'
            />
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
              type="text"
              value={dataVentas.categoria}
              name='categoria'
              onChange={handleChange}
              placeholder='ingrese la categoria' />
          </Form.Item>

          <Form.Item
            label="Presio Unidad"
            name="presioUnitario"
            rules={[
              {
                required: true,
                message: 'Por favor ingresa el presio por unidad',
              },
            ]}
          >
            <Input
              type='number'
              value={dataVentas.presioUnitario}
              name='presioUnitario'
              onChange={handleChange}
              placeholder='ingrese el presio' />
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
              value={dataVentas.marca}
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
                message: 'Por favor ingrese la cantidad',
              },
            ]}
          >
            <Input
              type='number'
              value={dataVentas.cantidad}
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
              handleCancel();
            }}>actualizar</Button> }
          </Form.Item>
        </Form>

      </Modal>
      {!descargar ? (
        <Button style={{ backgroundColor: 'green', color: 'white' }} onClick={handleDownload}>
        < FileExcelFilled/>  Descargar reporte
        </Button>
      ) : (
        <Button color="success" disabled>
          <Spin></Spin>
          <span> Generando...</span>
        </Button>
      )}
      <input
            type='search'
            size={70}
            value={input}
            onChange={handleInput}
            placeholder='Buscar por marca.. '/>
      <Table
        columns={[
          {
            title: "Producto",
            dataIndex: "producto",
          },
          {
            title: "Categoria",
            dataIndex: "categoria",
          },
          {
            title: "Presio Unitario",
            dataIndex: "presioUnitario",
          },
          {
            title: "Marca",
            dataIndex: "marca",
          },
          {
            title: "Cantidad",
            dataIndex: "cantidad",
          },
          {
            title: "Operaciones",
            dataIndex: "operaciones",
            render: (_, record) => {
              return (<>
                <Button><EditFilled /></Button>
                <Button onClick={()=>{deleteCompras(record.id)}}><DeleteFilled /></Button>
              </>
              )
            }
          },
        ]}
        loading={loading}
        dataSource={compras.filter((item)=> item.marca.toLowerCase().indexOf(input) ? item.marca===input:true)}
        pagination={4}
        rowKey='id'
      ></Table>
    </>
  );
}

function Ventas() {
  const idUser = useSelector(state => state.auth.idUser)
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actualizar, setActualizar]= useState(false);
  //const [idC, setIdC]= useState('');
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [dataVentas, setDataVentas] = useState({
    producto: '',
    categoria: '',
    presioUnitario: '',
    marca: '',
    cantidad:'',
    id_user: idUser
  });

  const formRef = useRef(null);

  const handleChange = (e) => {
    setDataVentas({ ...dataVentas, [e.target.name]: e.target.value });
  }
  const datosEnviar = async () => {
    await CreaeVentas(dataVentas).then(() => {
      getVentas(idUser).then((remoteTodos) => {
        setVentas(remoteTodos);
      })
    })
    formRef.current.resetFields();
  }
  const deleteVentas =async(id)=>{
    await axios.delete(`http://localhost:3800/api/admin/venta/${id}`).then(()=>{
       getVentas(idUser).then((remoteTodos)=>{
         setVentas(remoteTodos);
       });
     });
 
   }

   const onFinishFailed = (errorInfo) => {
    console.log('Form error:', errorInfo);
  };

  useEffect(() => {
    setLoading(true);
    getVentas(idUser).then((remoteTodos) => {
      setVentas(remoteTodos)
      setLoading(false);
    });
  }, []);
  const handleSubmit = (e) => {
    formRef.current.resetFields();
  };

  const [descargar, setDescargar] = useState(false);

  const handleDownload = () => {
    setDescargar(true);

    const libro = XLSX.utils.book_new();

    const hoja = XLSX.utils.json_to_sheet(ventas);

    XLSX.utils.book_append_sheet(libro, hoja, "Ventas");

    setTimeout(() => {
      XLSX.writeFile(libro, "ReporteVentast.xlsx");
      setDescargar(false);
    }, 1000);
  };

  const [input, setInput]= useState('')
  const handleInput=(e)=>{
    setInput(e.target.value)
  }


  return (
    <>
      <Typography.Text>Ventas</Typography.Text>
      <Button type="primary" onClick={()=>{showModal(); setActualizar(false)}}> <UsergroupAddOutlined />
      Registrar una nueva venta
      </Button>
      <Modal title={actualizar===false? "Registrar Nueva Venta":"Actualizar Cliente"} open={isModalOpen} onCancel={handleCancel} onOk={handleOk}>

        <Form
         ref={formRef}
          onFinish={handleSubmit}
          onFinishFailed={onFinishFailed}
          layout="Horizontal"
        >
          <Form.Item
          
            label="Producto"
            name="producto"
            rules={[
              {
                required: true,
                message: 'Por favor ingresa el Producto',
              },
            ]}
          >
            <Input
              type='text'
              value={dataVentas.producto}
              name='producto'
              onChange={handleChange}
              placeholder='Ingrese el producto'
            />
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
              type="text"
              value={dataVentas.categoria}
              name='categoria'
              onChange={handleChange}
              placeholder='ingrese la categoria' />
          </Form.Item>

          <Form.Item
            label="Presio Unidad"
            name="presioUnitario"
            rules={[
              {
                required: true,
                message: 'Por favor ingresa el presio por unidad',
              },
            ]}
          >
            <Input
              type='number'
              value={dataVentas.presioUnitario}
              name='presioUnitario'
              onChange={handleChange}
              placeholder='ingrese el presio' />
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
              value={dataVentas.marca}
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
                message: 'Por favor ingrese la cantidad',
              },
            ]}
          >
            <Input
              type='number'
              value={dataVentas.cantidad}
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
              handleCancel();
            }}>actualizar</Button> }
          </Form.Item>
        </Form>

      </Modal>
      {!descargar ? (
        <Button style={{ backgroundColor: 'green', color: 'white' }} onClick={handleDownload}>
        < FileExcelFilled/>  Descargar reporte
        </Button>
      ) : (
        <Button color="success" disabled>
          <Spin></Spin>
          <span> Generando...</span>
        </Button>
      )}
    
        <input
            type='search'
            size={70}
            value={input}
            onChange={handleInput}
            placeholder='Buscar por Categoria'/>
            
      <Table
        columns={[
          {
            title: "Producto",
            dataIndex: "producto",
          },
          {
            title: "Categoria",
            dataIndex: "categoria",
          },
          {
            title: "Presio Unitario",
            dataIndex: "presioUnitario",
          },
          {
            title: "Marca",
            dataIndex: "marca",
          },
          {
            title: "Cantidad",
            dataIndex: "cantidad",
          },
          {
            title: "Operaciones",
            dataIndex: "operaciones",
            render: (_, record) => {
              return (<>

                <Button><EditFilled /></Button>
                <Button onClick={()=>{deleteVentas(record.id)}}
                ><DeleteFilled /></Button>
              </>
              )
            }
          },
        ]}
        loading={loading}
        dataSource={ventas.filter((item)=> item.categoria.toLowerCase().indexOf(input) ? item.categoria===input:true)}
        pagination={4}
        rowKey='id'
      ></Table>
    </>
  );
}

function DashboardChart() {
  const idUser = useSelector(state => state.auth.idUser)
  const [reveneuData, setReveneuData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
    getCrompras(idUser).then((remoteTodos) => {
      const totals = {};

      remoteTodos.forEach((cart) => {
        const marca = cart.marca;
        const cantidad = cart.cantidad;
    
        if (totals[marca] === undefined) {
          totals[marca] = cantidad;
        } else {
          totals[marca] += cantidad;
        }
      });
    
      const labels = Object.keys(totals);
      const data = Object.values(totals);


      const dataSource = {
        labels,
        datasets: [
          {
            label: "Revenue",
            data: data,
            backgroundColor: "rgba(255, 0, 0, 1)",
          },
        ],
      };

      setReveneuData(dataSource);
    });
  }, 2000);
  return () => {
    clearInterval(intervalId);
  };
  }, [idUser]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Order Revenue",
      },
    },
  };

  return (
    <Card style={{ width: 500, height: 250 }}>
      <Bar options={options} data={reveneuData} />
    </Card>
  );
}

function GraficasVenta() {
  const idUser = useSelector(state => state.auth.idUser)
  const [reveneuData, setReveneuData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {

    const intervalId = setInterval(() => {

      getVentas(idUser).then((remoteTodos) => {
  
        const totals = {};

        remoteTodos.forEach((cart) => {
          const marca = cart.marca;
          const cantidad = cart.cantidad;
      
          if (totals[marca] === undefined) {
            totals[marca] = cantidad;
          } else {
            totals[marca] += cantidad;
          }
        });
      
        const labels = Object.keys(totals);
        const data = Object.values(totals);
      const dataSource = {
        labels,
        datasets: [
          {
            label: "Datos de Productos",
            data: data,
            backgroundColor: "rgba(255, 0, 0, 1)",
          },
        ],
      };

      setReveneuData(dataSource);
    });
  }, 2000);
  return () => {
    clearInterval(intervalId); // Limpia el intervalo cuando el componente se desmonta
  };
  }, [idUser]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Ventas por categoria",
      },
    },
  };

  return (
    <Card style={{ width: 500, height: 250 }}>
      <Bar options={options} data={reveneuData} />
    </Card>
  );
}
export default Dashboard;

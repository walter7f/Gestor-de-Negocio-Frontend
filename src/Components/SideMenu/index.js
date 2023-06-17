import {
  AppstoreOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  UserDeleteOutlined
} from "@ant-design/icons";
import { Button, Menu } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { LogOut } from "../../userLog/storage/authSlice";

function SideMenu() {
  const dispach= useDispatch();
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState("/");

  useEffect(() => {
    const pathName = location.pathname;
    setSelectedKeys(pathName);
  }, [location.pathname]);

  const navigate = useNavigate();
  return (
    <div className="SideMenu">
      <Menu
        className="SideMenuVertical"
        mode="vertical"
        onClick={(item) => {
          //item.key
          navigate(item.key);
        }}
        selectedKeys={[selectedKeys]}
        items={[
          {
            label: "Dashbaord",
            icon: <AppstoreOutlined />,
            key: "/",
          },
          {
            label: "Inventario",
            key: "/inventory",
            icon: <ShopOutlined />,
          },
          {
            label: "Proveedores",
            key: "/orders",
            icon: <ShoppingCartOutlined />,
          },
          {
            label: "Clientes",
            key: "/customers",
            icon: <UserOutlined />,
          },
          {
            icon:<Button onClick={()=>{dispach(LogOut())}}><UserDeleteOutlined />Cerrar Sesion</Button>
          },
        ]}
      ></Menu>
      
    </div>
  );
}
export default SideMenu;

import axios from "axios";

export const getOrders = () => {
  return fetch("https://dummyjson.com/carts/1").then((res) => res.json());
};

export const getRevenue = () => {
  return fetch("https://dummyjson.com/carts").then((res) => res.json());
};

export const getInventory = (id) => {
  return fetch(`https://localhost:3800/api/admin//producto1/${id}`).then((res) => res.json());
};

export const getCustomers = () => {
  return fetch("http://localhost:3800/api/admin/cliente2").then((res) => res.json());
};
export const getComments = () => {
  return fetch("https://dummyjson.com/comments").then((res) => res.json());
};




export async function CreateUser(UserData){
    try {
        console.log(UserData);
        const response = await axios({
            url:` http://localhost:3800/api/admin/sign-up`,
            method: 'POST',
            data: UserData,
        });
        return response
        console.log(response);
    } catch (error) {
        console.log(error)
    }
}

export async function getClientes(id_user)
{
  try {
    const response = await axios.get(` http://localhost:3800/api/admin/cliente/${id_user}`)
    return response.data
} catch (error) {
    console.log(error);
}

}
/*export async function getOneClientes(id)
{
  try {
    const response = await axios.get(` http://localhost:3800/api/admin/cliente2/${id}`)
    return response.data
} catch (error) {
    console.log(error);
}

}
*/


export async function CreateCliente(DataCliente){
  try {
      const response = await axios({
          url:` http://localhost:3800/api/admin/clientes`,
          method: 'POST',
          data: DataCliente,
      });
      return response
      console.log(response);
  } catch (error) {
      console.log(error)
  }
}

export async function UpdateCliente(id, data){
  try {

      const response = await axios({
          url:` http://localhost:3800/api/admin/cliente/${id}`,
          method: 'PATCH',
          data: data,
      });
      return response
  } catch (error) {
      console.error(error);
      console.log(error)
  }
}

export async function getVentas(id_user)
{
  try {
    const response = await axios.get(` http://localhost:3800/api/admin/venta2/${id_user}`)
    return response.data
} catch (error) {
    console.log(error);
}

}


export async function CreaeVentas(Dataventa){
  try {
      const response = await axios({
          url:` http://localhost:3800/api/admin/venta`,
          method: 'POST',
          data: Dataventa,
      });
      return response
  } catch (error) {
      console.log(error)
  }
}

export async function getProveedores(id_user)
{
  try {
    const response = await axios.get(` http://localhost:3800/api/admin/proveedor1/${id_user}`)
    return response.data
} catch (error) {
    console.log(error);
}

}
export async function CreateProveedor(dataProveedor){
  try {
      const response = await axios({
          url:` http://localhost:3800/api/admin/proveedor`,
          method: 'POST',
          data: dataProveedor,
      });
      return response
  } catch (error) {
      console.log(error)
  }
}

export async function getProducto(id_user)
{
  try {
    const response = await axios.get(` http://localhost:3800/api/admin/producto1/${id_user}`)
    return response.data
} catch (error) {
    console.log(error);
}

}
export async function CreateProducto(dataProducto){
  try {
      const response = await axios({
          url:` http://localhost:3800/api/admin/prodcuto`,
          method: 'POST',
          data: dataProducto,
      });
      return response
  } catch (error) {
      console.log(error)
  }
}

export async function UpdateProducto(id, data){
  try {

      const response = await axios({
          url:` http://localhost:3800/api/admin/producto/${id}`,
          method: 'PATCH',
          data: data,
      });
      return response
  } catch (error) {
      console.error(error);
      console.log(error)
  }
}



export async function getCrompras(id_user)
{
  try {
    const response = await axios.get(` http://localhost:3800/api/admin/compras/${id_user}`)
    return response.data
} catch (error) {
    console.log(error);
}

}
export async function CreateCompras(dataCompra){
  try {
      const response = await axios({
          url:` http://localhost:3800/api/admin/compras`,
          method: 'POST',
          data: dataCompra,
      });
      return response
  } catch (error) {
      console.log(error)
  }
}





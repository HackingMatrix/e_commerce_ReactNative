import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image, ScrollView, TouchableOpacity, Modal, Pressable, Alert } from 'react-native';
import axios from 'axios'; // Importa la librería Axios
import Toast from 'react-native-root-toast';
import { RootSiblingParent } from 'react-native-root-siblings';

const App = () => {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [carritoModalVisible, setCarritoModalVisible] = useState(false);
  const [subTotal, setSubTotal] = useState(0);

  const showToasts = () => {
    Toast.show('Producto Agregado', {
      duration: Toast.durations.SHORT,
      position: Toast.positions.CENTER,
      opacity: 1,
      backgroundColor: 'grey'
    })
  }

  const showToastsPurchase = () => {
    Toast.show('¡Gracias por comprar!', {
      duration: Toast.durations.SHORT,
      position: Toast.positions.CENTER,
      opacity: 1,
      backgroundColor: 'grey'
    })
  }

  // Función para obtener productos desde la API
  const obtenerProductos = async () => {
    try {
      const response = await axios.get('https://eshop-deve.herokuapp.com/api/v2/products', {
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJqNENWdUR6R0RpQTJzeHUwWVlPWW5kaUU0WGtvbnNGYiIsImlhdCI6MTY3NDU4NjI5OTUyN30.W01xe4zYHPf8-n8KlW_OnPe8anXZFzNPLIHHmmYTsDCBIeVqTYhbbYxHvRW3HTrN3nnwD9CSvbnFpvC_655UAQ', // Reemplaza 'TU_TOKEN_DE_ACCESO' con tu token de acceso
        },
      });
      setProductos(response.data.products); // Actualiza el estado con los datos de la API
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  const agregarAlCarrito = (producto) => {
    const productoExistente = carrito.find((item) => item.id === producto.id);
  if (productoExistente) {
    // Si el producto ya está en el carrito, incrementa su cantidad
    const nuevoCarrito = carrito.map((item) =>
      item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
    );
    setCarrito(nuevoCarrito);
  } else {
    // Si el producto no está en el carrito, agrega uno nuevo con cantidad 1
    setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    
  }
    setModalVisible(false)
  };

   // Función para manejar la acción de acceder al carrito de compras
   const accederCarrito = () => {
    // Muestra el modal del carrito
    setCarritoModalVisible(true);
  };

  const eliminarDelCarrito = (id) => {
    const nuevoCarrito = carrito.filter((producto) => producto.id !== id);
    setCarrito(nuevoCarrito);
  };

  const limpiarCarrito = () => {
    setCarrito([]);
    setSubTotal(0); // Para reiniciar el subtotal
  };

    // Función para manejar la acción de ver detalles del producto
    const verDetalles = async (id) => {
      try {
        // Llama a la API para obtener detalles del producto con el ID especificado
        const response = await axios.get(`https://eshop-deve.herokuapp.com/api/v2/products/${id}`, {
          headers:{
            Authorization: 'Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJqNENWdUR6R0RpQTJzeHUwWVlPWW5kaUU0WGtvbnNGYiIsImlhdCI6MTY3NDU4NjI5OTUyN30.W01xe4zYHPf8-n8KlW_OnPe8anXZFzNPLIHHmmYTsDCBIeVqTYhbbYxHvRW3HTrN3nnwD9CSvbnFpvC_655UAQ', // Reemplaza 'TU_TOKEN_DE_ACCESO' con tu token de acceso
          },
        });
         // Actualiza el estado del producto seleccionado con los detalles obtenidos
      setProductoSeleccionado(response.data);
      // Muestra el modal
      setModalVisible(true);
      } catch (error) {
        console.error('Error al obtener detalles del producto:', error);
      }
    };

    const totalProductosEnCarrito = () => {
      let total = 0;
      carrito.forEach((producto) => {
        total += producto.cantidad || 0;
      });
      return total;
    };

    const aumentarCantidad = (id) => {
      const nuevoCarrito = carrito.map((producto) => {
        if (producto.id === id) {
          return { ...producto, cantidad: (producto.cantidad || 1) + 1 }; // Aumenta la cantidad del producto en 1
        }
        return producto;
      });
      setCarrito(nuevoCarrito);
    };
    
    const disminuirCantidad = (id) => {
      const nuevoCarrito = carrito.map((producto) => {
        if (producto.id === id) {
          // Si la cantidad es mayor que 1, disminuye la cantidad en 1; de lo contrario, elimina el producto del carrito
          if ((producto.cantidad || 1) > 1) {
            return { ...producto, cantidad: (producto.cantidad || 1) - 1 };
          } else {
            return null; // Retorna null para marcar el producto como eliminado
          }
        }
        return producto;
      }).filter(Boolean); // Filtra los elementos nulos (productos eliminados) del array
      setCarrito(nuevoCarrito);
    };
    

  useEffect(() => {
    // Llama a la función para obtener productos cuando el componente se monta
    obtenerProductos();
  }, []); // El segundo argumento [] indica que useEffect solo se ejecutará una vez al montar el componente

  useEffect(() => {
    // Calcula el subtotal cada vez que cambie el carrito
    const subtotal = carrito.reduce((total, producto) => total + (producto.price * producto.cantidad), 0);
    setSubTotal(subtotal);
  }, [carrito]); // Dependencia del efecto: se ejecuta cada vez que cambie el carrito

  return (
    <RootSiblingParent>
    <View style={styles.container}>
      {/* Botón para acceder al carrito de compras */}
      <Text style={styles.titulo}>Productos Disponibles</Text>
      <TouchableOpacity onPress={accederCarrito} style={styles.botonCarrito}>
      <Image
        style={styles.imagenCarrito}
        source={{
          uri: 'https://uxwing.com/wp-content/themes/uxwing/download/e-commerce-currency-shopping/shopping-cart-icon.png',
        }}
      />
      {carrito.length > 0 && (
    <View style={styles.contador}>
      <Text style={styles.numeroProductos}>{totalProductosEnCarrito()}</Text>
    </View>
  )}
      </TouchableOpacity>
      <ScrollView style={styles.scrollContainer}>
      {/* Mapea los productos y muestra cada uno */}
      {productos.map((producto) => {
  
  return (
    <View key={producto.id} style={styles.detalleContainer}>
      <Text style={styles.nombre}>{producto.name}</Text>
      <Text style={styles.descripcion}>{producto.description}</Text>
      <Image
        style={styles.tinyLogo}
        source={{
          uri: producto.imageUrl,
        }}
      />
       {/* Botón para ver detalles del producto */}
       <TouchableOpacity style={styles.miBoton} onPress={() => verDetalles(producto.id)}>
        <Text style={styles.bottonText}>Ver Detalles</Text>
       </TouchableOpacity>
       
    </View>
  );
})}
</ScrollView>
 {/* Modal para mostrar los detalles del producto */}
 <Modal
  animationType="slide"
  transparent={false}
  visible={modalVisible}
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalContainer}>
  
    <Text style={styles.modalTitulo}>Detalles del Producto</Text>
    {/* Verifica si hay un producto seleccionado */}
    {productoSeleccionado && (
      <View style={styles.detalleProducto}>
        {/* Muestra el nombre del producto */}
        <Text style={styles.detalleNombre}>{productoSeleccionado.product.name}</Text>
        {/* Muestra la descripción del producto */}
        <Text style={styles.detalleDescripcion}>{productoSeleccionado.product.description}</Text>
        {/* Muestra el precio del producto */}
        <Text style={styles.detallePrecio}>Precio: {productoSeleccionado.product.price} {productoSeleccionado.product.currency}</Text>
        {/* Muestra el peso del producto */}
        <Text style={styles.detallePeso}>Peso: {productoSeleccionado.product.dimensions.weight} {productoSeleccionado.product.units.weight}</Text>
        {/* Muestra la imagen del producto */}
        <Image
        style={styles.tinyLogo}
        source={{
          uri: productoSeleccionado.product.imageUrl,
        }}
      />
        {/* Botón para agregar el producto al carrito */}
        
        <TouchableOpacity onPress={() => {agregarAlCarrito(productoSeleccionado.product),
        showToasts()}} style={styles.miBoton}>
          <Text style={styles.bottonText}>AGREGAR AL CARRITO</Text>
        </TouchableOpacity>
        
      </View>
    )}
    <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.miBoton}>
          <Text style={styles.bottonText}>CERRAR</Text>
        </TouchableOpacity>
  </View>
</Modal>
<Modal
  animationType="slide"
  transparent={false}
  visible={carritoModalVisible}
  onRequestClose={() => setCarritoModalVisible(false)}
>
  <View style={{ ...styles.modalContainer, paddingTop: 20}}>
    <Text style={{ ...styles.modalTitulo, paddingTop: 20 }}>Carrito de Compras</Text>
    {/* Verifica si hay productos en el carrito */}
    {carrito.length > 0 ? (
      <ScrollView style={{...styles.scrollContainer, paddingTop: 20, marginBottom: 20, paddingBottom:50, borderBottomWidth: 2, borderBottomColor: 'rgb(0,189,199)' }}>
        {/* Mapea los productos en el carrito y muestra cada uno */}
        {carrito.map((producto) => (
          <View key={producto.id} style={styles.detalleProducto}>
            {/* Muestra el nombre del producto */}
            <Text style={styles.detalleNombre}>{producto.name}</Text>
            {/* Muestra la descripción del producto */}
            <Text style={styles.detalleDescripcion}>{producto.description}</Text>
            {/* Muestra el precio del producto */}
            <Text style={styles.detallePrecio}>Precio: {producto.price} {producto.currency}</Text>
            {/* Muestra el peso del producto */}
            <Text style={styles.detallePeso}>Peso: {producto.dimensions.weight} {producto.units.weight}</Text>
            <Image
        style={styles.tinyLogo}
        source={{
          uri: producto.imageUrl,
        }}
      />
             {/* Muestra la cantidad del producto */}
             <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <TouchableOpacity style={styles.minusButton} onPress={() => disminuirCantidad(producto.id)}>
              <Text style={styles.textoBoton}>-</Text>
            </TouchableOpacity>
              <Text style={styles.cantidadProducto}>{producto.cantidad}</Text>
            <TouchableOpacity style={styles.plusButton} onPress={() => aumentarCantidad(producto.id)}>
            <Text style={styles.textoBoton}>+</Text>
            </TouchableOpacity>
             </View>
            

            {/* Botón para eliminar el producto del carrito */}
            <TouchableOpacity onPress={() => eliminarDelCarrito(producto.id)} style={styles.botonEliminar}>
              <Text style={styles.bottonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        ))}
        
      </ScrollView>
    ) : (
      <Text>No hay productos en el carrito</Text>
    )}
    <View style={{flexDirection: 'row'}}>
      <TouchableOpacity onPress={() => setCarritoModalVisible(false)} style={styles.miBoton}>
          <Text style={styles.bottonText}>CERRAR</Text>
        </TouchableOpacity>
    <TouchableOpacity style={{paddingTop: 20}}></TouchableOpacity>
    <TouchableOpacity onPress={() => {setCarritoModalVisible(false); 
      showToastsPurchase();
      limpiarCarrito();}} style={{ ...styles.miBoton, marginLeft:5, display: subTotal > 0 ? 'flex' : 'none' }}>
          <Text style={styles.bottonText}>COMPRAR</Text>
        </TouchableOpacity>
    </View>
    
    <TouchableOpacity style={{paddingTop: 20}}></TouchableOpacity>
    <View style={{ bottom: 20}}>
          <Text style={styles.subTotalText}>Total a pagar: {subTotal}.00$</Text>
        </View>
  </View>
</Modal>

    </View>
    </RootSiblingParent>);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    paddingTop: 40,
  },
  tinyLogo: {
    marginVertical: 5,
    width: 50,
    height: 50,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', // Fondo oscuro semi-transparente
    paddingHorizontal: 20,
    marginTop: 50,
    marginHorizontal: 10,
    borderTopWidth: 5, // Agrega un borde
    borderTopColor: 'rgb(0,189,199)',
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderLeftColor: 'rgb(0,189,199)',
    borderRightColor: 'rgb(0,189,199)',
    shadowColor: '#000',          // Color de la sombra
    shadowOffset: { width: 0, height: 2 }, // Offset de la sombra (ancho, alto)
    shadowOpacity: 0.25,          // Opacidad de la sombra
    shadowRadius: 3,              // Radio de la sombra
    elevation: 5,   
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  detalleProducto: {
    alignItems: 'center',
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,            // Radio de la sombra
    elevation: 5,   
  },
  scrollContainer: {
    flex: 1,
    width: '100%',
    borderTopWidth: 2,
    borderTopColor: 'rgb(0,189,199)',
  },
  detalleContainer: {
    flex: 1,
    marginBottom: 40,
    marginTop: 20,
    alignItems: 'center',
    
  },
  nombre: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  descripcion: {
    fontSize: 14,
    marginBottom: 5,
  },
  precio: {
    fontSize: 14,
    marginBottom: 10,
  },
  botonCarrito: {
    flexDirection: 'row',
    marginBottom:30,
    paddingVertical: 0,
    paddingHorizontal: 20,
    
  },
  numeroProductos: {
    color: 'rgb(0,152,158)', // Color del texto del contador
    fontSize: 12, // Tamaño del texto del contador
    fontWeight: 'bold',
    marginLeft: 10,
  },
  miBoton: {
    backgroundColor: 'rgb(0,189,199)', // Cambia el color de fondo del botón
    color: 'white', // Cambia el color del texto del botón
    borderRadius: 10, // Ajusta el radio de los bordes
    paddingVertical: 10, // Ajusta el espacio vertical dentro del botón
    paddingHorizontal: 20, // Ajusta el espacio horizontal dentro del botón
    fontSize: 16, // Ajusta el tamaño del texto
    fontWeight: 'bold', // Ajusta el peso del texto
    marginTop: 10,
  },
  miBoton2: {
    backgroundColor: 'rgb(0,152,158)', // Cambia el color de fondo del botón
    color: 'white', // Cambia el color del texto del botón
    borderRadius: 10, // Ajusta el radio de los bordes
    paddingVertical: 10, // Ajusta el espacio vertical dentro del botón
    paddingHorizontal: 20, // Ajusta el espacio horizontal dentro del botón
    fontSize: 16, // Ajusta el tamaño del texto
    fontWeight: 'bold', // Ajusta el peso del texto
    marginTop: 10,
  },
  botonEliminar:{
    backgroundColor: 'red', // Cambia el color de fondo del botón
    color: 'white', // Cambia el color del texto del botón
    borderRadius: 10, // Ajusta el radio de los bordes
    paddingVertical: 10, // Ajusta el espacio vertical dentro del botón
    paddingHorizontal: 20, // Ajusta el espacio horizontal dentro del botón
    fontSize: 16, // Ajusta el tamaño del texto
    fontWeight: 'bold', // Ajusta el peso del texto
    marginBottom: 70,
  },
  minusButton:{
    backgroundColor: 'red', // Cambia el color de fondo del botón
    color: 'white', // Cambia el color del texto del botón
    borderRadius: 50, // Ajusta el radio de los bordes
    paddingVertical: 10, // Ajusta el espacio vertical dentro del botón
    paddingHorizontal: 16, // Ajusta el espacio horizontal dentro del botón
    fontSize: 16, // Ajusta el tamaño del texto
    fontWeight: 'bold', // Ajusta el peso del texto
    marginBottom: 20,
  },
  plusButton:{
    backgroundColor: 'green', // Cambia el color de fondo del botón
    color: 'white', // Cambia el color del texto del botón
    borderRadius: 50, // Ajusta el radio de los bordes
    paddingVertical: 10, // Ajusta el espacio vertical dentro del botón
    paddingHorizontal: 16, // Ajusta el espacio horizontal dentro del botón
    fontSize: 16, // Ajusta el tamaño del texto
    fontWeight: 'bold', // Ajusta el peso del texto
    marginBottom: 20,
  },
  textoBoton: {
    color: 'white'
  },
  cantidadProducto: {
    color: 'rgb(0,152,158)',
    paddingVertical: 10, // Ajusta el espacio vertical dentro del botón
    paddingHorizontal: 16, // Ajusta el espacio horizontal dentro del botón
    fontSize: 16, // Ajusta el tamaño del texto
    fontWeight: 'bold', // Ajusta el peso del texto
    marginBottom: 20,
  },
  bottonText:{
    color: 'white'
  },
  subTotalText:{
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,            // Radio de la sombra
    elevation: 5, 
  },
  imagenCarrito: {
    width: 50,
    height: 44,
  },
});

export default App;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './components.css';

interface Product {
  id: number;
  name: string;
  price: string;
}

interface Order {
  id: number;
  orderDate: Date;
  quantity: number;
  product: Product;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [newOrderDate, setNewOrderDate] = useState('');
  const [newOrderQuantity, setNewOrderQuantity] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [orderIdToDelete, setOrderIdToDelete] = useState<number | null>(null);
  const [flashMessages, setFlashMessages] = useState({ success: '', error: '' });
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, [selectedProductId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFlashMessages({ success: '', error: '' }); // Clear messages after 5 seconds
    }, 5000);
    return () => clearTimeout(timer);
  }, [flashMessages]);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/products');
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get<Order[]>('/orders', {
        params: { productId: selectedProductId }
      });
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProductId(e.target.value);
  };

  const handleAddOrder = async () => {
    if (!newOrderDate || !newOrderQuantity || !selectedProductId) {
      setFlashMessages({ success: '', error: 'All fields are required' });
      return;
    }

    const orderPayload = {
      orderDate: new Date(newOrderDate),
      quantity: parseInt(newOrderQuantity),
      productId: parseInt(selectedProductId),
    };

    try {
      console.log('Adding order with payload:', orderPayload);
      const response = await axios.post('/orders/create', orderPayload);
      fetchOrders();
      setShowAddModal(false);
      setFlashMessages({ success: 'Order added successfully!', error: '' });
      setSelectedProductId('');
    } catch (error: any) {
      console.error('Error adding order:', error.response?.data || error.message);
      setFlashMessages({ success: '', error: error.response?.data?.message || 'Failed to add order' });
    }
  };

  const handleEditOrder = (order: Order) => {
    setCurrentOrder(order);
    setShowEditModal(true);
  };

  const handleUpdateOrder = async () => {
    if (!currentOrder) return;
    try {
      await axios.patch(`/orders/${currentOrder.id}`, currentOrder);
      setShowEditModal(false);
      fetchOrders(); // Refresh the orders list after updating
      setFlashMessages({ success: 'Order updated successfully!', error: '' });
    } catch (error) {
      console.error('Error updating order:', error);
      setFlashMessages({ success: '', error: 'Failed to update order' });
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentOrder) return;
    const { name, value } = event.target;
    setCurrentOrder({ ...currentOrder, [name]: value });
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleDeleteOrder = async (id: number) => {
    try {
      await axios.delete(`/orders/${id}`);
      setOrders(orders.filter(order => order.id !== id));
      setShowModal(false);
      setFlashMessages({ success: 'Order deleted successfully!', error: '' });
    } catch (error) {
      console.error('Error deleting order:', error);
      setFlashMessages({ success: '', error: 'Failed to delete order' });
    }
  };

  const handleDeleteClick = (id: number) => {
    setOrderIdToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = () => {
    if (orderIdToDelete !== null) {
      handleDeleteOrder(orderIdToDelete);
    }
  };

  return (
    <>
      <div className="header">
        <div className="col-lg-10 col-sm-8 col-8 float-left">
          <h2>Orders</h2>
        </div>
      </div>
      <div className="container mt-4">
        <div className="alert-area">
          {flashMessages.success && <div className="alert alert-success">{flashMessages.success}</div>}
          {flashMessages.error && <div className="alert alert-danger">{flashMessages.error}</div>}
        </div>
        <div className="row" style={{ paddingTop: "20px" }}>
          <div className="col-md-6 mb-3">
            <select value={selectedProductId} onChange={handleProductChange} className="form-control">
              <option value="">Filter by Product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>{product.name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <button type="button" className="btn btn-outline-primary float-right" onClick={() => setShowAddModal(true)}>Add Order</button>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Order Date</th>
              <th>Quantity</th>
              <th>Product</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                <td>{order.quantity}</td>
                <td>{order.product.name}</td>
                <td>
                  <ul className="list-inline m-0">
                    <li className="list-inline-item">
                      <button className="btn btn-success btn-sm rounded-0" onClick={() => handleEditOrder(order)}
                        data-toggle="tooltip" data-placement="top" title="Edit">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                          <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                          <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                        </svg>
                      </button>
                    </li>
                  </ul>
                </td>
                <td>
                  <ul className="list-inline m-0">
                    <li className="list-inline-item">
                      <button className="btn btn-danger btn-sm rounded-0 delete-btn"
                        data-toggle="tooltip" data-placement="top" title="Delete"
                        onClick={() => handleDeleteClick(order.id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                        </svg>
                      </button>
                    </li>
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showAddModal && (
          <div className="modal show" role="dialog" style={{ display: 'block' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add New Order</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setShowAddModal(false)}>
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <input type="date" className="form-control" value={newOrderDate} onChange={e => setNewOrderDate(e.target.value)} placeholder="Order Date" />
                  <input type="number" className="form-control" value={newOrderQuantity} onChange={e => setNewOrderQuantity(e.target.value)} placeholder="Quantity" />
                  <select value={selectedProductId} onChange={e => setSelectedProductId(e.target.value)} className="form-control">
                    <option value="">Select Product</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>{product.name}</option>
                    ))}
                  </select>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Close</button>
                  <button type="button" className="btn btn-primary" onClick={handleAddOrder}>Save changes</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showEditModal && currentOrder && (
          <div className="modal show" role="dialog" style={{ display: 'block' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Order</h5>
                  <button type="button" className="close" onClick={handleCloseEditModal}>
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <input type="date" className="form-control" name="orderDate" value={currentOrder.orderDate.toISOString().split('T')[0]} onChange={handleInputChange} />
                  <input type="number" className="form-control" name="quantity" value={currentOrder.quantity} onChange={handleInputChange} />
                  <select value={currentOrder.product.id} onChange={e => setCurrentOrder({ ...currentOrder, product: products.find(p => p.id === parseInt(e.target.value)) || currentOrder.product })} className="form-control">
                    <option value="">Select Product</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>{product.name}</option>
                    ))}
                  </select>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseEditModal}>Close</button>
                  <button type="button" className="btn btn-primary" onClick={handleUpdateOrder}>Save changes</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showModal && (
          <div className="modal fade show" id="deleteConfirmationModal" role="dialog" aria-labelledby="deleteConfirmationModalLabel" aria-hidden="true" style={{ display: 'block' }}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="deleteConfirmationModalLabel">Confirm Delete</h5>
                  <button type="button" className="close" onClick={() => setShowModal(false)} aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  Are you sure you want to delete this order?
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>No</button>
                  <button type="button" className="btn btn-danger" onClick={confirmDelete}>Yes</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Orders;

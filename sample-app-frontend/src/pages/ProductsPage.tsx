import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './components.css';

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  price: string;
  category: Category;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState<number | null>(null);
  const [flashMessages, setFlashMessages] = useState({ success: '', error: '' });
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [selectedCategoryId]);

  useEffect(() => {
    const timer = setTimeout(() => {
        setFlashMessages({ success: '', error: '' }); // Clear messages after 5 seconds
    }, 5000);
    return () => clearTimeout(timer);
}, [flashMessages]);

  const fetchCategories = async (searchTerm: string = '') => {
    try {
      const { data } = await axios.get('categories/all', {
        params: { search: searchTerm }
      });
      setCategories(data.categories);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get<Product[]>('/products', {
        params: { categoryId: selectedCategoryId }
      });
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategoryId(e.target.value);
  };

  const handleAddProduct = async () => {
    if (!newProductName || !newProductPrice || !selectedCategoryId) {
      setFlashMessages({ success: '', error: 'All fields are required' });
      return;
    }

    const productPayload = {
      name: newProductName,
      price: parseFloat(newProductPrice),
      category: parseInt(selectedCategoryId), // Ensure category is sent as a number
    };
    try {
      console.log('Adding product with payload:', productPayload);
      const response = await axios.post('/products/create', productPayload);
      fetchProducts();
      setShowAddModal(false);
      setFlashMessages({ success: 'Product added successfully!', error: '' });
      setSelectedCategoryId('');
    } catch (error: any) {
      console.error('Error adding product:', error.response?.data || error.message);
      setFlashMessages({ success: '', error: error.response?.data?.message || 'Failed to add product' });
    }
  };

  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    setShowEditModal(true);
  };

  const handleUpdateProduct = async () => {
    if (!currentProduct) return;
    try {
      await axios.patch(`/products/${currentProduct.id}`, currentProduct);
      setShowEditModal(false);
      fetchProducts(); // Refresh the products list after updating
      setFlashMessages({ success: 'Product updated successfully!', error: '' });
    } catch (error) {
      console.error('Error updating product:', error);
      setFlashMessages({ success: '', error: 'Failed to update product' });
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentProduct) return;
    const { name, value } = event.target;
    setCurrentProduct({ ...currentProduct, [name]: value });
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await axios.delete(`/products/${id}`);
      setProducts(products.filter(product => product.id !== id));
      setShowModal(false);
      setFlashMessages({ success: 'Product deleted successfully!', error: '' });
    } catch (error) {
      console.error('Error deleting product:', error);
      setFlashMessages({ success: '', error: 'Failed to delete product' });
    }
  };

  const handleDeleteClick = (id: number) => {
    setProductIdToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = () => {
    if (productIdToDelete !== null) {
      handleDeleteProduct(productIdToDelete);
    }
  };

  return (
    <>
      <div className="header">

        <div className="col-lg-10 col-sm-8 col-8 float-left">
          <h2>Products</h2>
        </div>
      </div>
      <div className="container mt-4">
        <div className="alert-area">
          {flashMessages.success && <div className="alert alert-success">{flashMessages.success}</div>}
          {flashMessages.error && <div className="alert alert-danger">{flashMessages.error}</div>}
        </div>
        <div className="row" style={{ paddingTop: "20px" }}>
          <div className="col-md-6 mb-3">

          </div>
          <div className="col-md-6">
            <button type="button" className="btn btn-outline-primary float-right" onClick={() => setShowAddModal(true)}>Add Product</button>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.category.name}</td>
                <td>
                  <ul className="list-inline m-0">
                    <li className="list-inline-item">
                      <button className="btn btn-success btn-sm rounded-0" onClick={() => handleEditProduct(product)}
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
                        onClick={() => handleDeleteClick(product.id)}>
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
                  <h5 className="modal-title">Add New Product</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setShowAddModal(false)}>
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <input type="text" className="form-control" value={newProductName} onChange={e => setNewProductName(e.target.value)} placeholder="Product Name" />
                  <input type="text" className="form-control" value={newProductPrice} onChange={e => setNewProductPrice(e.target.value)} placeholder="Product Price" />
                  <select value={selectedCategoryId} onChange={e => setSelectedCategoryId(e.target.value)} className="form-control">
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Close</button>
                  <button type="button" className="btn btn-primary" onClick={handleAddProduct}>Save changes</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showEditModal && currentProduct && (
          <div className="modal show" role="dialog" style={{ display: 'block' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Product</h5>
                  <button type="button" className="close" onClick={handleCloseEditModal}>
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <input type="text" className="form-control" name="name" value={currentProduct.name} onChange={handleInputChange} />
                  <input type="text" className="form-control" name="price" value={currentProduct.price} onChange={handleInputChange} />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseEditModal}>Close</button>
                  <button type="button" className="btn btn-primary" onClick={handleUpdateProduct}>Save changes</button>
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
                  Are you sure you want to delete this meal?
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

export default Products;

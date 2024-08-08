import { Link } from "react-router-dom";
// import Wrapper from "../../components/Wrapper";
import './components.css';
import { useEffect, useState } from "react";
import axios from "axios";
import { Categories } from "../models/categories";
import Wrapper from "../components/Wrapper";
import '../css/bootstrap.css';
import '../css/bootstrap.css.map';
import '../css/styles.css';

const Category = () => {
    // State variables for categories, modal display, form inputs, and flash messages
    const [categories, setCategories] = useState<Categories[]>([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [categoryIdToDelete, setCategoryIdToDelete] = useState<number | null>(null);
    const [flashMessages, setFlashMessages] = useState({ success: '', error: '' });
    const [search, setSearch] = useState<string>('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentCategory, setCurrentCategory] = useState<Categories | null>(null);

    useEffect(() => {
        fetchCategories();
    }, []);

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

    const handleAddCategory = async () => {
        if (!newCategoryName) return;
        try {
            await axios.post('/categories/create', { name: newCategoryName });
            setNewCategoryName('');
            setShowAddModal(false);
            fetchCategories();
            setFlashMessages({ success: 'Category added successfully', error: '' });
        } catch (error) {
            console.error('Error adding category:', error);
            setFlashMessages({ success: '', error: 'Failed to add category' });
        }
    };

    const handleEditCategory = (category: Categories) => {
        setCurrentCategory(category);
        setShowEditModal(true);
    };

    const handleUpdateCategory = async () => {
        if (!currentCategory) return;
        try {
            await axios.patch(`/categories/${currentCategory.id}`, currentCategory);
            setShowEditModal(false);
            fetchCategories(); // Refresh the products list after updating
            setFlashMessages({ success: 'Product updated successfully!', error: '' });
        } catch (error) {
            console.error('Error updating product:', error);
            setFlashMessages({ success: '', error: 'Failed to update product' });
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!currentCategory) return;
        const { name, value } = event.target;
        setCurrentCategory({ ...currentCategory, [name]: value });
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        fetchCategories(search);
    };

    const del = async (id: number) => {
        try {
            await axios.delete(`categories/${id}`);
            setCategories(categories.filter((c: Categories) => c.id !== id));
            setShowModal(false);
            setCategoryIdToDelete(null);
            setFlashMessages({ success: 'Category deleted successfully', error: '' });
        } catch (error) {
            setFlashMessages({ success: '', error: 'Failed to delete category' });
        }
    };

    const handleDeleteClick = (id: number) => {
        setCategoryIdToDelete(id);
        setShowModal(true);
    };

    const confirmDelete = () => {
        if (categoryIdToDelete !== null) {
            del(categoryIdToDelete);
        }
    };

    return (
        <>
            <div className="header">

                <div className="col-lg-10 col-sm-8 col-8 float-left">
                    <h2>Categories</h2>
                </div>
            </div>
            <div className="container mt-4">
                {flashMessages.success && (
                    <div className="alert alert-success" role="alert">
                        {flashMessages.success}
                    </div>
                )}
                {flashMessages.error && (
                    <div className="alert alert-danger" role="alert">
                        {flashMessages.error}
                    </div>
                )}
                {showAddModal && (
                    <div className="modal show fade" style={{ display: "block" }} aria-modal="true" role="dialog">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Add New Category</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setShowAddModal(false)}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <input type="text" className="form-control" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} placeholder="Category Name" />
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Close</button>
                                    <button type="button" className="btn btn-primary" onClick={handleAddCategory}>Save changes</button>
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
                <div className="row" style={{ paddingTop: "20px" }}>
                    <div className="col-md-6 mb-3">
                        <form onSubmit={handleSearchSubmit}>
                            <input
                                type="text"
                                id="categorySearch"
                                placeholder="Search for categories..."
                                className="form-control"
                                value={search}
                                onChange={handleSearchChange}
                            />
                        </form>
                    </div>
                    <div className="col-md-6">
                        <button type="button" className="btn btn-outline-primary float-right" onClick={() => setShowAddModal(true)}>Add Category</button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12 mx-auto">
                        <div className="card border-0 shadow">
                            <div className="card-body p-3">
                                <div className="table-responsive">
                                    <table className="table m-0">
                                        <thead style={{ backgroundColor: '#be22b1', color: "white" }}>
                                            <tr>
                                                <th>Name</th>
                                                <th>Actions</th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {categories.map((category: Categories) => (
                                                <tr key={category.id}>
                                                    <td>{category.name}</td>
                                                    <td>
                                                        <ul className="list-inline m-0">
                                                            <li className="list-inline-item">
                                                                <button className="btn btn-success btn-sm rounded-0" onClick={() => handleEditCategory(category)}
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
                                                                    onClick={() => handleDeleteClick(category.id)}>
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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {showEditModal && currentCategory && (
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
                                    <input type="text" className="form-control" name="name" value={currentCategory.name} onChange={handleInputChange} />
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseEditModal}>Close</button>
                                    <button type="button" className="btn btn-primary" onClick={handleUpdateCategory}>Save changes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Category;

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productApi } from '../../../api/productApi';
import type { Product } from '../../../types/index';
import styles from './ProductManagement.module.scss';

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    images: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await productApi.getAll();
      setProducts(res.data.products);
    } catch (error) {
      console.error('Error fetching products', error);
    }
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        category: product.category || '',
        images: product.images?.join(', ') || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', description: '', price: '', category: '', images: '' });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        images: formData.images.split(',').map(img => img.trim())
      };

      if (editingProduct) {
        await productApi.update(editingProduct._id, productData);
      } else {
        await productApi.create(productData);
      }

      await fetchProducts();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving product', error);
      alert('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await productApi.delete(id);
      setProducts(products.filter(p => p._id !== id));
    } catch (error) {
      console.error('Error deleting product', error);
      alert('Failed to delete product');
    }
  };

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <nav className={styles.nav}>
          <Link to="/admin" className={styles.navItem}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
            </svg>
            Dashboard
          </Link>
          <Link to="/admin/products" className={`${styles.navItem} ${styles.active}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
              <line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
            Products
          </Link>
          <Link to="/admin/orders" className={styles.navItem}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            Orders
          </Link>
        </nav>
      </aside>

      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Product Management</h1>
          <button className={styles.addBtn} onClick={() => handleOpenModal()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Product
          </button>
        </div>

        <div className={styles.tableCard}>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>
                    <div className={styles.productCell}>
                      <div className={styles.image}>
                        <img 
                          src={product.images?.[0] || 'https://via.placeholder.com/50'} 
                          alt={product.name} 
                        />
                      </div>
                      <span className={styles.name}>{product.name}</span>
                    </div>
                  </td>
                  <td>{product.category}</td>
                  <td>${product.price}</td>
                  <td>
                    <div className={styles.actions}>
                      <button 
                        className={styles.editBtn}
                        onClick={() => handleOpenModal(product)}
                      >
                        Edit
                      </button>
                      <button 
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(product._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
              <button className={styles.closeBtn} onClick={handleCloseModal}>&times;</button>
            </div>
            <div className={styles.modalBody}>
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.field}>
                  <label>Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className={styles.field}>
                  <label>Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label>Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>
                <div className={styles.field}>
                  <label>Image URLs (comma separated)</label>
                  <input
                    type="text"
                    value={formData.images}
                    onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  />
                </div>
                <div className={styles.actions}>
                  <button type="button" className={styles.cancelBtn} onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className={styles.saveBtn} disabled={loading}>
                    {loading ? 'Saving...' : 'Save Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
import React, { useState, useEffect } from 'react';
import { Tab, Tabs, Container, Table, Button, Modal, Form } from 'react-bootstrap';
import TopBar from './TopBar';
import { motion } from 'framer-motion';
import AxiosService from '../Utills/AxiosService';
import ApiRoutes from '../Utills/ApiRoutes';
import toast from 'react-hot-toast';

function Admin() {
  const [key, setKey] = useState('crud');
  const [searchDate, setSearchDate] = useState('');
  const [searchBillId, setSearchBillId] = useState('');
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);

  const initialStockState = {
    fullSleeve: 0, fiSleeve: 0, halfSleeve: 0, collar: 0, hoodie: 0,
    tinTin: 0, fourWay: 0, cargo: 0, lpCuff: 0, lpDower: 0, creep: 0,
    fourWayShorts: 0, tinTinShorts: 0, lpHigh: 0, paper: 0, jeans: 0, cotton: 0, creepShorts: 0,
    mTsCmb: 0, lTsCmb: 0, xlTsCmb: 0, xxlTsCmb: 0, lCmb: 0, xlCmb: 0, xxlCmb: 0,
    lTpCmb: 0, xlTpCmb: 0, xxlTpCmb: 0
  };

  const [stockFormData, setStockFormData] = useState(initialStockState);
  const [stockLoading, setStockLoading] = useState(false);

  useEffect(() => {
    const fetchExistingStock = async () => {
      try {
        const path = ApiRoutes.ALL_STOCKS.path;
        let res = await AxiosService.get(`/${path.replace(/^\//,'')}`);
        
        let stockData = null;
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          stockData = res.data[0];
        } else if (Array.isArray(res) && res.length > 0) {
          stockData = res[0];
        }
        
        if (stockData) {
          const merged = { ...initialStockState };
          Object.keys(initialStockState).forEach(key => {
            if (stockData[key] !== undefined && stockData[key] !== null) {
               merged[key] = Number(stockData[key]);
            }
          });
          setStockFormData(merged);
        }
      } catch (err) {
        console.log("No initial stock found or fetch failed", err);
      }
    };
    
    fetchExistingStock();
  }, []);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({ billId: '', gpay: 0, cash: 0, totalAmount: 0, items: [] });

  const handleEditClick = (bill) => {
    setEditFormData({
      billId: bill.billId,
      gpay: bill.gpay || 0,
      cash: bill.cash || 0,
      totalAmount: bill.totalAmount || 0,
      items: bill.items ? JSON.parse(JSON.stringify(bill.items)) : []
    });
    setShowEditModal(true);
  };

  const handleStockChange = (e) => {
    const val = e.target.value;
    setStockFormData({ ...stockFormData, [e.target.name]: val === '' ? '' : Number(val) });
  };

  const submitNewStock = async () => {
    setStockLoading(true);
    try {
      const sanitizedData = {};
      Object.keys(stockFormData).forEach(k => {
        sanitizedData[k] = stockFormData[k] === '' ? 0 : Number(stockFormData[k]);
      });
      await AxiosService.post(ApiRoutes.NEW_STOCK.path, sanitizedData);
      toast.success('Inventory dynamically overwritten successfully!');
      // Explicitly leaving the stockFormData populated over resetting heavily to zeros natively!
    } catch (err) {
      toast.error('Failed to update stock');
    } finally {
      setStockLoading(false);
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...editFormData.items];
    newItems[index][field] = value;
    setEditFormData({ ...editFormData, items: newItems });
  };

  const handleEditSubmit = async () => {
    try {
      const path = ApiRoutes.UPDATE_BILL.path.replace(':id', editFormData.billId);
      await AxiosService.put(`/${path.replace(/^\//,'')}`, {
        gpay: Number(editFormData.gpay),
        cash: Number(editFormData.cash),
        totalAmount: Number(editFormData.totalAmount),
        items: editFormData.items
      });
      
      toast.success('Bill updated successfully');
      setShowEditModal(false);
      
      setBills(bills.map(b => b.billId === editFormData.billId ? { 
        ...b, 
        gpay: Number(editFormData.gpay),
        cash: Number(editFormData.cash),
        totalAmount: Number(editFormData.totalAmount),
        items: editFormData.items
      } : b));

    } catch (err) {
      toast.error(err.message || 'Update failed');
    }
  };

  const handleSearch = async () => {
    if (!searchDate && !searchBillId) {
      toast.error('Please enter a Date or Bill ID to search');
      return;
    }
    
    setLoading(true);
    setBills([]);
    
    try {
      if (searchBillId) {
        const path = ApiRoutes.SEARCH_BILL.path.replace(':billId', searchBillId);
        let res = await AxiosService.get(`/${path.replace(/^\//,'')}`);
        // single bill mapping logic over interceptors wrapper stripping
        if (res.data) {
           setBills([res.data]);
        } else if (res.billId) { // Failsafe when backend returns generic
           setBills([res]);
        } else {
           toast.error('No bill found with that ID');
        }
      } else if (searchDate) {
        const path = ApiRoutes.DAILY_SALES.path;
        let res = await AxiosService.get(`/${path.replace(/^\//,'')}?date=${searchDate}`);
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
           setBills(res.data);
        } else if (Array.isArray(res) && res.length > 0) { // Axios interceptor wrapper bypass
           setBills(res);
        } else {
           toast.error('No bills found for this date');
        }
      }
    } catch (err) {
       console.log(err);
       toast.error(err.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (billIdString) => {
    if (!window.confirm(`Are you sure you want to delete bill ${billIdString}?`)) return;
    try {
       const path = ApiRoutes.DELETE_BILL.path.replace(':id', billIdString);
       await AxiosService.delete(`/${path.replace(/^\//,'')}`);
       toast.success('Bill deleted successfully');
       setBills(bills.filter(b => b.billId !== billIdString));
    } catch (err) {
       toast.error(err.message || 'Delete failed');
    }
  };

  return (
    <>
      <TopBar />
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-4"
      >
        <Container>
          <div className="d-flex align-items-center mb-4">
            <h2 style={{ fontWeight: 800, color: '#1e293b' }}>
               <i className="fa-solid fa-users-gear me-3" style={{color: '#4f46e5'}}></i> 
               Admin Panel
            </h2>
          </div>

          <div className="shadow-sm p-4 rounded bg-white" style={{ border: '1px solid #e2e8f0' }}>
            <Tabs
              id="admin-tabs"
              activeKey={key}
              onSelect={(k) => setKey(k)}
              className="mb-4 custom-tabs"
            >
              <Tab eventKey="crud" title={<span><i className="fa-solid fa-database me-2"></i>CRUD</span>}>
                <div className="p-3 mt-2">
                  <h4 style={{ color: '#4f46e5', fontWeight: 600 }}>Database Management</h4>
                  <hr/>
                  <p className="text-muted">Perform overarching Create, Read, Update, and Delete operations natively here.</p>
                  
                  <div className="row mb-4 mt-4">
                    <div className="col-md-4 mb-3">
                      <label className="form-label fw-bold" style={{color: '#475569'}}>Search by Date</label>
                      <input 
                        type="date" 
                        className="form-control hover-shadow" 
                        value={searchDate}
                        onChange={(e) => { setSearchDate(e.target.value); setSearchBillId(''); }}
                        style={{borderRadius: '10px'}}
                      />
                    </div>
                    <div className="col-md-2 d-flex align-items-center justify-content-center mb-3">
                      <span className="fw-bold px-3 py-1 rounded-pill" style={{backgroundColor: '#f1f5f9', color: '#94a3b8', fontSize: '0.9rem'}}>OR</span>
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label fw-bold" style={{color: '#475569'}}>Search by Bill ID</label>
                      <input 
                        type="text" 
                        className="form-control hover-shadow" 
                        placeholder="e.g. BILL-14"
                        value={searchBillId}
                        onChange={(e) => { setSearchBillId(e.target.value); setSearchDate(''); }}
                        style={{borderRadius: '10px'}}
                      />
                    </div>
                    <div className="col-md-2 d-flex align-items-end mb-3">
                      <Button 
                        variant="primary" 
                        className="w-100 fw-bold shadow-sm" 
                        onClick={handleSearch} 
                        disabled={loading}
                        style={{borderRadius: '10px', height: '38px', backgroundColor: '#4f46e5', border: 'none'}}
                      >
                        {loading ? 'Searching...' : 'Go'}
                      </Button>
                    </div>
                  </div>

                  {bills.length > 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="table-responsive">
                      <Table hover className="mt-3 align-middle" style={{border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden'}}>
                        <thead style={{backgroundColor: '#f8fafc', color: '#475569'}}>
                          <tr>
                            <th className="py-3 px-3">Bill ID</th>
                            <th className="py-3 px-3">Date</th>
                            <th className="py-3 px-3">Item(s)</th>
                            <th className="py-3 px-3">Product(s)</th>
                            <th className="py-3 px-3">Qty</th>
                            <th className="py-3 px-3">Total Amount</th>
                            <th className="py-3 px-3">GPay</th>
                            <th className="py-3 px-3">Cash</th>
                            <th className="py-3 px-3 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bills.map((b) => (
                            <tr key={b._id}>
                              <td className="fw-bold px-3" style={{color: '#4f46e5'}}>{b.billId}</td>
                              <td className="px-3 text-muted">{new Date(b.billDate || b.date).toLocaleDateString()}</td>
                              <td className="px-3">{b.items ? b.items.map(i => i.itemName || i.item).join(', ') : '-'}</td>
                              <td className="px-3">{b.items ? b.items.map(i => i.product).join(', ') : '-'}</td>
                              <td className="px-3">{b.items ? b.items.map(i => i.quantity).join(', ') : '-'}</td>
                              <td className="fw-bold px-3">₹{b.totalAmount}</td>
                              <td className="px-3" style={{color: '#10b981'}}>₹{b.gpay}</td>
                              <td className="px-3" style={{color: '#f59e0b'}}>₹{b.cash}</td>
                              <td className="px-3 text-center">
                                <Button variant="outline-info" size="sm" className="me-2 rounded-lg" title="Edit" onClick={() => handleEditClick(b)}>
                                  <i className="fa-solid fa-pen-to-square"></i>
                                </Button>
                                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(b.billId)} title="Delete" className="rounded-lg">
                                  <i className="fa-solid fa-trash"></i>
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </motion.div>
                  )}
                  {bills.length === 0 && !loading && (searchDate || searchBillId) && (
                    <div className="text-center text-muted mt-5 mb-3 p-4 rounded" style={{backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1'}}>
                      <i className="fa-solid fa-magnifying-glass fa-2x mb-3" style={{color: '#94a3b8'}}></i>
                      <p className="mb-0 fw-medium">No billing records found matching your query.</p>
                      <small>Try selecting a different date or verifying the bill ID.</small>
                    </div>
                  )}
                </div>
              </Tab>
              
              <Tab eventKey="newstock" title={<span><i className="fa-solid fa-boxes-stacked me-2"></i>New Stock</span>}>
                <div className="p-3 mt-2">
                  <h4 style={{ color: '#10b981', fontWeight: 600 }}>Inject New Stock</h4>
                  <hr/>
                  <p className="text-muted">Register unlisted inventory arrays directly into the primary application datastore globally.</p>
                  
                  <div className="bg-light p-4 rounded shadow-sm" style={{border: '1px solid #e2e8f0'}}>
                    <h5 className="fw-bold mb-3 border-bottom pb-2" style={{color: '#4f46e5'}}>T-Shirts</h5>
                    <div className="row mb-4">
                      {['fullSleeve', 'fiSleeve', 'halfSleeve', 'collar', 'hoodie'].map(field => (
                        <div className="col-md-2 col-sm-4 mb-3" key={field}>
                          <label className="form-label fw-semibold text-muted text-capitalize" style={{fontSize: '0.85rem'}}>{field.replace(/([A-Z])/g, ' $1').trim()}</label>
                          <input type="number" className="form-control bg-white" name={field} value={stockFormData[field]} onChange={handleStockChange} style={{borderRadius: '8px'}} />
                        </div>
                      ))}
                    </div>

                    <h5 className="fw-bold mb-3 border-bottom pb-2" style={{color: '#4f46e5'}}>Tracks</h5>
                    <div className="row mb-4">
                      {['tinTin', 'fourWay', 'cargo', 'lpCuff', 'lpDower'].map(field => (
                        <div className="col-md-2 col-sm-4 mb-3" key={field}>
                          <label className="form-label fw-semibold text-muted text-capitalize" style={{fontSize: '0.85rem'}}>{field.replace(/([A-Z])/g, ' $1').trim()}</label>
                          <input type="number" className="form-control bg-white" name={field} value={stockFormData[field]} onChange={handleStockChange} style={{borderRadius: '8px'}} />
                        </div>
                      ))}
                    </div>

                    <h5 className="fw-bold mb-3 border-bottom pb-2" style={{color: '#4f46e5'}}>Shorts</h5>
                    <div className="row mb-4">
                      {['fourWayShorts', 'tinTinShorts', 'lpHigh', 'paper', 'jeans', 'cotton'].map(field => (
                        <div className="col-md-2 col-sm-4 mb-3" key={field}>
                          <label className="form-label fw-semibold text-muted text-capitalize" style={{fontSize: '0.85rem'}}>{field.replace(/([A-Z])/g, ' $1').trim()}</label>
                          <input type="number" className="form-control bg-white" name={field} value={stockFormData[field] === 0 ? '' : stockFormData[field]} onChange={handleStockChange} placeholder="0" style={{borderRadius: '8px'}} />
                        </div>
                      ))}
                    </div>

                    <h5 className="fw-bold mb-3 border-bottom pb-2" style={{color: '#4f46e5'}}>T/S Combo</h5>
                    <div className="row mb-4">
                      {['mTsCmb', 'lTsCmb', 'xlTsCmb'].map(field => (
                        <div className="col-md-2 col-sm-4 mb-3" key={field}>
                          <label className="form-label fw-bold text-muted text-uppercase" style={{fontSize: '0.8rem'}}>{field.replace(/([A-Z])/g, ' $1').trim()}</label>
                          <input type="number" className="form-control bg-white" name={field} value={stockFormData[field] === 0 ? '' : stockFormData[field]} onChange={handleStockChange} placeholder="0" style={{borderRadius: '8px'}} />
                        </div>
                      ))}
                    </div>

                    <h5 className="fw-bold mb-3 border-bottom pb-2" style={{color: '#4f46e5'}}>T/P Combo</h5>
                    <div className="row mb-4">
                      {['lTpCmb', 'xlTpCmb', 'xxlTpCmb'].map(field => (
                        <div className="col-md-2 col-sm-4 mb-3" key={field}>
                          <label className="form-label fw-bold text-muted text-uppercase" style={{fontSize: '0.8rem'}}>{field.replace(/([A-Z])/g, ' $1').trim()}</label>
                          <input type="number" className="form-control bg-white" name={field} value={stockFormData[field] || 0} onChange={handleStockChange} style={{borderRadius: '8px'}} />
                        </div>
                      ))}
                    </div>

                    <h5 className="fw-bold mb-3 border-bottom pb-2" style={{color: '#4f46e5'}}>Shorts Combo</h5>
                    <div className="row mb-4">
                      {['lCmb', 'xlCmb', 'xxlCmb'].map(field => (
                        <div className="col-md-2 col-sm-4 mb-3" key={field}>
                          <label className="form-label fw-bold text-muted text-uppercase" style={{fontSize: '0.8rem'}}>{field.replace(/([A-Z])/g, ' $1').trim()}</label>
                          <input type="number" className="form-control bg-white" name={field} value={stockFormData[field] || 0} onChange={handleStockChange} style={{borderRadius: '8px'}} />
                        </div>
                      ))}
                    </div>

                    <div className="d-flex justify-content-end mt-4 pt-3 border-top">
                       <Button variant="success" className="px-5 py-2 fw-bold shadow-sm" style={{borderRadius: '10px'}} onClick={submitNewStock} disabled={stockLoading}>
                         {stockLoading ? 'Overwriting...' : 'Overwrite Global Stock Data'}
                       </Button>
                    </div>
                  </div>
                  
                </div>
              </Tab>
            </Tabs>
          </div>
        </Container>
      </motion.div>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton style={{backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0'}}>
          <Modal.Title style={{fontWeight: 700, color: '#1e293b'}}>Edit Bill: <span className="text-primary">{editFormData.billId}</span></Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form>
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold text-muted">Total Amount (₹)</Form.Label>
              <Form.Control 
                type="number" 
                value={editFormData.totalAmount}
                onChange={(e) => setEditFormData({...editFormData, totalAmount: e.target.value})}
                size="lg"
                style={{borderRadius: '10px'}}
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold text-muted">GPay Amount (₹)</Form.Label>
              <Form.Control 
                type="number" 
                value={editFormData.gpay}
                onChange={(e) => setEditFormData({...editFormData, gpay: e.target.value})}
                size="lg"
                style={{borderRadius: '10px'}}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold text-muted">Cash Amount (₹)</Form.Label>
              <Form.Control 
                type="number" 
                value={editFormData.cash}
                onChange={(e) => setEditFormData({...editFormData, cash: e.target.value})}
                size="lg"
                style={{borderRadius: '10px'}}
              />
            </Form.Group>
            
            {editFormData.items && editFormData.items.length > 0 && (
              <>
                <hr className="my-4"/>
                <h5 className="fw-bold mb-3" style={{color: '#475569'}}>Items Details</h5>
                {editFormData.items.map((item, idx) => (
                  <div key={idx} className="p-3 mb-3 shadow-sm" style={{border: '1px solid #e2e8f0', borderRadius: '12px', backgroundColor: '#f8fafc'}}>
                    <div className="row">
                      <div className="col-md-4 mb-2">
                        <Form.Label className="text-muted fw-semibold" style={{fontSize: '0.85rem'}}>Item</Form.Label>
                        <Form.Control 
                          type="text" 
                          value={item.itemName || item.item || ''}
                          onChange={(e) => handleItemChange(idx, 'itemName', e.target.value)}
                        />
                      </div>
                      <div className="col-md-4 mb-2">
                        <Form.Label className="text-muted fw-semibold" style={{fontSize: '0.85rem'}}>Product</Form.Label>
                        <Form.Control 
                          type="text" 
                          value={item.product || ''}
                          onChange={(e) => handleItemChange(idx, 'product', e.target.value)}
                        />
                      </div>
                      <div className="col-md-4 mb-2">
                        <Form.Label className="text-muted fw-semibold" style={{fontSize: '0.85rem'}}>Quantity</Form.Label>
                        <Form.Control 
                          type="number" 
                          value={item.quantity || ''}
                          onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
            
          </Form>
        </Modal.Body>
        <Modal.Footer style={{borderTop: 'none', backgroundColor: '#f8fafc'}}>
          <Button variant="light" onClick={() => setShowEditModal(false)} className="fw-bold" style={{borderRadius: '10px'}}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditSubmit} className="fw-bold px-4" style={{borderRadius: '10px'}}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Admin;

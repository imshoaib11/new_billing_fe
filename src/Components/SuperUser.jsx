import React, { useState } from 'react';
import { Tab, Tabs, Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import TopBar from './TopBar';
import { motion } from 'framer-motion';
import AxiosService from '../Utills/AxiosService';
import ApiRoutes from '../Utills/ApiRoutes';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

function SuperUser() {
  const [key, setKey] = useState('eom');

  // --- EOM State & Handlers ---
  const [eomData, setEomData] = useState({
    month: new Date().toLocaleString('default', { month: 'short' }),
    year: new Date().getFullYear(),
    rawTotalCashSales: 0,
    totalGpaySales: 0,
    dailyExpense: 0,
    rent: '', salary1: '', tea: '', papa1: '', purchase1: '', misc1: '',
    abi1: '', abi2: '', abi3: '', papa2: '', salary2: '', purchase2: '', misc2: '',
    notes: ''
  });

  const [summaryData, setSummaryData] = useState(null);
  const [summarySearch, setSummarySearch] = useState({
    month: new Date().toLocaleString('default', { month: 'short' }),
    year: new Date().getFullYear()
  });

  const [insightData, setInsightData] = useState(null);
  const [insightSearch, setInsightSearch] = useState({
    month: new Date().toLocaleString('default', { month: 'short' }),
    year: new Date().getFullYear()
  });

  const displayedTotalCash = eomData.rawTotalCashSales - eomData.dailyExpense;
  const cashExpenses = Number(eomData.rent) + Number(eomData.salary1) + Number(eomData.tea) + Number(eomData.papa1) + Number(eomData.purchase1) + Number(eomData.misc1);
  const cashLeft = displayedTotalCash - cashExpenses;

  const gpayExpenses = Number(eomData.abi1) + Number(eomData.abi2) + Number(eomData.abi3) + Number(eomData.papa2) + Number(eomData.salary2) + Number(eomData.purchase2) + Number(eomData.misc2);
  const gpayLeft = eomData.totalGpaySales - gpayExpenses;

  const totalExpense = cashExpenses + gpayExpenses;
  const totalSales = eomData.rawTotalCashSales + eomData.totalGpaySales;
  const overallBalance = cashLeft + gpayLeft;

  const currentUser = sessionStorage.getItem('currentUser') || 'Admin';

  const handleEomChange = (e) => setEomData({ ...eomData, [e.target.name]: e.target.value });

  const handleSummarySearchChange = (e) => setSummarySearch({ ...summarySearch, [e.target.name]: e.target.value });
  const handleInsightSearchChange = (e) => setInsightSearch({ ...insightSearch, [e.target.name]: e.target.value });

  const handleFetchInsight = async () => {
    try {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthIdx = monthNames.indexOf(insightSearch.month) + 1;

      const res = await AxiosService.get(`/${ApiRoutes.MONTHLY_EXPENSES.path}?month=${monthIdx}&year=${insightSearch.year}`);
      if (res && res.data && res.data.length > 0) {
        setInsightData(res.data);
        toast.success("Insights ledger securely retrieved!");
      } else {
        setInsightData(null);
        toast.error("No daily expense logs found for this period.");
      }
    } catch (err) {
      toast.error('Failed to fetch insights data');
      setInsightData(null);
    }
  };

  const handleFetchSummary = async () => {
    try {
      const res = await AxiosService.get(`/${ApiRoutes.EOM_BILLS.path}?month=${summarySearch.month}&year=${summarySearch.year}`);
      if (res && res._id) {
        setSummaryData(res);
        toast.success("Summary ledger securely retrieved!");
      } else {
        setSummaryData(null);
        toast.error("No stored EOM data found for this period.");
      }
    } catch (err) {
      toast.error('Failed to fetch summary data');
      setSummaryData(null);
    }
  };

  const handleFetchMonthly = async () => {
    try {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthIdx = monthNames.indexOf(eomData.month) + 1;

      const res = await AxiosService.get(`/${ApiRoutes.MONTHLY_BILLS.path}?month=${monthIdx}&year=${eomData.year}`);

      let dailyTotal = 0;
      try {
        const dRes = await AxiosService.get(`/${ApiRoutes.MONTHLY_EXPENSES.path}?month=${monthIdx}&year=${eomData.year}`);
        dailyTotal = dRes.totalExpense || dRes.data?.totalExpense || 0;
      } catch (err) {
        console.warn('Failed to fetch daily expense aggregation', err);
      }

      let bills = res.data?.data || res.data;
      if (Array.isArray(bills)) {
        let cash = 0; let gpay = 0;
        bills.forEach(b => { cash += Number(b.cash || 0); gpay += Number(b.gpay || 0); });
        setEomData(prev => ({ ...prev, rawTotalCashSales: cash, totalGpaySales: gpay, dailyExpense: dailyTotal }));
        toast.success(`Successfully fetched sales & expense arrays for ${eomData.month} ${eomData.year}`);
      }
    } catch (err) {
      toast.error('Failed to fetch monthly data records');
    }
  };

  const submitEOM = async () => {
    try {
      const payload = {
        month: eomData.month, year: Number(eomData.year),
        totalCash: displayedTotalCash,
        rent: Number(eomData.rent), salary1: Number(eomData.salary1), tea: Number(eomData.tea), papa1: Number(eomData.papa1), purchase1: Number(eomData.purchase1), misc1: Number(eomData.misc1),
        totalGpay: eomData.totalGpaySales,
        abi1: Number(eomData.abi1), abi2: Number(eomData.abi2), abi3: Number(eomData.abi3), papa2: Number(eomData.papa2), salary2: Number(eomData.salary2), purchase2: Number(eomData.purchase2), misc2: Number(eomData.misc2),
        totalExpense, totalSales, cashLeft, gpayLeft,
        overallBalance: overallBalance,
        notes: eomData.notes, user: currentUser
      };
      await AxiosService.post(`/${ApiRoutes.EOM.path}`, payload);

      Swal.fire({
        title: 'Success!',
        text: 'EOM successfully consolidated & secured!',
        icon: 'success',
        confirmButtonText: 'Awesome'
      });

      setEomData({
        month: new Date().toLocaleString('default', { month: 'short' }),
        year: new Date().getFullYear(),
        rawTotalCashSales: 0,
        totalGpaySales: 0,
        dailyExpense: 0,
        rent: '', salary1: '', tea: '', papa1: '', purchase1: '', misc1: '',
        abi1: '', abi2: '', abi3: '', papa2: '', salary2: '', purchase2: '', misc2: '',
        notes: ''
      });
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to push EOM storage hook");
    }
  };

  // --- Purchase Details State & Handlers ---
  const initialPurchaseState = {
    date: '', amount: '', abiCredit: 0, fullSleeve: 0, halfSleeve: 0, fiSleeve: 0,
    collar: 0, hoodie: 0, trackPant: 0, shorts: 0, comboTshirt: 0, comboShorts: 0, purchasedBy: currentUser
  };
  const [purchaseFormData, setPurchaseFormData] = useState(initialPurchaseState);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [purchaseFilter, setPurchaseFilter] = useState({ month: (new Date().getMonth() + 1).toString().padStart(2, '0'), year: new Date().getFullYear().toString() });
  const [historyLoading, setHistoryLoading] = useState(false);
  const [activePurchaseTab, setActivePurchaseTab] = useState('add');
  const [isSearched, setIsSearched] = useState(false);

  const handlePurchaseChange = (e) => {
    const { name, value } = e.target;
    setPurchaseFormData({ ...purchaseFormData, [name]: name === 'date' || name === 'purchasedBy' ? value : (value === '' ? '' : Number(value)) });
  };

  const submitPurchase = async () => {
    if (!purchaseFormData.date || !purchaseFormData.amount || !purchaseFormData.purchasedBy) {
      toast.error('Date, Amount, and Purchased By are required');
      return;
    }
    setPurchaseLoading(true);
    try {
      let formattedDate = purchaseFormData.date;
      if (formattedDate.includes('-')) {
        const [y, m, d] = formattedDate.split('-');
        formattedDate = `${d}/${m}/${y}`;
      }

      const payload = { ...purchaseFormData, date: formattedDate };
      await AxiosService.post(ApiRoutes.ADD_PURCHASE.path, payload);

      if (Number(purchaseFormData.abiCredit) > 0) {
        let currentPending = paymentFormData.abiPending || 0;
        let lastCreditId = null;
        try {
            const cRes = await AxiosService.get(`/${ApiRoutes.ALL_CREDIT.path.replace(/^\//,'')}`);
            const credits = cRes.data || cRes;
            if (Array.isArray(credits) && credits.length > 0) {
               const lastCredit = credits[credits.length - 1];
               currentPending = lastCredit.abiPending || 0;
               lastCreditId = lastCredit._id;
            }
        } catch (e) {
            console.error("Error fetching credit history", e);
        }
        
        const newAbiPending = currentPending + Number(purchaseFormData.abiCredit);
        
        if (lastCreditId) {
            await AxiosService.put(`${ApiRoutes.UPDATE_CREDIT.path}/${lastCreditId}`, { abiPending: newAbiPending });
        } else {
            const creditPayload = {
              amountPaid: 0,
              paidDate: formattedDate,
              paidBy: currentUser,
              abiPending: newAbiPending
            };
            await AxiosService.post(ApiRoutes.ADD_CREDIT.path, creditPayload);
        }
        setPaymentFormData(prev => ({ ...prev, abiPending: newAbiPending }));
      }

      toast.success('Purchase details added successfully!');
      setPurchaseFormData(initialPurchaseState);
    } catch (err) {
      toast.error('Failed to add purchase');
    } finally {
      setPurchaseLoading(false);
    }
  };

  const fetchPurchaseHistory = async (isDefault = false) => {
    setHistoryLoading(true);
    setPurchaseHistory([]);
    setIsSearched(!isDefault);
    try {
      let res;
      if (isDefault) {
        res = await AxiosService.get(`/${ApiRoutes.ALL_PURCHASES.path.replace(/^\//, '')}`);
        const data = res.data || res;
        if (Array.isArray(data) && data.length > 0) {
          setPurchaseHistory([data[data.length - 1]]);
        } else {
          setPurchaseHistory([]);
        }
      } else {
        const { month, year } = purchaseFilter;
        // Use leading slash for consistency with other backend calls
        const path = `/${ApiRoutes.MONTHLY_PURCHASES.path.replace(/^\//, '')}?month=${month}&year=${year}`;
        res = await AxiosService.get(path);
        const data = res.data || res;
        setPurchaseHistory(Array.isArray(data) ? data : []);
        if (data.length === 0) toast.error('No purchases found for the selected period');
      }
    } catch (err) {
      toast.error('Failed to fetch purchase history');
    } finally {
      setHistoryLoading(false);
    }
  };

  React.useEffect(() => {
    if (key === 'purchasedetails') {
      fetchPurchaseHistory(true);
    }
  }, [key]);

  // --- Credit & Payments State & Handlers ---
  const initialPaymentState = {
    abiPending: 0, amountPaid: '', paidDate: '', paidBy: currentUser
  };
  const [paymentFormData, setPaymentFormData] = useState(initialPaymentState);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [paymentFilter, setPaymentFilter] = useState({ month: (new Date().getMonth() + 1).toString().padStart(2, '0'), year: new Date().getFullYear().toString() });
  const [payHistoryLoading, setPayHistoryLoading] = useState(false);
  const [activePaymentTab, setActivePaymentTab] = useState('pay');

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentFormData({ ...paymentFormData, [name]: name === 'paidDate' ? value : (value === '' ? '' : Number(value)) });
  };

  const fetchPendingAbi = async () => {
    try {
      const cRes = await AxiosService.get(`/${ApiRoutes.ALL_CREDIT.path.replace(/^\//,'')}`);
      
      const credits = cRes.data || cRes;
      let currentPending = 0;
      
      if (Array.isArray(credits) && credits.length > 0) {
        // Retrieve the abiPending value from the very last (latest) credit record
        const lastCredit = credits[credits.length - 1];
        currentPending = lastCredit.abiPending || 0;
      }
      
      setPaymentFormData(prev => ({ ...prev, abiPending: currentPending }));
    } catch (err) {
      toast.error('Failed to fetch pending Abi');
    }
  };

  const submitPayment = async () => {
    if (!paymentFormData.paidDate || !paymentFormData.amountPaid) {
      toast.error('Payment Date and Amount Paid are required');
      return;
    }
    setPaymentLoading(true);
    try {
      let formattedDate = paymentFormData.paidDate;
      if (formattedDate.includes('-')) {
        const [y, m, d] = formattedDate.split('-');
        formattedDate = `${d}/${m}/${y}`;
      }
      
      const amountPaidNum = Number(paymentFormData.amountPaid);
      const newAbiPending = paymentFormData.abiPending - amountPaidNum;
      const payload = { 
          ...paymentFormData, 
          paidDate: formattedDate,
          abiPending: newAbiPending,
          paidBy: currentUser
      };
      await AxiosService.post(ApiRoutes.ADD_CREDIT.path, payload);
      toast.success('Payment recorded successfully!');
      setPaymentFormData(initialPaymentState);
      fetchPendingAbi(); // Refresh balance
    } catch (err) {
      toast.error('Failed to record payment');
    } finally {
      setPaymentLoading(false);
    }
  };

  const fetchPaymentHistory = async (isDefault = false) => {
    setPayHistoryLoading(true);
    setPaymentHistory([]);
    try {
      let res;
      if (isDefault) {
        res = await AxiosService.get(`/${ApiRoutes.ALL_CREDIT.path.replace(/^\//,'')}`);
        const data = res.data || res;
        if (Array.isArray(data) && data.length > 0) {
          setPaymentHistory([data[data.length - 1]]); 
        } else {
          setPaymentHistory([]);
        }
      } else {
        const { month, year } = paymentFilter;
        const path = `/${ApiRoutes.MONTHLY_CREDIT.path.replace(/^\//,'')}?month=${month}&year=${year}`;
        res = await AxiosService.get(path);
        const data = res.data || res;
        setPaymentHistory(Array.isArray(data) ? data : []);
        if (data.length === 0) toast.error('No payments found for the selected period');
      }
    } catch (err) {
      toast.error('Failed to fetch payment summary');
    } finally {
      setPayHistoryLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPendingAbi(); // Always fetch abi pending so it's ready for EOM & Credit tabs
    if (key === 'creditpayments') {
      fetchPaymentHistory(true);
    }
  }, [key]);
  // ----------------------------

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
              <i className="fa-solid fa-crown me-3" style={{ color: '#f59e0b' }}></i>
              Super User Dashboard
            </h2>
          </div>

          <div className="shadow-sm p-4 rounded bg-white" style={{ border: '1px solid #e2e8f0' }}>
            <Tabs
              id="superuser-tabs"
              activeKey={key}
              onSelect={(k) => setKey(k)}
              className="mb-4 custom-tabs"
            >
              <Tab eventKey="eom" title={<span><i className="fa-solid fa-calendar-check me-2"></i>EOM</span>}>
                <div className="p-3 mt-2">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 style={{ color: '#4f46e5', fontWeight: 600 }}>End Of Month Config</h4>
                    <div className="d-flex gap-2">
                      <Form.Select style={{ width: '120px', borderRadius: '10px' }} name="month" value={eomData.month} onChange={handleEomChange}>
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => <option key={m} value={m}>{m}</option>)}
                      </Form.Select>
                      <Form.Control type="number" style={{ width: '100px', borderRadius: '10px' }} name="year" value={eomData.year} onChange={handleEomChange} />
                      <Button variant="primary" style={{ borderRadius: '10px' }} onClick={handleFetchMonthly}>Go</Button>
                    </div>
                  </div>
                  <hr />

                  <Row className="gx-4">
                    {/* DIV 1: Cash Breakdown */}
                    <Col md={4} className="mb-4">
                      <Card className="h-100 shadow-sm border-0 bg-light" style={{ borderRadius: '12px' }}>
                        <Card.Body>
                          <h5 className="fw-bold mb-4" style={{ color: '#10b981' }}><i className="fa-solid fa-money-bill-wave me-2"></i>Cash Breakdown</h5>

                          <Form.Group className="mb-3">
                            <Form.Label className="text-muted fw-bold" style={{ fontSize: '0.85rem' }}>TOTAL CASH SALES</Form.Label>
                            <Form.Control type="number" value={displayedTotalCash} disabled className="fw-bold bg-white" />
                          </Form.Group>
                          <Form.Group className="mb-4">
                            <Form.Label className="text-muted fw-bold" style={{ fontSize: '0.85rem' }}>DAILY EXPENSE</Form.Label>
                            <Form.Control type="number" value={eomData.dailyExpense} disabled className="fw-bold bg-white" />
                          </Form.Group>

                          <div className="border-top pt-3">
                            <h6 className="text-muted fw-bold mb-3" style={{ fontSize: '0.8rem' }}>EXPENSES DEDUCTIONS</h6>
                            <Form.Group className="mb-2 d-flex align-items-center"><Form.Label className="mb-0 me-3 w-50" style={{ fontSize: '0.9rem' }}>Rent</Form.Label><Form.Control type="number" name="rent" value={eomData.rent} onChange={handleEomChange} size="sm" /></Form.Group>
                            <Form.Group className="mb-2 d-flex align-items-center"><Form.Label className="mb-0 me-3 w-50" style={{ fontSize: '0.9rem' }}>Salary-I</Form.Label><Form.Control type="number" name="salary1" value={eomData.salary1} onChange={handleEomChange} size="sm" /></Form.Group>
                            <Form.Group className="mb-2 d-flex align-items-center"><Form.Label className="mb-0 me-3 w-50" style={{ fontSize: '0.9rem' }}>Tea</Form.Label><Form.Control type="number" name="tea" value={eomData.tea} onChange={handleEomChange} size="sm" /></Form.Group>
                            <Form.Group className="mb-2 d-flex align-items-center"><Form.Label className="mb-0 me-3 w-50" style={{ fontSize: '0.9rem' }}>Papa-I</Form.Label><Form.Control type="number" name="papa1" value={eomData.papa1} onChange={handleEomChange} size="sm" /></Form.Group>
                            <Form.Group className="mb-2 d-flex align-items-center"><Form.Label className="mb-0 me-3 w-50" style={{ fontSize: '0.9rem' }}>Purchase-I</Form.Label><Form.Control type="number" name="purchase1" value={eomData.purchase1} onChange={handleEomChange} size="sm" /></Form.Group>
                            <Form.Group className="mb-4 d-flex align-items-center"><Form.Label className="mb-0 me-3 w-50" style={{ fontSize: '0.9rem' }}>Misc-I</Form.Label><Form.Control type="number" name="misc1" value={eomData.misc1} onChange={handleEomChange} size="sm" /></Form.Group>
                          </div>

                          <Form.Group className="mt-auto border-top pt-3">
                            <Form.Label className="text-muted fw-bold" style={{ fontSize: '0.85rem' }}>CASH LEFT IN SYSTEM</Form.Label>
                            <Form.Control type="number" value={cashLeft} disabled className="fw-bold" style={{ backgroundColor: '#e0e7ff', color: '#4338ca' }} />
                          </Form.Group>
                        </Card.Body>
                      </Card>
                    </Col>

                    {/* DIV 2: Gpay Breakdown */}
                    <Col md={4} className="mb-4">
                      <Card className="h-100 shadow-sm border-0 bg-light" style={{ borderRadius: '12px' }}>
                        <Card.Body>
                          <h5 className="fw-bold mb-4" style={{ color: '#0ea5e9' }}><i className="fa-solid fa-mobile-screen-button me-2"></i>Gpay Breakdown</h5>

                          <Form.Group className="mb-4 pb-1">
                            <Form.Label className="text-muted fw-bold" style={{ fontSize: '0.85rem' }}>TOTAL GPAY SALES</Form.Label>
                            <Form.Control type="number" value={eomData.totalGpaySales} disabled className="fw-bold bg-white" />
                          </Form.Group>

                          <div className="border-top pt-3 mt-4">
                            <h6 className="text-muted fw-bold mb-3" style={{ fontSize: '0.8rem' }}>EXPENSES DEDUCTIONS</h6>
                            <Form.Group className="mb-2 d-flex align-items-center"><Form.Label className="mb-0 me-3 w-50" style={{ fontSize: '0.9rem' }}>ABI-I</Form.Label><Form.Control type="number" name="abi1" value={eomData.abi1} onChange={handleEomChange} size="sm" /></Form.Group>
                            <Form.Group className="mb-2 d-flex align-items-center"><Form.Label className="mb-0 me-3 w-50" style={{ fontSize: '0.9rem' }}>ABI-II</Form.Label><Form.Control type="number" name="abi2" value={eomData.abi2} onChange={handleEomChange} size="sm" /></Form.Group>
                            <Form.Group className="mb-2 d-flex align-items-center"><Form.Label className="mb-0 me-3 w-50" style={{ fontSize: '0.9rem' }}>ABI-III</Form.Label><Form.Control type="number" name="abi3" value={eomData.abi3} onChange={handleEomChange} size="sm" /></Form.Group>
                            <Form.Group className="mb-2 d-flex align-items-center"><Form.Label className="mb-0 me-3 w-50" style={{ fontSize: '0.9rem' }}>Papa-II</Form.Label><Form.Control type="number" name="papa2" value={eomData.papa2} onChange={handleEomChange} size="sm" /></Form.Group>
                            <Form.Group className="mb-2 d-flex align-items-center"><Form.Label className="mb-0 me-3 w-50" style={{ fontSize: '0.9rem' }}>Salary-II</Form.Label><Form.Control type="number" name="salary2" value={eomData.salary2} onChange={handleEomChange} size="sm" /></Form.Group>
                            <Form.Group className="mb-2 d-flex align-items-center"><Form.Label className="mb-0 me-3 w-50" style={{ fontSize: '0.9rem' }}>Purchase-II</Form.Label><Form.Control type="number" name="purchase2" value={eomData.purchase2} onChange={handleEomChange} size="sm" /></Form.Group>
                            <Form.Group className="mb-4 d-flex align-items-center"><Form.Label className="mb-0 me-3 w-50" style={{ fontSize: '0.9rem' }}>Misc-II</Form.Label><Form.Control type="number" name="misc2" value={eomData.misc2} onChange={handleEomChange} size="sm" /></Form.Group>
                          </div>

                          <Form.Group className="mt-auto border-top pt-2">
                            <Form.Label className="text-muted fw-bold" style={{ fontSize: '0.85rem' }}>GPAY LEFT IN SYSTEM</Form.Label>
                            <Form.Control type="number" value={gpayLeft} disabled className="fw-bold" style={{ backgroundColor: '#e0f2fe', color: '#0369a1' }} />
                          </Form.Group>
                          
                          <Form.Group className="mt-3 border-top pt-2">
                            <Form.Label className="text-muted fw-bold" style={{ fontSize: '0.85rem', color: '#ef4444' }}>CURRENT ABI PENDING</Form.Label>
                            <Form.Control type="number" value={paymentFormData.abiPending} disabled className="fw-bold" style={{ backgroundColor: '#fee2e2', color: '#b91c1c' }} />
                          </Form.Group>
                        </Card.Body>
                      </Card>
                    </Col>

                    {/* DIV 3: Total Break down */}
                    <Col md={4} className="mb-4">
                      <Card className="h-100 shadow-sm border-0" style={{ backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                        <Card.Body>
                          <h5 className="fw-bold mb-4" style={{ color: '#8b5cf6' }}><i className="fa-solid fa-calculator me-2"></i>Total Sales Breakdown</h5>

                          <Form.Group className="mb-3">
                            <Form.Label className="text-muted fw-bold" style={{ fontSize: '0.85rem' }}>TOTAL SALES (ALL)</Form.Label>
                            <Form.Control type="number" value={totalSales} disabled className="fw-bold bg-white" />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label className="text-muted fw-bold" style={{ fontSize: '0.85rem' }}>TOTAL EXPENSE</Form.Label>
                            <Form.Control type="number" value={totalExpense} disabled className="fw-bold bg-white text-danger" />
                          </Form.Group>

                          <div className="d-flex gap-2 mb-3">
                            <div className="w-50">
                              <Form.Label className="text-muted fw-bold" style={{ fontSize: '0.75rem' }}>CASH LEFT</Form.Label>
                              <Form.Control type="number" value={cashLeft} disabled className="fw-bold bg-white" style={{ fontSize: '0.9rem' }} />
                            </div>
                            <div className="w-50">
                              <Form.Label className="text-muted fw-bold" style={{ fontSize: '0.75rem' }}>GPAY LEFT</Form.Label>
                              <Form.Control type="number" value={gpayLeft} disabled className="fw-bold bg-white" style={{ fontSize: '0.9rem' }} />
                            </div>
                          </div>

                          <Form.Group className="mb-3">
                            <Form.Label className="text-muted fw-bold" style={{ fontSize: '0.85rem' }}>OVERALL BALANCE</Form.Label>
                            <Form.Control type="number" value={overallBalance} disabled className="fw-bold" style={{ backgroundColor: '#ecfdf5', color: '#059669', fontSize: '1.05rem' }} />
                          </Form.Group>

                          <div className="border-top pt-3 mt-2">
                            <Form.Group className="mb-3">
                              <Form.Label className="text-muted fw-bold" style={{ fontSize: '0.85rem' }}>NOTES</Form.Label>
                              <Form.Control as="textarea" rows={3} name="notes" value={eomData.notes} onChange={handleEomChange} style={{ borderRadius: '8px' }} />
                            </Form.Group>

                            <Form.Group className="mb-4">
                              <Form.Label className="text-muted fw-bold" style={{ fontSize: '0.85rem' }}>SUBMITTING USER</Form.Label>
                              <Form.Control type="text" value={currentUser} disabled className="fw-bold bg-light text-muted" />
                            </Form.Group>

                            <Button variant="success" className="w-100 fw-bold py-2 shadow-sm" style={{ borderRadius: '10px' }} onClick={submitEOM}>
                              <i className="fa-solid fa-cloud-arrow-up me-2"></i> Save EOM Records
                            </Button>
                          </div>

                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                </div>
              </Tab>

              <Tab eventKey="insights" title={<span><i className="fa-solid fa-chart-line me-2"></i>Monthly Insights</span>}>
                <div className="p-3 mt-2">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 style={{ color: '#4f46e5', fontWeight: 600 }}>Monthly Ledger Insights</h4>
                    <div className="d-flex gap-2">
                      <Form.Select style={{ width: '120px', borderRadius: '10px' }} name="month" value={insightSearch.month} onChange={handleInsightSearchChange}>
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => <option key={m} value={m}>{m}</option>)}
                      </Form.Select>
                      <Form.Control type="number" style={{ width: '100px', borderRadius: '10px' }} name="year" value={insightSearch.year} onChange={handleInsightSearchChange} />
                      <Button variant="primary" style={{ borderRadius: '10px' }} onClick={handleFetchInsight}>Go</Button>
                    </div>
                  </div>
                  <hr />

                  {insightData ? (
                    <Card className="shadow-sm border-0 mt-3" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                      <div className="table-responsive">
                        <table className="table mb-0 table-hover">
                          <thead style={{ backgroundColor: '#e0e7ff' }} className="text-muted">
                            <tr>
                              <th className="py-3 px-4 fw-bold">S.NO</th>
                              <th className="py-3 fw-bold">DATE</th>
                              <th className="py-3 fw-bold">TOTAL SALES</th>
                              <th className="py-3 fw-bold">TOTAL CASH</th>
                              <th className="py-3 fw-bold">TOTAL GPAY</th>
                              <th className="py-3 fw-bold text-danger">EXPENSE</th>
                            </tr>
                          </thead>
                          <tbody>
                            {insightData.map((row, index) => (
                              <tr key={index} className="align-middle">
                                <td className="px-4 fw-semibold text-muted">{index + 1}</td>
                                <td className="fw-bold">{row.date}</td>
                                <td className="fw-semibold">₹{row.totalSales || 0}</td>
                                <td className="fw-semibold text-success">₹{row.totalCash || 0}</td>
                                <td className="fw-semibold text-primary">₹{row.totalGpay || 0}</td>
                                <td className="fw-bold text-danger">₹{row.expense || 0}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Card>
                  ) : (
                    <div className="text-center p-5 mt-4 text-muted">
                      <i className="fa-solid fa-list-ol fa-3x mb-3 opacity-25"></i>
                      <h5 className="fw-bold">No Insights Tracked</h5>
                      <p style={{ fontSize: '0.9rem' }}>Select a standard interval and click "Go" to pull EOD analytical spreadsheets.</p>
                    </div>
                  )}

                </div>
              </Tab>

              <Tab eventKey="summary" title={<span><i className="fa-solid fa-file-invoice-dollar me-2"></i>Monthly Summary</span>}>
                <div className="p-3 mt-2">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 style={{ color: '#10b981', fontWeight: 600 }}>Monthly Ledger Summary</h4>
                    <div className="d-flex gap-2">
                      <Form.Select style={{ width: '120px', borderRadius: '10px' }} name="month" value={summarySearch.month} onChange={handleSummarySearchChange}>
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => <option key={m} value={m}>{m}</option>)}
                      </Form.Select>
                      <Form.Control type="number" style={{ width: '100px', borderRadius: '10px' }} name="year" value={summarySearch.year} onChange={handleSummarySearchChange} />
                      <Button variant="success" style={{ borderRadius: '10px' }} onClick={handleFetchSummary}>Go</Button>
                    </div>
                  </div>
                  <hr />

                  {summaryData ? (
                    <Row className="gx-4">
                      {/* Monthly Summary Div */}
                      <Col md={6} className="mb-4">
                        <Card className="h-100 shadow-sm border-0 bg-light" style={{ borderRadius: '12px' }}>
                          <Card.Body>
                            <h5 className="fw-bold mb-4" style={{ color: '#4f46e5' }}><i className="fa-solid fa-chart-pie me-2"></i>Monthly Summary</h5>

                            <Form.Group className="mb-3 d-flex align-items-center"><Form.Label className="mb-0 me-3 w-50 fw-bold text-muted" style={{ fontSize: '0.9rem' }}>TOTAL SALES</Form.Label><Form.Control type="number" value={summaryData.totalSales} disabled className="fw-bold bg-white" /></Form.Group>
                            <Form.Group className="mb-3 d-flex align-items-center"><Form.Label className="mb-0 me-3 w-50 fw-bold text-muted" style={{ fontSize: '0.9rem' }}>TOTAL EXPENSE</Form.Label><Form.Control type="number" value={summaryData.totalExpense} disabled className="fw-bold bg-white text-danger" /></Form.Group>
                            <Form.Group className="mb-3 d-flex align-items-center"><Form.Label className="mb-0 me-3 w-50 fw-bold text-muted" style={{ fontSize: '0.9rem' }}>CASH LEFT</Form.Label><Form.Control type="number" value={summaryData.cashLeft} disabled className="fw-bold bg-white" /></Form.Group>
                            <Form.Group className="mb-3 d-flex align-items-center"><Form.Label className="mb-0 me-3 w-50 fw-bold text-muted" style={{ fontSize: '0.9rem' }}>GPAY LEFT</Form.Label><Form.Control type="number" value={summaryData.gpayLeft} disabled className="fw-bold bg-white" /></Form.Group>

                            <hr className="my-4" />
                            <Form.Group className="mb-4 d-flex align-items-center"><Form.Label className="mb-0 me-3 w-50 fw-bold" style={{ color: '#059669' }}>OVERALL BALANCE</Form.Label><Form.Control type="number" value={summaryData.overallBalance || (summaryData.cashLeft + summaryData.gpayLeft)} disabled className="fw-bold" style={{ backgroundColor: '#ecfdf5', color: '#059669', fontSize: '1.1rem' }} /></Form.Group>

                            <Form.Group className="mb-3">
                              <Form.Label className="fw-bold text-muted" style={{ fontSize: '0.85rem' }}>NOTES</Form.Label>
                              <Form.Control as="textarea" rows={3} value={summaryData.notes} disabled className="bg-white" />
                            </Form.Group>
                            <Form.Group className="mb-1">
                              <Form.Label className="fw-bold text-muted" style={{ fontSize: '0.85rem' }}>COMPLETED BY</Form.Label>
                              <Form.Control type="text" value={summaryData.user} disabled className="fw-bold bg-white text-muted" />
                            </Form.Group>
                          </Card.Body>
                        </Card>
                      </Col>

                      {/* Expense List Div */}
                      <Col md={6} className="mb-4">
                        <Card className="h-100 shadow-sm border-0" style={{ backgroundColor: '#fef2f2', borderRadius: '12px' }}>
                          <Card.Body>
                            <h5 className="fw-bold mb-4" style={{ color: '#dc2626' }}><i className="fa-solid fa-receipt me-2"></i>Expense List</h5>
                            <div style={{ maxHeight: '420px', overflowY: 'auto' }} className="pe-2">
                              {[
                                { label: "Rent", val: summaryData.rent },
                                { label: "Salary-I", val: summaryData.salary1 },
                                { label: "Tea", val: summaryData.tea },
                                { label: "Papa-I", val: summaryData.papa1 },
                                { label: "Purchase-I", val: summaryData.purchase1 },
                                { label: "Misc-I", val: summaryData.misc1 },
                                { label: "ABI-I", val: summaryData.abi1 },
                                { label: "ABI-II", val: summaryData.abi2 },
                                { label: "ABI-III", val: summaryData.abi3 },
                                { label: "Papa-II", val: summaryData.papa2 },
                                { label: "Salary-II", val: summaryData.salary2 },
                                { label: "Purchase-II", val: summaryData.purchase2 },
                                { label: "Misc-II", val: summaryData.misc2 },
                              ].map((exp, idx) => (
                                <div key={idx} className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom" style={{ borderColor: '#fee2e2' }}>
                                  <span className="fw-semibold text-muted">{exp.label}</span>
                                  <span className="fw-bold text-danger">₹{exp.val || 0}</span>
                                </div>
                              ))}
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  ) : (
                    <div className="text-center p-5 mt-4 text-muted">
                      <i className="fa-solid fa-chart-bar fa-3x mb-3 opacity-25"></i>
                      <h5 className="fw-bold">No Summary Available</h5>
                      <p style={{ fontSize: '0.9rem' }}>Select a proper calendar block and click "Go" to recursively fetch EOM results natively from the datastore.</p>
                    </div>
                  )}

                </div>
              </Tab>

              <Tab eventKey="purchasedetails" title={<span><i className="fa-solid fa-cart-shopping me-2"></i>Purchase Details</span>}>
                <div className="p-3 mt-2">
                  <h4 style={{ color: '#4f46e5', fontWeight: 600 }}>Purchase Management</h4>
                  <hr />

                  <Tabs
                    activeKey={activePurchaseTab}
                    onSelect={(k) => setActivePurchaseTab(k)}
                    className="mb-4 sub-tabs"
                  >
                    <Tab eventKey="add" title="Add Purchase">
                      <div className="bg-light p-4 rounded shadow-sm" style={{ border: '1px solid #e2e8f0' }}>
                        <div className="row mb-4">
                          <div className="col-md-3 mb-3">
                            <label className="form-label fw-bold">Purchase Date</label>
                            <input type="date" className="form-control hover-shadow" name="date" value={purchaseFormData.date} onChange={handlePurchaseChange} style={{ borderRadius: '8px' }} />
                          </div>
                          <div className="col-md-3 mb-3">
                            <label className="form-label fw-bold">Purchase Amount (₹)</label>
                            <input type="number" className="form-control hover-shadow" name="amount" value={purchaseFormData.amount} onChange={handlePurchaseChange} placeholder="0" style={{ borderRadius: '8px' }} />
                          </div>
                          <div className="col-md-3 mb-3">
                            <label className="form-label fw-bold">Purchased By</label>
                            <input type="text" className="form-control bg-light text-muted" name="purchasedBy" value={currentUser} disabled style={{ borderRadius: '8px' }} />
                          </div>
                          <div className="col-md-3 mb-3">
                            <label className="form-label fw-bold">Abi Credit (₹)</label>
                            <input type="number" className="form-control hover-shadow" name="abiCredit" value={purchaseFormData.abiCredit} onChange={handlePurchaseChange} placeholder="0" style={{ borderRadius: '8px' }} />
                          </div>
                        </div>

                        <h5 className="fw-bold mb-3 border-bottom pb-2" style={{ color: '#4f46e5' }}>Stock Details</h5>
                        <div className="row mb-4">
                          {[
                            { label: 'Full Sleeve', name: 'fullSleeve' },
                            { label: 'Half Sleeve', name: 'halfSleeve' },
                            { label: '5Sleeve', name: 'fiSleeve' },
                            { label: 'Collar', name: 'collar' },
                            { label: 'Hoodie', name: 'hoodie' },
                            { label: 'Track Pant', name: 'trackPant' },
                            { label: 'Shorts', name: 'shorts' },
                            { label: 'Combo Tshirt', name: 'comboTshirt' },
                            { label: 'Combo Shorts', name: 'comboShorts' }
                          ].map(item => (
                            <div className="col-md-2 col-sm-4 mb-3" key={item.name}>
                              <label className="form-label fw-semibold text-muted" style={{ fontSize: '0.85rem' }}>{item.label}</label>
                              <input type="number" className="form-control bg-white" name={item.name} value={purchaseFormData[item.name]} onChange={handlePurchaseChange} style={{ borderRadius: '8px' }} />
                            </div>
                          ))}
                        </div>

                        <div className="d-flex justify-content-end mt-4 pt-3 border-top">
                          <Button variant="primary" className="px-5 py-2 fw-bold shadow-sm" style={{ borderRadius: '10px' }} onClick={submitPurchase} disabled={purchaseLoading}>
                            {purchaseLoading ? 'Saving...' : 'Save Purchase Details'}
                          </Button>
                        </div>
                      </div>
                    </Tab>

                    <Tab eventKey="history" title="Purchase History">
                      <div className="p-3">
                        <div className="row mb-4 align-items-end">
                          <div className="col-md-3 mb-3">
                            <label className="form-label fw-bold">Month</label>
                            <select
                              className="form-select"
                              value={purchaseFilter.month}
                              onChange={(e) => setPurchaseFilter({ ...purchaseFilter, month: e.target.value })}
                              style={{ borderRadius: '8px' }}
                            >
                              {["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"].map((m, i) => (
                                <option key={m} value={m}>{new Date(2000, i).toLocaleString('default', { month: 'long' })}</option>
                              ))}
                            </select>
                          </div>
                          <div className="col-md-3 mb-3">
                            <label className="form-label fw-bold">Year</label>
                            <input
                              type="number"
                              className="form-control"
                              value={purchaseFilter.year}
                              onChange={(e) => setPurchaseFilter({ ...purchaseFilter, year: e.target.value })}
                              style={{ borderRadius: '8px' }}
                            />
                          </div>
                          <div className="col-md-2 mb-3">
                            <Button variant="primary" className="w-100 fw-bold" onClick={() => fetchPurchaseHistory(false)} disabled={historyLoading} style={{ borderRadius: '8px' }}>
                              {historyLoading ? '...' : 'Go'}
                            </Button>
                          </div>
                        </div>

                        {purchaseHistory.length > 0 ? (
                          <div className="purchase-view-container mt-4">
                            <h5 className="mb-3 fw-bold" style={{ color: isSearched ? '#4f46e5' : '#10b981' }}>
                              <i className={`fa-solid ${isSearched ? 'fa-list' : 'fa-clock-rotate-left'} me-2`}></i>
                              {isSearched ? `Purchase Records for Selected Period` : 'Recently Added Purchase'}
                            </h5>
                            <div className="d-flex flex-wrap gap-4">
                              {purchaseHistory.map((p, idx) => (
                                <motion.div
                                  key={idx}
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="bg-white p-4 rounded shadow-sm"
                                  style={{ border: '1px solid #e2e8f0', minWidth: '350px', flex: '1 1 350px', maxWidth: '500px' }}
                                >
                                  <div className="d-flex flex-column gap-2">
                                    {[
                                      { label: 'Purchase Date', value: p.date, highlight: false },
                                      { label: 'Purchase Amount', value: `₹${p.amount}`, highlight: true, color: '#4f46e5' },
                                      { label: 'Abi Credit', value: p.abiCredit, highlight: false },
                                      { label: 'Full Sleeve', value: p.fullSleeve, highlight: false },
                                      { label: 'Half Sleeve', value: p.halfSleeve, highlight: false },
                                      { label: '5Sleeve', value: p.fiSleeve, highlight: false },
                                      { label: 'Collar', value: p.collar, highlight: false },
                                      { label: 'Hoodie', value: p.hoodie, highlight: false },
                                      { label: 'Track Pant', value: p.trackPant, highlight: false },
                                      { label: 'Shorts', value: p.shorts, highlight: false },
                                      { label: 'Combo Tshirt', value: p.comboTshirt, highlight: false },
                                      { label: 'Combo Shorts', value: p.comboShorts, highlight: false },
                                      { label: 'Purchased By', value: p.purchasedBy, highlight: true, color: '#1e293b' }
                                    ].map((row, rIdx) => (
                                      <div key={rIdx} className={`row ${rIdx !== 12 ? 'border-bottom' : ''} py-2`}>
                                        <div className="col-6 fw-bold text-muted" style={{ fontSize: '0.9rem' }}>{row.label}</div>
                                        <div className="col-1 text-center">:</div>
                                        <div className="col-5 fw-bold text-end text-sm-start" style={row.highlight ? { color: row.color } : {}}>{row.value}</div>
                                      </div>
                                    ))}
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          !historyLoading && (
                            <div className="text-center text-muted mt-5 py-5 rounded" style={{ backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1' }}>
                              <i className="fa-solid fa-receipt fa-3x mb-3 opacity-25"></i>
                              <p className="fw-medium">No purchase records found for this selection.</p>
                            </div>
                          )
                        )}
                      </div>
                    </Tab>
                  </Tabs>
                </div>
              </Tab>

              <Tab eventKey="creditpayments" title={<span><i className="fa-solid fa-hand-holding-dollar me-2"></i>Credit and Payments</span>}>
                <div className="p-3 mt-2">
                  <h4 style={{ color: '#4f46e5', fontWeight: 600 }}>Credit & Payment Management</h4>
                  <hr />
                  <Tabs
                    activeKey={activePaymentTab}
                    onSelect={(k) => setActivePaymentTab(k)}
                    className="mb-4 sub-tabs"
                  >
                    <Tab eventKey="pay" title="Payment">
                      <div className="bg-light p-4 rounded shadow-sm" style={{ border: '1px solid #e2e8f0' }}>
                        <div className="row mb-4">
                          <div className="col-md-3 mb-3">
                            <label className="form-label fw-bold" style={{color: '#ef4444'}}>Abi Pending (₹)</label>
                            <input type="number" className="form-control bg-white fw-bold" value={paymentFormData.abiPending} disabled style={{ borderRadius: '8px' }} />
                          </div>
                          <div className="col-md-3 mb-3">
                            <label className="form-label fw-bold">Amount Paid (₹)</label>
                            <input type="number" className="form-control hover-shadow" name="amountPaid" value={paymentFormData.amountPaid} onChange={handlePaymentChange} placeholder="0" style={{ borderRadius: '8px' }} />
                          </div>
                          <div className="col-md-3 mb-3">
                            <label className="form-label fw-bold">Payment Date</label>
                            <input type="date" className="form-control hover-shadow" name="paidDate" value={paymentFormData.paidDate} onChange={handlePaymentChange} style={{ borderRadius: '8px' }} />
                          </div>
                          <div className="col-md-3 mb-3">
                            <label className="form-label fw-bold">Paid By</label>
                            <input type="text" className="form-control bg-white text-muted shadow-none" value={currentUser} disabled style={{ borderRadius: '8px' }} />
                          </div>
                        </div>

                        <div className="d-flex justify-content-end mt-3">
                           <Button variant="primary" className="px-5 py-2 fw-bold shadow-sm" style={{borderRadius: '10px'}} onClick={submitPayment} disabled={paymentLoading}>
                             {paymentLoading ? 'Processing...' : 'Submit Payment'}
                           </Button>
                        </div>
                      </div>
                    </Tab>

                    <Tab eventKey="summary" title="Payment Summary">
                      <div className="p-3">
                        <div className="row mb-4 align-items-end">
                          <div className="col-md-3 mb-3">
                            <label className="form-label fw-bold">Month</label>
                            <select
                              className="form-select"
                              value={paymentFilter.month}
                              onChange={(e) => setPaymentFilter({ ...paymentFilter, month: e.target.value })}
                              style={{ borderRadius: '8px' }}
                            >
                              {["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"].map((m, i) => (
                                <option key={m} value={m}>{new Date(2000, i).toLocaleString('default', { month: 'long' })}</option>
                              ))}
                            </select>
                          </div>
                          <div className="col-md-3 mb-3">
                            <label className="form-label fw-bold">Year</label>
                            <input
                              type="number"
                              className="form-control"
                              value={paymentFilter.year}
                              onChange={(e) => setPaymentFilter({ ...paymentFilter, year: e.target.value })}
                              style={{ borderRadius: '8px' }}
                            />
                          </div>
                          <div className="col-md-2 mb-3">
                            <Button variant="primary" className="w-100 fw-bold" onClick={() => fetchPaymentHistory(false)} disabled={payHistoryLoading} style={{ borderRadius: '8px' }}>
                              {payHistoryLoading ? '...' : 'Go'}
                            </Button>
                          </div>
                        </div>

                        {paymentHistory.length > 0 ? (
                          <div className="payment-view-container mt-4">
                            <h5 className="mb-3 fw-bold" style={{ color: paymentHistory.length === 1 && !payHistoryLoading ? '#10b981' : '#4f46e5' }}>
                                <i className={`fa-solid ${paymentHistory.length === 1 && !payHistoryLoading ? 'fa-clock-rotate-left' : 'fa-list'} me-2`}></i>
                                {paymentHistory.length === 1 && !payHistoryLoading ? 'Latest Payment Recorded' : 'Payment Records for Selected Period'}
                            </h5>
                            <div className="d-flex flex-wrap gap-4">
                              {paymentHistory.map((p, idx) => (
                                <motion.div
                                  key={idx}
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="bg-white p-4 rounded shadow-sm"
                                  style={{ border: '1px solid #e2e8f0', minWidth: '350px', flex: '1 1 350px', maxWidth: '500px' }}
                                >
                                  <div className="d-flex flex-column gap-2">
                                    {[
                                      { label: 'Payment Date', value: p.paidDate, highlight: false },
                                      { label: 'Amount Paid', value: `₹${p.amountPaid}`, highlight: true, color: '#10b981' },
                                      { label: 'Previous Abi Pending', value: `₹${(p.abiPending || 0) + (p.amountPaid || 0)}`, highlight: false },
                                      { label: 'New Balance', value: `₹${p.abiPending}`, highlight: true, color: '#ef4444' },
                                      { label: 'Paid By', value: p.paidBy, highlight: true, color: '#1e293b' }
                                    ].map((row, rIdx) => (
                                      <div key={rIdx} className={`row ${rIdx !== 4 ? 'border-bottom' : ''} py-2`}>
                                        <div className="col-6 fw-bold text-muted" style={{ fontSize: '0.9rem' }}>{row.label}</div>
                                        <div className="col-1 text-center">:</div>
                                        <div className="col-5 fw-bold text-end text-sm-start" style={row.highlight ? { color: row.color } : {}}>{row.value}</div>
                                      </div>
                                    ))}
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          !payHistoryLoading && (
                            <div className="text-center text-muted mt-5 py-5 rounded" style={{ backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1' }}>
                              <i className="fa-solid fa-receipt fa-3x mb-3 opacity-25"></i>
                              <p className="fw-medium">No payment records found for this selection.</p>
                            </div>
                          )
                        )}
                      </div>
                    </Tab>
                  </Tabs>
                </div>
              </Tab>

            </Tabs>
          </div>
        </Container>
      </motion.div>
    </>
  );
}

export default SuperUser;

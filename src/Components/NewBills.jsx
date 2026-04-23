import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import TopBar from './TopBar';
import { motion } from 'framer-motion';
import AxiosService from "../Utills/AxiosService";
import ApiRoutes from "../Utills/ApiRoutes";
import toast from 'react-hot-toast';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function NewBills() {

  const currentDate = new Date();

  const date = currentDate.toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
  });

  const options = {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };

  const billTime = new Date().toLocaleString("en-IN", options);

  const [show, setShow] = useState(false);

  const [billId, setBillId] = useState("");

  const fetchAndSetBillId = async () => {
    try {
      let { data } = await AxiosService.get(ApiRoutes.VIEW_BILLS.path);
      if (data && data.length > 0) {
        const lastBill = data[data.length - 1];
        let lastIdNum = 0;
        
        if (typeof lastBill.billId === 'string' && lastBill.billId.includes('-')) {
          const parts = lastBill.billId.split('-');
          lastIdNum = parseInt(parts[1], 10);
        } else if (!isNaN(Number(lastBill.billId))) {
          lastIdNum = Number(lastBill.billId);
        } else {
          lastIdNum = data.length;
        }
        
        const nextIdNum = (isNaN(lastIdNum) ? data.length : lastIdNum) + 1;
        setBillId(`BILL-${nextIdNum}`);
      } else {
        setBillId("BILL-1");
      }
    } catch (err) {
      console.log(err);
      setBillId("BILL-1");
    }
  };

  useEffect(() => {
    fetchAndSetBillId();
  }, []);

  const [custName, setCustName] = useState("");
  const [custNo, setCustNo] = useState("");
  

  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedItemName, setSelectedItemName] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState("");
  const [billItems, setBillItems] = useState([]);
  const [gpay, setGpay] = useState("");
  const [cash, setCash] = useState("");

  const itemIdToName = {
    "1": "T-shirt",
    "2": "Track",
    "3": "Shorts",
    "4": "Combo T/S",
    "5": "Combo T/P",
    "6": "Combo Shorts",
  };

  const itemNameToId = {
    "T-shirt": "1",
    "Track": "2",
    "Shorts": "3",
    "Combo T/S": "4",
    "Combo T/P": "5",
    "Combo Shorts": "6",
  };

  const itemNameToProducts = {
    "T-shirt": ["F/S", "H/S", "5SLV", "Hoodie","Collar"],
    "Track": ["Tin Tin", "4way", "Cargo", "LP-Cuff", "LP-Dower"],
    "Shorts": ["Tin Tin-S", "4way-S", "LP-H", "Paper", "Jeans", "Cotton"],
    "Combo T/S": ["M-TS-CMB","L-TS-CMB","XL-TS-CMB"],
    "Combo T/P": ["L-TP-CMB","XL-TP-CMB","XXL-TP-CMB"],
    "Combo Shorts": ["L-CMB","XL-CMB","XXL-CMB"]
  };

  const catToPrice = {
    "Cat-1": "390",
    "Cat-2": "350",
    "Cat-3": "270",
    "Cat-4": "200",
    "Cat-5": "150",
    "Cat-6": "500",
  }

  const priceToCat = {
    "390": "Cat-1",
    "350": "Cat-2",
    "270": "Cat-3",
    "200": "Cat-4",
    "150": "Cat-5",
    "500": "Cat-6",
  }

  const handleCatChange = (e) => {
    const newCat = e.target.value;
    setSelectedCategory(newCat);
    if (newCat === "Cat-6" && selectedQuantity !== "3" && selectedQuantity !== "4") {
      setSelectedQuantity("");
    }
    if (catToPrice[newCat]) {
      setSelectedPrice(catToPrice[newCat]);
    } else {
      setSelectedPrice("");
    }
  }

  const handlePriceChange = (e) => {
    const newPrice = e.target.value;
    setSelectedPrice(newPrice);
    if (priceToCat[newPrice]) {
      const newCat = priceToCat[newPrice];
      setSelectedCategory(newCat);
      if (newCat === "Cat-6" && selectedQuantity !== "3" && selectedQuantity !== "4") {
        setSelectedQuantity("");
      }
    } else {
      setSelectedCategory("");
    }
  }

  const handleItemIdChange = (e) => {
    const newId = e.target.value;
    setSelectedItemId(newId);
    if (itemIdToName[newId]) {
      const name = itemIdToName[newId];
      setSelectedItemName(name);
      if (name === "Combo T/P") {
        setSelectedProduct("Track");
      } else if (name === "Combo T/S") {
        setSelectedProduct("T-shirt");
      } else if (name === "Combo Shorts") {
        setSelectedProduct("Shorts");
      } else {
        setSelectedProduct("");
      }
    } else {
      setSelectedItemName("");
      setSelectedProduct("");
    }
  };

  const handleItemNameChange = (e) => {
    const newName = e.target.value;
    setSelectedItemName(newName);
    if (itemNameToId[newName]) {
      setSelectedItemId(itemNameToId[newName]);
      if (newName === "Combo T/P") {
        setSelectedProduct("Track");
      } else if (newName === "Combo T/S") {
        setSelectedProduct("T-shirt");
      } else if (newName === "Combo Shorts") {
        setSelectedProduct("Shorts");
      } else {
        setSelectedProduct("");
      }
    } else {
      setSelectedItemId("");
      setSelectedProduct("");
    }
  };

  const handleAddItems = () => {
    if (!selectedItemName || !selectedProduct || !selectedCategory || !selectedPrice || !selectedSize || !selectedQuantity) {
      alert("Please select all details before adding.");
      return;
    }

    const newItem = {
      id: Date.now(),
      itemId: selectedItemId,
      item: selectedItemName,
      product: selectedProduct,
      category: selectedCategory,
      price: selectedPrice,
      size: selectedSize,
      quantity: selectedQuantity
    };

    setBillItems([...billItems, newItem]);

    // Reset fields after adding item
    setSelectedItemId("");
    setSelectedItemName("");
    setSelectedProduct("");
    setSelectedCategory("");
    setSelectedPrice("");
    setSelectedSize("");
    setSelectedQuantity("");
  };

  const handleDeleteItem = (id) => {
    setBillItems(billItems.filter(item => item.id !== id));
  };

  const handleClose = () => setShow(false);
  const handleShow = () => {
    if (!custName.trim() || !custNo.trim()) {
      alert("Please enter both Customer Name and Contact No before proceeding.");
      return;
    }
    if (billItems.length === 0) {
      alert("Please add at least one product item to the bill.");
      return;
    }
    setShow(true);
  };

  const billTotalAmount = billItems.reduce((acc, item) => {
    const itemTotal = item.category === "Cat-6" 
      ? (Number(item.price) || 0) 
      : (Number(item.price) * Number(item.quantity) || 0);
    return acc + itemTotal;
  }, 0);

  const totalPaid = (Number(gpay) || 0) + (Number(cash) || 0);
  const balance = billTotalAmount - totalPaid;

 const billPayment = async () => {
  try {
 
      await AxiosService.post(ApiRoutes.NEW_BILLS.path, {
        custName,
        custNo,
        billId,
        date,
        billTime,
        billItems: billItems.map((i) => ({
            itemId: i.itemId,
            itemName: i.item,
            product: i.product,
            category: i.category,
            price: i.price,
            size: i.size,
            quantity: i.quantity,
        })),
        gpay,
        cash,
        totalAmount: billTotalAmount
      });


    console.log("Bill added successfully");
    toast.success("Bill Paid Successfully!");
    handleClose();
    setBillItems([]);
    setCustName("");
    setCustNo("");
    setGpay("");
    setCash("");
    fetchAndSetBillId();
  } catch (error) {
    console.log(error);
  }
};

  return (
    <>
      <TopBar />
      <motion.div
        className="container-fluid mt-3"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
          }
        }}
      >

        {/* BILL + CUSTOMER DETAILS */}
        <motion.div className="row" variants={itemVariants}>

          {/* BILL DETAILS */}
          <div className="col-md-3">
            <br></br>
            <div className="mb-3 mt-3">
              <label className="form-label">Date</label>
              <input
                type="text"
                className="form-control"
                value={date}
                disabled
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Bill Id</label>
              <input type="text" className="form-control" value={billId} disabled />
            </div>

          </div>

          {/* CUSTOMER DETAILS */}
          <div className="col-md-9">
            <h4 className="mb-3">Customer Details</h4>
            <div className="col-md-3">
              <div className="mb-3">
                <label className="form-label">Customer Name</label>
                <input type="text"  value={custName}
                onChange={(e) => setCustName(e.target.value)}className="form-control" />
              </div>

              <div className="mb-3">
                <label className="form-label">Contact No</label>
                <input type="text"  value={custNo}
                onChange={(e) => setCustNo(e.target.value)}className="form-control" />
              </div>
            </div>

          </div>




        </motion.div>

        <hr />

        {/* PRODUCT DETAILS */}
        <motion.h3 className="text-center mb-4" variants={itemVariants}>Product Details</motion.h3>
        <motion.div className="container-sm" variants={itemVariants}>
          <div className="row g-3">

            <div className="col-lg-2 col-md-6">
              <label className="form-label">Item Id</label>
              <select className="form-select" value={selectedItemId} onChange={handleItemIdChange}>
                <option value="">Choose...</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
              </select>
            </div>

            <div className="col-lg-2 col-md-6">
              <label className="form-label">Item Name</label>
              <select className="form-select" value={selectedItemName} onChange={handleItemNameChange}>
                <option value="">Choose...</option>
                <option value="T-shirt">T-shirt</option>
                <option value="Track">Track</option>
                <option value="Shorts">Shorts</option>
                <option value="Combo T/S">Combo T/S</option>
                <option value="Combo T/P">Combo T/P</option>
                <option value="Combo Shorts">Combo Shorts</option>
              </select>
            </div>

            <div className="col-lg-2 col-md-6">
              <label className="form-label">Product</label>
              <select className="form-select" value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
                <option value="">Choose...</option>                {selectedItemName && itemNameToProducts[selectedItemName]?.map((prod, index) => (
                  <option key={index} value={prod}>{prod}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>
        <div className="container-sm mt-1">
          <div className="row g-3">
            <div className="col-lg-2 col-md-3">
              <label className="form-label">Category</label>
              <select className="form-select" value={selectedCategory} onChange={handleCatChange}>
                <option>Choose...</option>
                <option value={"Cat-1"}>Cat-1</option>
                <option value={"Cat-2"}>Cat-2</option>
                <option value={"Cat-3"}>Cat-3</option>
                <option value={"Cat-4"}>Cat-4</option>
                <option value={"Cat-5"}>Cat-5</option>
                <option value={"Cat-6"}>Cat-6</option>

              </select>
            </div>

            <div className="col-lg-1 col-md-6">
              <label className="form-label">Price</label>
              <select className="form-select" value={selectedPrice} onChange={handlePriceChange}>
                <option>Choose...</option>
                <option value={"390"}>390</option>
                <option value={"350"}>350</option>
                <option value={"270"}>270</option>
                <option value={"200"}>200</option>
                <option value={"150"}>150</option>
                <option value={"500"}>500</option>
              </select>
            </div>

            <div className="col-lg-1 col-md-3">
              <label className="form-label">Size</label>
              <select className="form-select" value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
                <option value="">Choose...</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
            </div>

            <div className="col-lg-2 col-md-1">
              <label className="form-label">Quantity</label>
              <select className="form-select" value={selectedQuantity} onChange={(e) => setSelectedQuantity(e.target.value)}>
                <option value="">Choose...</option>
                {selectedCategory === "Cat-6" ? (
                  <>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </>
                ) : (
                  <>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                  </>
                )}
              </select>
            </div>

          </div>
        </div>



        {/* BUTTONS */}
        <motion.div className="text-center mt-4" variants={itemVariants}>
          <button className="btn btn-info me-3" onClick={handleAddItems}>Add Items</button>
          <button className="btn btn-secondary" onClick={() => {
            setSelectedItemId("");
            setSelectedItemName("");
            setSelectedProduct("");
            setSelectedCategory("");
            setSelectedPrice("");
            setSelectedSize("");
            setSelectedQuantity("");
          }}>Reset</button>
        </motion.div>

        {/* TABLE */}
        <motion.div className="table-responsive mt-4" variants={itemVariants}>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Item</th>
                <th scope="col">Product</th>
                <th scope="col">Category</th>
                <th scope="col">Size</th>
                <th scope="col">Quantity</th>
                <th scope="col">Price</th>
                <th scope="col">Total</th>
                <th scope="col">Delete</th>
              </tr>
            </thead>
            <tbody>
              {billItems.map((item, index) => (
                <tr key={item.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{item.item}</td>
                  <td>{item.product}</td>
                  <td>{item.category}</td>
                  <td>{item.size}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price}</td>
                  <td>{item.category === "Cat-6" ? Number(item.price) || 0 : Number(item.price) * Number(item.quantity) || 0}</td>
                  <td>
                    <i 
                      className="fa-solid fa-trash fa-lg" 
                      style={{ color: "rgb(225, 20, 20)", cursor: "pointer" }}
                      onClick={() => handleDeleteItem(item.id)}
                    ></i>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* TOTAL AMOUNT */}
        <motion.div className="text-end me-5 mb-3" variants={itemVariants}>
          <h4>Total Amount: ₹{billTotalAmount}</h4>
        </motion.div>

        {/* PROCEED BUTTON */}
        <motion.div className="text-center mt-3 mb-3" variants={itemVariants}>
          <button className="btn btn-primary" onClick={handleShow}>
            Proceed
          </button>
        </motion.div>

      </motion.div>

      {/* PAYMENT MODAL */}

      <Modal show={show} onHide={handleClose} size="sm">
        <Modal.Header closeButton>
          <Modal.Title>Payments</Modal.Title>
        </Modal.Header>

        <Modal.Body>

          <div className="mb-3">
            <label className="form-label">Total</label>
            <input type="text" className="form-control" value={billTotalAmount} disabled />
          </div>

          <div className="mb-3">
            <label className="form-label">GPAY</label>
            <input
              type="number"
              min="0"
              className="form-control"
              placeholder="0"
              value={gpay}
              onChange={(e) => setGpay(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Cash</label>
            <input
              type="number"
              min="0"
              className="form-control"
              placeholder="0"
              value={cash}
              onChange={(e) => setCash(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Total Paid</label>
            <input
              type="text"
              className="form-control"
              value={totalPaid}
              disabled
            />
          </div>

          <p style={{ color: "red", fontWeight: "bold" }}>
            Balance: ₹{balance.toFixed(2)}
          </p>

        </Modal.Body>

        <Modal.Footer>
          <Button variant="success" onClick={billPayment}>
            Pay
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>

      </Modal>
    </>
  );
}

export default NewBills;
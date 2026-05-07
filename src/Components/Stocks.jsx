import TopBar from './TopBar';
import { motion } from 'framer-motion';
import ApiRoutes from '../Utills/ApiRoutes';
import AxiosService from '../Utills/AxiosService';
import { useEffect,useState } from 'react';

const stockData = [
  { title: "T-Shirts", items: [
    { name: "FULL SLEEVE", key: "fullSleeve" },
    { name: "5 SLEEVE", key: "fiSleeve" },
    { name: "HALF SLEEVE", key: "halfSleeve" },
    { name: "COLLAR", key: "collar" },
    { name: "HOODIE", key: "hoodie" }
  ]},
  { title: "Track Pant", items: [
    { name: "TIN TIN", key: "tinTin" },
    { name: "4WAY", key: "fourWay" },
    { name: "CARGO", key: "cargo" },
    { name: "LOOPKNIT CUFF", key: "lpCuff" },
    { name: "LOOPKNIT DOWER", key: "lpDower" },
    { name: "CREEP", key: "creep" }
  ]},
  { title: "Shorts", items: [
    { name: "4WAY", key: "fourWayShorts" },
    { name: "TIN TIN", key: "tinTinShorts" },
    { name: "LOOPKNIT-H", key: "lpHigh" },
    { name: "PAPER", key: "paper" },
    { name: "JEANS", key: "jeans" },
    { name: "COTTON", key: "cotton" },
    { name: "CREEP", key: "creepShorts" }
  ]},
  { title: "T-Shirts Combo", items: [
    { name: "M", key: "mTsCmb" },
    { name: "L", key: "lTsCmb" },
    { name: "XL", key: "xlTsCmb" },
    { name: "XXL", key: "xxlTsCmb" }
  ]},
  { title: "Track Combo", items: [
    { name: "L", key: "lTpCmb" },
    { name: "XL", key: "xlTpCmb" },
    { name: "XXL", key: "xxlTpCmb" }
  ]},
  { title: "Shorts Combo", items: [
    { name: "L", key: "lCmb" },
    { name: "XL", key: "xlCmb" },
    { name: "XXL", key: "xxlCmb" }
  ]},
];

function Stocks() {

  const [stock,setStock] = useState([])
  const fetchStockData = async () => {
    try{
       let {data,message} = await AxiosService.get(ApiRoutes.ALL_STOCKS.path)
       setStock(data)
    }
    catch(err){
      console.log(err)
    }
  }

  useEffect(()=>{
    fetchStockData()
  },[])


  return (
    <>
      <TopBar />
      <div className="container-sm mt-4 mb-3 text-center">
        <h2 style={{ fontWeight: 700, color: '#111827' }}>Stock Details Overview</h2>
        <p className="text-muted">Current inventory availability across all categories.</p>
      </div>

      <motion.div 
        className="container mb-5"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }}
      >
        <div className="row g-4 justify-content-center">
          {stockData.map((category, index) => (
            <motion.div 
              className="col-lg-4 col-md-6 d-flex" 
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <div className="premium-card p-4 w-100 h-100">
                <div className="d-flex align-items-center mb-4">
                  <div className="icon-wrapper me-3" style={{ padding: '10px 14px', backgroundColor: '#4f46e515', borderRadius: '10px', color: '#4f46e5' }}>
                    <i className="fa-solid fa-box fa-lg"></i>
                  </div>
                  <h4 className="mb-0" style={{ fontWeight: 600, fontSize: '1.25rem' }}>{category.title}</h4>
                </div>
                
                {category.items.map((item, i) => {
                  const stockCount = stock && stock.length > 0 ? (stock[0][item.key] ?? 0) : 0;
                  return (
                  <div className="d-flex justify-content-between align-items-center p-2 mb-2 rounded" key={i} style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}>
                    <span style={{ fontWeight: 500, fontSize: '0.9rem', color: '#4b5563' }}>{item.name}</span>
                    <span className={`badge ${stockCount > 0 ? 'bg-success' : 'bg-danger'} rounded-pill px-3 py-2`} style={{ fontSize: '0.85rem' }}>{stockCount} in stock</span>
                  </div>
                )})}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
}

export default Stocks;

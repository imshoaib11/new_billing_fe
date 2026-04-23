import TopBar from './TopBar'
import { useEffect, useState } from 'react'
import ApiRoutes from '../Utills/ApiRoutes'
import AxiosService from '../Utills/AxiosService'

function EOD(){
            const currentDate = new Date()

            const date = currentDate.toLocaleDateString('en-IN',{timeZone:"Asia/Kolkata"})
            let [user,setUser] = useState("")
            let totalGpay = 0;
            let totalCash = 0;
            let totalSales = 0; 
            let [expense,setExpense] = useState(0)
            let bundle = 0
            let [Notes,setNotes] = useState("")
            const[bills,setBills] = useState([])
        const getSummary = async ()=>{
            try{
                let {data} = await AxiosService.get(`${ApiRoutes.VIEW_BILLS.path}`)
                console.log(data)
                setBills(data)
            }
            catch(error){
                console.log(error)
            }
        }

        useEffect(()=>{
            getSummary()
        },[])

        bills.forEach(bill => {
            if (bill.date === date) {
              totalGpay += bill.gpay;
              totalCash += bill.cash;
              totalSales += bill.totalAmount;
              bundle = Number(totalCash)-Number(expense)
            }
          });

  return <>
        <TopBar/>
        <div className='container'>
          <div className="container">
            <h2>End of Day</h2>
            <br></br>
          </div>
            <div className='mb-3'>
            <label  className="form-label">DATE</label>
            <input className="form-control ip-width" type="text" value={date} aria-label="Disabled input example" disabled />
            </div>
            <div className='mb-3'>
            <label  className="form-label">Total Sales</label>
            <input className="form-control ip-width" type="text" value={totalSales}  aria-label="Disabled input example" disabled />
            </div> 

            <div className='mb-3'>
            <label  className="form-label">Total Gpay</label>
            <input className="form-control ip-width" type="text" value={totalGpay}  aria-label="Disabled input example" disabled />
            </div>
            <div className='mb-3'>
            <label  className="form-label">Total Cash</label>
            <input className="form-control ip-width" type="text" value={totalCash}  aria-label="Disabled input example" disabled />
            </div>
            <div className='mb-3'>
            <label  className="form-label">Expense</label>
            <input type="text" className="form-control ip-width" id="exampleFormControlInput1" value={expense} onChange={(e)=>setExpense(e.target.value)} placeholder="0" />
            </div>
            
            <div className='mb-3'>
            <label  className="form-label">Bundled</label>
            <input className="form-control ip-width" type="text"  value={bundle} aria-label="Disabled input example" disabled />
            </div>

            <div className='mb-3'>
            <label  className="form-label">Closed By</label>
            <input type="text" className="form-control ip-width" id="exampleFormControlInput1" value={user} onChange={(e)=>setUser(e.target.value)} placeholder="Closed By ?"/>
            </div>

            <div className='mb-3'>
            <textarea className="form-control" id="exampleFormControlTextarea1" value={Notes} onChange={(e)=>setNotes(e.target.value)} placeholder='Enter the notes' rows="3" ></textarea>
            </div>
            
            <button className='btn btn-danger' onClick={async () => {
              if(!user || !Notes) {
                alert("Please fill User and Notes!");
                return;
              }
              try {
                await AxiosService.post(`${ApiRoutes.EOD.path}`, {
                  date,
                  totalSales,
                  totalGpay,
                  totalCash,
                  expense: Number(expense) || 0,
                  bundle,
                  user,
                  Notes
                });
                alert("EOD submitted successfully");
              } catch(err) {
                alert("Error submitting EOD: " + (err.response?.data?.message || err.message));
              }
            }}>End Sales</button>
            </div>
  </>

}

export default EOD
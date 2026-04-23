import TopBar from './TopBar'
import { useEffect, useState } from 'react'
import ApiRoutes from '../Utills/ApiRoutes'
import AxiosService from '../Utills/AxiosService'

function ViewBills() {

    const [bills,setBills] = useState([])

    const fetchBillsData = async () => {
        try{
           let {data,message} = await AxiosService.get(ApiRoutes.TODAY_BILLS.path)
           setBills(data)
           console.log(data)
        }
        catch(err){
          console.log(err)
        }
    }

    useEffect(()=>{
        fetchBillsData()
    },[])
    return <>
        <TopBar/>
          <div className='container'>
        <h3 className='mb-3'>Bills Today - {bills.length}</h3>
        <table className="table table-bordered">
        <thead>
            <tr>
            <th scope="col">#</th>
            <th scope="col">Bill No.</th>
            <th scope="col">Time</th>
            <th scope="col">GPay</th>
            <th scope="col">Cash</th>
            <th scope="col">Total</th>
            </tr>
        </thead>
        <tbody>
            {bills.map((bill,index)=>{
                return <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{bill.billId}</td>
                    <td>{bill.billTime}</td>
                    <td>{bill.gpay}</td>
                    <td>{bill.cash}</td>
                    <td>{bill.totalAmount}</td>
                </tr>
            })}
        </tbody>

        </table>
        </div>
    
    </>
}

export default ViewBills;
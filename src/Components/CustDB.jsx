import { useState,useEffect } from 'react'
import ApiRoutes from '../Utills/ApiRoutes'
import AxiosService from '../Utills/AxiosService'
import TopBar from './TopBar'

function CustDB() {
    
    const [cust,setCust] = useState([])
    const custData = async () => {
        try{
            let {data,message} = await AxiosService.get(ApiRoutes.CUSTOMERS.path)
            setCust(data)
            
        }
        catch(err){
            console.log(err)
        }
    }

    useEffect(()=>{
        custData()
    },[])


  return <>
        <TopBar/>
        <div className='container'>
            <h1>Customer Details</h1>
        </div>   
        <div className='container'>
            <table className="table table-bordered">
        <thead>
            <tr>
            <th scope="col">#</th>
            <th scope="col">Cust Id</th>
            <th scope="col">Name</th>
            <th scope="col">Contact</th>
            </tr>
        </thead>
        <tbody>
            {
                cust.map((item,index)=>{
                    return(
                        <tr key={index}>
                            <th scope="row">{index+1}</th>
                            <td>{item.custId}</td>
                            <td>{item.custName}</td>
                            <td>{item.custNo}</td>
                        </tr>
                    )
                })
            }
        </tbody>

        </table>
        </div>     
        
  </>
}

export default CustDB
import { p, path } from "framer-motion/client";

export default {
    LOGIN: {
        path: '/user/login',
        auth: false
    },
    NEW_BILLS: {
        path: '/bills/newbill'
    },
    VIEW_BILLS: {
        path: '/bills/allbills'
    },
    TODAY_BILLS: {
        path: '/bills/today'
    },
    CUSTOMERS: {
        path: '/allcustomers'
    },
    EOD: {
        path: '/daily/eod'
    },
    ALL_STOCKS: {
        path: '/allstocks'
    },
    NEW_STOCK: {
        path: '/newstock'
    },
    NEW_USER: {
        path: '/user/newuser'
    },
    ALL_USERS: {
        path: '/user/users'
    },
    DAILY_SALES: {
        path: 'bills/getbillsbydate'
    },
    SEARCH_BILL: {
        path: 'bills/getbill/:billId'
    },
    UPDATE_BILL: {
        path: 'bills/updatebill/:id'
    },
    DELETE_BILL: {
        path: 'bills/deletebill/:id'
    },
    MONTHLY_BILLS: {
        path: 'bills/getbillsbymonth'
    },
    MONTHLY_EXPENSES: {
        path: 'daily/getmonthlyexpense'
    },
    EOM: {
        path: 'eom/endofmonth'
    },
    EOM_BILLS: {
        path: 'eom/getmonthly'
    },
    ADD_PURCHASE: {
        path: 'purchase/addpurchase'
    },
    ALL_PURCHASES: {
        path: 'purchase/allpurchases'
    },
    MONTHLY_PURCHASES: {
        path: 'purchase/purchasesbymonth'
    },
    ADD_CREDIT: {
        path: 'credit/addcredit'
    },
    MONTHLY_CREDIT: {
        path: 'credit/month'
    },
    ALL_CREDIT: {
        path: 'credit/allcredits'
    },
    UPDATE_CREDIT: {
        path: 'credit/updatecredit'
    },
    VERIFY_OTP: {
        path: '/user/verify-otp',
        auth: false
    }
}
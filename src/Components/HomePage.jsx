import TopBar from "../Components/TopBar";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
  hover: { 
    scale: 1.05, 
    y: -5, 
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
  }
};

function HomePage() {
  const cards = [
    { title: "New Bill", icon: "fa-solid fa-file-invoice-dollar", color: "#4f46e5", link: "/newbills", desc: "Create and process a new bill for a customer." },
    { title: "View Bills", icon: "fa-solid fa-receipt", color: "#10b981", link: "/viewbills", desc: "Browse through history and duplicate past bills." },
    { title: "Stock Details", icon: "fa-solid fa-boxes-stacked", color: "#f59e0b", link: "/stocks", desc: "Manage current inventory and update available stock." },
    { title: "Staff", icon: "fa-solid fa-users", color: "#6366f1", link: "/staff", desc: "Manage employee profiles and attendance." },
    { title: "Customer DB", icon: "fa-solid fa-address-book", color: "#ec4899", link: "/customers", desc: "View your full directory of loyal customers." },
    { title: "EOD (Reports)", icon: "fa-solid fa-chart-line", color: "#ef4444", link: "/eod", desc: "End of Day summary and performance metrics." }
  ];

  return (
    <>
      <TopBar />
      <div className="container mt-5 mb-5">
        <motion.div 
          className="text-center mb-5"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="d-inline-flex align-items-center justify-content-center p-3 mb-3 rounded-circle" style={{ backgroundColor: "#4f46e520", color: "#4f46e5" }}>
            <i className="fa-solid fa-store fa-2x"></i>
          </div>
          <h1 style={{ fontWeight: 800, fontSize: "2.8rem", color: "var(--text-dark)", letterSpacing: "-1px" }}>
            Welcome back, <span style={{ color: "#4f46e5" }}>Prince!</span>
          </h1>
          <p className="text-muted mt-2 mx-auto" style={{ fontSize: "1.1rem", maxWidth: "600px" }}>
            Your dashboard is ready. Select an action below to manage your store, track inventory, or view your performance.
          </p>
        </motion.div>

        <motion.div 
          className="row g-4 justify-content-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {cards.map((card, index) => (
            <div className="col-lg-4 col-md-6" key={index}>
              <Link to={card.link} style={{ textDecoration: "none" }}>
                <motion.div
                  className="premium-card p-4 text-center h-100 d-flex flex-column justify-content-center align-items-center"
                  variants={cardVariants}
                  whileHover="hover"
                  style={{ cursor: "pointer", minHeight: "220px", position: 'relative', overflow: 'hidden' }}
                >
                  <div 
                    className="icon-wrapper mb-3 d-flex justify-content-center align-items-center"
                    style={{ 
                      width: "70px", 
                      height: "70px", 
                      borderRadius: "18px", 
                      backgroundColor: `${card.color}15`,
                      color: card.color,
                      transform: "rotate(-5deg)"
                    }}
                  >
                    <i className={`${card.icon} fa-2x`}></i>
                  </div>
                  <h4 style={{ color: "var(--text-dark)", fontWeight: 700 }}>{card.title}</h4>
                  <p className="text-muted small mt-2 mb-0" style={{ lineHeight: "1.5" }}>{card.desc}</p>
                </motion.div>
              </Link>
            </div>
          ))}
        </motion.div>
      </div>
    </>
  );
}

export default HomePage;
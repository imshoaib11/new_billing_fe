import TopBar from './TopBar';
import { motion } from 'framer-motion';

const staffData = [
  { name: "Mohamed Arif", phone: "8124778823", role: "Founder", address: "A6/15 New Veena Apartments, Annanagar Madurai-625020", since: "1989", icon: "fa-user-tie" },
  { name: "Mohamed Aaqib", phone: "9790357810", role: "Purchase Manager", address: "A6/15 New Veena Apartments, Annanagar Madurai-625020", since: "2021", icon: "fa-user-tag" },
  { name: "Mohamed Farid", phone: "9943630058", role: "Chief Advisor", address: "A6/15 New Veena Apartments, Annanagar Madurai-625020", since: "2021", icon: "fa-user-shield" },
  { name: "Mohamed Shoaib Ibrahim", phone: "8124778823", role: "CEO", address: "A6/15 New Veena Apartments, Annanagar Madurai-625020", since: "2021", icon: "fa-user-astronaut" },
  { name: "Ibrahim Bhai @ Abu Thahir", phone: "9943232888", role: "Manager", address: "18 Khazimaar Street 1st street Madurai-625001", since: "2022", icon: "fa-user-cog" },
  { name: "Muzeep", phone: "9597017761", role: "Supervisor", address: "18/Kasi Rajan compound Thillanayakpuram Lane South Veli Street Madurai-01", since: "2023", icon: "fa-user-check" }
];

function Staff() {
  return (
    <>
      <TopBar />
      <div className="container mt-4 mb-4 text-center">
        <h2 style={{ fontWeight: 700, color: '#111827' }}>Staff Directory</h2>
        <p className="text-muted">Company leadership and management team profiles.</p>
      </div>

      <motion.div 
        className="container mb-5"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
        }}
      >
        <div className="row g-4 justify-content-center">
          {staffData.map((person, index) => (
            <motion.div 
              className="col-lg-6" 
              key={index}
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0 }
              }}
            >
              <div className="premium-card p-4 d-flex align-items-center h-100">
                <div 
                  className="rounded-circle d-flex justify-content-center align-items-center me-4 flex-shrink-0"
                  style={{ width: '80px', height: '80px', backgroundColor: '#4f46e510', color: '#4f46e5' }}
                >
                  <i className={`fa-solid ${person.icon} fa-2x`}></i>
                </div>
                <div>
                  <h4 className="mb-1" style={{ fontWeight: 700, color: '#111827' }}>{person.name}</h4>
                  <span className="badge bg-primary rounded-pill mb-2 px-3 py-1" style={{ fontWeight: 500 }}>{person.role}</span>
                  <div className="text-muted small mb-1"><i className="fa-solid fa-phone me-2" style={{ width: '15px' }}></i>{person.phone}</div>
                  <div className="text-muted small mb-1"><i className="fa-solid fa-location-dot me-2" style={{ width: '15px' }}></i>{person.address}</div>
                  <div className="text-muted small"><i className="fa-solid fa-calendar me-2" style={{ width: '15px' }}></i>On duty since {person.since}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
}

export default Staff;
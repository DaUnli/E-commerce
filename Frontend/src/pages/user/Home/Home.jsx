import Navbar from "../../../components/Navbar/Navbar";
import styles from "./Home.module.scss";
import Sidebar from "../../../components/Sidebar/Sidebar";


const Home = () => {
  return (
    <div className={styles.container}>
      <Navbar />
      <Sidebar />

      <div></div>
    </div>  
  );
};

export default Home;
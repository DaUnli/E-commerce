import React, { useState, useEffect } from "react"; // Capitalized React & added useEffect
import Navbar from "../../components/Navbar/Navbar";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner"; // Import your spinner
import styles from "./Home.module.scss";
import sample from "../../assets/sample.png"
import Cheackout from "../Cheackout/Cheackout";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSpinner fullScreen={true} size="large" />;
  }

  return (
    <>
      <Navbar />
      <div className={styles.container}>

        <main className={styles.content}>
          <img src={sample} alt="sample" className={styles.sample} />

        </main>
        <div className={styles.product}>
          <Cheackout />
        </div>
      </div>
    </>
  );
};

export default Home;
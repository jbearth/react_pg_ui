import Image from "next/image";
import styles from "./page.module.css";
import DataForm from "@/app/DataForm";

const Home = () => {
  return (
    <main className={styles.main}>
      <DataForm />
    </main>
  );
};

export default Home;

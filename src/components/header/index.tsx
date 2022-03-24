import Image from "next/image";
import { SignInbuttom } from "../signInbuttom";
import styles from "./styles.module.scss";

export function Header() {
  return (
    <>
      <header className={styles.headerContainer}>
        <div className={styles.headerContent}>
          <Image src="/images/logo.svg" height={100} width={100} alt="logo" />
          <nav>
            <a className={styles.active}>Home</a>
            <a>Posts</a>
          </nav>
          <SignInbuttom/>
        </div>
      </header>
    </>
  );
}

// O header vai estar em toda aplicação, então vai ser importado no _app.tsx;
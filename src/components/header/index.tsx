/* eslint-disable @next/next/link-passhref */
import Image from "next/image";
import Link from "next/link";
import { ActiveLink } from "../ActiveLink";
import { SignInbuttom } from "../signInbuttom";
import styles from "./styles.module.scss";

export function Header() {
  return (
    <>
      <header className={styles.headerContainer}>
        <div className={styles.headerContent}>
          <Link href="/">
            <a className={styles.svgLog}>
              <Image
                src="/images/logo.svg"
                height={100}
                width={100}
                alt="logo"
              />
            </a>
          </Link>
          <nav>
            <ActiveLink activeClassName={styles.active} href="/">
              <a>Home</a>
            </ActiveLink>
            <ActiveLink activeClassName={styles.active} href="/posts">
              <a>Posts</a>
            </ActiveLink>
          </nav>
          <SignInbuttom />
        </div>
      </header>
    </>
  );
}

// O header vai estar em toda aplicação, então vai ser importado no _app.tsx;

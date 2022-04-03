/* eslint-disable @next/next/no-img-element */
import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import styles from "./styles.module.scss";
import Tooltip from "@mui/material/Tooltip";
import { signIn, signOut, useSession } from "next-auth/react";

export function SignInbuttom() {
  const { data: session } = useSession();

  return session ? (
    <Tooltip title="Logout" placement="bottom">
      <button
        type="button"
        className={styles.signInbutton}
        onClick={() => signOut()}
      >
        <img src={session.user.image} alt="iamge" />
        {session.user.name}

        <FiX color="#737380" className={styles.closeIcon} />
      </button>
    </Tooltip>
  ) : (
    <button
      type="button"
      className={styles.signInbutton}
      onClick={() => signIn("github")}
    >
      <FaGithub color="#eba417" />
      Sign in with Github
    </button>
  );
}

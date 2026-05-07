import styles from "./volt-button.module.css";

type VoltButtonProps = {
  text: string;
};

export function VoltButton({ text }: VoltButtonProps) {
  return <button className={styles.voltButton}>{text}</button>;
}

import styles from "./volt-button.module.css";

type VoltButtonProps = {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
};

export function VoltButton({ text, onClick, disabled = false }: VoltButtonProps) {
  return (
    <button type="button" className={styles.voltButton} onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
}

import styles from "./volt-button.module.css";

type VoltButtonProps = {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  muted?: boolean;
};

export function VoltButton({
  text,
  onClick,
  disabled = false,
  fullWidth = false,
  muted = false,
}: VoltButtonProps) {
  return (
    <button
      type="button"
      className={`${styles.voltButton} ${fullWidth ? styles.fullWidth : ""} ${muted ? styles.muted : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}

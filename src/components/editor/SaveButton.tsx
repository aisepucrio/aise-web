import { Button } from "@mantine/core";
import { IconDeviceFloppy } from "@tabler/icons-react";

interface SaveButtonProps {
  onClick: () => void;
  loading: boolean;
  disabled?: boolean;
  loadingText?: string;
  text?: string;
}

export default function SaveButton({
  onClick,
  loading,
  disabled = false,
  loadingText = "Salvando...",
  text = "Salvar Alterações",
}: SaveButtonProps) {
  return (
    <Button
      leftSection={<IconDeviceFloppy size={18} />}
      color="green"
      onClick={onClick}
      disabled={disabled}
      loading={loading}
    >
      {loading ? loadingText : text}
    </Button>
  );
}

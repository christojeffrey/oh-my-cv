import { toast as sonnerToast } from "sonner";

export type ToastType = "success" | "error" | "info" | "warning";

class ToastService {
  save(): void {
    this.success("Your changes have been saved");
  }

  switch(name: string): void {
    this.success(`Switched to resume "${name}"`);
  }

  delete(name: string): void {
    this.success(`Resume "${name}" has been deleted`);
  }

  new(): void {
    this.success("New resume created");
  }

  duplicate(newName: string, oldName: string): void {
    this.success(`Created resume "${oldName}"'s duplication "${newName}"`);
  }

  correct(num: number): void {
    this.success(`Corrected ${num} words`);
  }

  correctAllGood(): void {
    this.success("All case are correct!");
  }

  import(success: boolean): void {
    if (success) {
      this.success("Data has been successfully imported!");
    } else {
      this.error("Data format is invalid.");
    }
  }

  export(): void {
    this.success("Resume exported successfully");
  }

  success(message: string): void {
    sonnerToast.success(message);
  }

  error(message: string): void {
    sonnerToast.error(message);
  }

  info(message: string): void {
    sonnerToast.info(message);
  }

  warning(message: string): void {
    sonnerToast.warning(message);
  }
}

export const toast = new ToastService();

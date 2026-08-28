import axios from "axios";

export function getDefermentErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const apiMessage = (error.response?.data as { message?: string } | undefined)
      ?.message;

    if (status === 409) {
      return (
        (typeof apiMessage === "string" && apiMessage.trim()) ||
        "You have already submitted a deferment request."
      );
    }

    if (status === 422) {
      return (
        (typeof apiMessage === "string" && apiMessage.trim()) ||
        "Unable to submit your request. Please check that you are enrolled and your details are correct."
      );
    }

    if (status === 401) {
      return "Please sign in to submit your deferment request.";
    }

    if (typeof apiMessage === "string" && apiMessage.trim()) {
      return apiMessage.trim();
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message.trim();
  }

  return "Failed to submit deferment request. Please try again.";
}

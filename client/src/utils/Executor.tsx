import {errorMessageFromUnknown, notifyError} from "@utils/notify";

export const execute = async (action: () => Promise<void> | void) => {
  try {
    if (typeof action === "function") {
      await action();
    }
  } catch (error: unknown) {
    console.error(error);
    notifyError(errorMessageFromUnknown(error));
  }
};

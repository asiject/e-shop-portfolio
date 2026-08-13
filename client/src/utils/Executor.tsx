export const execute = async (action: any) => {
  try {
    if (typeof action == "function") {
      await action();
    }
  } catch (error: any) {
    if (error?.response) {
      console.error(error?.response);
      // const {
      //   data: { message },
      // } = error?.response;
      // enqueueSnackbar(message, { variant: "error" });
    } else {
      console.error(error);
      // enqueueSnackbar(error, { variant: "error" });
    }
  }
};

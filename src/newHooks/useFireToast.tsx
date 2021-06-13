import { Box, ToastPosition, useToast } from "@chakra-ui/react";
import React from "react";
import { isMobile } from "react-device-detect";
import {
  ToastError,
  ToastSuccess,
  ToastWarning,
} from "../newComponents/CustomToasts";

const useFireToast = () => {
  const TOAST_POSITION = isMobile
    ? ("bottom" as ToastPosition)
    : ("top-right" as ToastPosition);

  const DURATION: number = 2500;

  const toast = useToast();

  const toastSuccess = (title: string, description?: string) => {
    toast({
      position: TOAST_POSITION,
      render: () => <ToastSuccess title={title} description={description} />,
      duration: DURATION,
      isClosable: true,
    });
  };

  const toastError = (title: string, description?: string) => {
    toast({
      position: TOAST_POSITION,
      render: () => <ToastError title={title} description={description} />,
      duration: DURATION,
      isClosable: true,
    });
  };

  const toastWarning = (title: string, description?: string) => {
    toast({
      position: TOAST_POSITION,
      render: () => <ToastWarning title={title} description={description} />,
      duration: DURATION,
      isClosable: true,
    });
  };

  return { toastSuccess, toastError, toastWarning };
};

export default useFireToast;

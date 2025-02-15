import React from "react";

export type Steppers = {
  label: string;
  icon: React.ReactNode;
  key?: string;
};
type Props = {
  steppers: Steppers[];
};

const useStepper = ({ steppers }: Props) => {
  const [activeStep, setActiveStep] = React.useState(0);

  return {
    activeStep,
    setActiveStep,
    steppers,
    goBack: (number?: number) => {
      if (number) {
        setActiveStep(number);
      } else {
        setActiveStep((prev) => prev - 1);
      }
    },
    goNext: (number?: number) => {
      if (number) {
        setActiveStep(number);
      } else {
        setActiveStep((prev) => prev + 1);
      }
    },
  };
};

export default useStepper;

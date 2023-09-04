import taxi from "assets/images/3644592.jpg";
import { createContext } from "react";

export const FormContext = createContext({
  bgImage: taxi,
  heading: "Taxi",
  name: "Taxi",
  value: "taxi",
  icon: "local_taxi_icon",
});
export const ActiveStepperContext = createContext({
  activeStepper: 0,
  increaseStepperValue: () => {},
  decreaseStepperValue: () => {},
});

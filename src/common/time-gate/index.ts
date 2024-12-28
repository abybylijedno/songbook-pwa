import { FIFOTimeGate } from "./FIFOTimeGate";
import { FILOTimeGate } from "./FILOTimeGate";
import { LIFOTimeGate } from "./LIFOTimeGate";

export const fifoTimeGate = (timeWindow: number, callback: Function) => {
  const gate = new FIFOTimeGate(timeWindow, callback);
  return gate.welcomeFunction.bind(gate);
};

export const filoTimeGate = (timeWindow: number, callback: Function) => {
  const gate = new FILOTimeGate(timeWindow, callback);
  return gate.welcomeFunction.bind(gate);
};

export const lifoTimeGate = (timeWindow: number, callback: Function) => {
  const gate = new LIFOTimeGate(timeWindow, callback);
  return gate.welcomeFunction.bind(gate);
};

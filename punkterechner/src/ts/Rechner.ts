import { getController, Controller } from "./Controller";
import { recordsHistory } from "./RecordsHistory";

var rechner = getController();
rechner.configure("Calculator", recordsHistory);
rechner.initialize();
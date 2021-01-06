import { Sexes } from "./Sexes";
import { Types } from "./Types";
import { Record } from "./Record";
import { Discipline } from "./Discipline";
import { Agegroup } from "./Agegroup";
import { Year } from "./Year";
import { getController, Controller } from "./Controller";
import { data } from "./Data";

var rechner = getController();
rechner.configure("Calculator", data);
rechner.initialize();
// UI
import { ReactComponent as ArrowDropDown } from "../img/svg/arrow-drop-down.svg";
import { ReactComponent as ArrowDropUp } from "../img/svg/arrow-drop-up.svg";
import { ReactComponent as ArrowLeft } from "../img/svg/arrow-left.svg";
import { ReactComponent as ArrowRight } from "../img/svg/arrow-right.svg";

function ArrowLeftIcon() {
  return <ArrowLeft />;
}

function ArrowRightIcon() {
  return <ArrowRight />;
}

function ArrowDropDownIcon() {
  return <ArrowDropDown />;
}

function ArrowDropUpIcon() {
  return <ArrowDropUp />;
}

export { ArrowLeftIcon, ArrowRightIcon, ArrowDropDownIcon, ArrowDropUpIcon };

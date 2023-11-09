import { history, trainingActive, sharingModalActive, gradientArray } from "$lib/stores";
import { colorScheme } from "$lib/config";

export function percentageColor(value) {
  if (value >= 75) {
    return "success";
  } else if (value >= 50) {
    return "primary";
  } else if (value >= 25) {
    return "warning";
  } else if (value > 0) {
    return "orange";
  } else {
    return "danger";
  }
}

export function updateHistory(objArr) {
  objArr.forEach((obj) => {
    history.update((historyValue) => [...historyValue, obj]);

    if (obj.finished) {
      gradientArray.update((gradientValue) => [...gradientValue, colorScheme[obj.color]]);
    }
  });
}

export function toggleSharingModal() {
  trainingActive.set(false);
  sharingModalActive.update((value) => !value);
}

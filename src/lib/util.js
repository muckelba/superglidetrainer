import { history, trainingActive, sharingModalActive, gradientArray, analyticsHidden } from "$lib/stores";
import { colorScheme } from "$lib/config";
import { analyticsHidden, changelogModalActive, chartHistory, gradientArray, history, sharingModalActive, trainingActive } from "$lib/stores";

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
    if (obj.chance) {
      chartHistory.update((chartValue) => [...chartValue, obj.chance]);
    }
  });
}

export function toggleSharingModal() {
  trainingActive.set(false);
  sharingModalActive.update((value) => !value);
}

export function toggleChgangelogModal() {
  trainingActive.set(false);
  changelogModalActive.update((value) => !value);
}

export function toggleAnalytics(state) {
  analyticsHidden.update(() => state);
}

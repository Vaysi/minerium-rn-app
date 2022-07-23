import {createNavigationContainerRef} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navigate(name: string, params: {}) {
  if (navigationRef.isReady()) {
    // @ts-ignore
    navigationRef.navigate(name, params);
  }
}

export function replace(name: string) {
  if (navigationRef.isReady()) {
    // @ts-ignore
    navigationRef.replace(name);
  }
}

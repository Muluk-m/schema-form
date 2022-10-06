import { isFn } from '@v3sf/shared';
import { defaultSettingWidgets, defaultWidgets } from '../constants';
import { Widgets, SettingWidget } from '../types';

const transListMapToKeyMap = <T extends Record<string, any>>(listMap: T[], key: keyof T) =>
  listMap.reduce((acc, item) => ({ ...acc, [item[key]]: item }), {}) as Record<string, T>;

const mergeListMapByKey = <T extends Record<string, any>>(
  mainListMap: T[],
  subListMap: T[],
  key: keyof T,
  mergeHandle?: (mainItem: T, subItem: T) => T
) => {
  const result: T[] = [];
  const mainKeyMap = transListMapToKeyMap(mainListMap, key);
  const subKeyMap = transListMapToKeyMap(subListMap, key);
  const mainKeys = Object.keys(mainKeyMap);
  const subKeys = Object.keys(subKeyMap);
  const keySet = new Set([...mainKeys, ...subKeys]);

  for (const [key] of keySet.entries()) {
    if (mainKeys.includes(key)) {
      if (subKeys.includes(key) && isFn(mergeHandle)) {
        // 交集合并
        const merged = mergeHandle(mainKeyMap[key], subKeyMap[key]);
        result.push(merged);
      } else {
        // 默认取主线项
        result.push(mainKeyMap[key]);
      }
    } else {
      result.push(subKeyMap[key]);
    }
  }

  return result;
};

export const mergeSettingWidgets = (
  settings: SettingWidget[],
  defaultSettings = defaultSettingWidgets
) =>
  mergeListMapByKey(settings, defaultSettings, 'scope', (main, sub) => ({
    ...main,
    ...sub,
    widgets: mergeListMapByKey(main.widgets, sub.widgets, 'name'),
  }));

export const mergeWidgets = (widgets: Widgets) => ({ ...defaultWidgets, ...widgets });

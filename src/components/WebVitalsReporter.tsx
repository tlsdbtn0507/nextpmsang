'use client';

import { useEffect } from 'react';

type VitalsPayload = {
  name: string;
  value: number;
  rating?: string;
  id?: string;
  url?: string;
  navigationType?: string;
  ts?: number;
};

function sendVitals(metric: VitalsPayload) {
  try {
    const body = JSON.stringify(metric);
    const url = '/api/vitals';
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon(url, blob);
    } else {
      fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true });
    }
  } catch {}
}

export default function WebVitalsReporter() {
  useEffect(() => {
    // LCP
    try {
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const last = entries[entries.length - 1] as any;
        if (last) {
          sendVitals({ name: 'LCP', value: last.startTime, url: location.pathname, ts: Date.now() });
        }
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true } as any);
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') lcpObserver.disconnect();
      });
    } catch {}

    // CLS
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries() as any) {
          // 최근 입력이 없는 레이아웃 시프트만 계산
          if (!entry.hadRecentInput) clsValue += entry.value || 0;
        }
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true } as any);
      const reportCls = () => {
        sendVitals({ name: 'CLS', value: Number(clsValue.toFixed(4)), url: location.pathname, ts: Date.now() });
      };
      window.addEventListener('beforeunload', reportCls);
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          reportCls();
          clsObserver.disconnect();
        }
      });
    } catch {}

    // INP (근사): interaction 이벤트의 최대 duration을 추적
    try {
      let maxDuration = 0;
      const inpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as any) {
          // type === 'event'에서 interactionId가 있는 이벤트만 고려 (사용자 상호작용)
          if (entry.duration && entry.interactionId) {
            if (entry.duration > maxDuration) maxDuration = entry.duration;
          }
        }
      });
      inpObserver.observe({ type: 'event', buffered: true, durationThreshold: 40 } as any);
      const reportInp = () => {
        if (maxDuration > 0) {
          sendVitals({ name: 'INP', value: Math.round(maxDuration), url: location.pathname, ts: Date.now() });
        }
      };
      window.addEventListener('beforeunload', reportInp);
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          reportInp();
          inpObserver.disconnect();
        }
      });
    } catch {}
  }, []);

  return null;
}



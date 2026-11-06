// Shared public-site consent UI. No form values or document text are inspected.
import { createAnalytics, ANALYTICS_NOTICE } from './analytics.js';
const analytics = createAnalytics({ measurementId: 'G-B3WTD82CQ0', window, document });
if (analytics.snapshot().configured) {
  const aside = document.createElement('aside');
  aside.className = 'analytics-preferences';
  aside.setAttribute('aria-label', 'Website analytics preferences');
  document.body.append(aside);
  let expanded = false;
  const button = (label, action) => {
    const node = document.createElement('button');
    node.type = 'button'; node.textContent = label;
    node.addEventListener('click', action); return node;
  };
  function render() {
    const state = analytics.snapshot();
    aside.replaceChildren();
    if (state.excluded) {
      const p = document.createElement('p');
      p.textContent = 'This browser is excluded from analytics. Your visits and clicks are not recorded.';
      aside.append(p);
      if (!state.automated) aside.append(button('Include this browser again', () => analytics.setExcluded(false)));
    } else if (state.choice === null || expanded) {
      const p = document.createElement('p'); p.textContent = ANALYTICS_NOTICE;
      const actions = document.createElement('div');
      for (const [label, choice] of [['Decline analytics', 'denied'], ['Allow analytics', 'granted']]) {
        actions.append(button(label, () => { expanded = false; analytics.setConsent(choice); render(); }));
      }
      aside.append(p, actions);
    } else aside.append(button(`Analytics: ${state.choice === 'granted' ? 'on' : 'off'} · Change`, () => { expanded = true; render(); }));
  }
  analytics.subscribe(render); render();
}

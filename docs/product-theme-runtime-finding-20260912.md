# Tayoca product theme runtime finding — 2026-09-12

Scrapling live-production certification after PR #81 found one remaining v9 parity gap on product-detail pages.

Observed on `https://tayoca.com/products/aws-cost-optimization-playbook.html`:

- the page rendered successfully and returned the expected product content;
- `html[data-theme]` was absent after navigation from a dark-themed editorial page;
- no visible `.theme-switch` appeared;
- the product page loads `/tayoca-site.js`, but does not statically load `/tayoca-v9.js` or `/assets/css/tayoca-v9.css`;
- product-detail CSS already defines both light and dark token sets, so the missing runtime/controller is the primary functional gap.

Repair target:

1. make the shared Tayoca shell ensure the v9 stylesheet and controller are loaded exactly once on public pages that use `tayoca-site.js`;
2. add a product-detail route to the permanent browser theme regression;
3. validate static, route, accessibility and theme-runtime checks before merge;
4. re-certify the promoted production deployment with Scrapling;
5. remove this temporary finding document before merge if the durable regression and PR history fully capture the repair.

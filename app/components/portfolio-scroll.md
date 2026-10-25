# Portfolio smooth scrolling

`PortfolioScroll` wraps all routes once in the root layout and dynamically loads
GSAP ScrollSmoother/ScrollTrigger. Adjust `SCROLL_SMOOTH_SECONDS` in
`PortfolioScroll.tsx` (currently 0.8 seconds) to change catch-up strength. This
changes the response, not the existing hero's 1.4× scroll distance.

Desktop fine-pointer layouts at least 768px wide use the smoother. Touch, narrow
layouts, reduced-motion preferences and import failures retain native scrolling.
No demo fixed height, shapes, wheel normalizer or extra parallax is enabled.

Local effects subscribe to `portfolio-scroll` and use `visualScrollY()` rather
than reading native scrollY during smoothing. `scrollToPosition()` bridges their
anchor/focus navigation. The root forwards native scroll events in fallback mode.

Because transformed scrolling changes native sticky behavior, the explicitly
listed sticky elements retain their flow space and receive a clamped translate
within their original parent. Header clearance uses `stickyRestTop()` when needed.
Add new document-level sticky elements to the scoped selector list; do not add
sticky children of independently scrolling dialogs. Modal body-scroll locks pause
ScrollSmoother. Route changes and preference changes dispose and rebuild the
smoother and observers.

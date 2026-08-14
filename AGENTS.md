# Portfolio Website Working Rules

## Absolute Source-of-Truth Rule

- “Use Figma native elements” means use the exact Figma node and its own source data without substitution: Figma TEXT stays that node's text content, font, size, tracking, fill, bounds, and transform; Figma image stays that node's image fill/crop/transform; Figma vector stays that node's vector geometry. Do not replace any of these with a guessed HTML font, a hand-written copy, a group/frame composite, a crop, a recreated shape, or a visually similar asset.
- The Figma node tree is the implementation specification. If a node cannot be represented exactly in the browser from the available Figma data, stop at that node and report it. Never change the design to make implementation easier.

- The Figma page is the source of truth for static visuals.
- Preserve canvas dimensions, layout, typography, text, sizes, geometry, and content exactly.
- New work may add interaction only. Do not recreate a page from a screenshot or replace a page with a guessed responsive layout.
- For Figma interactions: identify the exact node first, export only that node when needed, verify its position against the immutable page baseline, then add the smallest possible behavior layer.
- Before handing off, run syntax checks and verify that the static state has no visual overlays or duplicate full-page images.

## Non-Negotiable Figma Interaction Gate

- A full-page Figma export is a static reference only. It must never receive hover, scale, filter, transform, or cursor-driven interaction.
- Do not create a visual duplicate, crop, mask, blend-mode approximation, or transparent rectangle to imitate a Figma layer.
- Before adding any interaction, the target text/image/shape must be imported from its exact Figma node as an independent DOM element.
- The independent element must be placed at its verified Figma position and match the static baseline while idle. If the source export contains unrelated background, parent composition, or cannot be aligned exactly, stop: leave that target static and report the blocker.
- Interaction code may be written only after the following proof is complete: exact node ID recorded; exported asset inspected; idle-state overlay compared against the page baseline; target bounds verified; no unrelated pixels appear outside target bounds.
- Never add substitute text over a flattened page image. To animate text, first import that exact Figma TEXT node as its own Figma SVG asset at its Figma bounds; only then animate it.
- Do not replace a working page with a layer-built version until the *complete* Figma node tree has been imported and its idle rendering has been compared against Figma using absolute render bounds. Partial trees, guessed coordinates, or a visual approximation are a hard stop.
- Do not alter exported Figma assets in any way: no black/white keying, alpha conversion, recoloring, pixel removal, crop, filter, blend mode, or reconstructed substitute. Use the original node export or raw fill exactly as Figma supplies it.
- For legacy rotated Figma frames, use `absoluteRenderBounds` and `absoluteTransform` from Figma as the single coordinate source. Never derive browser coordinates from local `x/y` values by hand.

## Standard Figma-to-Web Layer Workflow

### Design-context-first override

- Before implementing a Figma page, call Figma `get_design_context` for the target frame. It is the canonical browser implementation input: use its exact node content, font, size, tracking, fills, transforms, bounds, masks, and source-asset URLs.
- A Figma TEXT node must be rendered as native browser text from that exact design-context data. It is not acceptable to reconstruct wording or typography by eye, nor to make per-text PNG/SVG exports the default implementation path.
- Use Figma source image/vector assets only for images, masks, and vectors. Preserve their Figma crop, transform, opacity, and bounds exactly.
- Individual asset exports are a fallback for a non-text leaf asset only after its alpha is verified. They are never the default way to build the page structure.
- This override supersedes any older sentence that requires TEXT-node SVG exports. For this website, native browser text populated from exact Figma design-context data is the required implementation; never use Figma TEXT SVG/PNG exports when they introduce a black canvas or reduce clarity.
- A page may remain on its existing static Figma reference while its complete source-layer implementation is being assembled. Do not activate a partial replacement and do not attach new interaction to the reference image.
- Font-metric gate: exact Figma text values alone are insufficient. If the precise Figma font is unavailable in the browser or a static comparison shows wrapping, spacing, or glyph differences, the layer-built page is rejected and the verified Figma render stays active. Never ship an interaction on that replacement.

Use this exact sequence for every future page or interaction. Do not skip or reorder steps.

1. Read the target Figma frame and its complete descendant tree. Record each target node's ID, type, text/font data, fills, effects, `absoluteRenderBounds`, and `absoluteTransform`.
2. Create the browser page using the same Figma frame dimensions. Import every visible target as its own DOM layer: a Figma TEXT node must use that exact node's Figma SVG export (never hand-written browser text); a vector must use its own Figma SVG export; an image fill must use its original Figma node export or raw fill with its Figma crop and transform.
   - Once that layer tree is in use, remove the prior full-frame/page-image baseline from that page. Keep only the Figma background *layer* when it exists as a real node; never leave a duplicate full-page image underneath the imported layers.
   - Never use a raster export of a Figma TEXT node as a browser text layer: it can include a black export canvas and loses text clarity. Use the exact HTML text properties or a transparent Figma SVG; inspect the asset before placement.
3. For rotated legacy frames, position browser layers only from `absoluteRenderBounds` / `absoluteTransform`; local node coordinates are not a substitute.
4. Preserve every Figma source asset byte-for-byte. Apply only the Figma-defined crop, opacity, rotation, clipping, and effect values; never process pixels to make a layer appear transparent or to change its color.
5. **Batch-export identity gate:** never map returned Figma assets by array position, request order, filename order, or visual guess. Before writing each file, prove its identity with the returned node ID and node name; after writing, inspect the rendered asset against that node. A mismatch blocks the entire page from being activated. File names must contain the exact Figma node ID.
6. Verify the idle page visually against Figma before adding any event listener. Fix only a demonstrably mismatched original node; do not make compensating changes to unrelated layers.
7. Add interaction exclusively to the named original DOM layer. The interaction may animate transform/opacity only as requested and must return exactly to the verified idle state.
8. Run syntax and local-page checks. If an exact layer cannot be imported or aligned, stop and report that specific node as blocked rather than introducing a raster, crop, overlay, or approximation.

### Mandatory Per-Page Stop Gate

Before changing any Figma-derived page, write a short implementation record in the current task containing all five items below. If any item is missing or fails, do **not** replace the page, delete its baseline, add animation, or intercept scrolling.

1. Frame ID and the exact Figma node IDs being imported.
2. Asset type verified for every target: exact Figma TEXT-node SVG, exact Figma vector SVG, or original Figma image node/fill. Hand-written HTML text and raster TEXT exports are rejected.
- A Figma `GROUP` or `FRAME` PNG export is a composited render, not an independently stackable layer. It is forbidden as a layer replacement unless its export is verified transparent outside its own intended pixels. Import its leaf text/vector/image-fill descendants instead.
  - The same prohibition applies to a Figma `GROUP` or `FRAME` SVG export: an SVG file can still embed a composited opaque background. A group/frame SVG is never evidence of native leaf-layer fidelity. Do not use it as a browser layer replacement.
  - Export verification is mandatory: after every Figma `GROUP` or `FRAME` export, inspect the alpha channel at all four corners and outside its expected visible pixels. If any unexpected opaque black/background pixel exists, reject that export immediately. Never remove it through keying, masking, recoloring, or CSS. Use a user-supplied transparent PNG of the same exact Figma content, or continue with verified transparent leaf nodes only.
  - A user-supplied transparent PNG made from the exact Figma layers is an approved source asset for a complex single visual layer. Preserve it byte-for-byte; it may be positioned and animated only at its original Figma bounds.
3. Position source: each layer's `absoluteRenderBounds` and, where applicable, `absoluteTransform`.
4. Idle-state comparison: the assembled layers match Figma before the old page image is removed.
5. Only after items 1–4 pass: interaction target, trigger type, and exit/reset behavior are defined.

Speed, a user prompt to continue, or a partial asset download never authorizes skipping this gate.

- A partial leaf-node page must never be activated. Keep the clear Figma reference page active until every visible node is present as an independently exported leaf layer; incomplete content is not an acceptable intermediate preview.

## Motion Rule

- Treat scroll-driven reveal and pointer-driven hover as different requests. For portfolio cover text, use scroll/viewport entry reveal only when the request is a "scrolling down" text effect; do not add hover glow, scaling, or cursor interaction unless explicitly requested.
- Treat global background ambience as separate from page-level particle interactions: it must stay below all Figma content, use pointer repulsion only when requested, and must not be made visible by overlaying, masking, or altering an opaque Figma page asset. Identify the DOM element that owns any blank-looking region first; only an existing non-content reserve may be made transparent to reveal the unchanged site background beneath.
- A bridge between pages may animate only its own background field. It must not reduce, hide, disable, or otherwise alter the approved interactive particle field already inside a visible Figma cover.
- For a centred Figma cover, distinguish the page container's external blank website background from the Figma-cover canvas inside it. A request for ambience in the former authorizes only revealing the existing below-content site canvas in that external region; it never authorizes changing, extending, or redistributing particles inside the Figma cover.
- A scroll-gated cover is a functional contract: after it reaches the reading centre, positive wheel input must be consumed by its numbered reveal stages and must not scroll to the next page until the final stage is complete. Do not weaken, remove, or overwrite this lock when editing unrelated page or global scrolling code.
- For a project-cover-to-content handoff, never animate the reserve height frame-by-frame. Measure the exact final collapse distance, animate only the next page wrapper by that distance on the compositor while input remains locked, then close the reserve once with an equal and opposite transform reset. Keep the lock duration synchronized; never compensate by changing page spacing, sticky position, wheel logic, or Figma layers.
- An approved local particle interaction must be above non-interactive Figma source nodes that would otherwise intercept its pointer events, but remain below any explicitly approved controls (for example directory-card hotspots). Its particles may not replace or alter those source nodes.
- Local particle fields must sleep when idle, render one static field on entry, and wake immediately from an on-screen pointer gesture even if an intersection observer was stale. Never run a dense local canvas loop continuously during a staged page reveal.
- A generic page-entry transform is a one-time arrival effect. Never remove and re-add it in response to ordinary viewport exits, scroll handoffs, or temporary intersection changes; those re-arms create an unrequested body-page bounce.
- Treat a completed project cover's upward return as its own timed page state: expand only its existing reserve while consuming input until the expansion finishes, then resume reverse layer stages. Ambient canvases with no idle motion must render once and sleep; wake them only for their requested visible interaction.
- Global scroll optimization must preserve all existing page states: pause particle requestAnimationFrame loops outside the viewport and scope reading-lock geometry checks to nearby pages only. Do not change Figma layers, normal-flow geometry, reveal ordering, or the existing page-state lock contract to improve performance.
- **Page-state-only centre lock:** whether a directory or project cover stops is determined only by that page reaching its reading-centre position and by its reveal-completion state. Never derive a stop, release, or page displacement from `WheelEvent.deltaY`, wheel velocity, gesture size, or wheel-event count. Interaction code must never use `window.scrollTo()`, CSS `scroll-snap`, smooth auto-alignment, pull-back, or any mechanism that changes document scroll position. Do not change a page's height, margins, gaps, or normal-flow geometry to manufacture a scroll hold. The reading-centre state gates input consumption only after the visitor has naturally reached it; it must never drag, snap, reposition, or change the page spacing.

## Approved-Baseline Preservation Rule

- When the user confirms any behaviour, visual state, page spacing, transition, or interaction as correct, treat it as an immutable approved baseline. It must remain byte-for-byte and behaviourally unchanged unless the user explicitly asks to alter that exact item.
- Every future edit must name one narrow target before code is changed. Do not modify shared/global scrolling, page geometry, styles, Figma layers, reveal timing, or another page as a speculative way to fix the target.
- Before changing a shared mechanism, prove that the approved baseline itself is the cause. If that proof is absent, stop and report the blocker; do not replace, simplify, or "improve" a working implementation.
- After a target change, verify both the requested target and all previously approved neighbouring behaviour. A passing syntax check is not enough. If either is changed unexpectedly, restore the approved baseline before any further work.
- Never introduce new interaction types, fallback mechanisms, spacers, layout changes, or global event handlers without an explicit user request for that mechanism.

## Directory Particle Bridge Rule

- The cover-to-directory bridge may attenuate only the directory's pre-reveal transition. Once the directory has entered any non-zero reveal stage, its local particle field is an active interaction layer and must remain at full approved opacity; do not let bridge falloff make a responsive canvas appear inactive.
- A wheel-driven directory reveal may begin under a stationary pointer. Keep the local particle field scoped to its existing zone, but wake it from the latest real pointer position at every non-zero stage so the original repulsion stays visibly active through the reveal.
- Directory particle input must cover the full Page 02 composition even if its visual field is masked as background. Receive pointer events from the page host, keep the canvas below Figma nodes and card controls, and never use an invisible rectangle above the design as a substitute visual layer.

## Cover-to-Body Handoff Rule

- Project bodies must remain in normal document flow during handoff. Never translate a body upward into an unfinished cover; animate only the cover chapter's existing lower reserve and wait for its `::after` height transition before completing the handoff. A timer is fallback-only; it is not proof that rendered motion has completed.
- Apply the cover's final minimum height from the first handoff frame, not only at completion. The handoff may reduce its lower reserve to that floor, but completion must not introduce a second geometry change that pushes the body back down.

## External Background Rule

- For the first and last full-screen pages, external whitespace can reveal the site-level particle field only through a transparent outer page host. Keep the actual Figma canvas/image opaque and unchanged; never raise the background particle layer over it.

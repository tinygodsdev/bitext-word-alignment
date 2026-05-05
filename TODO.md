# Version 1.0.0

- [x] Sort out glossing functionality
- [x] Improve sharing visuals
- [x] Check SEO
- [x] Highlighting tokens when selecting (hovering) and when selected (with current color, which will be the link color)
- [x] Make sure instructions are clear and concise, up to date, and complete. 
- [x] Add better examples - with complex links and advanced tokenization.
- [x] Improve export card comment
- [x] Twitter doesn't show visual preview
- [x] Dependency CVE check (`npm audit` / CI)
- [x] Add QR code export method
- [-] Add QR code to visualization exports (small in the corner - only site link; `siteLandingQrDataUrl` + `siteQrPngDataUri` in svg — wiring disabled in ExportMenu) - out of scope for now

# Version 2

Includes bugs and feature requests from the public.

Feature requests - high priority:
- [ ] Add ability to add more than 2 lines 
- [ ] Improve support for longer sentences - currently non-svg export is low resolution when font is small
- [ ] add special separator to combine words into a single token - it will be connected with 1 line in the visualization but still be written with a space or spaces
- [ ] add ability to optionally tokenize punctuation as separate tokens
- [ ] add transcription line support (probably can be solved by adding more than 2 lines)

Usability improvements - high priority:
- [ ] Parameter card or other view should move to be next to the editor - currently on small screens you have to scroll back and forth between the editor and the parameters

Bug fixes - high priority:
- [ ] Reportedly ligatures in custom fonts are not working in the export (but fine in preview) - investigate and fix
- [ ] When color palette is depleted, it should cycle through the colors - currently uses the last color

Advanced features - medium priority:
- [ ] Ability to create custom color palettes
- [ ] Maybe parameter-line connection should be reworked to be more flexible - each line should have all the parameters configured separately. 

General interface improvements - medium priority:
- [ ] Interface languages - add pages for some major languages
- [ ] Make interface more compact to accomodate more features
- [ ] Probably add full screen mode for the preview - so that the user would be able to see it all and screenshot if needed - this will partially help if we won't be able to solve ligature problems

Considerations:
- If we support multiple lines with independent parameters, we can deprecate separate gloss row and configuration - it will be just a single new line with the glosses. Then, the user would be able to add transcription and other annotations in the same manner. 
- In case of adding multiple lines, additional lines after the first 2 should be optional. 
- The ultimate fix for pdf export would be to use external resource like gotenberg. We can set up a server with it, but preferably this is to be avoided since it will add costs to support it. 

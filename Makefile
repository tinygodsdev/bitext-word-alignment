# Example gallery PNGs → object storage CDN (zero Railway egress for images).
#
# One-time: cd bitext && npm install && npx playwright install chromium
# Credentials: copy bitext/.env.example → bitext/.env
#
#   make examples-previews   — build, render PNGs, upload to Spaces
#   make examples-render     — render only → bitext/.cache/example-previews/
#   make examples-upload     — upload PNGs (needs .env)
#   make examples-deps       — npm install + Playwright Chromium

BITEXT := bitext

.PHONY: examples-deps examples-previews examples-render examples-upload examples-build

examples-deps:
	cd $(BITEXT) && npm install && npx playwright install chromium

examples-previews: examples-render examples-upload

examples-render: examples-build
	cd $(BITEXT) && npm run examples:render

examples-upload:
	cd $(BITEXT) && npm run examples:upload

examples-build:
	cd $(BITEXT) && npm run build

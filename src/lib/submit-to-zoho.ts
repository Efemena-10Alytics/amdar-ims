// Zoho redirects here once it accepts a record. It's a static same-origin page,
// so the app can read the hidden iframe's URL afterwards; a rejected record
// leaves the iframe on Zoho's own cross-origin error page instead.
export const ZOHO_RETURN_PATH = '/zoho-thanks.html'

/**
 * Posts to Zoho through a hidden iframe rather than fetch(). fetch with
 * mode:"no-cors" returns an opaque response — status is always 0 and HTTP
 * errors never throw — so a rejected record would look identical to a
 * successful one. Watching where the iframe lands gives us a real signal.
 */
export const submitToZoho = (formUrl: string, fields: Record<string, string>) =>
    new Promise<void>((resolve, reject) => {
        // Zoho always redirects from https. When our own page is http (local
        // dev), the browser mixed-content-upgrades that redirect to
        // https://localhost, which the dev server can't serve — so the iframe
        // never lands back here and an accepted record looks identical to a
        // rejected one. Detection is only meaningful on an https origin.
        const canDetectOutcome = window.location.protocol === 'https:'

        const frameName = `zoho-submit-${Date.now()}`

        const iframe = document.createElement('iframe')
        iframe.name = frameName
        iframe.style.display = 'none'
        document.body.appendChild(iframe)

        const form = document.createElement('form')
        form.action = formUrl
        form.method = 'POST'
        form.enctype = 'multipart/form-data'
        form.acceptCharset = 'UTF-8'
        form.target = frameName
        form.style.display = 'none'

        Object.entries(fields).forEach(([name, value]) => {
            const input = document.createElement('input')
            input.type = 'hidden'
            input.name = name
            input.value = value
            form.appendChild(input)
        })
        document.body.appendChild(form)

        let settled = false
        const cleanup = () => {
            clearTimeout(timer)
            iframe.remove()
            form.remove()
        }

        const settle = (fn: () => void) => {
            if (settled) return
            settled = true
            cleanup()
            fn()
        }

        const timer = setTimeout(
            () => {
                // Without detection the POST has long since been sent; only
                // treat a genuine stall as an error when we can observe it.
                settle(() =>
                    canDetectOutcome
                        ? reject(new Error('Timed out waiting for Zoho'))
                        : resolve()
                )
            },
            canDetectOutcome ? 20000 : 2000
        )

        iframe.addEventListener('load', () => {
            if (settled) return

            let href: string | null = null
            try {
                href = iframe.contentWindow?.location.href ?? null
            } catch {
                // Cross-origin: still sitting on a Zoho page, i.e. not accepted.
                href = null
            }

            // Fires once for the initial blank document before the POST lands.
            if (href === 'about:blank') return

            if (!canDetectOutcome) {
                settle(resolve)
                return
            }

            settle(() =>
                href?.includes(ZOHO_RETURN_PATH)
                    ? resolve()
                    : reject(new Error('Zoho rejected the submission'))
            )
        })

        form.submit()
    })

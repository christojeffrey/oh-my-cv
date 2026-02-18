from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 375, "height": 667})
        page = context.new_page()

        # Listen for console logs
        page.on("console", lambda msg: print(f"Console: {msg.text}"))
        page.on("pageerror", lambda err: print(f"Page Error: {err}"))

        try:
            print("Navigating...")
            page.goto("http://localhost:5173/", timeout=30000)
            print("Navigation complete. Waiting for network idle...")
            page.wait_for_load_state("networkidle")

            # Wait for any content
            try:
                page.wait_for_selector("body", timeout=5000)
                print("Body found.")
            except:
                print("Body not found?")

            page.screenshot(path="verification/mobile_view_debug.png")
            print("Screenshot taken")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error_view.png")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
